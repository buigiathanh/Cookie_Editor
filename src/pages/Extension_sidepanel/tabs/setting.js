/*global chrome*/
import {useEffect, useState} from "react";
import {cookieFormats, customizeCookieDefault} from "../../../constants";
import {extension} from "../../../utils/chrome";
import {observer} from "mobx-react-lite";
import {settingStore} from "../../../mobx/setting.store";
import IconCookie from "../../../icons/cookie";
import IconSetting from "../../../icons/setting";
import IconCopy from "../../../icons/copy";
import IconExport from "../../../icons/export";
import IconImport from "../../../icons/import";
import IconAngleDown from "../../../icons/angle_down";

const Setting = () => {
    const [enableContextMenus, setEnableContextMenus] = useState(false)
    const displayCookie = settingStore.display_cookie;
    const customizeDisplayCookie = settingStore.customize_display_cookie;
    const formatCopyDefault = settingStore.format_copy;
    const formatExportDefault = settingStore.format_export;
    const optionImport = settingStore.option_import;
    const formatImportDefault = settingStore.format_import
    const confirmDialog = settingStore.confirm_dialog;

    const handleClickIconTitle = (icon, id) => {
        const elIcon = document.getElementById(icon);
        const el = document.getElementById(id);
        const isVisibilityHidden = window.getComputedStyle(el).display === "none"
        if (isVisibilityHidden) {
            el.style.display = "block";
            elIcon.style.transform = 'rotate(0deg)';
        } else {
            el.style.display = "none";
            elIcon.style.transform = 'rotate(180deg)';
        }
    }

    const handleEnableContextMenus = (checked) => {
        if (checked) {
            chrome.permissions.request({ permissions: ['contextMenus'] }, (granted) => {
                if (granted) {
                    setEnableContextMenus(true);
                    chrome.contextMenus.create({
                        id: "remove_cookie",
                        title: extension.getLang("btn_remove"),
                        contexts: ["all"]
                    });

                    chrome.contextMenus.create({
                        id: "copy_cookie",
                        title: extension.getLang("btn_copy"),
                        contexts: ["all"]
                    });
                } else {
                    setEnableContextMenus(false);
                }
            });
        } else {
            chrome.permissions.remove({permissions: ["contextMenus"]}, () => {
                setEnableContextMenus(false);
            });
        }
    }

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

    useEffect(() => {
        chrome.permissions.contains(
            { permissions: ["contextMenus"] },
            function (result) {
                setEnableContextMenus(result)
            }
        );
    }, [])


    return (
        <>
            {
                settingStore.tab === "setting" && (
                    <div className={`w-full py-3 px-2`}>
                        <p className={`text-white font-bold text-[14px] mb-2`}>
                            {extension.getLang("setting_title")}
                        </p>
                        <p className={`text-white text-[12px]`}>
                            {extension.getLang("setting_description")}
                        </p>
                        <div className={`w-full mt-5`}>
                            <div className={`w-full bg-[#3C3C3C] p-4 rounded-[10px] mb-[10px]`}>
                                <div
                                    onClick={() => handleClickIconTitle("icon_display_setting", "box_display_setting")}
                                    className={`w-full flex justify-between items-center cursor-pointer`}
                                >
                                    <div className={`inline-block w-[30px]`}>
                                        <IconCookie cname={"w-[20px] h-[20px] text-white"}/>
                                    </div>
                                    <div className={`inline-block`} style={{width: "calc(100% - 40px)"}}>
                                        <p className={`text-white font-medium text-sm`}>
                                            {extension.getLang("display_setting_title")}
                                        </p>
                                    </div>
                                    <div
                                        id={`icon_display_setting`}
                                        className={`inline-block w-4 transition-transform duration-300 ease-in-out rotate-180`}
                                    >
                                        <IconAngleDown cname={`w-4 h-4 text-white`}/>
                                    </div>
                                </div>
                                <div
                                    className={`w-full mt-2`}
                                    style={{display: "none"}}
                                    id={"box_display_setting"}
                                >
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
                                                        <div key={key}
                                                             className="inline-flex me-4 w-[130px] mb-4 items-center">
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
                            </div>
                            <div className={`w-full bg-[#3C3C3C] p-4 rounded-[10px] mb-[10px]`}>
                                <div
                                    onClick={() => handleClickIconTitle("icon_confirm_dialog", "box_confirm_dialog")}
                                    className={`w-full flex justify-between items-center cursor-pointer`}>
                                    <div className={`inline-block w-[30px]`}>
                                        <IconSetting cname={"w-[20px] h-[20px] text-white"}/>
                                    </div>
                                    <div className={`inline-block`} style={{width: "calc(100% - 40px)"}}>
                                        <p className={`text-white font-medium text-sm`}>
                                            {extension.getLang("setting_confirm_dialog")}
                                        </p>
                                    </div>
                                    <div
                                        id={`icon_confirm_dialog`}
                                        className={`inline-block w-4 transition-transform duration-300 ease-in-out rotate-180`}
                                    >
                                        <IconAngleDown cname={`w-4 h-4 text-white`}/>
                                    </div>
                                </div>
                                <div
                                    className={`w-full mt-2`}
                                    style={{display: "none"}}
                                    id={"box_confirm_dialog"}
                                >
                                    <p className={`text-white mb-5`}>
                                        {extension.getLang("setting_confirm_dialog_description")}
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
                                            {extension.getLang("setting_dialog_copy")}
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
                                            {extension.getLang("setting_dialog_delete")}
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
                                            {extension.getLang("setting_dialog_delete_all")}
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className={`w-full bg-[#3C3C3C] p-4 rounded-[10px] mb-[10px]`}>
                                <div
                                    onClick={() => handleClickIconTitle("icon_copy_setting", "box_copy_setting")}
                                    className={`w-full flex justify-between items-center cursor-pointer`}>
                                    <div className={`inline-block w-[30px]`}>
                                        <IconCopy cname={"w-[20px] h-[20px] text-white"}/>
                                    </div>
                                    <div className={`inline-block`} style={{width: "calc(100% - 40px)"}}>
                                        <p className={`text-white font-medium text-sm`}>
                                            {extension.getLang("copy_setting_title")}
                                        </p>
                                    </div>
                                    <div
                                        id={`icon_copy_setting`}
                                        className={`inline-block w-4 transition-transform duration-300 ease-in-out rotate-180`}
                                    >
                                        <IconAngleDown cname={`w-4 h-4 text-white`}/>
                                    </div>
                                </div>
                                <div
                                    className={`w-full mt-2`}
                                    style={{display: "none"}}
                                    id={"box_copy_setting"}
                                >
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
                            </div>
                            <div className={`w-full bg-[#3C3C3C] p-4 rounded-[10px] mb-[10px]`}>
                                <div
                                    onClick={() => handleClickIconTitle("icon_export_setting", "box_export_setting")}
                                    className={`w-full flex justify-between items-center cursor-pointer`}>
                                    <div className={`inline-block w-[30px]`}>
                                        <IconExport cname={"w-[20px] h-[20px] text-white"}/>
                                    </div>
                                    <div className={`inline-block`} style={{width: "calc(100% - 40px)"}}>
                                        <p className={`text-white font-medium text-sm`}>
                                            {extension.getLang("export_setting_title")}
                                        </p>
                                    </div>
                                    <div
                                        id={`icon_export_setting`}
                                        className={`inline-block w-4 transition-transform duration-300 ease-in-out rotate-180`}
                                    >
                                        <IconAngleDown cname={`w-4 h-4 text-white`}/>
                                    </div>
                                </div>
                                <div
                                    className={`w-full mt-2`}
                                    style={{display: "none"}}
                                    id={"box_export_setting"}
                                >
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
                            </div>
                            <div className={`w-full bg-[#3C3C3C] p-4 rounded-[10px] mb-[10px]`}>
                                <div
                                    onClick={() => handleClickIconTitle("icon_import_setting", "box_import_setting")}
                                    className={`w-full flex justify-between items-center cursor-pointer`}>
                                    <div className={`inline-block w-[30px]`}>
                                        <IconImport cname={"w-[20px] h-[20px] text-white"}/>
                                    </div>
                                    <div className={`inline-block`} style={{width: "calc(100% - 40px)"}}>
                                        <p className={`text-white font-medium text-sm`}>
                                            {extension.getLang("import_setting_title")}
                                        </p>
                                    </div>
                                    <div
                                        id={`icon_import_setting`}
                                        className={`inline-block w-4 transition-transform duration-300 ease-in-out rotate-180`}
                                    >
                                        <IconAngleDown cname={`w-4 h-4 text-white`}/>
                                    </div>
                                </div>
                                <div
                                    className={`w-full mt-2`}
                                    style={{display: "none"}}
                                    id={"box_import_setting"}
                                >
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
                                            {extension.getLang("import_setting_format_text")}
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
                            <div
                                className={`w-full bg-[#3C3C3C] p-4 rounded-[10px] mb-[10px]`}>
                                <div className="w-full flex items-center">
                                    <input
                                        checked={enableContextMenus}
                                        id="checked-enable-context-menus"
                                        type="checkbox"
                                        value="copy"
                                        onChange={(e) => handleEnableContextMenus(e.target.checked)}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm"
                                    />
                                    <label
                                        htmlFor="checked-enable-context-menus"
                                        className="ms-4 text-[12px] text-white">
                                        {extension.getLang("setting_enable_context_menus")}
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default observer(Setting)