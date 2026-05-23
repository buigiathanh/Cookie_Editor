/*global chrome*/

export const openN8nPage = async () => {
    const n8nUrl = chrome.runtime.getURL("pages/n8n.html");
    const tabs = await chrome.tabs.query({url: `${n8nUrl}*`});

    if (tabs.length > 0) {
        await chrome.tabs.update(tabs[0].id, {active: true});
        if (tabs[0].windowId) {
            await chrome.windows.update(tabs[0].windowId, {focused: true});
        }
        return;
    }

    await chrome.tabs.create({url: n8nUrl});
};
