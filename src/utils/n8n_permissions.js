/*global chrome*/

export const N8N_REQUIRED_PERMISSIONS = ["storage", "alarms"];

export const checkN8nPermissions = () => {
    return new Promise((resolve) => {
        chrome.permissions.contains({permissions: N8N_REQUIRED_PERMISSIONS}, resolve);
    });
};

export const requestN8nPermissions = () => {
    return new Promise((resolve) => {
        chrome.permissions.request({permissions: N8N_REQUIRED_PERMISSIONS}, resolve);
    });
};
