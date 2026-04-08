/*global chrome*/
import {useEffect, useState} from "react";
import PopupClearDataBrowser from "../components/popup/clear_data_browser";
import {googleAnalytics} from "../../../utils/google_analytics";
import {observer} from "mobx-react-lite";
import {settingStore} from "../../../mobx/setting.store";
import {extension} from "../../../utils/chrome";

const options = [
    {
        title: `Website's appcaches.`,
        key: extension.getLang("clear_browser_option_appcache")
    },
    {
        title: `The browser's cache`,
        key: extension.getLang("clear_browser_option_cache")
    },
    {
        title: `Cache storage`,
        key: extension.getLang("clear_browser_option_cacheStorage")
    },
    {
        title: `Cookies`,
        key: extension.getLang("clear_browser_option_cookies")
    },
    {
        title: `The browser's download list`,
        key: extension.getLang("clear_browser_option_downloads")
    },
    {
        title: `The browser's history`,
        key: extension.getLang("clear_browser_option_history")
    },
    {
        title: `The browser's stored form data`,
        key: extension.getLang("clear_browser_option_formData")
    },
    {
        title: `Websites' file systems`,
        key: extension.getLang("clear_browser_option_fileSystems")
    },
    {
        title: `Websites' IndexedDB data`,
        key: extension.getLang("clear_browser_option_indexedDB")
    },
    {
        title: `Websites' local storage data`,
        key: extension.getLang("clear_browser_option_localStorage")
    },
    {
        title: `Service Workers`,
        key: extension.getLang("clear_browser_option_serviceWorkers")
    },
    {
        title: `Websites' WebSQL data`,
        key: extension.getLang("clear_browser_option_webSQL")
    }
];

