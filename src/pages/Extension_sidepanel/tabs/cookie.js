/*global chrome*/
import WebsiteInfo from "../components/webiste_info";
import TopAction from "../components/top_action";
import DetailCookie from "../components/detail_cookie";
import {useEffect, useState} from "react";
import {icons} from "../../../constants/icon";
import EmptyCookie from "../components/empty_cookie";
import {observer} from "mobx-react-lite";
import {settingStore} from "../../../mobx/setting.store";

const ShowCookie = () => {
    const [tab, setTab] = useState(undefined);
    const [favicon, setFavicon] = useState("");
    const [cookieInfo, setCookieInfo] = useState(undefined);

    const handleGetTabCurrent = async () => {
        const [tabCurrent] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
        setTab(JSON.parse(JSON.stringify(tabCurrent)));
    }

    const getFavicon = async (url) => {
        if (url.startsWith("chrome://") || url.startsWith("https://chromewebstore.google.com/")) {
            setFavicon(icons.chrome)
        } else {
            const linkFavicon = `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${url}&size=32`;
            const check = await fetch(linkFavicon);
            if (check.status === 404) {
                setFavicon(icons.chrome)
            } else {
                setFavicon(linkFavicon)
            }
        }
    }

    const handleGetCookies = async () => {
        const data = await chrome.cookies.getAll({url: tab.url});
        setCookieInfo(JSON.parse(JSON.stringify(data)));
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
        handleGetTabCurrent().then();

        chrome.tabs.onActivated.addListener(() => {
            handleGetTabCurrent().then();
        });

        chrome.tabs.onUpdated.addListener(() => {
            handleGetTabCurrent().then();
        });
    }, [])

    useEffect(() => {
        if (tab !== undefined) {
            if (tab.url.length > 0) {
                getFavicon(tab.url).then()
                handleGetCookies().then();
            } else {
                setCookieInfo([]);
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

                        <TopAction
                            cookies={cookieInfo}
                        />

                        <div className={`w-full mb-3`}>
                            {
                                typeof cookieInfo === "object" && (
                                    <>
                                        {
                                            cookieInfo.length > 0 ? (
                                                <DetailCookie
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