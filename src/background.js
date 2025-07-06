/*global chrome*/

chrome.sidePanel.setPanelBehavior({openPanelOnActionClick: true}).catch((error) => console.error(error));

chrome.action.onClicked.addListener(async (tab) => {
    chrome.sidePanel.setOptions({
        tabId: tab.id,
        path: "pages/sidepanel.html",
        enabled: true
    });
    chrome.sidePanel.open({tabId: tab.id});
});

chrome.runtime.onInstalled.addListener(details => {
    if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
        chrome.tabs.create({
            url: `https://cookieeditor.org/?install_success=true&ref=https://chromewebstore.google.com/`,
            active: true
        });
        chrome.runtime.setUninstallURL('https://forms.gle/tCy1URDSXn8yqJ8H7');
    } else if (details.reason === chrome.runtime.OnInstalledReason.UPDATE) {
        chrome.tabs.create({url: `https://cookieeditor.org/?updated_success=true`, active: true});
    }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab?.url.startsWith("https://cookieeditor.org/cookie/link/")) {
        chrome.tabs.update(tabId, {url: tab?.url.replace("https://cookieeditor.org/cookie/link/", `chrome-extension://${chrome.runtime.id}/pages/import.html?cookie_id=`)});
    }
});

chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
    switch (request.action) {
        case "check_install":
            sendResponse({status: true});
            break;

        default:
            sendResponse({status: true});
            break;
    }

    return true;
})

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    switch (request.action) {
        case "google_analytics":
            sendGoogleAnalytics(request.data, sendResponse);
            return true;

        default:
            sendResponse({status: true});
            break
    }
});


chrome.permissions.contains({permissions: ["contextMenus"]}, (result) => {
    if (result) {
        chrome.contextMenus.onClicked.addListener(async (info, tab) => {
            const cookies = await chrome.cookies.getAll({url: tab.url});
            switch (info.menuItemId) {
                case "remove_cookie":
                    for (let i = 0; i < cookies.length; i++) {
                        await chrome.cookies.remove({
                            url: tab.url,
                            name: cookies[i].name,
                            storeId: cookies[i].storeId
                        })
                    }
                    break;

                case "copy_cookie":
                    chrome.tabs.sendMessage(tab.id, { action: "copy_all_cookie", data: {cookies} });
                    break;
            }
        });
    }
});

const sendGoogleAnalytics = async (data, callback) => {
    const {en, ep = [], tid, cid, v, t, ul, sr} = data;

    const raw = [
        `en=${en}`,
        ...ep.map(item => `ep.${item.key}=${item.value}`)
    ].join('&');

    const params = {
        tid: String(tid),
        cid: String(cid),
        seg: "1",
        ...(v && {v: String(v)}),
        ...(t && {t: String(t)}),
        ...(ul && {ul: String(ul)}),
        ...(sr && {sr: String(sr)}),
    };

    const url = "https://www.google-analytics.com/g/collect?" + new URLSearchParams(params);

    await fetch(url, {
        method: "POST",
        headers: {"Content-Type": "text/plain"},
        body: raw,
        redirect: "follow",
    });

    callback({status: true});
};


