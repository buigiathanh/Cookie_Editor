import {useEffect, useRef} from "react";
import ModalPopup from "../modal_popup";
import {motion} from "framer-motion";
import {extension} from "../../../../../utils/chrome";
import {googleAnalytics} from "../../../../../utils/google_analytics";
import {useClickOutside} from "../../../../../hooks/useClickOutside";
import {settingStore} from "../../../../../mobx/setting.store";
import {observer} from "mobx-react-lite";

const PopupBuyCoffee = () => {
    const ref = useRef(null);
    useClickOutside(ref, () => {
        settingStore.popup = ""
    });

    const disableBuyCoffee = () => {
        settingStore.setDisableShowPopupBuyCoffee("true");
        googleAnalytics({name: "click_no_support", params: []})
    }

    useEffect(() => {
        googleAnalytics({name: "show_popup_buy_coffee", params: []})
    }, []);

    return (
        <>
            {
                settingStore.popup === "buy_coffee" && (
                    <>
                        <ModalPopup/>

                        <motion.div
                            ref={ref}
                            initial={{opacity: 0, y: 50}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: 50}}
                            transition={{duration: 0.5}}
                            className={`fixed ${settingStore.show_ads ? "bottom-[60px]" : "bottom-[10px]"} left-0 p-[10px]`}
                            style={{zIndex: 50, width: "calc(100% - 50px)"}}
                        >
                            <div className={`bg-white rounded-[10px] p-5`}>
                                <p className={`text-gray-900 font-bold text-[14px] mb-3 uppercase`}>
                                    {extension.getLang("sidebar_buy_me_a_coffee")}
                                </p>
                                <p className={`text-gray-900 text-[12px] mb-3`}>
                                    {extension.getLang("buy_coffee_content_1")}
                                </p>
                                <p className={`text-gray-900 text-[12px] mb-3`}>
                                    {extension.getLang("buy_coffee_content_2")}
                                </p>
                                <div className={`w-full mb-3`}>
                                    <button
                                        onClick={() => {
                                            window.open('https://buymeacoffee.com/thanhbui28', '_blank');
                                            googleAnalytics({name: "start_buy_coffee", params: []})
                                        }}
                                        className={`w-full h-10 rounded-[10px] bg-blue-600 text-white`}>
                                        {extension.getLang("sidebar_buy_me_a_coffee")}
                                    </button>
                                </div>
                                <div className={`w-full mb-3`}>
                                    <button
                                        onClick={() => {
                                            window.open('https://www.paypal.com/ncp/payment/DSVEGHYGSC8JA', '_blank');
                                            googleAnalytics({name: "start_buy_coffee_paypal", params: []})
                                        }}
                                        className={`w-full h-10 rounded-[10px] bg-blue-600 text-white`}>
                                        Paypal
                                    </button>
                                </div>
                                <div className={`w-full text-center`}>
                                    <p
                                        onClick={disableBuyCoffee}
                                        className={`text-gray-600 underline cursor-pointer`}>
                                        {extension.getLang("no_support")}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )
            }
        </>
    )
}

export default observer(PopupBuyCoffee)