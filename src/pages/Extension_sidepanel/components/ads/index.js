/*global chrome*/
import BuyMeACoffee from "../buy_me_a_coffe";
import {useEffect, useMemo} from "react";
import {v4 as UUID} from 'uuid';
import {googleAnalytics} from "../../../../utils/google_analytics";

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
                <BuyMeACoffee/>
            </div>
            <div id={"ads_banner"} className={`w-full h-full overflow-hidden absolute top-0 left-0`} style={{zIndex: 900}}>
                {renderAds}
            </div>
        </div>
    )
}

export default Ads