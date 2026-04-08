import {extension} from "../../../../utils/chrome";
import {settingStore} from "../../../../mobx/setting.store";

const EmptyCookie = () => {
    const isLightMode = settingStore.theme_mode === "light";

    return (
        <div className={`w-full mt-[100px] text-center`}>
            <p className={`${isLightMode ? "text-gray-800" : "text-white"} text-[16px] mb-2`}>
                {extension.getLang("msg_no_cookies")}
            </p>
            <p className={`${isLightMode ? "text-gray-600" : "text-gray-200"}`}>
                {extension.getLang("no_cookie_description")}.
            </p>
        </div>
    )
}

export default EmptyCookie