/*global chrome*/
import {image} from "../../utils/images";
import {useEffect, useState} from "react";
import CryptoJS from "crypto-js";
import {extension} from "../../utils/chrome";

const ExtensionImport = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [uuid, setUuid] = useState("");
    const [cookieInfo, setCookieInfo] = useState({});
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const getQueryParam = (key) => {
        return new URLSearchParams(window.location.search).get(key);
    }

    const handleImportCookieJson = async (dataCookies) => {
        let cookies = typeof dataCookies === "string" ? JSON.parse(dataCookies) : dataCookies
        for (let i = 0; i < cookies.length; i++) {
            const dataUpdate = {
                expirationDate: cookies[i].expirationDate,
                httpOnly: cookies[i].httpOnly,
                name: cookies[i].name,
                value: cookies[i].value,
                sameSite: cookies[i].sameSite,
                path: cookies[i].path,
                secure: cookies[i].secure,
                storeId: cookies[i].storeId,
                url: cookieInfo.domain
            }
            await chrome.cookies.set(dataUpdate);
            if (i === cookies.length - 1) {
                window.location.replace(cookieInfo.domain);
            }
        }
    }

    const handleImport = async () => {
        if (!password) {
            setMessage(extension.getLang("msg_password_empty"));
            return;
        }

        if (!cookieInfo || !Object.keys(cookieInfo).length) {
            setMessage(extension.getLang("msg_cookie_error"));
            return;
        }

        try {
            const decodedBase64 = CryptoJS.AES.decrypt(cookieInfo.cookie, password).toString(CryptoJS.enc.Utf8);
            if (!decodedBase64) {
                setMessage(extension.getLang("msg_password_error"));
                return;
            }

            const cookies = JSON.parse(atob(decodedBase64));
            if (typeof cookies !== "object" || cookies === null) {
                setMessage(extension.getLang("msg_password_error"));
                return;
            }

            await handleImportCookieJson(cookies);
        } catch (error) {
            setMessage(extension.getLang("msg_password_error"));
        }
    }

    useEffect(() => {
        if (uuid.length > 0) {
            (async () => {
                setIsLoading(true);
                const response = await fetch(`${process.env.REACT_APP_WEBSITE}/api/cookie/${uuid}/info`, {
                    "method": "GET",
                    "mode": "cors",
                    "credentials": "include"
                });

                setIsLoading(false);
                if (response.ok) {
                    const dataResponse = await response.json();
                    setCookieInfo({...cookieInfo, ...dataResponse.data})
                } else {
                    const statusCode = response.status;
                    if (statusCode === 404) {
                        setMessage(extension.getLang("msg_link_not_found"))
                    } else if (statusCode === 403) {
                        setMessage(extension.getLang("msg_no_permission"))
                    } else if (statusCode === 410) {
                        setMessage(extension.getLang("msg_link_exp"))
                    }
                }
            })()
        }
    }, [uuid])

    useEffect(() => {
        const cookieId = getQueryParam('cookie_id');
        if (cookieId) {
            setUuid(cookieId)
        }
    }, []);

    return (
        <div className={`w-full bg-white relative`}>
            <div className={`w-[90%] max-w-[500px] mx-auto py-10`}>
                <div className={`w-full text-center mb-5`}>
                    <img
                        src={image.inExtension("/icons/128x128.png")}
                        width={60}
                        height={60}
                        alt={"cookie editor"}
                        className={`w-[60px] h-[60px] mx-auto`}
                    />
                    <h1 className={`text-blue-700 text-4xl/[1.25] font-extrabold tracking-tight uppercase mt-5 my-2`}>
                        Cookie editor
                    </h1>
                    <p className={`text-gray-800 text-sm`}>
                        {extension.getLang("page_import_description")}
                    </p>
                </div>

                {
                    isLoading && (
                        <>
                            <div className={`w-full bg-gray-100 border border-gray-200 rounded-lg p-5 mt-10`}>
                                <div className="h-2.5 bg-gray-200 rounded-full w-48 mb-4"/>
                                <div className="h-2 bg-gray-200 rounded-full max-w-[480px] mb-2.5"/>
                                <div className="h-2 bg-gray-200 rounded-full mb-2.5"/>
                                <div className="h-2 bg-gray-200 rounded-full max-w-[440px] mb-2.5"/>
                                <div className="h-2 bg-gray-200 rounded-full max-w-[460px] mb-2.5"/>
                                <div className="h-2 bg-gray-200 rounded-full max-w-[360px]"/>
                            </div>
                            <div
                                className={`w-full overflow-y-auto bg-gray-100 border border-gray-200 rounded-lg p-5 mt-5`}>

                                <div role="status" className="space-y-2.5 animate-pulse max-w-lg">
                                    <div className="flex items-center w-full">
                                        <div className="h-2.5 bg-gray-200 rounded-full w-32"/>
                                        <div className="h-2.5 ms-2 bg-gray-300 rounded-full w-24"/>
                                        <div className="h-2.5 ms-2 bg-gray-300 rounded-full w-full"/>
                                    </div>
                                    <div className="flex items-center w-full max-w-[480px]">
                                        <div className="h-2.5 bg-gray-200 rounded-full w-full"/>
                                        <div className="h-2.5 ms-2 bg-gray-300 rounded-full w-full"/>
                                        <div className="h-2.5 ms-2 bg-gray-300 rounded-full w-24"/>
                                    </div>
                                    <div className="flex items-center w-full max-w-[400px]">
                                        <div className="h-2.5 bg-gray-300 rounded-full w-full"/>
                                        <div className="h-2.5 ms-2 bg-gray-200 rounded-full w-80"/>
                                        <div className="h-2.5 ms-2 bg-gray-300 rounded-full w-full"/>
                                    </div>
                                    <div className="flex items-center w-full max-w-[480px]">
                                        <div className="h-2.5 ms-2 bg-gray-200 rounded-full w-full"/>
                                        <div className="h-2.5 ms-2 bg-gray-300 rounded-full w-full"/>
                                        <div className="h-2.5 ms-2 bg-gray-300 rounded-full w-24"/>
                                    </div>
                                    <div className="flex items-center w-full max-w-[440px]">
                                        <div className="h-2.5 ms-2 bg-gray-300 rounded-full w-32"/>
                                        <div className="h-2.5 ms-2 bg-gray-300 rounded-full w-24"/>
                                        <div className="h-2.5 ms-2 bg-gray-200 rounded-full w-full"/>
                                    </div>
                                    <div className="flex items-center w-full max-w-[360px]">
                                        <div className="h-2.5 ms-2 bg-gray-300 rounded-full w-full"/>
                                        <div className="h-2.5 ms-2 bg-gray-200 rounded-full w-80"/>
                                        <div className="h-2.5 ms-2 bg-gray-300 rounded-full w-full"/>
                                    </div>
                                    <span className="sr-only">Loading...</span>
                                </div>

                            </div>
                        </>
                    )
                }

                {
                    !isLoading && message.length > 0 && (
                        <div className="flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 mt-5"
                             role="alert">
                            <svg
                                className="shrink-0 inline w-4 h-4 me-3"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                            </svg>
                            <span className="sr-only">Info</span>
                            <div>
                                {message}
                            </div>
                        </div>
                    )
                }

                {
                    !isLoading && Object.keys(cookieInfo).length > 0 && (
                        <>
                            <div className={`w-full bg-gray-100 border border-gray-200 rounded-lg p-5`}>
                                <p className={`text-gray-800 text-sm mb-2`}><strong>{extension.getLang("Owner")}: </strong>{cookieInfo.owner}</p>
                                <p className={`text-gray-800 text-sm mb-2`}><strong>{extension.getLang("website")}: </strong>{cookieInfo.domain}
                                </p>
                                <p className={`text-gray-800 text-sm mb-2`}><strong>{extension.getLang("title")}: </strong>{cookieInfo.title}</p>
                                <p className={`text-gray-800 text-sm mb-2`}><strong>{extension.getLang("expiration_time")}: </strong>{cookieInfo.is_unlimited_exp ? "Unlimited" : cookieInfo.exp}</p>
                            </div>

                            <div
                                className={`w-full overflow-y-auto bg-gray-100 border border-gray-200 rounded-lg py-5 mt-5`}>
                                <div className={`w-full max-h-[150px] overflow-y-auto px-5`}>
                                    <p className={`text-gray-800 text-sm mb-2 break-words`}>
                                        {cookieInfo.cookie}
                                    </p>
                                </div>
                            </div>

                            <div className={`w-full mt-5`}>
                                <label
                                    htmlFor="default-search"
                                    className="mb-2 text-sm font-medium text-gray-900 sr-only">
                                    Search
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                        <svg
                                            className="w-4 h-4 text-gray-500"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M12 14v3m-3-6V7a3 3 0 1 1 6 0v4m-8 0h10a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1Z"
                                            />
                                        </svg>
                                    </div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        id="default-search"
                                        className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder={extension.getLang("password_encrypt")}
                                        required
                                    />
                                    <button
                                        onClick={handleImport}
                                        type="submit"
                                        className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2">
                                        {extension.getLang("btn_import")}
                                    </button>
                                </div>
                            </div>
                        </>
                    )
                }
            </div>

            <div className={`w-full mt-10 border-t border-gray-200 py-5`}>
                <div className={`w-full flex flex-wrap justify-center mb-5`}>
                    <a href={`${process.env.REACT_APP_WEBSITE}`}>
                        <div className={`inline-block px-3`}>
                            <p className={`text-gray-800 text-sm`}>
                                Home
                            </p>
                        </div>
                    </a>
                    <a href={"https://x.com/buigiathanh2802"}>
                        <div className={`inline-block px-3`}>
                            <p className={`text-gray-800 text-sm`}>
                                Contact
                            </p>
                        </div>
                    </a>
                    <a
                        href={`${process.env.REACT_APP_WEBSITE}/privacy-policy`}>
                        <div className={`inline-block px-3`}>
                            <p className={`text-gray-800 text-sm`}>
                                Privacy
                            </p>
                        </div>
                    </a>
                    <a href={"https://github.com/buigiathanh/Cookie_Editor"}>
                        <div className={`inline-block px-3`}>
                            <p className={`text-gray-800 text-sm`}>
                                Open Source
                            </p>
                        </div>
                    </a>
                    <a
                        href={`${process.env.REACT_APP_WEBSITE}/changelog`}>
                        <div className={`inline-block px-3`}>
                            <p className={`text-gray-800 text-sm`}>
                                Changelog
                            </p>
                        </div>
                    </a>
                </div>
                <div className={`w-full text-center`}>
                    <p className={`text-gray-800 text-sm mb-2`}>
                        <span className={`text-black font-bold`}>Cookie </span>
                        <span className={`text-blue-600 font-bold`}>Editor</span> is developed by <a
                        href={"https://x.com/buigiathanh2802"}><span
                        className={`text-blue-600 font-bold`}>ThanhBui</span></a>
                    </p>
                    <p className={`text-gray-800 text-sm`}>
                        Developed with all our heart ♥️
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ExtensionImport