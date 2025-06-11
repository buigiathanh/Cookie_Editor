/*global chrome*/
const generateUid = () => {
    let d = new Date().getTime();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
            const r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
        }
    );
}


export const googleAnalytics = ({ name, params = [] }, callback = () => {}) => {
    const w = window.screen.width;
    const h = window.screen.height;
    const language = navigator.language;

    let cid = localStorage.getItem("cid");
    if (!cid) {
        cid = generateUid();
        localStorage.setItem("cid", cid)
    }

    chrome.runtime.sendMessage(
        {
            action: "google_analytics",
            data: {
                v: 2,
                t: "event",
                ul: language,
                de: "UTF-8",
                sr: `${w}x${h}`,
                en: name,
                ep: params,
                tid: "G-Q6M7NGMJYS",
                cid: cid
            },
        },
        callback
    );
};
