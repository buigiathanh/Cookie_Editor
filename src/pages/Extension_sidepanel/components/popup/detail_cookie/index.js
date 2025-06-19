/*global chrome*/
import {settingStore} from "../../../../../mobx/setting.store";
import ModalPopup from "../modal_popup";
import {AnimatePresence, motion} from "framer-motion";
import {cookieStore} from "../../../../../mobx/cookie.store";
import {useRef} from "react";
import {useClickOutside} from "../../../../../hooks/useClickOutside";
import {observer} from "mobx-react-lite";
import {extension} from "../../../../../utils/chrome";

const PopupDetailCookie = () => {
    const ref = useRef(null);
    useClickOutside(ref, () => {
        settingStore.popup = ""
    });

    const handleDeleteLink = async () => {
        settingStore.loading = true;
        const response = await fetch(`${process.env.REACT_APP_WEBSITE}/api/cookie/${cookieStore.cookie_detail.uuid}/delete`, {
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        });

        settingStore.loading = false;
        if (response.ok) {
            settingStore.popup = "";
            cookieStore.links = cookieStore.links.filter(item => item.uuid !== cookieStore.cookie_detail.uuid)
        } else {
            const statusCode = response.status;
            if (statusCode === 404) {
                settingStore.alert = {type: "error", message: extension.getLang("msg_link_not_found")}
            } else if (statusCode === 403) {
                settingStore.alert = {type: "error", message: extension.getLang("msg_no_permission")}
            } else if (statusCode === 500) {
                settingStore.alert = {type: "error", message: extension.getLang("msg_error")}
            }
        }
    }

    return (
        <>
            {
                settingStore.popup === "detail_cookie" && (
                    <>
                        <ModalPopup/>
                        <AnimatePresence>
                            <motion.div
                                ref={ref}
                                initial={{opacity: 0, y: 50}}
                                animate={{opacity: 1, y: 0}}
                                exit={{opacity: 0, y: 50}}
                                transition={{duration: 0.5, ease: "easeOut"}}
                                className={`fixed ${settingStore.show_ads ? "bottom-[60px]" : "bottom-[10px]"} left-0 p-[10px]`}
                                style={{zIndex: 50, width: "calc(100% - 50px)"}}
                            >
                                <div className={`bg-white rounded-[10px] p-5`}>
                                    {
                                        Object.keys(cookieStore.cookie_detail).length > 0 && (
                                            <>
                                                <p className={`text-gray-800 text-xs mb-1`}>
                                                    <strong>{extension.getLang("website")}: </strong>{cookieStore.cookie_detail.domain}
                                                </p>
                                                <p className={`text-gray-800 text-xs mb-1`}>
                                                    <strong>{extension.getLang("title")}: </strong>{cookieStore.cookie_detail.title}
                                                </p>
                                                <p className={`text-gray-800 text-xs mb-1`}>
                                                    <strong>{extension.getLang("expiration_time")}: </strong>{cookieStore.cookie_detail.is_unlimited_exp ? "Unlimited" : cookieStore.cookie_detail.exp}
                                                </p>

                                                <div className={`w-full flex justify-between mt-3`}>
                                                    <div className={`w-[59%] inline-block`}>
                                                        <button
                                                            onClick={() => window.open(`chrome-extension://${chrome.runtime.id}/pages/import.html?cookie_id=${cookieStore.cookie_detail.uuid}`)}
                                                            type="button"
                                                            className="text-white w-full bg-blue-600 hover:bg-blue-700 rounded-lg text-xs px-5 py-2"
                                                        >
                                                            {extension.getLang("btn_import")}
                                                        </button>
                                                    </div>
                                                    <div className={`w-[39%] inline-block`}>
                                                        <button
                                                            onClick={handleDeleteLink}
                                                            type="button"
                                                            className="text-white w-full bg-red-500 hover:bg-red-600 rounded-lg text-xs px-5 py-2"
                                                        >
                                                            {extension.getLang("btn_delete")}
                                                        </button>
                                                    </div>
                                                </div>
                                            </>
                                        )
                                    }
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </>
                )
            }
        </>
    )
}

export default observer(PopupDetailCookie)