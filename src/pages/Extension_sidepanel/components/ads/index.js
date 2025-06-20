/*global chrome*/
import {useEffect, useMemo} from "react";
import {v4 as UUID} from 'uuid';
import {googleAnalytics} from "../../../../utils/google_analytics";
import {settingStore} from "../../../../mobx/setting.store";
import {extension} from "../../../../utils/chrome";

const Ads = () => {
    const renderAds = useMemo(() => {
        return (
            <iframe
                id={"ads_content"}
                className={`w-[300px] h-full mx-auto border-0`}
                scrolling="no"
                src={`https://wetab.org/ad/div-gpt-ad-1682062303226-0/Ads_320x50/320/50?version=1.0.5.2&ref=cookieeditor.org&size=320x50&uuid=${UUID()}`}>
            </iframe>
        )
    }, [])

    useEffect(() => {
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            if (message.action === "show_ads" || message.action === "hidden_ads") {
                const url = sender.url;
                const el = document.getElementById("ads_content");
                const linkAds = el.getAttribute("src");
                if (url === linkAds) {
                    const bannerBuyCoffee = document.getElementById("buy_me_coffee");
                    const bannerAds = document.getElementById("ads_banner");
                    if (message.action === "show_ads") {
                        bannerAds.style.zIndex = "901";
                        bannerBuyCoffee.style.display = "none";
                        googleAnalytics({name: "show_ads", params: []});
                    }
                }
            }

            sendResponse({status: true})
        });
    }, [])

    return (
        <div className={`w-full h-full relative`}>
            <div id={"buy_me_coffee"} className={`w-full h-full absolute top-0 left-0`} style={{zIndex: 901}}>
                <div onClick={() => settingStore.popup = "upgrade"} className={`w-full h-full px-[5px] bg-blue-600 rounded flex cursor-pointer items-center`}>
                    <div className={`inline-block px-2 w-full text-center`}>
                        <p className={`text-white text-xs font-bold uppercase`}>
                            {extension.getLang("bottom_message_upgrade")}
                        </p>
                    </div>
                </div>
                {/*<BuyMeACoffee/>*/}
            </div>
            <div id={"ads_banner"} className={`w-full h-full overflow-hidden absolute top-0 left-0`}
                 style={{zIndex: 900}}>
                {renderAds}
            </div>
        </div>
    )
}

export default Ads