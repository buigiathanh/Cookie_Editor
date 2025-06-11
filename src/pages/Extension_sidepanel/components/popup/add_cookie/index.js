/*global chrome*/
import {motion} from "framer-motion";
import {useRef, useState} from "react";
import {observer} from "mobx-react-lite";
import {googleAnalytics} from "../../../../../utils/google_analytics";
import {extension} from "../../../../../utils/chrome";
import {settingStore} from "../../../../../mobx/setting.store";
import {useClickOutside} from "../../../../../hooks/useClickOutside";
import ModalPopup from "../modal_popup";

const AddCookie = () => {
    const ref = useRef(null);
    useClickOutside(ref, () => {
        settingStore.popup = "";
    })

    const [cookie, setCookie] = useState({});

    const handleAddCookie = (key, value) => {
        setCookie({...cookie, ...{[key]: value}})
    }

    const handleSetCookie = async () => {
        try {
            const [tabCurrent] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
            await chrome.cookies.set({
                ...cookie, ...{url: tabCurrent.url}
            })
            document.dispatchEvent(new CustomEvent("update_cookie", {
                detail: {action: "add"},
                bubbles: true,
            }));
            settingStore.alert = {type: "info", message: extension.getLang("alert_add_cookie_success")}
            googleAnalytics({name: "add_cookie", params: []})
        } catch (e) {
            settingStore.alert = {type: "error", message: "Add cookie error"}
        }

        settingStore.popup = "";
    }

    const handleFormatDate = (value) => {
        if (value) {
            const timestamp = value * 1000;
            const date = new Date(timestamp);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            return `${year}-${month}-${day}T${hours}:${minutes}`;
        } else {
            return ""
        }
    }

    return (
        <>
            {
                settingStore.popup === "add_cookie" && (
                    <>
                        <ModalPopup />
                        <motion.div
                            ref={ref}
                            initial={{opacity: 0, y: -50}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -50}}
                            transition={{duration: 0.5}}
                            className={`fixed top-0 left-0 p-[10px] overflow-y-auto`}
                            style={{zIndex: 50, width: "calc(100% - 50px)", maxHeight: "calc(100vh - 100px)"}}
                        >
                            <div className={`bg-white rounded-[10px] p-5`}>
                                <p className={`font-bold text-[14px] mb-1`}>
                                    {extension.getLang("title_add_cookie")}
                                </p>
                                <p className={`text-[12px] mb-5`}>
                                    {extension.getLang("description_add_cookie")}
                                </p>
                                <div className={`w-full`}>
                                    <div className={`w-full mb-2`}>
                                        <label
                                            htmlFor="hostOnly"
                                            className="block mb-2 text-[12px] font-medium text-gray-900">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            onChange={(e) => handleAddCookie("name", e.target.value)}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2"
                                            value={cookie?.name}
                                        />
                                    </div>
                                    <div className={`w-full mb-2`}>
                                        <label
                                            htmlFor="hostOnly"
                                            className="block mb-2 text-[12px] font-medium text-gray-900">
                                            Value
                                        </label>
                                        <textarea
                                            rows={3}
                                            onChange={(e) => handleAddCookie("value", e.target.value)}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2">
                                {cookie?.value}
                            </textarea>
                                    </div>
                                    <div className={`w-full mb-2`}>
                                        <label
                                            htmlFor="expirationDate"
                                            className="block mb-2 text-[12px] font-medium text-gray-900">
                                            Expiration Date
                                        </label>
                                        <input
                                            type="datetime-local"
                                            onChange={(e) => handleAddCookie("expirationDate", Math.round(new Date(e.target.value).getTime() / 1000))}
                                            id="expirationDate"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2"
                                            value={handleFormatDate(cookie?.expirationDate)}
                                        />
                                    </div>
                                    <div className={`w-full mb-2`}>
                                        <label
                                            htmlFor="hostOnly"
                                            className="block mb-2 text-[12px] font-medium text-gray-900">
                                            HttpOnly
                                        </label>
                                        <select
                                            onChange={(e) => handleAddCookie("hostOnly", e.target.value  === "true")}
                                            value={String(cookie?.hostOnly)}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2">
                                            <option value={"true"}>True</option>
                                            <option value={"false"}>False</option>
                                        </select>
                                    </div>
                                    <div className={`w-full mb-2`}>
                                        <label
                                            htmlFor="hostOnly"
                                            className="block mb-2 text-[12px] font-medium text-gray-900">
                                            SameSite
                                        </label>
                                        <select
                                            onChange={(e) => handleAddCookie("sameSite", e.target.value)}
                                            value={String(cookie?.sameSite)}
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
                                            onChange={(e) => handleAddCookie("secure", e.target.value === "true")}
                                            value={String(cookie?.secure)}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2">
                                            <option value={"false"}>False</option>
                                            <option value={"true"}>True</option>
                                        </select>
                                    </div>
                                    <div className={`w-full flex justify-between`}>
                                        <div className={"inline-block w-[59%]"}>
                                            <button
                                                onClick={handleSetCookie}
                                                className={`h-[40px] w-full rounded-[10px] bg-blue-500 text-white px-5`}>
                                                Add
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

export default observer(AddCookie)