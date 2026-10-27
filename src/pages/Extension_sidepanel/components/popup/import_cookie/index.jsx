/*global chrome*/
import CryptoJS from "crypto-js";
import {useEffect, useRef, useState} from "react";
import { motion } from "framer-motion";
import ModalPopup from "../modal_popup";
import {googleAnalytics} from "../../../../../utils/google_analytics";
import {extension} from "../../../../../utils/chrome";
import {observer} from "mobx-react-lite";
import {settingStore} from "../../../../../mobx/setting.store";
import {useClickOutside} from "../../../../../hooks/useClickOutside";
import {parseCookieImport} from "../../../../../utils/cookie_text_import";

const ImportCookie = () => {
    const ref = useRef(null);
    useClickOutside(ref, () => settingStore.popup = "");

    const format = settingStore.format_import;
    const optionImport = settingStore.option_import;

    const [password, setPassword] = useState("");
    const [url, setUrl] = useState("");
    const [linkImport, setLinkImport] = useState("");
    const [cookies, setCookies] = useState([]);
    const [contentImport, setContentImport] = useState("");

    const listFormats = [
        {title: "Use text", id: "import_from_text", value: "text"},
        {title: "Use a file", id: "import_from_file", value: "file"},
        // {title: "Use a link", id: "import_from_url", value: "link"}
    ];

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            let dataContent = e.target.result;
            setContentImport(String(dataContent))
        };

        reader.readAsText(file);
    };

    const handleImport = async () => {
        try {
            let dataCookies;
            switch (format) {
                case "text":
                    dataCookies = cookies;
                    break;

                case "file":
                    dataCookies = contentImport;
                    break;

                case "link":
                    const res = await fetch(linkImport);
                    const dataRes = await res.text();
                    dataCookies = dataRes;
                    break;
            }

            if (password.length > 0) {
                dataCookies = CryptoJS.AES.decrypt(dataCookies.trim(), password).toString(CryptoJS.enc.Utf8);
            }

            // Parse and validate every row before any Cookie write. Browser API failures
            // can still interrupt writes: chrome.cookies does not provide transactions.
            const expirationDate = Math.round(Date.now() / 1000) + 365 * 86400;
            const cookiesToSet = parseCookieImport(dataCookies, url, expirationDate);
            for (const cookie of cookiesToSet) {
                await chrome.cookies.set(cookie);
            }
            settingStore.alert = {type: "info", message: extension.getLang("alert_import_cookie_success")}

            document.dispatchEvent(new CustomEvent("update_cookie", {
                detail: {action: "import"},
                bubbles: true,
            }));

            if (optionImport.includes("reload_page")) {
                const [tabCurrent] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
                await chrome.tabs.reload(tabCurrent.id);
            }
            googleAnalytics({name: "import_cookie", params: []});
            settingStore.popup = "";
        } catch (e) {
            console.log("import error", e)
            settingStore.popup = "";
            settingStore.alert = {type: "error", message: extension.getLang("alert_import_cookie_error")}
        }
    }

    useEffect(() => {
        (async () => {
            const [tabCurrent] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
            setUrl(tabCurrent.url)
        })()
    }, [])

    return (
        <>
            {
                settingStore.popup === "import_cookie" && (
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
                            <div className={`bg-white rounded-[10px] overflow-y-auto p-5`} style={{maxHeight: "calc(100vh - 80px)"}}>
                                <p className={`font-bold text-[14px] mb-2`}>
                                    {extension.getLang("title_import_cookie")}
                                </p>
                                <p className={`text-[12px] mb-5`}>
                                    {extension.getLang("description_import_cookie")}
                                </p>
                                <div className={`w-full flex flex-wrap justify-between mb-2`}>
                                    {
                                        listFormats.map((item, key) => (
                                            <div key={key} className="inline-flex w-fit pr-3 items-center mb-4">
                                                <input
                                                    id={item.id}
                                                    type="radio"
                                                    value={item.value}
                                                    name="format"
                                                    onClick={(e) => settingStore.setFormatImport(e.target.value)}
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
                                <div className={`w-full mb-5`}>
                                    <input
                                        type="text"
                                        onChange={(e) => setUrl(e.target.value)}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 mb-1"
                                        value={url}
                                    />
                                </div>
                                <div className={`w-full mb-5`}>
                                    {
                                        format === "text" && (
                                            <>
                                                <label className="block mb-2 text-[12px] font-medium text-gray-900">
                                                    Cookie value
                                                </label>
                                                <textarea
                                                    rows={5}
                                                    onChange={(e) => setCookies(e.target.value)}
                                                    placeholder={"JSON/Header string/Netscape"}
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 mb-1"
                                                />
                                            </>
                                        )
                                    }

                                    {
                                        format === "file" && (
                                            <>
                                                <label className="block mb-2 text-[12px] font-medium text-gray-900">
                                                    {extension.getLang("label_select_file_import")}
                                                </label>
                                                <input
                                                    onChange={handleFileChange}
                                                    accept=".txt, .json"
                                                    className="block w-full mb-5 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                                                    type="file"
                                                />
                                            </>
                                        )
                                    }

                                    {
                                        format === "link" && (
                                            <>
                                                <label className="block mb-2 text-[12px] font-medium text-gray-900">
                                                    {extension.getLang("lable_link_import")} (<span className={"text-red-500"}>*</span>)
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder={"http://example.com/cookie"}
                                                    onChange={(e) => setLinkImport(e.target.value)}
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 mb-1"
                                                    value={linkImport}
                                                />
                                            </>
                                        )
                                    }
                                </div>
                                <div className={`w-full mb-5`}>
                                    <label
                                        htmlFor="hostOnly"
                                        className="block mb-2 text-[12px] font-medium text-gray-900">
                                        {extension.getLang("label_password_decrypt")}
                                    </label>
                                    <input
                                        type="password"
                                        placeholder={extension.getLang("label_password_decrypt")}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-[12px] rounded-lg block w-full p-2.5 mb-1"
                                        value={password}
                                    />
                                    <p className={`text-gray-500`}>
                                        {extension.getLang("description_password_decrypt")}
                                    </p>
                                </div>
                                <div className={`w-full flex justify-between`}>
                                    <div className={"inline-block w-[59%]"}>
                                        <button
                                            onClick={handleImport}
                                            className={`h-[40px] w-full rounded-[10px] bg-blue-500 text-white px-5`}>
                                            {extension.getLang("btn_import")}
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

export default observer(ImportCookie)
