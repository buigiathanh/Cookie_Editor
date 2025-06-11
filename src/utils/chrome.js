/*global chrome*/

const extension = {
    getManifest: () => {
        return chrome.runtime.getManifest();
    },
    getId: () => {
        return chrome.runtime.id
    },
    getLang: (key) => {
        return chrome.i18n.getMessage(key)
    },
    storage: {
        getItem: (key) => {
            return new Promise((resolve) => {
                chrome.storage.local.get(key, (result) => {
                    resolve(result[key] || null)
                });
            });
        },
        setItem: (key, value) => {
            return new Promise((resolve) => {
                chrome.storage.local.set({[key]: value}, () => {
                    resolve();
                });
            });
        },
        removeItem: (key) => {
            return new Promise((resolve) => {
                chrome.storage.local.remove(key, () => {
                    resolve();
                });
            });
        },
    },
}

export {
    extension
}