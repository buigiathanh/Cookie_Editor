export const WEBSITE_URL = import.meta.env.VITE_WEBSITE || "https://cookieeditor.org";

export const getN8nWsUrl = () => {
    return WEBSITE_URL.replace(/^http/, "ws") + "/ws/n8n";
};

export const getN8nApiUrl = () => {
    return `${WEBSITE_URL}/api/n8n/cookies`;
};
