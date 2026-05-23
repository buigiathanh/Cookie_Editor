const HOST_PREFIX = "__Host-";
const SECURE_PREFIX = "__Secure-";

const shouldIncludeDomain = (cookie) => {
    if (!cookie.domain || cookie.name?.startsWith(HOST_PREFIX)) {
        return false;
    }

    if (cookie.hostOnly === false) {
        return true;
    }

    return cookie.hostOnly === undefined && cookie.domain.startsWith(".");
}

export const createCookieSetDetails = (cookie, url) => {
    const name = cookie.name || "";
    const details = {
        url,
        name,
        value: cookie.value || "",
    };

    if (cookie.expirationDate !== undefined && cookie.expirationDate !== null) {
        details.expirationDate = Number(cookie.expirationDate);
    }

    if (cookie.httpOnly !== undefined) {
        details.httpOnly = cookie.httpOnly;
    }

    if (cookie.sameSite) {
        details.sameSite = cookie.sameSite;
    }

    if (cookie.storeId) {
        details.storeId = cookie.storeId;
    }

    const secure = Boolean(cookie.secure || name.startsWith(SECURE_PREFIX) || name.startsWith(HOST_PREFIX));
    details.secure = secure;
    details.path = name.startsWith(HOST_PREFIX) ? "/" : (cookie.path || "/");

    if (shouldIncludeDomain(cookie)) {
        details.domain = cookie.domain;
    }

    return details;
}
