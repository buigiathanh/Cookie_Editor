/*global chrome*/
import {useEffect} from "react";
import {observer} from "mobx-react-lite";
import Sidebar from "./components/sidebar";
import AlertComponent from "./components/alert";
import ShowCookie from "./tabs/cookie";
import {googleAnalytics} from "../../utils/google_analytics";
import About from "./components/popup/about";
import Ads from "./components/ads";
import PopupBuyCoffee from "./components/popup/buy_coffee";
import FeatureSuggest from "./components/popup/feature_suggest";
import {settingStore} from "../../mobx/setting.store";
import {accountStore} from "../../mobx/account.store";
import AccountPopup from "./components/popup/account";
import RemindUpgrade from "./components/popup/remind_upgrade";
import Upgrade from "./components/popup/upgrade";
import RemindLogin from "./components/popup/remind_login";
import ClearData from "./tabs/clear_data";
import Setting from "./tabs/setting";
import LinkCookies from "./tabs/links";
import PopupDetailCookie from "./components/popup/detail_cookie";
import Loading from "./components/loading";

const ExtensionSidePanel = () => {
    const lastDayActive = settingStore.day_active;
    const countDayActive = settingStore.count_day_active;
    const autoShowPopupFeatureSuggest = settingStore.auto_show_popup_feature_suggest;


    useEffect(() => {
        const versionExtension = localStorage.getItem("extension_version");
        if (!versionExtension) {
            settingStore.setDisplayCookie("default");
            settingStore.setFormatCopy("header_string");
            settingStore.setFormatExport("header_string");
            settingStore.setFormatImport("text");
            settingStore.setOptionImport(["reload_page"])
            settingStore.setCustomDisplayCookie([
                "domain",
                "expirationDate",
                "hostOnly",
                "httpOnly",
                "name",
                "path",
                "sameSite",
                "secure",
                "session",
                "storeId",
                "value"
            ])
        }
        const dataConfirmDialog = localStorage.getItem("confirm_dialog");
        if (typeof dataConfirmDialog !== "string") {
            settingStore.setConfirmDialog([
                "copy",
                "delete",
                "delete_all"
            ])
        }

        localStorage.setItem("extension_version", chrome.runtime.getManifest().version);
    }, [])

    useEffect(() => {
        const today = new Date().toDateString();
        if (Number(countDayActive) >= 3 && autoShowPopupFeatureSuggest !== "true") {
            settingStore.tab = "home";
            settingStore.popup = "feature_suggest";
            settingStore.setAutoShowPopupFeatureSuggest("true")
        }

        if (!lastDayActive || lastDayActive !== today) {
            googleAnalytics({name: "account_active", params: []});
            settingStore.setDayActive(today)
            settingStore.setCountDayActive(String(Number(countDayActive) + 1))
        }
    }, [lastDayActive, countDayActive, autoShowPopupFeatureSuggest])

    useEffect(() => {
        chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
            if (request.action === "update_account") {
                accountStore.getAccount().then();
            }

            sendResponse({status: true})
        })

        googleAnalytics({name: "use_extension", params: []});
        settingStore.setDataSetting();
        accountStore.getAccount().then();
    }, [])

    return (
        <div className={`w-full h-[100vh] bg-[#282828]`}>
            <div className={"w-full h-full m-auto bg-[#282828] flex justify-center"}>
                <div
                    className="h-full inline-block"
                    style={{width: "calc(100% - 50px)"}}
                >
                    <div className={`w-full h-full p-[10px] ${settingStore.show_ads ? "pb-[70px]" : "pb-[20px]"} overflow-y-auto relative`}>
                        <ShowCookie/>

                        <Setting/>

                        <ClearData/>

                        {
                            settingStore.tab === "link_cookies" && (
                                <LinkCookies />
                            )
                        }

                        <AlertComponent/>

                        <About/>

                        <AccountPopup />

                        <RemindUpgrade />

                        <RemindLogin />

                        <Upgrade />

                        <PopupDetailCookie />

                        <FeatureSuggest/>

                        <Loading />

                        {
                            settingStore.show_ads && (
                                <div
                                    className={`h-[60px] fixed bottom-0 left-0 p-[5px] bg-white`}
                                    style={{zIndex: 50, width: "calc(100% - 50px)"}}
                                >
                                    <Ads/>
                                </div>
                            )
                        }

                        <PopupBuyCoffee/>

                    </div>
                </div>

                <div className={"inline-block w-[50px] h-full bg-[#3C3C3C]"}>
                    <Sidebar/>
                </div>
            </div>
        </div>
    )
}

export default observer(ExtensionSidePanel)