const ClearData = () => {
    const [optionSelect, setOptionSelect] = useState([]);
    const [timeClear, setTimeClear] = useState(0);

    const handleSelectOption = (key) => {
        let optionUserSelect = [];
        if (optionSelect.includes(key)) {
            optionUserSelect = optionSelect.filter(item => item !== key)
        } else {
            optionUserSelect = optionSelect.concat([key])
        }

        setOptionSelect(JSON.parse(JSON.stringify(optionUserSelect)))
    }

    const handleSelectAll = () => {
        setOptionSelect(options.map(opt => opt.key));
    };

    const handleRemoveAll = () => {
        setOptionSelect([])
    }

    const handleClearNow = async () => {
        googleAnalytics({name: "clear_data_browser", params: []})
        await chrome.browsingData.remove({ since: timeClear }, Object.fromEntries(
            optionSelect.map(key => [key, true])
        ));

        settingStore.popup = "";
        settingStore.alert = {type: "info", message: "Clear data success"}
    };

    const handleClear = () => {
        chrome.permissions.request({ permissions: ['browsingData'] }, (granted) => {
            if (granted && optionSelect.length > 0) {
                settingStore.popup = "delete_browser_data";
            } else {
                //todo
            }
        });
    }

    useEffect(() => {
        (async () => {
            googleAnalytics({name: "open_clear_data_browser", params: []})
        })()
    }, [])

    return (
        <>
            {
                settingStore.tab === "clear_data_web" && (
                    <>
                        <div className={`w-full py-3`}>
                            <p className={`text-white font-bold text-[14px] mb-2`}>
                                {extension.getLang("clear_browser_title")}
                            </p>
                            <p className={`text-white text-[12px]`}>
                                {extension.getLang("clear_browser_description")}
                            </p>
                            <div className={`w-full bg-[#3C3C3C] p-4 rounded-[10px] mb-[10px] mt-3`}>
                                {
                                    options.map((option, key) => (
                                        <div key={key} className="w-full mb-4 last:mb-0">
                                            <input
                                                id={`option_clear_${key}`}
                                                type="checkbox"
                                                onChange={() => handleSelectOption(option.key)}
                                                value={option.key}
                                                checked={optionSelect.includes(option.key)}
                                                className="w-4 h-4 text-blue-600 rounded-sm ring-offset-gray-800 focus:ring-2 bg-gray-300 border-gray-400"
                                            />
                                            <label
                                                htmlFor={`option_clear_${key}`}
                                                className="ms-2 text-[12px] text-white capitalize">
                                                {option.title}
                                            </label>
                                        </div>
                                    ))
                                }

                                <button
                                    onClick={handleSelectAll}
                                    className="px-3 py-2 me-2 text-[12px] font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-800 focus:outline-none">
                                    {extension.getLang("button_select_all")}
                                </button>

                                <button
                                    onClick={handleRemoveAll}
                                    className="px-3 py-2 text-[12px] font-medium text-center text-gray-800 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none">
                                    {extension.getLang("button_remove_all")}
                                </button>
                            </div>
                            <div className={`w-full bg-[#3C3C3C] p-4 rounded-[10px] mb-[10px] mt-3`}>
                                <p className={`text-white text-[12px] mb-3`}>
                                    {extension.getLang("message_select_time_clear_browser_data")}
                                </p>
                                <div className="w-full mb-3">
                                    <input
                                        id={"all_time"}
                                        type="radio"
                                        value={"default"}
                                        onClick={() => setTimeClear(0)}
                                        name="time_clear"
                                        className="w-4 h-4 text-blue-600 bg-gray-300 border-gray-400 focus:ring-blue-500"
                                    />
                                    <label
                                        htmlFor={"all_time"}
                                        className="ms-2 text-[12px] cursor-pointer font-medium text-white"
                                    >
                                        {extension.getLang("choice_all_time")}
                                    </label>
                                </div>
                                <div className="w-full mb-3">
                                    <input
                                        id={"24h"}
                                        type="radio"
                                        onClick={() => setTimeClear((new Date()).getTime() - 1000 * 60 * 60 * 24)}
                                        value={"default"}
                                        name="time_clear"
                                        className="w-4 h-4 text-blue-600 bg-gray-300 border-gray-400 focus:ring-blue-500"
                                    />
                                    <label
                                        htmlFor={"24h"}
                                        className="ms-2 text-[12px] cursor-pointer font-medium text-white"
                                    >
                                        {extension.getLang("choice_24h")}
                                    </label>
                                </div>
                                <div className="w-full mb-3">
                                    <input
                                        id={"7_days"}
                                        type="radio"
                                        value={"default"}
                                        onClick={() => setTimeClear((new Date()).getTime() - 1000 * 60 * 60 * 24 * 7)}
                                        name="time_clear"
                                        className="w-4 h-4 text-blue-600 bg-gray-300 border-gray-400 focus:ring-blue-500"
                                    />
                                    <label
                                        htmlFor={"7_days"}
                                        className="ms-2 text-[12px] cursor-pointer font-medium text-white"
                                    >
                                        {extension.getLang("choice_last_7days")}
                                    </label>
                                </div>
                                <div className="w-full mb-3">
                                    <input
                                        id={"30_days"}
                                        type="radio"
                                        onClick={() => setTimeClear((new Date()).getTime() - 1000 * 60 * 60 * 24 * 30)}
                                        value={""}
                                        name="time_clear"
                                        className="w-4 h-4 text-blue-600 bg-gray-300 border-gray-400 focus:ring-blue-500"
                                    />
                                    <label
                                        htmlFor={"30_days"}
                                        className="ms-2 text-[12px] cursor-pointer font-medium text-white"
                                    >
                                        {extension.getLang("choice_last_30days")}
                                    </label>
                                </div>
                            </div>
                            <button
                                onClick={handleClear}
                                className={`h-[40px] w-full rounded-[10px] bg-blue-500 text-white`}>
                                {extension.getLang("button_clear_browser")}
                            </button>
                        </div>

                        <PopupClearDataBrowser clear={handleClearNow}/>
                    </>
                )
            }
        </>
    )
}

export default observer(ClearData)