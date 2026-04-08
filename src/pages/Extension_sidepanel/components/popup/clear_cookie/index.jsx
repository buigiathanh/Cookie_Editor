/*global chrome*/
import { motion } from "framer-motion";
import ModalPopup from "../modal_popup";
import {useEffect, useRef} from "react";
import {googleAnalytics} from "../../../../../utils/google_analytics";
import {extension} from "../../../../../utils/chrome";
import {clearCookie} from "../../../../../utils/cookie";
import {useClickOutside} from "../../../../../hooks/useClickOutside";
import {settingStore} from "../../../../../mobx/setting.store";
import {observer} from "mobx-react-lite";

const ClearCookie = ({cookies}) => {
    const ref = useRef(null);
    useClickOutside(ref, () => {
        settingStore.popup = ""
    })

    const handleActionRemoveCookie = async () => {
        await clearCookie(cookies);
        settingStore.popup = ""
    }

    return (
        <>
            {
                settingStore.popup === "delete_all_cookie" && (
                    <>
                        <ModalPopup />
                        <motion.div
                            ref={ref}
                            initial={{opacity: 0, y: -50}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -50}}
                            transition={{duration: 0.5}}
                            className={`fixed top-0 left-0 p-[10px]`}
                            style={{zIndex: 50, width: "calc(100% - 50px)"}}
                        >
                            <div className={`bg-white rounded-[10px] p-5`}>
                                <p className={`font-bold text-[14px] mb-2`}>
                                    {extension.getLang("title_clear_cookie")}
                                </p>
                                <p className={`text-[12px] mb-5`}>
                                    {extension.getLang("description_clear_cookie")}
                                </p>
                                <div className={`w-full flex justify-between`}>
                                    <div className={"inline-block w-[59%]"}>
                                        <button
                                            onClick={handleActionRemoveCookie}
                                            className={`h-[40px] w-full rounded-[10px] bg-blue-500 text-white px-5`}>
                                            {extension.getLang("btn_delete")}
                                        </button>
                                    </div>
                                    <div className={"inline-block w-[39%]"}>
                                        <button
                                            onClick={() => settingStore.popup = ""}
                                            className={`h-[40px] w-full rounded-[10px] bg-gray-200 text-gray-900 px-5`}>
                                            {extension.getLang("btn_cancel")}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )
            }
        </>
    )
}

export default observer(ClearCookie)