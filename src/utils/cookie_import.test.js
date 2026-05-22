import {describe, expect, it} from "vitest";
import {createCookieSetDetails} from "./cookie_import";

describe("createCookieSetDetails", () => {
    it("preserves domain cookies", () => {
        expect(createCookieSetDetails({
            domain: ".chatgpt.com",
            hostOnly: false,
            name: "oai-did",
            path: "/",
            value: "device",
        }, "https://chatgpt.com")).toMatchObject({
            domain: ".chatgpt.com",
            name: "oai-did",
            path: "/",
            url: "https://chatgpt.com",
            value: "device",
        });
    });

    it("omits domain for host-only cookies", () => {
        expect(createCookieSetDetails({
            domain: "chatgpt.com",
            hostOnly: true,
            name: "g_state",
            path: "/",
            value: "state",
        }, "https://chatgpt.com")).not.toHaveProperty("domain");
    });

    it("omits domain and enforces prefix requirements for __Host cookies", () => {
        const details = createCookieSetDetails({
            domain: ".chatgpt.com",
            hostOnly: false,
            name: "__Host-next-auth.csrf-token",
            path: "/wrong",
            secure: false,
            value: "token",
        }, "https://chatgpt.com");

        expect(details).not.toHaveProperty("domain");
        expect(details).toMatchObject({
            path: "/",
            secure: true,
        });
    });

    it("enforces secure for __Secure cookies", () => {
        expect(createCookieSetDetails({
            domain: ".chatgpt.com",
            hostOnly: false,
            name: "__Secure-next-auth.session-token.0",
            secure: false,
            value: "token",
        }, "https://chatgpt.com")).toMatchObject({
            domain: ".chatgpt.com",
            secure: true,
        });
    });
});
