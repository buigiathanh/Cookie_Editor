/*global chrome*/

import {observer} from "mobx-react-lite";
import {useEffect, useState} from "react";
import DeleteCookie from "../popup/delete_cookie";
import EditCookie from "../popup/edit_cookie";
import {customizeCookieDefault} from "../../../../constants";
import {extension} from "../../../../utils/chrome";
import {deleteCookie} from "../../../../utils/cookie";
import {settingStore} from "../../../../mobx/setting.store";
import IconCopy from "../../../../icons/copy";
import IconDelete from "../../../../icons/delete";
import IconEdit from "../../../../icons/edit";

const DetailCookie = ({cookies}) => {
    const [search, setSearch] = useState("");
    const displayCookie = settingStore.display_cookie;
    const customizeDisplayCookie = settingStore.customize_display_cookie;
    const confirmDialog = settingStore.confirm_dialog;
    const [cookieSelect, setCookieSelect] = useState(undefined);

    const handleSelectAction = async (cookie, action) => {
        if (action === "delete_cookie" && !confirmDialog.includes("delete")) {
            await deleteCookie(cookie)
        } else {
            settingStore.popup = action;
            setCookieSelect(JSON.parse(JSON.stringify(cookie)));
            settingStore.cookie_select = cookie;
        }
    }

    const handleCopy = (cookie) => {
        navigator.clipboard.writeText(cookie.value)
            .then(() => {
                settingStore.popup = "";
                console.log(extension.getLang("alert_copy_cookie_success"))
                settingStore.alert = {type: "info", message: extension.getLang("alert_copy_cookie_success")}
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
            });
    }

    const handleFormatDate = (time) => {
        return new Date(time * 1000)
            .toLocaleString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            })
    }

    useEffect(() => {
        let customizeCookie = customizeCookieDefault;

        if (displayCookie === "compact") {
            const keyDisplays = ["name", "value", "expirationDate", "path"]
            customizeCookie = customizeCookie.map(item => {
                return {...item, ...{display: keyDisplays.includes(item.key)}}
            })
        } else if (displayCookie === "custom") {
            const dataCustomizeDisplayCookie = localStorage.getItem("customize_display_cookie");
            if (typeof dataCustomizeDisplayCookie === "string") {
                const keyDisplays = JSON.parse(dataCustomizeDisplayCookie)
                customizeCookie = customizeCookie.map(item => {
                    return {...item, ...{display: keyDisplays.includes(item.key)}}
                })
            } else {
                customizeCookie = customizeCookie.map(item => {
                    return {...item, ...{display: false}}
                })
            }
        }

        settingStore.customize_display_cookie = customizeCookie
    }, [displayCookie])


    return (
        <div className={`w-full h-full relative`}>
            {
                cookies && (
                    <form className="mx-auto mb-3">
                        <label
                            htmlFor="default-search"
                            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
                            Search
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg
                                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                    />
                                </svg>
                            </div>
                            <input
                                type="text"
                                id="default-search"
                                className="block w-full p-4 ps-10 text-[12px] text-white border border-[#3C3C3C] rounded-lg bg-[#3C3C3C]"
                                placeholder={extension.getLang("placeholder_search")}
                                onChange={(e) => setSearch(e.target.value)}
                                value={search}
                            />
                        </div>
                    </form>
                )
            }

            {
                cookies && customizeDisplayCookie.length > 0 && cookies.map((cookie, key) => (
                    <div
                        key={key}
                        className={`w-ful ${search.length === 0 || (search.length > 0 && cookie.name.toLowerCase().includes(search.toLowerCase())) ? "flex" : "hidden"} items-center min-h-[130px] bg-[#3C3C3C] mb-3 rounded-[10px] p-4 group relative`}>
                        <div className={`w-full inline-block pr-5`}>
                            {
                                Object.keys(cookie).map((item, itemKey) => (
                                    <div key={itemKey}
                                         className={`w-full ${(customizeDisplayCookie.find(setting => setting.key === item)?.display || customizeDisplayCookie[itemKey].required) ? "flex items-center" : "hidden"} text-white mb-2 last:mb-0`}>
                                        <div className={`w-[90px] inline-block`}>
                                            <p>{item}</p>
                                        </div>
                                        <div className={`inline-block`}
                                             style={{width: "calc(100% - 90px)"}}>
                                            <p className={`truncate`}>{item === "expirationDate" ? handleFormatDate(cookie[item]) : String(cookie[item])}</p>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>

                        <div className={`w-5 absolute bottom-2 right-3 hidden group-hover:block`}>
                            <div
                                onClick={() => handleSelectAction(cookie, "edit_cookie")}
                                className={`w-6 h-6 mb-2 p-1 rounded-[5px] cursor-pointer hover:bg-gray-500`}>
                                <IconEdit cname={`w-4 h-4 text-white`} />
                            </div>
                            <div
                                onClick={() => handleCopy(cookie)}
                                className={`w-6 h-6 mb-2 p-1 rounded-[5px] cursor-pointer hover:bg-gray-500`}>
                                <IconCopy cname={`w-4 h-4 text-white`} />
                            </div>
                            <div
                                onClick={() => handleSelectAction(cookie, "delete_cookie")}
                                className={`w-6 h-6 mb-2 p-1 rounded-[5px] cursor-pointer hover:bg-gray-500`}>
                                <IconDelete cname={`w-4 h-4 text-white`} />
                            </div>
                        </div>
                    </div>
                ))
            }

            <DeleteCookie cookie={cookieSelect}/>

            <EditCookie cookie={cookieSelect}/>

        </div>
    )
}

export default observer(DetailCookie)