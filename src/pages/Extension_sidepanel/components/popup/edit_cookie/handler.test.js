// @vitest-environment node
import {test} from "vitest";
import {resolve} from "node:path";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import vm from "node:vm";

// Execute the actual editor handlers with hook doubles and synthetic browser boundaries.
// No extension, browser profile, real Cookies, analytics or network client is loaded.
const source = readFileSync(resolve("src/pages/Extension_sidepanel/components/popup/edit_cookie/index.jsx"), "utf8");
const start = source.indexOf("const EditCookie = ");
const end = source.indexOf("\n    return (", start);
assert.ok(start >= 0 && end > start, "component handler boundaries must remain identifiable");

const fixture = (name = "fixture-a") => ({name, value: "synthetic-a", domain: "example.invalid", path: "/", httpOnly: false, secure: true, sameSite: "lax", storeId: "fixture-store-a"});
const tabA = {id: 1, url: "https://example.invalid/"};
const deferred = () => {
    let resolve, reject;
    const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
    return {promise, resolve, reject};
};
const flush = async () => { for (let i = 0; i < 4; i++) await Promise.resolve(); };

function createHarness({query, remove, set, tab = tabA} = {}) {
    const calls = {query: [], remove: [], set: [], events: [], analytics: []};
    const store = {popup: "edit_cookie", cookie_select: fixture(), alert: {}};
    let props = {cookie: {...store.cookie_select}, tab}, handles, outside;
    let refIndex, stateIndex, effectIndex;
    const refs = [], states = [], effects = [];
    const context = {
        settingStore: store, extension: {getLang: key => key},
        chrome: {
            tabs: {query: async details => { calls.query.push(details); return query ? query() : [tab]; }},
            cookies: {
                remove: async details => { calls.remove.push({...details}); return remove?.(); },
                set: async details => { calls.set.push({...details}); return set?.(); },
            },
        },
        document: {dispatchEvent: event => calls.events.push(event.type)},
        CustomEvent: class { constructor(type) { this.type = type; } },
        googleAnalytics: details => calls.analytics.push(details),
        useClickOutside: (_ref, fn) => { outside = fn; },
        useRef: initial => { const i = refIndex++; return refs[i] ??= {current: initial}; },
        useState: initial => { const i = stateIndex++; if (!(i in states)) states[i] = initial; return [states[i], value => { states[i] = value; }]; },
        useEffect: (fn, deps) => {
            const i = effectIndex++, old = effects[i];
            if (!old || deps.some((dep, index) => !Object.is(dep, old.deps[index]))) {
                old?.cleanup?.(); effects[i] = {deps, cleanup: fn()};
            }
        },
    };
    const component = vm.runInNewContext(`${source.slice(start, end)}\n return {handleActionEditCookie, handleEditCookie};\n}; EditCookie;`, context, {timeout: 1000});
    const render = () => { refIndex = stateIndex = effectIndex = 0; handles = component(props); };
    render();
    return {
        calls, store, save: () => handles.handleActionEditCookie(), close: () => outside(),
        edit: (name, value) => handles.handleEditCookie(name, value),
        select(cookie = fixture("fixture-b"), nextTab = {id: 2, url: "https://second.invalid/"}) {
            store.cookie_select = {...cookie}; store.popup = "edit_cookie";
            props = {cookie: {...cookie}, tab: nextTab}; render();
        },
        unmount() { effects.forEach(effect => effect.cleanup?.()); },
    };
}

test("save snapshots A before any await and cannot write B or close B's editor", async () => {
    const query = deferred(), removal = deferred();
    const h = createHarness({query: () => query.promise, remove: () => removal.promise});
    h.edit("value", "submitted-a");
    const pending = h.save();
    h.select({...fixture("fixture-b"), value: "private-b-fixture", domain: "second.invalid", storeId: "fixture-store-b"});
    query.resolve([tabA]); removal.resolve({});
    await pending;
    assert.equal(h.calls.remove[0].name, "fixture-a");
    assert.equal(h.calls.remove[0].storeId, "fixture-store-a");
    assert.equal(h.calls.set[0].name, "fixture-a");
    assert.equal(h.calls.set[0].value, "submitted-a");
    assert.equal(h.calls.set[0].url, tabA.url);
    assert.equal(h.calls.set[0].storeId, "fixture-store-a");
    assert.equal(h.store.popup, "edit_cookie");
    assert.deepEqual(h.store.alert, {});
    assert.deepEqual(h.calls.events, []);
});

