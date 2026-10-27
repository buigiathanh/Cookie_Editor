// @vitest-environment node
import {test} from "vitest";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import vm from "node:vm";
import {resolve} from "node:path";
import {parseCookieImport} from "./cookie_text_import.js";

// Exercise the actual component handler without loading React, a browser, or network clients.
const source = readFileSync(resolve("src/pages/Extension_sidepanel/components/popup/import_cookie/index.jsx"), "utf8");
const marker = "    const handleImport = ";
const start = source.indexOf(marker);
const end = source.indexOf("    useEffect(", start);
assert.ok(start >= 0 && end > start, "component handler boundaries must remain identifiable");
const handlerSource = source.slice(start + marker.length, end).trim();

async function runImport(input, rejectWrite = false) {
    const written = [];
    const events = [];
    const store = {popup: "import_cookie"};
    const context = {
        parseCookieImport,
        format: "text", cookies: input, password: "", url: "https://example.invalid/",
        optionImport: [], settingStore: store,
        extension: {getLang: key => key},
        console: {log: () => {}},
        chrome: {cookies: {set: async cookie => {
            written.push(cookie);
            if (rejectWrite) throw new Error("Synthetic Cookie API rejection");
        }}},
        document: {dispatchEvent: event => events.push(event.type)},
        CustomEvent: class { constructor(type) { this.type = type; } },
        googleAnalytics: () => {},
    };
    const handler = vm.runInNewContext(`(${handlerSource})`, context, {timeout: 1000});
    await handler();
    return {written, events, store};
}

test("actual handler makes zero writes when a later Netscape row is malformed", async () => {
    const result = await runImport("example.invalid\tFALSE\t/\tFALSE\t0\tsample\tx\nexample.invalid\tFALSE");
    assert.equal(result.written.length, 0);
    assert.equal(result.store.alert.type, "error");
    assert.deepEqual(result.events, []);
});

test("actual handler stops after API rejection without retrying another import format", async () => {
    const result = await runImport(JSON.stringify([{name: "sample", value: "a=b"}, {name: "other", value: "x"}]), true);
    assert.equal(result.written.length, 1);
    assert.equal(result.written[0].value, "a=b");
    assert.equal(result.store.alert.type, "error");
    assert.deepEqual(result.events, []);
});

test("actual handler writes both parsed header pairs and signals success", async () => {
    const result = await runImport("sample=a=b==; other=hello world");
    assert.equal(result.written.length, 2);
    assert.equal(result.written[0].value, "a=b==");
    assert.equal(result.written[1].value, "hello world");
    assert.equal(result.store.alert.type, "info");
    assert.deepEqual(result.events, ["update_cookie"]);
});
