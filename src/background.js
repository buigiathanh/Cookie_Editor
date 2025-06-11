/*global chrome*/

import {getListHistory} from "./utils/history";

chrome.sidePanel.setPanelBehavior({openPanelOnActionClick: true}).catch((error) => console.error(error));

chrome.action.onClicked.addListener(async (tab ) => {
    chrome.sidePanel.setOptions({
        tabId: tab.id,
        path: "pages/sidepanel.html",
        enabled: true
    });
    chrome.sidePanel.open({tabId: tab.id});
});

chrome.runtime.onInstalled.addListener(details => {
    if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
        chrome.tabs.create({url: `https://cookieeditor.org/?install_success=true&ref=https://chromewebstore.google.com/`, active: true});
        chrome.runtime.setUninstallURL('https://forms.gle/tCy1URDSXn8yqJ8H7');
    } else if (details.reason === chrome.runtime.OnInstalledReason.UPDATE) {

    }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete") {
        const listHistory = await getListHistory();
        if (listHistory.length > 0) {
            const url = tab.url;
            if (url.startsWith("http")) {
                const urlArray = url.split("/");
                const domain = `${urlArray[0]}//${urlArray[2]}`;
            }
        }
    }
})

chrome.tabs.onRemoved.addListener(async (e) => {
    setTimeout(() => {

    }, 5000)
})

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    switch (request.action) {
        case "google_analytics":
            sendGoogleAnalytics(request.data, sendResponse);
            return true;

        default:
        //todo
    }
});
const sendGoogleAnalytics = async (data, callback) => {
    const { en, ep = [], tid, cid, v, t, ul, sr } = data;

    const raw = [
        `en=${en}`,
        ...ep.map(item => `ep.${item.key}=${item.value}`)
    ].join('&');

    const params = {
        tid: String(tid),
        cid: String(cid),
        seg: "1",
        ...(v && { v: String(v) }),
        ...(t && { t: String(t) }),
        ...(ul && { ul: String(ul) }),
        ...(sr && { sr: String(sr) }),
    };

    const url = "https://www.google-analytics.com/g/collect?" + new URLSearchParams(params);

    await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: raw,
        redirect: "follow",
    });

    callback({ status: true });
};


