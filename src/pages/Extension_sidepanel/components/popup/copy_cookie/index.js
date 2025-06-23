import {useEffect, useRef, useState} from "react";
import {motion} from "framer-motion";
import ModalPopup from "../modal_popup";
import CookieExample from "../../cookie_example";
import {cookieFormats} from "../../../../../constants";
import {googleAnalytics} from "../../../../../utils/google_analytics";
import {extension} from "../../../../../utils/chrome";
import {copyCookie} from "../../../../../utils/cookie";
import {useClickOutside} from "../../../../../hooks/useClickOutside";
import {settingStore} from "../../../../../mobx/setting.store";
import {observer} from "mobx-react-lite";

const CopyCookie = ({cookies}) => {
    const format = settingStore.format_copy;
    const ref = useRef(null);
    useClickOutside(ref, () => {
        settingStore.popup = "";
    })


    return (
        <>
            {
                settingStore.popup === "copy_cookie" && (
                    <>
                        <ModalPopup/>
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
                                    {extension.getLang("title_copy_cookie")}
                                </p>
                                <p className={`text-[12px] mb-5`}>
                                    {extension.getLang("description_copy_cookie")}
                                </p>
                                <div className={`w-full flex flex-wrap justify-between mb-2`}>
                                    {
                                        cookieFormats.map((item, key) => (
                                            <div key={key} className="inline-flex w-fit pr-3 items-center mb-4">
                                                <input
                                                    id={item.id}
                                                    type="radio"
                                                    value={item.value}
                                                    name="format"
                                                    onClick={(e) => settingStore.setFormatCopy(e.target.value)}
                                                    checked={format === item.value}
                                                    className="w-4 h-4 text-blue-600 bg-gray-400 border-gray-300 focus:ring-blue-500"
                                                />
                                                <label
                                                    htmlFor={item.id}
                                                    className="ms-2 text-[12px] cursor-pointer font-medium text-gray-900"
                                                >
                                                    {item.title}
                                                </label>
                                            </div>
                                        ))
                                    }
                                </div>
                                <p className={`text-[12px] font-medium mb-2`}>
                                    {extension.getLang("str_example")}
                                </p>
                                <div className={`w-full mb-4 bg-gray-300 rounded-[10px] p-[10px]`}>
                                    <CookieExample format={format}/>
                                </div>
                                <div className={`w-full flex justify-between`}>
                                    <div className={"inline-block w-[59%]"}>
                                        <button
                                            onClick={() => {
                                                copyCookie(cookies, format);
                                                settingStore.popup = ""
                                            }}
                                            className={`h-[40px] w-full rounded-[10px] bg-blue-500 text-white px-5`}>
                                            {extension.getLang("btn_copy")}
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
                                <div className={`w-full mt-4`}>
                                    <p className={`text-gray-800 text-xs`}>
                                        {extension.getLang("str_convert_share_link")} <span
                                        onClick={() => settingStore.popup = "share_cookie"}
                                        className={`text-blue-600 font-bold underline cursor-pointer`}>{extension.getLang("cta_convert_share_link")}</span>
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

export default observer(CopyCookie)