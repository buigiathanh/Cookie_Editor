import {useEffect, useState} from "react";
import {cookieFormats, customizeCookieDefault} from "../../../constants";
import {extension} from "../../../utils/chrome";
import {observer} from "mobx-react-lite";
import {settingStore} from "../../../mobx/setting.store";

const Setting = () => {
    const displayCookie = settingStore.display_cookie;
    const customizeDisplayCookie = settingStore.customize_display_cookie;
    const formatCopyDefault = settingStore.format_copy;
    const formatExportDefault = settingStore.format_export;
    const optionImport = settingStore.option_import;
    const formatImportDefault = settingStore.format_import
    const confirmDialog = settingStore.confirm_dialog;

    const handleSetConfirmDialog = (value, status) => {
        let dataConfirmDialog = confirmDialog;
        if (status) {
            dataConfirmDialog = dataConfirmDialog.concat([value])
        } else {
            dataConfirmDialog = dataConfirmDialog.filter(item => item !== value)
        }

        settingStore.setConfirmDialog(dataConfirmDialog);
    }

    const handleSetSetting = (key, value) => {
        switch (key) {
            case "display_cookie":
                settingStore.setDisplayCookie(value)
                break;

            case "format_copy":
                settingStore.setFormatCopy(value);
                break;

            case "format_export":
                settingStore.setFormatExport(value)
                break;

            case "format_import":
                settingStore.setFormatImport(value)
                break;
        }
    }

    const handleChangeOptionImport = (key, event) => {
        const {checked} = event.target;
        const updatedOptions = checked
            ? [...optionImport, key]
            : optionImport.filter(item => item !== key);

        const uniqueOptions = [...new Set(updatedOptions)];

        settingStore.setOptionImport(uniqueOptions)
    };

    const handleChangeCustomizeCookie = (key, event) => {
        const {checked} = event.target;
        const item = customizeDisplayCookie.find(i => i.key === key);
        const index = customizeDisplayCookie.indexOf(item);
        customizeDisplayCookie[index].display = checked;
        const keysWithDisplayTrue = customizeDisplayCookie
            .filter(item => item.display === true)
            .map(item => item.key);

        settingStore.setCustomDisplayCookie(keysWithDisplayTrue);
    }

    useEffect(() => {
        let customizeCookie = customizeCookieDefault;

        if (displayCookie === "compact") {
            const keyDisplays = ["name", "value", "expirationDate", "secure"]
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

        settingStore.setCustomDisplayCookie(customizeCookie)
    }, [displayCookie])


    return (
        <>
            {
                settingStore.tab === "setting" && (
                    <div className={`w-full`}>
                        <div className={`w-full bg-[#3C3C3C] p-4 rounded-[10px] mb-[10px]`}>
                            <div className={`w-full flex items-center mb-2`}>
                                <div className={`inline-block w-[30px]`}>
                                    <svg
                                        className="w-[20px] h-[20px] text-white"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M11 6C11 5.44772 10.5506 4.99356 10.0026 5.06242C8.77376 5.21683 7.59275 5.65513 6.55544 6.34824C5.23985 7.22729 4.21446 8.47672 3.60896 9.93853C3.00346 11.4003 2.84504 13.0089 3.15372 14.5607C3.4624 16.1126 4.22433 17.538 5.34315 18.6569C6.46197 19.7757 7.88743 20.5376 9.43928 20.8463C10.9911 21.155 12.5997 20.9965 14.0615 20.391C15.5233 19.7855 16.7727 18.7602 17.6518 17.4446C18.3449 16.4072 18.7832 15.2262 18.9376 13.9974C19.0064 13.4494 18.5523 13 18 13H12.5C11.6716 13 11 12.3284 11 11.5V6Z"
                                            stroke="white"
                                            strokeWidth="1.5"
                                        />
                                        <path
                                            d="M14 4C14 3.44772 14.45 2.99268 14.9966 3.07131C15.5731 3.15423 16.1383 3.30896 16.6788 3.53284C17.5281 3.88463 18.2997 4.40024 18.9497 5.05025C19.5998 5.70026 20.1154 6.47194 20.4672 7.32122C20.691 7.86171 20.8458 8.4269 20.9287 9.00339C21.0073 9.55005 20.5523 10 20 10L15 10C14.4477 10 14 9.55228 14 9V4Z"
                                            stroke="white"
                                            strokeWidth="1.5"
                                        />
                                    </svg>
                                </div>
                                <div className={`inline-block`}>
                                    <p className={`text-white font-bold text-[14px]`}>
                                        {extension.getLang("display_setting_title")}
                                    </p>
                                </div>
                            </div>
                            <p className={`text-white mb-3`}>
                                {extension.getLang("display_setting_description")}
                            </p>
                            <div className="w-full mb-3">
                                <input
                                    id={"display_setting_default"}
                                    type="radio"
                                    value={"default"}
                                    name="format"
                                    checked={displayCookie === "default"}
                                    onClick={(e) => handleSetSetting("display_cookie", e.target.value)}
                                    className="w-4 h-4 text-blue-600 bg-gray-300 border-gray-400 focus:ring-blue-500"
                                />
                                <label
                                    htmlFor={"display_setting_default"}
                                    className="ms-2 text-[12px] cursor-pointer font-medium text-white"
                                >
                                    {extension.getLang("display_setting_option_default")}
                                </label>
                            </div>
                            <div className="w-full mb-3">
                                <input
                                    id={"display_setting_compact"}
                                    type="radio"
                                    value={"compact"}
                                    checked={displayCookie === "compact"}
                                    onClick={(e) => handleSetSetting("display_cookie", e.target.value)}
                                    name="format"
                                    className="w-4 h-4 text-blue-600 bg-gray-300 border-gray-400 focus:ring-blue-500"
                                />
                                <label
                                    htmlFor={"display_setting_compact"}
                                    className="ms-2 text-[12px] cursor-pointer font-medium text-white"
                                >
                                    {extension.getLang("display_setting_option_compact")}
                                </label>
                            </div>
                            <div className="w-full mb-3">
                                <input
                                    id={"display_setting_custom"}
                                    type="radio"
                                    value={"custom"}
                                    checked={displayCookie === "custom"}
                                    onClick={(e) => handleSetSetting("display_cookie", e.target.value)}
                                    name="format"
                                    className="w-4 h-4 text-blue-600 bg-gray-300 border-gray-400 focus:ring-blue-500"
                                />
                                <label
                                    htmlFor={"display_setting_custom"}
                                    className="ms-2 text-[12px] cursor-pointer font-medium text-white"
                                >
                                    {extension.getLang("display_setting_option_custom")}
                                </label>
                            </div>
                            <p className={`text-white mb-3`}>
                                {extension.getLang("setting_customize_display_cookie")}
                            </p>
                            {
                                customizeDisplayCookie.length > 0 && (
                                    <div className={`w-full flex flex-wrap`}>
                                        {
                                            customizeDisplayCookie.map((item, key) => (
                                                <div key={key} className="inline-flex me-4 w-[130px] mb-4 items-center">
                                                    <input
                                                        id={`display_cookie_${key}`}
                                                        type="checkbox"
                                                        onChange={(e) => handleChangeCustomizeCookie(item.key, e)}
                                                        disabled={item.required}
                                                        checked={item.required || item.display}
                                                        value=""
                                                        className="w-4 h-4 text-blue-600 rounded-sm focus:ring-blue-500 focus:ring-blue-600 ring-offset-gray-800 focus:ring-2 bg-gray-300 border-gray-400"
                                                    />
                                                    <label
                                                        htmlFor={`display_cookie_${key}`}
                                                        className="ms-2 text-[12px] text-white capitalize">
                                                        {item.key} {item.required &&
                                                        <span className={`text-red-500`}>(*)</span>}
                                                    </label>
                                                </div>
                                            ))
                                        }
                                    </div>
                                )
                            }
                        </div>
                        <div className={`w-full bg-[#3C3C3C] p-4 rounded-[10px] mb-[10px]`}>
                            <div className={`w-full flex items-center mb-2`}>
                                <div className={`inline-block w-[30px]`}>
                                    <svg
                                        className="w-[20px] h-[20px] text-white"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <circle
                                            cx="3"
                                            cy="3"
                                            r="3"
                                            transform="matrix(-1 0 0 1 15 9)"
                                            stroke="white"
                                            strokeWidth="1.5"
                                        />
                                        <path
                                            d="M16.5001 4.9375L16.8751 4.28798L16.8751 4.28798L16.5001 4.9375ZM16.5001 19.0621L16.1251 18.4126L16.5001 19.0621ZM7.50005 19.0621L7.12505 19.7117H7.12505L7.50005 19.0621ZM7.50005 4.9375L7.87505 5.58702L7.50005 4.9375ZM8.92299 3.01508L8.19229 2.84601L8.92299 3.01508ZM5.31189 18.7402L5.13971 18.0102L5.31189 18.7402ZM4.40301 18.503L4.97254 18.015L4.40301 18.503ZM9.53927 21.695L9.72325 20.9679L9.53927 21.695ZM8.92305 20.9848L9.65376 20.8158L8.92305 20.9848ZM15.0771 20.9848L14.3464 20.8158L15.0771 20.9848ZM14.4609 21.695L14.6448 22.422L14.4609 21.695ZM19.597 18.503L19.0275 18.015L19.597 18.503ZM21.4437 8.70289L22.1518 8.45569L21.4437 8.70289ZM21.0936 9.68352L20.6167 9.10469L21.0936 9.68352ZM18.688 5.2595L18.5159 4.52952L18.688 5.2595ZM21.0936 14.3165L20.6167 14.8953L21.0936 14.3165ZM21.4437 15.2971L20.7356 15.0499L21.4437 15.2971ZM15.0772 3.01511L14.3465 3.18418L15.0772 3.01511ZM14.3465 3.18418C14.5723 4.16005 15.1879 5.04592 16.1251 5.58702L16.8751 4.28798C16.3127 3.96329 15.9439 3.43381 15.8079 2.84603L14.3465 3.18418ZM16.1251 5.58702C16.986 6.08408 17.9639 6.2008 18.8601 5.98949L18.5159 4.52952C17.9767 4.65663 17.3922 4.5865 16.8751 4.28798L16.1251 5.58702ZM22.1518 8.45569C21.7062 7.17937 21.0272 6.01337 20.1663 5.00871L19.0273 5.98471C19.7687 6.85004 20.3527 7.85328 20.7356 8.95008L22.1518 8.45569ZM20.75 12C20.75 11.3006 21.0682 10.6762 21.5705 10.2624L20.6167 9.10469C19.7834 9.79128 19.25 10.8337 19.25 12H20.75ZM21.5705 13.7376C21.0682 13.3238 20.75 12.6994 20.75 12H19.25C19.25 13.1663 19.7834 14.2087 20.6167 14.8953L21.5705 13.7376ZM20.1666 18.991C21.0273 17.9864 21.7063 16.8205 22.1518 15.5443L20.7356 15.0499C20.3528 16.1466 19.7688 17.1497 19.0275 18.015L20.1666 18.991ZM16.8751 19.7117C17.3922 19.4131 17.9768 19.343 18.516 19.4702L18.8603 18.0102C17.964 17.7988 16.9861 17.9155 16.1251 18.4126L16.8751 19.7117ZM15.8078 21.1538C15.9437 20.566 16.3126 20.0364 16.8751 19.7117L16.1251 18.4126C15.1877 18.9538 14.5721 19.8398 14.3464 20.8158L15.8078 21.1538ZM12 22.75C12.9117 22.75 13.7979 22.6363 14.6448 22.422L14.2769 20.9679C13.5493 21.152 12.7866 21.25 12 21.25V22.75ZM9.3553 22.4221C10.2022 22.6363 11.0883 22.75 12 22.75V21.25C11.2134 21.25 10.4508 21.152 9.72325 20.9679L9.3553 22.4221ZM7.12505 19.7117C7.68749 20.0364 8.05637 20.566 8.19234 21.1538L9.65376 20.8158C9.42802 19.8398 8.81238 18.9538 7.87505 18.4126L7.12505 19.7117ZM5.48407 19.4702C6.02327 19.343 6.60793 19.4131 7.12505 19.7117L7.87505 18.4126C7.01401 17.9155 6.03606 17.7988 5.13971 18.0102L5.48407 19.4702ZM1.84822 15.5443C2.29374 16.8205 2.97273 17.9864 3.83347 18.991L4.97254 18.015C4.23119 17.1498 3.64726 16.1466 3.2644 15.0499L1.84822 15.5443ZM3.25004 12C3.25004 12.6994 2.93185 13.3238 2.42953 13.7376L3.38336 14.8953C4.21668 14.2087 4.75004 13.1663 4.75004 12H3.25004ZM2.42953 10.2623C2.93185 10.6762 3.25004 11.3006 3.25004 12H4.75004C4.75004 10.8337 4.21668 9.79126 3.38336 9.10468L2.42953 10.2623ZM3.83376 5.00867C2.97288 6.01334 2.2938 7.17934 1.84822 8.45567L3.2644 8.95007C3.6473 7.85326 4.23132 6.85001 4.97279 5.98468L3.83376 5.00867ZM7.12505 4.28798C6.60798 4.58651 6.02337 4.65664 5.4842 4.5295L5.13994 5.98946C6.03623 6.20081 7.01409 6.0841 7.87505 5.58702L7.12505 4.28798ZM8.19229 2.84601C8.05629 3.43379 7.68743 3.96329 7.12505 4.28798L7.87505 5.58702C8.81227 5.04591 9.42788 4.16003 9.65368 3.18415L8.19229 2.84601ZM12 1.25C11.0883 1.25 10.2021 1.36366 9.35522 1.57796L9.72318 3.03213C10.4508 2.84802 11.2134 2.75 12 2.75V1.25ZM14.645 1.578C13.798 1.36368 12.9118 1.25 12 1.25V2.75C12.7867 2.75 13.5494 2.84803 14.277 3.03217L14.645 1.578ZM9.65368 3.18415C9.66929 3.11668 9.69574 3.06909 9.71627 3.04413C9.73389 3.02269 9.73703 3.02862 9.72318 3.03213L9.35522 1.57796C8.66401 1.75286 8.30711 2.3498 8.19229 2.84601L9.65368 3.18415ZM3.38336 9.10468C3.32248 9.05451 3.28709 9.00024 3.27289 8.96394C3.26095 8.93341 3.26974 8.93478 3.2644 8.95007L1.84822 8.45567C1.58221 9.21766 1.99436 9.9038 2.42953 10.2623L3.38336 9.10468ZM5.13971 18.0102C5.07248 18.0261 5.01821 18.0235 4.98675 18.0162C4.95969 18.0099 4.96341 18.0044 4.97254 18.015L3.83347 18.991C4.29652 19.5314 4.98849 19.5871 5.48407 19.4702L5.13971 18.0102ZM9.72325 20.9679C9.73711 20.9714 9.73396 20.9773 9.71634 20.9559C9.69581 20.9309 9.66936 20.8833 9.65376 20.8158L8.19234 21.1538C8.30711 21.6501 8.66402 22.2471 9.3553 22.4221L9.72325 20.9679ZM14.3464 20.8158C14.3308 20.8833 14.3043 20.9309 14.2838 20.9559C14.2662 20.9773 14.263 20.9714 14.2769 20.9679L14.6448 22.422C15.3361 22.2471 15.693 21.6501 15.8078 21.1538L14.3464 20.8158ZM19.0275 18.015C19.0366 18.0043 19.0403 18.0098 19.0133 18.0161C18.9818 18.0235 18.9276 18.0261 18.8603 18.0102L18.516 19.4702C19.0116 19.587 19.7035 19.5314 20.1666 18.991L19.0275 18.015ZM20.7356 8.95008C20.7303 8.93479 20.7391 8.93343 20.7271 8.96395C20.7129 9.00025 20.6775 9.05452 20.6167 9.10469L21.5705 10.2624C22.0057 9.90381 22.4178 9.21767 22.1518 8.45569L20.7356 8.95008ZM3.2644 15.0499C3.26974 15.0652 3.26095 15.0666 3.27289 15.0361C3.28709 14.9998 3.32248 14.9455 3.38336 14.8953L2.42953 13.7376C1.99436 14.0962 1.58221 14.7823 1.84822 15.5443L3.2644 15.0499ZM18.8601 5.98949C18.9273 5.97364 18.9816 5.97624 19.0131 5.98357C19.0401 5.98987 19.0364 5.99537 19.0273 5.98471L20.1663 5.00871C19.7033 4.46835 19.0114 4.41269 18.5159 4.52952L18.8601 5.98949ZM4.97279 5.98468C4.96366 5.99534 4.95994 5.98984 4.98699 5.98354C5.01845 5.97621 5.07271 5.97361 5.13994 5.98946L5.4842 4.5295C4.98867 4.41265 4.29678 4.4683 3.83376 5.00867L4.97279 5.98468ZM20.6167 14.8953C20.6775 14.9455 20.7129 14.9997 20.7271 15.036C20.7391 15.0666 20.7303 15.0652 20.7356 15.0499L22.1518 15.5443C22.4178 14.7823 22.0057 14.0962 21.5705 13.7376L20.6167 14.8953ZM15.8079 2.84603C15.6931 2.34983 15.3362 1.75292 14.645 1.578L14.277 3.03217C14.2631 3.02866 14.2663 3.02273 14.2839 3.04417C14.3044 3.06913 14.3309 3.11672 14.3465 3.18418L15.8079 2.84603Z"
                                            fill="white"
                                        />
                                    </svg>
                                </div>
                                <div className={`inline-block`}>
                                    <p className={`text-white font-bold text-[14px]`}>
                                        CONFIRMATION DIALOG
                                    </p>
                                </div>
                            </div>
                            <p className={`text-white mb-5`}>
                                Set confirmation dialog when using extension
                            </p>
                            <div className="w-full mt-2 flex items-center">
                                <input
                                    checked={confirmDialog.includes("copy")}
                                    id="checked-checkbox-confirm-dialog-copy"
                                    type="checkbox"
                                    value="copy"
                                    onChange={(e) => handleSetConfirmDialog(e.target.value, e.target.checked)}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm"
                                />
                                <label
                                    htmlFor="checked-checkbox-confirm-dialog-copy"
                                    className="ms-4 text-[12px] text-white">
                                    Display a confirmation dialog when copying current cookies
                                </label>
                            </div>
                            <div className="w-full mt-2 flex items-center">
                                <input
                                    checked={confirmDialog.includes("delete")}
                                    id="checked-checkbox-confirm-dialog-delete"
                                    type="checkbox"
                                    value="delete"
                                    onChange={(e) => handleSetConfirmDialog(e.target.value, e.target.checked)}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm"
                                />
                                <label
                                    htmlFor="checked-checkbox-confirm-dialog-delete"
                                    className="ms-4 text-[12px] text-white">
                                    Display a confirmation dialog when deleting current cookies
                                </label>
                            </div>
                            <div className="w-full mt-2 flex items-center">
                                <input
                                    checked={confirmDialog.includes("delete_all")}
                                    id="checked-checkbox-confirm-dialog-delete_all"
                                    type="checkbox"
                                    value="delete_all"
                                    onChange={(e) => handleSetConfirmDialog(e.target.value, e.target.checked)}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm"
                                />
                                <label
                                    htmlFor="checked-checkbox-confirm-dialog-delete_all"
                                    className="ms-4 text-[12px] text-white">
                                    Display a confirmation dialog when deleting all current cookies.
                                </label>
                            </div>
                        </div>
                        <div className={`w-full bg-[#3C3C3C] p-4 rounded-[10px] mb-[10px]`}>
                            <div className={`w-full flex items-center mb-2`}>
                                <div className={`inline-block w-[30px]`}>
                                    <svg
                                        className="w-[20px] h-[20px] text-white"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <rect
                                            x="5"
                                            y="3"
                                            width="10"
                                            height="14"
                                            rx="3"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                        />
                                        <path
                                            d="M17.5 7.40137C18.3967 7.92008 19 8.8896 19 10V18C19 19.6569 17.6569 21 16 21H12C10.8896 21 9.92008 20.3967 9.40137 19.5"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                </div>
                                <div className={`inline-block`}>
                                    <p className={`text-white font-bold text-[14px]`}>
                                        {extension.getLang("copy_setting_title")}
                                    </p>
                                </div>
                            </div>
                            <p className={`text-white mb-3`}>
                                {extension.getLang("copy_setting_description")}
                            </p>
                            {
                                cookieFormats.map((format, key) => (
                                    <div key={key} className="w-full mb-3 last:mb-0">
                                        <input
                                            id={`setting_format_copy_cookie_${key}`}
                                            type="radio"
                                            checked={formatCopyDefault === format.value}
                                            onClick={(e) => handleSetSetting("format_copy", e.target.value)}
                                            value={format.value}
                                            name="format_copy"
                                            className="w-4 h-4 text-blue-600 bg-gray-300 border-gray-400 focus:ring-blue-500"
                                        />
                                        <label
                                            htmlFor={`setting_format_copy_cookie_${key}`}
                                            className="ms-2 text-[12px] cursor-pointer font-medium text-white"
                                        >
                                            {format.title}
                                        </label>
                                    </div>
                                ))
                            }
                        </div>
                        <div className={`w-full bg-[#3C3C3C] p-4 rounded-[10px] mb-[10px]`}>
                            <div className={`w-full flex items-center mb-2`}>
                                <div className={`inline-block w-[30px]`}>
                                    <svg
                                        className="w-[20px] h-[20px] text-white"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M16.5 8.5L18.5 8.5C20.7091 8.5 22.5 10.2909 22.5 12.5L22.5 17.5C22.5 19.7091 20.7091 21.5 18.5 21.5L6.5 21.5C4.29086 21.5 2.5 19.7091 2.5 17.5L2.5 12.5C2.5 10.2909 4.29086 8.5 6.5 8.5L8.5 8.5"
                                            stroke="white"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                        />
                                        <path
                                            d="M15.5 5.5L13.2071 3.20711C12.8166 2.81658 12.1834 2.81658 11.7929 3.20711L9.5 5.5"
                                            stroke="white"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                        />
                                        <path
                                            d="M12.5 3.5L12.5 15.5"
                                            stroke="white"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                </div>
                                <div className={`inline-block`}>
                                    <p className={`text-white font-bold text-[14px]`}>
                                        {extension.getLang("export_setting_title")}
                                    </p>
                                </div>
                            </div>
                            <p className={`text-white mb-3`}>
                                {extension.getLang("export_setting_description")}
                            </p>
                            {
                                cookieFormats.map((format, key) => (
                                    <div key={key} className="w-full mb-3 last:mb-0">
                                        <input
                                            id={`setting_export_cookie_${key}`}
                                            type="radio"
                                            checked={formatExportDefault === format.value}
                                            onClick={(e) => handleSetSetting("format_export", e.target.value)}
                                            value={format.value}
                                            name="format_export"
                                            className="w-4 h-4 text-blue-600 bg-gray-300 border-gray-400 focus:ring-blue-500"
                                        />
                                        <label
                                            htmlFor={`setting_export_cookie_${key}`}
                                            className="ms-2 text-[12px] cursor-pointer font-medium text-white"
                                        >
                                            {format.title}
                                        </label>
                                    </div>
                                ))
                            }
                        </div>
                        <div className={`w-full bg-[#3C3C3C] p-4 rounded-[10px] mb-[10px]`}>
                            <div className={`w-full flex items-center mb-2`}>
                                <div className={`inline-block w-[30px]`}>
                                    <svg
                                        className="w-[20px] h-[20px] text-white"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M9 8L7 8C4.79086 8 3 9.79086 3 12L3 17C3 19.2091 4.79086 21 7 21L19 21C21.2091 21 23 19.2091 23 17L23 12C23 9.79086 21.2091 8 19 8L17 8"
                                            stroke="white"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                        />
                                        <path
                                            d="M10 13L12.2929 15.2929C12.6834 15.6834 13.3166 15.6834 13.7071 15.2929L16 13"
                                            stroke="white"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                        />
                                        <path
                                            d="M13 15L13 3"
                                            stroke="white"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                </div>
                                <div className={`inline-block`}>
                                    <p className={`text-white font-bold text-[14px]`}>
                                        {extension.getLang("import_setting_title")}
                                    </p>
                                </div>
                            </div>
                            <p className={`text-white mb-3`}>
                                {extension.getLang("import_setting_description")}
                            </p>
                            <div className="w-full mb-5">
                                {/*<div className="flex mb-4 items-center">*/}
                                {/*    <input*/}
                                {/*        id="checked-checkbox"*/}
                                {/*        type="checkbox"*/}
                                {/*        onChange={(e) => handleChangeOptionImport("remove_all", e)}*/}
                                {/*        checked={optionImport.includes("remove_all")}*/}
                                {/*        value="remove_all"*/}
                                {/*        className="w-4 h-4 text-blue-600 rounded-sm focus:ring-blue-500 focus:ring-blue-600 ring-offset-gray-800 focus:ring-2 bg-gray-300 border-gray-400"*/}
                                {/*    />*/}
                                {/*    <label*/}
                                {/*        htmlFor="checked-checkbox"*/}
                                {/*        className="ms-2 text-[12px] text-white">*/}
                                {/*        Clear all cookies before import*/}
                                {/*    </label>*/}
                                {/*</div>*/}
                                <div className="flex items-center">
                                    <input
                                        id="checked-checkbox"
                                        type="checkbox"
                                        onChange={(e) => handleChangeOptionImport("reload_page", e)}
                                        checked={optionImport.includes("reload_page")}
                                        value="reload_page"
                                        className="w-4 h-4 text-blue-600 rounded-sm focus:ring-blue-500 focus:ring-blue-600 ring-offset-gray-800 focus:ring-2 bg-gray-300 border-gray-400"
                                    />
                                    <label
                                        htmlFor="checked-checkbox"
                                        className="ms-2 text-[12px] text-white">
                                        {extension.getLang("import_setting_option_reload_page")}
                                    </label>
                                </div>
                            </div>
                            <p className={`text-white mb-3`}>
                                {extension.getLang("import_setting_format")}
                            </p>
                            <div className="w-full mb-3">
                                <input
                                    id={"import_option_1"}
                                    type="radio"
                                    value={"text"}
                                    checked={formatImportDefault === "text"}
                                    onClick={(e) => handleSetSetting("format_import", e.target.value)}
                                    name="option_import"
                                    className="w-4 h-4 text-blue-600 bg-gray-300 border-gray-400 focus:ring-blue-500"
                                />
                                <label
                                    htmlFor={"import_option_1"}
                                    className="ms-2 text-[12px] cursor-pointer font-medium text-white"
                                >
                                    {extension.getLang("import_settomg_format_text")}
                                </label>
                            </div>
                            <div className="w-full mb-3">
                                <input
                                    id={"import_option_2"}
                                    type="radio"
                                    value={"file"}
                                    checked={formatImportDefault === "file"}
                                    onClick={(e) => handleSetSetting("format_import", e.target.value)}
                                    name="option_import"
                                    className="w-4 h-4 text-blue-600 bg-gray-300 border-gray-400 focus:ring-blue-500"
                                />
                                <label
                                    htmlFor={"import_option_2"}
                                    className="ms-2 text-[12px] cursor-pointer font-medium text-white"
                                >
                                    {extension.getLang("import_setting_format_file")}
                                </label>
                            </div>
                            {/*<div className="w-full">*/}
                            {/*    <input*/}
                            {/*        id={"import_option_3"}*/}
                            {/*        type="radio"*/}
                            {/*        value={"link"}*/}
                            {/*        checked={formatImportDefault === "link"}*/}
                            {/*        onClick={(e) => handleSetSetting("format_import", e.target.value)}*/}
                            {/*        name="option_import"*/}
                            {/*        className="w-4 h-4 text-blue-600 bg-gray-300 border-gray-400 focus:ring-blue-500"*/}
                            {/*    />*/}
                            {/*    <label*/}
                            {/*        htmlFor={"import_option_3"}*/}
                            {/*        className="ms-2 text-[12px] cursor-pointer font-medium text-white"*/}
                            {/*    >*/}
                            {/*        Use a link*/}
                            {/*    </label>*/}
                            {/*</div>*/}
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default observer(Setting)