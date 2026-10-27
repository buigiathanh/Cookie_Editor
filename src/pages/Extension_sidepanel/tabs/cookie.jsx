/*global chrome*/
import WebsiteInfo from "../components/webiste_info";
import TopAction from "../components/top_action";
import DetailCookie from "../components/detail_cookie";
import {useEffect, useRef, useState} from "react";
import {icons} from "../../../constants/icon";
import EmptyCookie from "../components/empty_cookie";
import {observer} from "mobx-react-lite";
import {settingStore} from "../../../mobx/setting.store";

const ShowCookie = () => {
    const [tab, setTab] = useState(undefined);
    const [favicon, setFavicon] = useState("");
    // Keep the loaded Cookies and their source tab together during active-tab changes.
    const [cookieSource, setCookieSource] = useState(undefined);
    const cookieInfo = cookieSource?.cookies;
    const requests = useRef({active: false, tab: 0, cookies: 0, currentTab: undefined});

    const handleGetTabCurrent = async () => {
        const generation = ++requests.current.tab;
        ++requests.current.cookies;
        requests.current.currentTab = undefined;
        // Retire the old editor immediately; never show editable A data under B's heading.
        setCookieSource(undefined);
        setTab(undefined);
        setFavicon(icons.chrome);
        let tabs;
        try {
            tabs = await chrome.tabs.query({active: true, lastFocusedWindow: true});
        } catch { return; }
        if (!requests.current.active || generation !== requests.current.tab) return;
        const tabCurrent = tabs?.[0];
        requests.current.currentTab = tabCurrent;
        setTab(tabCurrent);
    }

    const getFavicon = async (url) => {
        const generation = requests.current.tab;
        if (url.startsWith("chrome://") || url.startsWith("https://chromewebstore.google.com/")) {
            setFavicon(icons.chrome)
        } else {
            const linkFavicon = `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${url}&size=32`;
            let check;
            try { check = await fetch(linkFavicon); } catch { return; }
            if (!requests.current.active || generation !== requests.current.tab) return;
            if (check.status === 404) {
                setFavicon(icons.chrome)
            } else {
                setFavicon(linkFavicon)
            }
        }
    }

    const isValidCookieUrl = (url) => {
        return typeof url === "string" && (url.startsWith("http://") || url.startsWith("https://"));
    };

    const handleGetCookies = async () => {
        if (tab !== requests.current.currentTab) return;
        const generation = requests.current.tab;
        const request = ++requests.current.cookies;
        if (!isValidCookieUrl(tab?.url)) {
            setCookieSource({tab, cookies: []});
            return;
        }

        let data;
        try { data = await chrome.cookies.getAll({url: tab.url}); } catch { return; }
        if (!requests.current.active || generation !== requests.current.tab || request !== requests.current.cookies) return;
        setCookieSource({tab, cookies: JSON.parse(JSON.stringify(data))});
    }

    useEffect(() => {
        if (tab) {
            const handleUpdateCookie = (e) => {
                ["add", "delete", "clear", "edit", "import"].includes(e.detail.action) && handleGetCookies().then()
            }

            document.addEventListener("update_cookie", handleUpdateCookie);

            return () => document.removeEventListener("update_cookie", handleUpdateCookie);
        }
    }, [tab])

    useEffect(() => {
        requests.current.active = true;
        handleGetTabCurrent().then();

        const handleActivated = () => { handleGetTabCurrent().then(); };
        const handleUpdated = (tabId, changeInfo) => {
            if (tabId === requests.current.currentTab?.id &&
                (changeInfo.url !== undefined || changeInfo.status === "complete")) handleGetTabCurrent().then();
        };
        chrome.tabs.onActivated.addListener(handleActivated);
        chrome.tabs.onUpdated.addListener(handleUpdated);
        return () => {
            requests.current.active = false;
            ++requests.current.tab;
            ++requests.current.cookies;
            chrome.tabs.onActivated.removeListener(handleActivated);
            chrome.tabs.onUpdated.removeListener(handleUpdated);
        };
    }, [])

    useEffect(() => {
        if (tab !== undefined && tab === requests.current.currentTab) {
            if (isValidCookieUrl(tab.url)) {
                getFavicon(tab.url).then();
                handleGetCookies().then();
            } else {
                setFavicon(icons.chrome);
                setCookieSource({tab, cookies: []});
            }
        }
    }, [tab]);

    return (
        <>
            {
                settingStore.tab === "home" && (
                    <>
                        <WebsiteInfo
                            tab={tab}
                            favicon={favicon}
                        />

                        {
                            typeof cookieInfo === "object" && (
                                <TopAction
                                    tab={tab}
                                    cookies={cookieInfo}
                                />
                            )
                        }

                        <div className={`w-full mb-3`}>
                            {
                                typeof cookieInfo === "object" && (
                                    <>
                                        {
                                            cookieInfo.length > 0 ? (
                                                <DetailCookie
                                                    key={`${cookieSource.tab.id}:${cookieSource.tab.url}`}
                                                    tab={cookieSource.tab}
                                                    cookies={cookieInfo}
                                                />
                                            ) : (
                                                <EmptyCookie />
                                            )
                                        }
                                    </>
                                )
                            }
                        </div>
                    </>
                )
            }
        </>
    )
}

export default observer(ShowCookie)
