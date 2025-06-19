/*global chrome*/
import {useEffect, useState} from "react";
import CryptoJS from "crypto-js";
import {settingStore} from "../../../../../mobx/setting.store";
import {accountStore} from "../../../../../mobx/account.store";
import {cookieStore} from "../../../../../mobx/cookie.store";
import {extension} from "../../../../../utils/chrome";

const FormShareCookie = ({cookies}) => {
    const [formData, setFormData] = useState({
        is_public: true,
        title: "",
        password: "",
        expiryTime: "1h",
        timeOption: "1h",
        valueTimeOption: "",
        typeTimeOption: "",
    });
    const [errors, setErrors] = useState({title: "", password: ""});

    const timeOptions = [
        {id: "option_1", value: "1h", label: extension.getLang("time_option_1h")},
        {id: "option_2", value: "custom", label: extension.getLang("exp_custom")},
        {id: "option_3", value: "unlimited", label: extension.getLang("unlimited")},
    ];

    const typeOptions = [
        {value: "h", label: extension.getLang("type_option_exp_h")},
        {value: "d", label: extension.getLang("type_option_exp_d")},
        {value: "m", label: extension.getLang("type_option_exp_m")},
        {value: "y", label: extension.getLang("type_option_exp_y")},
    ];

    const updateFormData = (updates) => {
        setFormData((prev) => ({...prev, ...updates}));
        setErrors((prev) => ({...prev, ...Object.keys(updates).reduce((acc, key) => ({...acc, [key]: ""}), {})}));
    };

    const handleShareCookie = async () => {
        const {title, password} = formData;
        if (!title || !password) {
            setErrors({
                title: title ? "" : extension.getLang("msg_title_empty"),
                password: password ? "" : extension.getLang("msg_password_empty"),
            });
            return;
        }

        if (password.length < 8) {
            setErrors({...errors, ...{password: extension.getLang("msg_password_length")}})
        }

        const [tabCurrent] = await chrome.tabs.query({
            active: true,
            lastFocusedWindow: true,
        });

        if (!tabCurrent.url.startsWith("http")) return;

        if (accountStore.account.account_type === 2) {
            try {
                const cookieBase64 = btoa(JSON.stringify(cookies));
                const cookieEncryptedValue = CryptoJS.AES.encrypt(cookieBase64, password).toString();
                const urlArray = tabCurrent.url.split("/");
                settingStore.loading = true;
                const response = await fetch(`${process.env.REACT_APP_WEBSITE}/api/cookie/share`, {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        cookie: cookieEncryptedValue,
                        exp: formData.expiryTime,
                        domain: `${urlArray[0]}//${urlArray[2]}`,
                        is_public: formData.is_public,
                        title: formData.title
                    }),
                });

                settingStore.loading = false;
                const statusCode = response.status;
                if (statusCode === 200) {
                    settingStore.popup = "";
                    settingStore.tab = "link_cookies";
                    await cookieStore.restoreLinks();
                } else {
                    settingStore.popup = "";
                    settingStore.alert = {type: "info", message: extension.getLang("msg_share_error")}
                }
            } catch (error) {
                settingStore.popup = "";
                settingStore.alert = {type: "info", message: extension.getLang("msg_share_error")}
            }
        } else {
            settingStore.popup = "remind_upgrade";
            settingStore.tab = "home";
        }
    };

    useEffect(() => {
        const {timeOption, valueTimeOption, typeTimeOption} = formData;
        if (timeOption === "custom" && valueTimeOption && typeTimeOption) {
            setFormData((prev) => ({...prev, expiryTime: `${valueTimeOption}${typeTimeOption}`}));
        } else {
            setFormData((prev) => ({...prev, expiryTime: timeOption}));
        }
    }, [formData.timeOption, formData.valueTimeOption, formData.typeTimeOption]);

    return (
        <div className="w-full space-y-5">
            <div>
                <label className="block mb-2 text-[12px] font-medium text-gray-900">
                    {extension.getLang("title")} (<span className="text-red-500">*</span>)
                </label>
                <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => updateFormData({title: e.target.value})}
                    placeholder="A memorable name."
                    className={`bg-gray-50 border ${errors.title ? "border-red-500" : "border-gray-300"} text-gray-900 text-[12px] rounded-lg w-full p-2.5 mb-1`}
                />
                <p className="text-gray-500 text-[12px]">
                    {extension.getLang("title_description")}
                </p>
                {errors.title && <p className="text-red-500 text-[12px] mt-2">{errors.title}</p>}
            </div>

            <div>
                <label className="block mb-2 text-[12px] font-medium text-gray-900">
                    {extension.getLang("password_encrypt")} (<span className="text-red-500">*</span>)
                </label>
                <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => updateFormData({password: e.target.value})}
                    placeholder="Password to encrypt cookies"
                    className={`bg-gray-50 border ${errors.password ? "border-red-500" : "border-gray-300"} text-gray-900 text-[12px] rounded-lg w-full p-2.5 mb-1`}
                />
                <p className="text-gray-500 text-[12px]">
                    {extension.getLang("password_encrypt_description")}
                </p>
                {errors.password && (
                    <p className="text-red-500 text-[12px] mt-2">{errors.password}</p>
                )}
            </div>

            <div>
                <label className="block mb-2 text-[12px] font-medium text-gray-900">
                    {extension.getLang("link_exp")}
                </label>
                <div className="flex flex-wrap gap-3">
                    {timeOptions.map(({id, value, label}) => (
                        <div key={id} className="inline-flex items-center">
                            <input
                                id={id}
                                type="radio"
                                value={value}
                                name="timeOption"
                                checked={formData.timeOption === value}
                                onChange={() => updateFormData({timeOption: value})}
                                className="w-4 h-4 text-blue-600 bg-gray-400 border-gray-300 focus:ring-blue-500"
                            />
                            <label
                                htmlFor={id}
                                className="ms-2 text-[12px] cursor-pointer font-medium text-gray-900"
                            >
                                {label}
                            </label>
                        </div>
                    ))}
                </div>

                {formData.timeOption === "custom" && (
                    <div className="mt-3">
                        <div className="flex gap-2">
                            <input
                                type="number"
                                value={formData.valueTimeOption}
                                onChange={(e) =>
                                    updateFormData({valueTimeOption: e.target.value})
                                }
                                placeholder="Link expiration time"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-[12px] rounded-lg w-full p-2.5 mb-1"
                            />

                            <select
                                value={formData.typeTimeOption}
                                onChange={(e) => updateFormData({typeTimeOption: e.target.value})}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-[12px] rounded-lg w-[100px] p-2.5 mb-1"
                            >
                                {typeOptions.map(({value, label}) => (
                                    <option key={value} value={value}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <p className="text-gray-500 text-[12px]">
                            {extension.getLang("link_exp_description")}
                        </p>
                    </div>
                )}
            </div>

            <div className="w-full mb-2 items-center">
                <input
                    id={`is_public_checkbox`}
                    type="checkbox"
                    onChange={(e) => updateFormData({is_public: e.target.checked})}
                    checked={formData.is_public}
                    className="w-4 h-4 text-blue-600 rounded-sm focus:ring-blue-500 focus:ring-blue-600 ring-offset-gray-800 focus:ring-2 bg-gray-300 border-gray-400"
                />
                <label
                    htmlFor={`is_public_checkbox`}
                    className="ms-2 text-[12px] text-gray-900 capitalize">
                    {extension.getLang("public_link_cookie")}
                </label>
            </div>

            <div className="flex justify-between gap-2">
                <button
                    onClick={handleShareCookie}
                    className="h-[40px] w-[59%] rounded-[10px] bg-blue-500 text-white px-5"
                >
                    {extension.getLang("tooltip_top_action_share")}
                </button>
                <button
                    onClick={() => (settingStore.popup = "")}
                    className="h-[40px] w-[39%] rounded-[10px] bg-gray-200 text-gray-900 px-5"
                >
                    {extension.getLang("btn_cancel")}
                </button>
            </div>
        </div>
    );
};

export default FormShareCookie;