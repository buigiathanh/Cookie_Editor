export const customizeCookieDefault = [
    {key: "domain", display: true, required: false},
    {key: "expirationDate", display: true, required: true},
    {key: "hostOnly", display: true, required: false},
    {key: "httpOnly", display: true, required: false},
    {key: "name", display: true, required: true},
    {key: "path", display: true, required: false},
    {key: "sameSite", display: true, required: false},
    {key: "secure", display: true, required: true},
    {key: "session", display: true, required: false},
    {key: "storeId", display: true, required: false},
    {key: "value", display: true, required: true},
];

export const cookieFormats = [
    {title: "Header String", id: "format_header_string", value: "header_string"},
    {title: "JSON", id: "format_json", value: "json"},
    {title: "Netscape", id: "format_netscape", value: "netscape"}
];