test("save stays bound to the displayed tab, not a newly active tab", async () => {
    const h = createHarness({query: async () => [{id: 2, url: "https://second.invalid/"}]});
    await h.save();
    assert.equal(h.calls.query.length, 0);
    assert.equal(h.calls.remove[0].url, tabA.url);
    assert.equal(h.calls.set[0].url, tabA.url);
});

test("a second click while removal is pending cannot start another save", async () => {
    const removal = deferred();
    const h = createHarness({remove: () => removal.promise});
    const first = h.save(), second = h.save();
    await flush();
    assert.equal(h.calls.remove.length, 1);
    removal.resolve({});
    await Promise.all([first, second]);
    assert.equal(h.calls.set.length, 1);
    assert.equal(h.calls.analytics.length, 1);
});

test("the actual edit handler cannot change the submitted draft while saving", async () => {
    const removal = deferred();
    const h = createHarness({remove: () => removal.promise});
    const pending = h.save();
    h.edit("value", "ignored-later-edit");
    assert.equal(h.store.cookie_select.value, "synthetic-a");
    removal.resolve({}); await pending;
    assert.equal(h.calls.set[0].value, "synthetic-a");
});

test("save removes the original name but writes the submitted renamed draft", async () => {
    const h = createHarness();
    h.edit("name", "renamed-fixture");
    await h.save();
    assert.equal(h.calls.remove[0].name, "fixture-a");
    assert.equal(h.calls.set[0].name, "renamed-fixture");
});

test("an unmounted editor's successful write cannot update another popup", async () => {
    const write = deferred();
    const h = createHarness({set: () => write.promise});
    const pending = h.save();
    await flush();
    h.unmount(); h.store.popup = "import_cookie";
    write.resolve({}); await pending;
    assert.equal(h.store.popup, "import_cookie");
    assert.deepEqual(h.store.alert, {});
    assert.deepEqual(h.calls.events, []);
});

test("cancel followed by reopening the same Cookie isolates the old completion", async () => {
    const write = deferred();
    const h = createHarness({set: () => write.promise});
    const pending = h.save(); await flush();
    h.close(); h.select(fixture(), tabA);
    write.resolve({}); await pending;
    assert.equal(h.store.popup, "edit_cookie");
    assert.deepEqual(h.store.alert, {});
    assert.deepEqual(h.calls.events, []);
});

test("cancel during removal still completes the captured write without claiming cancellation", async () => {
    const removal = deferred();
    const h = createHarness({remove: () => removal.promise});
    const pending = h.save();
    assert.equal(h.calls.remove.length, 1);
    h.close();
    removal.resolve({}); await pending;
    assert.equal(h.calls.set.length, 1);
    assert.equal(h.calls.set[0].name, "fixture-a");
    assert.equal(h.calls.set[0].value, "synthetic-a");
    assert.equal(h.calls.set[0].storeId, "fixture-store-a");
    assert.equal(h.store.popup, "");
    assert.deepEqual(h.store.alert, {});
    assert.deepEqual(h.calls.events, []);
});

for (const phase of ["remove", "set"]) {
    test(`${phase} rejection reports an error only to the live editor and allows retry`, async () => {
        let reject = true;
        const h = createHarness({[phase]: async () => { if (reject) throw new Error("Synthetic API failure"); }});
        await h.save();
        assert.equal(h.store.popup, "edit_cookie");
        assert.equal(h.store.alert.type, "error");
        assert.equal(h.calls.set.length, phase === "remove" ? 0 : 1);
        assert.deepEqual(h.calls.events, []);
        assert.deepEqual(h.calls.analytics, []);
        reject = false; await h.save();
        assert.equal(h.store.popup, "");
        assert.equal(h.store.alert.type, "info");
    });
}

test("a stale failure cannot overwrite the new editor's alert", async () => {
    const write = deferred();
    const h = createHarness({set: () => write.promise});
    const pending = h.save(); await flush(); h.select();
    h.store.alert = {type: "info", message: "new-editor-fixture"};
    write.reject(new Error("Synthetic stale failure")); await pending;
    assert.deepEqual(h.store.alert, {type: "info", message: "new-editor-fixture"});
    assert.equal(h.store.popup, "edit_cookie");
});

test("an unavailable source tab causes zero writes and an actionable error", async () => {
    const h = createHarness({tab: {id: 1, url: "chrome://extensions/"}});
    await h.save();
    assert.deepEqual(h.calls.remove, []);
    assert.deepEqual(h.calls.set, []);
    assert.equal(h.store.alert.type, "error");
    assert.equal(h.store.popup, "edit_cookie");
});
