/*global chrome*/
import {useEffect, useRef, useState} from "react";
import {useClickOutside} from "../../../../../hooks/useClickOutside";
import ModalPopup from "../modal_popup";
import {motion, AnimatePresence} from "framer-motion";
import {extension} from "../../../../../utils/chrome";
import {getListHistory} from "../../../../../utils/history";

const PopupAutoRemoveCookie = ({close}) => {
    const ref = useRef(null);
    useClickOutside(ref, close);

    const [isRunning, setIsRunning] = useState("false");
    const [histories, setHistories] = useState([]);
    const [selectOptionHistory, setSelectOptionHistory] = useState(false);
    const [whitelist, setWhitelist] = useState([]);
    const [search, setSearch] = useState("");

    const handleChangeWhiteList = async (value) => {
        const list = JSON.parse(JSON.stringify(value.split(`\n`)));
        setWhitelist(list);
    }

    const handleGetHistories = async () => {
        const allCookie = await chrome.cookies.getAll({});
        let domains = [];
        for (let i = 0; i < allCookie.length; i++) {
            const index = domains.findIndex(item => item.domain === allCookie[i].domain);
            if (index === -1) {
                domains.push({domain: allCookie[i].domain, count: 1})
            } else {
                domains[index].count = domains[index].count + 1
            }
        }

        domains.sort((a, b) => b.visitCount - a.visitCount);
        // const domains = await getListHistory();
        setHistories(JSON.parse(JSON.stringify(domains)))
    }

    const handleSelectOptionHistory = async (status) => {
        console.log("handleSelectOptionHistory", status)
        let isSelect = "";
        if (status) {
            chrome.permissions.request({permissions: ['history', "storage"]}, async (granted) => {
                if (granted) {
                    isSelect = true;
                    setSelectOptionHistory(true);
                    await handleGetHistories();
                } else {
                    isSelect = false;
                    setSelectOptionHistory(false);
                }
            });
        } else {
            isSelect = false;
            setSelectOptionHistory(false);
            setHistories([]);
        }

        localStorage.setItem("using_option_browser_history", String(isSelect))
    }

    const handleStartAutoRemove = async () => {
        await extension.storage.setItem("whitelist_auto_remove_cookie", whitelist);
        await extension.storage.setItem("start_auto_remove_cookie", "true");
        setIsRunning("true");
    }

    const handleStopAutoRemove = async () => {
        await extension.storage.setItem("start_auto_remove_cookie", "false");
        setIsRunning("false");
    }

    useEffect(() => {
        if (selectOptionHistory) {
            chrome.permissions.contains({ permissions: ['history', "storage"] }, function(result) {
                if (result) {
                    handleGetHistories().then()
                }
            });
        }
    }, [selectOptionHistory])

    useEffect(() => {
        const isSelectOptionHistory = localStorage.getItem("using_option_browser_history");
        setSelectOptionHistory(isSelectOptionHistory === "true");
    }, [])

    useEffect(() => {
        (async () => {
            const isRunning = await extension.storage.getItem("start_auto_remove_cookie");
            const dataWhitelist = await extension.storage.getItem("whitelist_auto_remove_cookie");
            if (dataWhitelist) {
                setWhitelist(dataWhitelist)
            }
            setIsRunning(isRunning)
        })()
    }, [])

    return (
        <>
            <ModalPopup/>
            <AnimatePresence>
                <motion.div
                    ref={ref}
                    initial={{opacity: 0, y: 50}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: 50}}
                    transition={{duration: 0.5, ease: "easeOut"}}
                    className={`fixed top-0 left-0 p-[10px] overflow-y-auto`}
                    style={{zIndex: 50, width: "calc(100% - 50px)", maxHeight: "calc(100vh - 70px)"}}
                >
                    <div className={`bg-white rounded-[10px] p-5`}>
                        <p className={`font-bold text-[14px] mb-2`}>AUTO REMOVE COOKIE</p>
                        <p className={`text-[12px] mb-1`}>Automatically clean cookies the way you want.</p>
                        <p className={`text-[12px] mb-5`}>
                            Cookies will be automatically deleted when the tab is closed or navigated to a different
                            website. Set up a whitelist to ensure specific sites are not removed by the auto cookie
                            cleaner.
                        </p>

                        <div className={`w-full`}>
                            <p className={`text-[12px] mb-2 font-bold`}>Whitelist</p>
                            <textarea
                                rows={3}
                                value={whitelist.join(`\n`)}
                                onChange={(e) => handleChangeWhiteList(e.target.value)}
                                placeholder={"https://example_1.com\nhttps://example_2.com\nhttps://example_3.com"}
                                className={`w-full p-2 border border-gray-200 rounded-lg mb-2`}
                            />

                            <div className={`w-full mb-5`}>
                                <div className="w-full mb-4">
                                    <div className={`w-full mb-2`}>
                                        <input
                                            id={`whitelist_history`}
                                            type="checkbox"
                                            checked={selectOptionHistory}
                                            onChange={(e) => handleSelectOptionHistory(e.target.checked)}
                                            value={"history"}
                                            name="format"
                                            className="w-4 h-4 text-blue-600 bg-gray-400 border-gray-500 rounded-sm focus:ring-blue-500"
                                        />
                                        <label
                                            htmlFor={`whitelist_history`}
                                            className="ms-2 text-[12px] cursor-pointer font-medium text-gray-900"
                                        >
                                            Create whitelist from browser history
                                        </label>
                                    </div>
                                    {
                                        !selectOptionHistory && (
                                            <p className={`text-[12px]`}>
                                                To help you create a whitelist, we’ll gather a list of websites you
                                                frequently
                                                visit, and you can choose which ones to keep cookies for during automatic
                                                deletion. We do not store your browsing history.
                                            </p>
                                        )
                                    }
                                </div>

                                {
                                    histories.length > 0 && (
                                        <div
                                            className={`w-full rounded  border border-gray-200 p-3 max-h-[250px] overflow-y-auto`}>
                                            <form className="mx-auto mb-3">
                                                <label
                                                    htmlFor="default-search"
                                                    className="mb-2 text-sm font-medium text-gray-900 sr-only">
                                                    Search
                                                </label>
                                                <div className="relative">
                                                    <div
                                                        className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                                        <svg
                                                            className="w-4 h-4 text-gray-500"
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
                                                        className="block w-full p-4 ps-10 text-[12px] text-gray-500 rounded border border-gray-200"
                                                        placeholder={"Search Domain"}
                                                        onChange={(e) => setSearch(e.target.value)}
                                                        value={search}
                                                    />
                                                </div>
                                            </form>
                                            {
                                                (search.length === 0 ? histories : histories.filter(item => item.domain.includes(search))).map((history, key) => (
                                                    <div key={key} className="flex items-center mb-4">
                                                        <input
                                                            id={`website_${key}`}
                                                            type="checkbox"
                                                            checked={whitelist.includes(history.domain)}
                                                            onChange={(e) => {
                                                                let dataWhitelist = whitelist;
                                                                if (e.target.checked) {
                                                                    setWhitelist([history.domain].concat(dataWhitelist))
                                                                } else {
                                                                    setWhitelist(dataWhitelist.filter(u => u !== history.domain))
                                                                }
                                                            }}
                                                            className="w-4 h-4 text-blue-600 bg-gray-100 border border-gray-300 rounded-sm focus:ring-blue-500"
                                                        />
                                                        <label
                                                            htmlFor={`website_${key}`}
                                                            className="ms-2 text-[12px] text-gray-900"
                                                        >
                                                            {history.domain}
                                                        </label>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    )
                                }
                            </div>
                            {
                                isRunning === "true" ? (
                                    <div className={`w-full flex justify-between`}>
                                        <div className={`inline-block w-[59%]`}>
                                            <button
                                                className={`h-[40px] w-full rounded-[10px] bg-blue-500 text-white px-5`}>
                                                RUNNING ...
                                            </button>
                                        </div>
                                        <div className={`inline-block w-[39%]`}>
                                            <button
                                                onClick={handleStopAutoRemove}
                                                className={`h-[40px] w-full rounded-[10px] bg-gray-300 text-gray-800 px-5`}>
                                                STOP
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={`w-full`}>
                                        <button
                                            onClick={handleStartAutoRemove}
                                            className={`h-[40px] w-full rounded-[10px] bg-blue-500 text-white px-5`}>
                                            START
                                        </button>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </>
    )
}

export default PopupAutoRemoveCookie