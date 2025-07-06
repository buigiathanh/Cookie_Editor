/*global chrome*/
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    const cookies = message.data.cookies;
    if (message.action === "copy_all_cookie") {
        const dataCookie = JSON.stringify(cookies, null, 2);
        navigator.clipboard.writeText(dataCookie)
            .then(() => {
                //todo
            })
            .catch(err => {
                //todo
            });
    }

    sendResponse({ status: true });
});