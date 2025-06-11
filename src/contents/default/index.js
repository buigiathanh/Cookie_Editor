/*global chrome*/
import {useEffect} from "react";

const DefaultContent = () => {
    useEffect(() => {
        let idInterval;
        if (window.location.href.startsWith("https://wetab.org/ad/div-gpt-ad-1682062303226-0/")) {
            idInterval = setInterval(() => {
                const boxAds = document.getElementById("google_ads_iframe_/22907305402/Ads_320x50_0__container__");
                let elHtml = "";
                if (boxAds) {
                    elHtml = boxAds.innerHTML;
                    if (elHtml !== "") {
                        chrome.runtime.sendMessage({action: "show_ads"}, (e) => {
                        });
                        clearInterval(idInterval)
                    }
                }

            }, 500)
        }

        return () => {
            clearInterval(idInterval)
        }
    }, [])


    return (
        <></>
    )
}

export default DefaultContent