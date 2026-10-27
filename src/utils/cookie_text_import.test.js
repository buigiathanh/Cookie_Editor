import {test} from "vitest";
import assert from "node:assert/strict";
import {parseCookieHeader, parseNetscapeCookieLine, parseCookieImport} from "./cookie_text_import.js";
const url = "https://example.invalid/";
test("header preserves equals inside a Cookie value", () => {
    assert.equal(parseCookieHeader("sample=a=b==; other=x", url, 1700000000)[0].value, "a=b==");
});
test("header does not remove internal value whitespace", () => {
    assert.equal(parseCookieHeader("sample=hello world; other=x", url, 1700000000)[0].value, "hello world");
});
test("Netscape expiry remains in seconds", () => {
    assert.equal(parseNetscapeCookieLine("example.invalid\tFALSE\t/\tFALSE\t1700000000\tsample\tx", url).expirationDate, 1700000000);
});
test("Netscape HttpOnly data rows are not discarded as comments", () => {
    const cookie = parseNetscapeCookieLine("#HttpOnly_example.invalid\tFALSE\t/\tTRUE\t1700000000\tsample\tx", url);
    assert.ok(cookie);
    assert.equal(cookie.httpOnly, true);
});
test("header retains empty values and ignores non-pairs", () => {
    assert.deepEqual(parseCookieHeader("empty=; invalid; =no-name", url, 1700000000).map(({name, value}) => ({name, value})), [{name: "empty", value: ""}]);
});
test("header reuses secure prefix constraints", () => {
    for (const name of ["__Host-sample", "__Secure-sample"]) {
        const cookie = parseCookieHeader(`${name}=x`, url, 1700000000)[0];
        assert.equal(cookie.secure, true);
        assert.equal(cookie.path, "/");
        assert.ok(!("domain" in cookie));
    }
});
test("Netscape comments and blanks are skipped", () => {
    for (const row of ["", "  ", "# Netscape HTTP Cookie File", "# comment"]) assert.equal(parseNetscapeCookieLine(row, url), null);
});
test("Netscape domain flags preserve host-only and domain scope", () => {
    const domain = parseNetscapeCookieLine(".example.invalid\tTRUE\t/sub\tFALSE\t1700000000\tsample\tx", url);
    const host = parseNetscapeCookieLine("example.invalid\tFALSE\t/sub\tFALSE\t1700000000\tsample\tx", url);
    assert.equal(domain.domain, ".example.invalid");
    assert.equal(domain.path, "/sub");
    assert.ok(!("domain" in host));
});
test("Netscape session expiry and empty value survive CRLF", () => {
    const cookie = parseNetscapeCookieLine("example.invalid\tFALSE\t/\tFALSE\t0\tsample\t\r", url);
    assert.equal(cookie.value, "");
    assert.ok(!("expirationDate" in cookie));
});
test("Netscape secure prefixes reuse upstream normalization", () => {
    const cookie = parseNetscapeCookieLine(".example.invalid\tTRUE\t/sub\tFALSE\t1700000000\t__Host-sample\tx", url);
    assert.equal(cookie.path, "/");
    assert.equal(cookie.secure, true);
    assert.ok(!("domain" in cookie));
});
test("Netscape malformed rows fail rather than produce invalid details", () => {
    assert.throws(() => parseNetscapeCookieLine("example.invalid\tFALSE", url), /Invalid Netscape Cookie row/);
    assert.throws(() => parseNetscapeCookieLine("example.invalid\tFALSE\t/\tFALSE\tnot-a-number\tsample\tx", url), /Invalid Netscape Cookie expiration/);
});

test("actual import parser routes a single header pair without semicolons", () => {
    assert.equal(parseCookieImport("sample=a=b==", url, 1700000000)[0].value, "a=b==");
});
test("actual import parser preserves the final empty Netscape field", () => {
    const cookies = parseCookieImport("# Netscape HTTP Cookie File\nexample.invalid\tFALSE\t/\tFALSE\t0\tsample\t", url);
    assert.equal(cookies[0].value, "");
});
test("actual import parser preserves JSON domain and prefix behavior", () => {
    const cookies = parseCookieImport(JSON.stringify([
        {name: "sample", value: "x", domain: ".example.invalid", hostOnly: false},
        {name: "__Host-sample", value: "x", domain: ".example.invalid", path: "/sub"}
    ]), url);
    assert.equal(cookies[0].domain, ".example.invalid");
    assert.ok(!("domain" in cookies[1]));
    assert.equal(cookies[1].path, "/");
    assert.equal(cookies[1].secure, true);
});
test("parsing rejects a malformed later row before a write loop can begin", () => {
    const written = [];
    assert.throws(() => {
        const cookies = parseCookieImport("example.invalid\tFALSE\t/\tFALSE\t0\tsample\tx\nexample.invalid\tFALSE", url);
        for (const cookie of cookies) written.push(cookie);
    }, /Invalid Netscape Cookie row/);
    assert.deepEqual(written, []);
});

test("actual route does not mistake spaces or tabs inside header values for Netscape", () => {
    for (const value of ["one two three four five six", "one\ttwo"]) {
        assert.equal(parseCookieImport(`sample=${value}; other=x`, url, 1700000000)[0].value, value);
    }
});

test("header keeps value-edge spaces rather than silently changing Cookie data", () => {
    assert.equal(parseCookieImport("  sample= hello world ; other=x", url, 1700000000)[0].value, " hello world ");
});
test("Netscape rejects malformed expiry and boolean columns before writes", () => {
    for (const expiry of ["", "0x10", "1.5", "-1", "9007199254740992"]) {
        assert.throws(() => parseCookieImport(`example.invalid\tFALSE\t/\tFALSE\t${expiry}\tsample\tx`, url), /Invalid Netscape Cookie expiration/);
    }
    for (const row of ["example.invalid\tMAYBE\t/\tFALSE\t0\tsample\tx", "example.invalid\tFALSE\t/\tMAYBE\t0\tsample\tx"]) {
        assert.throws(() => parseCookieImport(row, url), /Invalid Netscape Cookie flag/);
    }
});
