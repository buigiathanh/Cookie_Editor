/*global chrome*/
document.addEventListener('DOMContentLoaded', () => {
    const interval = setInterval(() => {
        const targetNode = document.getElementById('google_ads_iframe_/22907305402/Ads_320x50_0');
        if (targetNode) {
            clearInterval(interval);
            chrome.runtime.sendMessage({ action: "show_ads" }, () => {});
        }
    }, 500);
});
