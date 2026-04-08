/*global chrome*/
import {useEffect, useRef, useState} from "react";
import {motion} from "framer-motion";
import ModalPopup from "../modal_popup";
import {googleAnalytics} from "../../../../../utils/google_analytics";
import {extension} from "../../../../../utils/chrome";
import {settingStore} from "../../../../../mobx/setting.store";
import {useClickOutside} from "../../../../../hooks/useClickOutside";
import {observer} from "mobx-react-lite";

const EditCookie = ({cookie}) => {
    const ref = useRef(null);
    useClickOutside(ref, () => settingStore.popup = "");

    const handleFormatDate = (time) => {
        return !time ? "" : new Date(time * 1000)
            .toLocaleString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            })
    }

    const handleEditCookie = (param, value) => {
        if (param === "expirationDate") {
            settingStore.cookie_select.expirationDate = settingStore.cookie_select.session ? "" : Math.round(new Date(value).getTime() / 1000)
        } else if (param === "httpOnly" || param === "secure" || param === "hostOnly") {
            settingStore.cookie_select[param] = value === "true";
        } else {
            settingStore.cookie_select[param] = value;
        }
    }

    const handleActionEditCookie= async () => {
        const [tabCurrent] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
        const dataUpdate = {
            domain: settingStore.cookie_select.domain,
            expirationDate: settingStore.cookie_select.expirationDate,
            httpOnly: settingStore.cookie_select.httpOnly,
            name: settingStore.cookie_select.name,
            path: settingStore.cookie_select.path,
            sameSite: settingStore.cookie_select.sameSite,
            secure: settingStore.cookie_select.secure,
            storeId: settingStore.cookie_select.storeId,
            url: tabCurrent.url,
            value: settingStore.cookie_select.value,
        }

        await chrome.cookies.remove({
            url: tabCurrent.url,
            name: settingStore.cookie_select.name,
            storeId: settingStore.cookie_select.storeId
        });

        await chrome.cookies.set(dataUpdate);
        document.dispatchEvent(new CustomEvent("update_cookie", {
            detail: {action: "edit"},
            bubbles: true,
        }));
        settingStore.alert = {type: "info", message: extension.getLang("alert_edit_cookie_success")}
        googleAnalytics({name: "edit_cookie", params: []});
        settingStore.popup = "";
    }

    return (
        <>
            {
                (cookie && settingStore.popup === "edit_cookie") && (
                    <>
                        <ModalPopup />
                        <motion.div
                            ref={ref}
                            initial={{opacity: 0, y: 50}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: 50}}
                            transition={{duration: 0.5}}
                            className={`fixed bottom-[60px] left-0 p-[10px] overflow-y-auto`}
                            style={{zIndex: 50, width: "calc(100% - 50px)", maxHeight: "calc(100vh - 70px)"}}
                        >
                            <div className={`bg-white rounded-[10px] p-5`}>
                                <p className={`font-bold text-[14px] mb-1`}>
                                    {extension.getLang("title_edit_cookie")}
                                </p>
                                <p className={`text-[12px] mb-5`}>
                                    {extension.getLang("description_edit_cooke")}
                                </p>
                                <div className={`w-full`}>
                                    <div className={`w-full mb-2`}>
                                        <label htmlFor="name" className="block mb-2 text-[12px] font-medium text-gray-900">
                                            Name
                                        </label>
                                        <input
                                            id={"name"}
                                            type="text"
                                            onChange={(e) => handleEditCookie("name", e.target.value)}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2"
                                            value={settingStore.cookie_select.name}
                                        />
                                    </div>
                                    <div className={`w-full mb-2`}>
                                        <label htmlFor="value" className="block mb-2 text-[12px] font-medium text-gray-900">
                                            Value
                                        </label>
                                        <textarea
                                            id={"value"}
                                            rows={3}
                                            onChange={(e) => handleEditCookie("value", e.target.value)}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2">
                                            {settingStore.cookie_select.value}
                                        </textarea>
                                    </div>
                                    <div className={`w-full mb-2`}>
                                        <label
                                            htmlFor="expirationDate"
                                            className="block mb-2 text-[12px] font-medium text-gray-900">
                                            Expiration Date
                                        </label>
                                        <input
                                            type="text"
                                            onChange={(e) => handleEditCookie("expirationDate", e.target.value)}
                                            id="expirationDate"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2"
                                            value={handleFormatDate(settingStore.cookie_select.expirationDate)}
                                        />
                                    </div>

                                    <div className={`w-full mb-2`}>
                                        <label
                                            htmlFor="path"
                                            className="block mb-2 text-[12px] font-medium text-gray-900">
                                            Path
                                        </label>
                                        <input
                                            type="text"
                                            onChange={(e) => handleEditCookie("path", e.target.value)}
                                            id="path"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2"
                                            value={settingStore.cookie_select.path}
                                        />
                                    </div>
                                    <div className={`w-full mb-2`}>
                                        <label
                                            htmlFor="httpOnly"
                                            className="block mb-2 text-[12px] font-medium text-gray-900">
                                            HttpOnly
                                        </label>
                                        <select
                                            id={"httpOnly"}
                                            onChange={(e) => handleEditCookie("httpOnly", e.target.value)}
                                            value={String(settingStore.cookie_select.httpOnly)}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2">
                                            <option value={"true"}>True</option>
                                            <option value={"false"}>False</option>
                                        </select>
                                    </div>
                                    <div className={`w-full mb-2`}>
                                        <label
                                            htmlFor="sameSite"
                                            className="block mb-2 text-[12px] font-medium text-gray-900">
                                            SameSite
                                        </label>
                                        <select
                                            id={"sameSite"}
                                            onChange={(e) => handleEditCookie("sameSite", e.target.value)}
                                            value={String(settingStore.cookie_select.sameSite)}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2">
                                            <option value={"no_restriction"}>no_restriction</option>
                                            <option value={"lax"}>lax</option>
                                            <option value={"strict"}>strict</option>
                                            <option value={"unspecified"}>unspecified</option>
                                        </select>
                                    </div>

                                    <div className={`w-full mb-2`}>
                                        <label
                                            htmlFor="secure"
                                            className="block mb-2 text-[12px] font-medium text-gray-900">
                                            Secure
                                        </label>
                                        <select
                                            id={"secure"}
                                            onChange={(e) => handleEditCookie("secure", e.target.value)}
                                            value={String(settingStore.cookie_select.secure)}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2">
                                            <option value={"false"}>False</option>
                                            <option value={"true"}>True</option>
                                        </select>
                                    </div>

                                    <div className={`w-full flex justify-between`}>
                                        <div className={"inline-block w-[59%]"}>
                                            <button
                                                onClick={handleActionEditCookie}
                                                className={`h-[40px] w-full rounded-[10px] bg-blue-500 text-white px-5`}>
                                                Edit
                                            </button>
                                        </div>
                                        <div className={"inline-block w-[39%]"}>
                                            <button
                                                onClick={() => settingStore.popup = ""}
                                                className={`h-[40px] w-full rounded-[10px] bg-gray-200 text-gray-900 px-5`}>
                                                Cancel
                                            </button>
                                        </div>
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

export default observer(EditCookie)