import {createCookieSetDetails} from "./cookie_import.js";

export const parseCookieHeader = (text, url, expirationDate) => text.split(";").flatMap(part => {
    const pair = part.trimStart();
    const separator = pair.indexOf("=");
    if (separator <= 0) return [];

    // Split only once: values may themselves contain '=' (for example base64 padding).
    return [createCookieSetDetails({
        name: pair.slice(0, separator).trim(),
        value: pair.slice(separator + 1),
        expirationDate,
    }, url)];
});

export const parseNetscapeCookieLine = (line, url) => {
    const row = line.replace(/\r$/, "");
    const httpOnly = row.startsWith("#HttpOnly_");
    if (!row.trim() || (row.startsWith("#") && !httpOnly)) return null;

    // Netscape uses tabs. Keep empty values; retain the existing space-separated fallback.
    const fields = row.includes("\t") ? row.split("\t") : row.trim().split(/\s+/);
    if (fields.length !== 7) throw new Error("Invalid Netscape Cookie row");
    if (![fields[1], fields[3]].every(flag => flag === "TRUE" || flag === "FALSE")) {
        throw new Error("Invalid Netscape Cookie flag");
    }
    const expirationDate = Number(fields[4]);
    if (!/^\d+$/.test(fields[4]) || !Number.isSafeInteger(expirationDate)) {
        throw new Error("Invalid Netscape Cookie expiration");
    }

    return createCookieSetDetails({
        domain: httpOnly ? fields[0].slice("#HttpOnly_".length) : fields[0],
        hostOnly: fields[1] !== "TRUE",
        path: fields[2],
        secure: fields[3] === "TRUE",
        httpOnly,
        // The format and chrome.cookies both use seconds; zero denotes a session Cookie.
        ...(expirationDate === 0 ? {} : {expirationDate}),
        name: fields[5],
        value: fields[6],
    }, url);
};

export const parseCookieImport = (text, url, expirationDate) => {
    let json;
    let isJson = true;
    try {
        json = JSON.parse(text);
    } catch {
        isJson = false;
    }
    if (isJson) {
        if (!Array.isArray(json)) throw new Error("Cookie JSON must be an array");
        return json.map(cookie => createCookieSetDetails(cookie, url));
    }

    // Do not trim the entire input: a final tab can represent an empty Netscape value.
    const lines = text.split("\n");
    const rows = lines.filter(line => line.trim() && (!line.startsWith("#") || line.startsWith("#HttpOnly_")));
    // Header pairs start with name=; whitespace inside their values is not a format signal.
    // Non-header rows go through strict Netscape validation, including truncated rows.
    const isNetscape = rows.length === 0 || !/^[^=;\s]+\s*=/.test(rows[0].trimStart());
    return isNetscape
        ? lines.map(line => parseNetscapeCookieLine(line, url)).filter(Boolean)
        : parseCookieHeader(text, url, expirationDate);
};
