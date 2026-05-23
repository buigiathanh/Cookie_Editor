/*global chrome*/
import {observer} from "mobx-react-lite";
import {extension} from "../../../../utils/chrome";
import {settingStore} from "../../../../mobx/setting.store";
import IconCookie from "../../../../icons/cookie";
import IconShare from "../../../../icons/share";
import IconN8n from "../../../../icons/n8n";
import IconSetting from "../../../../icons/setting";
import IconFeatureSuggest from "../../../../icons/feature_suggest";
import IconBuyCoffee from "../../../../icons/buy_coffee";
import IconStar from "../../../../icons/star";
import IconInfo from "../../../../icons/info";
import {accountStore} from "../../../../mobx/account.store";
import UserIcon from "../../../../icons/user";
import RocketIcon from "../../../../icons/rocket";
import GithubIcon from "../../../../icons/github";
import IconDelete from "../../../../icons/delete";
import {openN8nPage} from "../../../../utils/n8n_page";

const Sidebar = () => {
    const themeMode = settingStore.theme_mode;
    const isLightMode = themeMode === "light";
    const iconClass = `w-[20px] h-[20px] ${isLightMode ? "text-gray-800" : "text-white"}`;
    const actionClass = (isActive = false) =>
        `w-[40px] m-[5px] rounded-[3px] p-[10px] cursor-pointer group relative ${
            isLightMode
                ? `${isActive ? "bg-gray-200" : ""} hover:bg-gray-200`
                : `${isActive ? "bg-[#2E3135]" : ""} hover:bg-[#2E3135]`
        }`;

    const handleSelectAction = (action, type = "tab") => {
        if (type === "tab") {
            settingStore.tab = action
        } else {
            settingStore.popup = action;
        }
    }

    return (
        <>
            <div className="w-full relative" style={{height: "calc(100% - 100px)"}}>
                <div className="w-full">
                    <div
                        onClick={() => handleSelectAction("home")}
                        className={actionClass(settingStore.tab === "home")}
                    >
                        <IconCookie cname={iconClass}/>
                        <div
                            style={{zIndex: 51}}
                            className="hidden group-hover:block bg-white absolute right-[50px] top-[50%] translate-y-[-50%] rounded-[5px] p-[5px]">
                            <span className="text-gray-900 whitespace-nowrap">Cookie</span>
                        </div>
                    </div>
                    <div
                        onClick={() => handleSelectAction("link_cookies")}
                        className={actionClass(settingStore.tab === "link_cookies")}
                    >
                        <IconShare cname={iconClass}/>
                        <div
                            style={{zIndex: 51}}
                            className="hidden group-hover:block bg-white absolute right-[50px] top-[50%] translate-y-[-50%] rounded-[5px] p-[5px]">
                            <span className="text-gray-900 whitespace-nowrap">
                                {extension.getLang("sidebar_link")}
                            </span>
                        </div>
                    </div>
                    <div
                        onClick={() => openN8nPage()}
                        className={actionClass(false)}
                    >
                        <IconN8n cname={iconClass}/>
                        <div
                            style={{zIndex: 51}}
                            className="hidden group-hover:block bg-white absolute right-[50px] top-[50%] translate-y-[-50%] rounded-[5px] p-[5px]">
                            <span className="text-gray-900 whitespace-nowrap">
                                {extension.getLang("sidebar_n8n")}
                            </span>
                        </div>
                    </div>
                </div>

                <div onClick={() => handleSelectAction("clear_data_web")}
                     className={actionClass(settingStore.tab === "clear_data_web")}
                >
                    <IconDelete cname={iconClass} />
                    <div
                        style={{zIndex: 51}}
                        className="hidden group-hover:block bg-white absolute right-[50px] top-[50%] translate-y-[-50%] rounded-[5px] p-[5px]">
                            <span className="text-gray-900 whitespace-nowrap">
                                {extension.getLang("sidebar_clear_browser")}
                            </span>
                    </div>
                </div>

                <div
                    onClick={() => handleSelectAction("setting")}
                    className={actionClass(settingStore.tab === "setting")}
                >
                    <IconSetting cname={iconClass}/>

                    <div
                        style={{zIndex: 51}}
                        className="hidden group-hover:block bg-white absolute right-[50px] top-[50%] translate-y-[-50%] rounded-[5px] p-[5px]">
                            <span className="text-gray-900 whitespace-nowrap">
                                {extension.getLang("sidebar_setting")}
                            </span>
                    </div>
                </div>

                {
                    accountStore.account?.account_type !== 2 && (
                        <div
                            onClick={() => handleSelectAction("upgrade", "popup")}
                            className={actionClass(settingStore.popup === "upgrade")}
                        >
                            <RocketIcon cname={iconClass} strokeWidth={"1.5"}/>
                            <div
                                style={{zIndex: 51}}
                                className="hidden group-hover:block bg-white absolute right-[50px] top-[50%] translate-y-[-50%] rounded-[5px] p-[5px]">
                                <span className="text-gray-900 whitespace-nowrap">
                                   {extension.getLang("sidebar_upgrade")}
                                </span>
                            </div>
                        </div>
                    )
                }

                <div
                    onClick={() => handleSelectAction("feature_suggest", "popup")}
                    className={actionClass(settingStore.popup === "feature_suggest")}
                >
                    <IconFeatureSuggest cname={iconClass}/>
                    <div
                        style={{zIndex: 51}}
                        className="hidden group-hover:block bg-white absolute right-[50px] top-[50%] translate-y-[-50%] rounded-[5px] p-[5px]">
                            <span className="text-gray-900 whitespace-nowrap">
                               {extension.getLang("sidebar_feature_suggestion")}
                            </span>
                    </div>
                </div>

                <div
                    onClick={() => handleSelectAction("buy_coffee", "popup")}
                    className={actionClass(false)}
                >
                    <IconBuyCoffee cname={iconClass}/>
                    <div
                        style={{zIndex: 51}}
                        className="hidden group-hover:block bg-white absolute right-[50px] top-[50%] translate-y-[-50%] rounded-[5px] p-[5px]">
                            <span className="text-gray-900 whitespace-nowrap">
                                {extension.getLang("sidebar_buy_me_a_coffee")}
                            </span>
                    </div>
                </div>

                <div
                    onClick={() => window.open('https://chromewebstore.google.com/detail/cookie-editor/ookdjilphngeeeghgngjabigmpepanpl/reviews', '_blank')}
                    className={actionClass(false)}
                >
                    <IconStar cname={iconClass}/>
                    <div
                        style={{zIndex: 51}}
                        className="hidden group-hover:block bg-white absolute right-[50px] top-[50%] translate-y-[-50%] rounded-[5px] p-[5px]">
                            <span className="text-gray-900 whitespace-nowrap">
                                {extension.getLang("sidebar_reviews")}
                            </span>
                    </div>
                </div>

                <div
                    onClick={() => window.open('https://github.com/buigiathanh/Cookie_Editor', '_blank')}
                    className={actionClass(false)}
                >
                    <GithubIcon cname={iconClass}/>
                    <div
                        style={{zIndex: 51}}
                        className="hidden group-hover:block bg-white absolute right-[50px] top-[50%] translate-y-[-50%] rounded-[5px] p-[5px]">
                            <span className="text-gray-900 whitespace-nowrap">
                                {extension.getLang("sidebar_open_source")}
                            </span>
                    </div>
                </div>
            </div>
            <div className={`w-full`}>
                <div
                    onClick={() => handleSelectAction("about", "popup")}
                    className={actionClass(false)}>
                    <IconInfo cname={iconClass}/>
                </div>


                {
                    accountStore.account?.email ? (
                        <div
                            onClick={() => handleSelectAction("account", "popup")}
                            className={`w-[40px] m-[5px] rounded-lg bg-white p-[5px] cursor-pointer`}>
                            {
                                accountStore.account.avatar ? (
                                    <img
                                        src={accountStore.account.avatar}
                                        alt={accountStore.account.name}
                                        className={"w-[30px] h-[30px] rounded-full border-gray-50"}
                                    />
                                ) : (
                                    <div className={`w-[30px] h-[30px] rounded-full bg-green-500 text-center`}>
                                        <span className={`text-white font-bold uppercase leading-[30px]`}>
                                            {accountStore.account.email.slice(0, 1)}
                                        </span>
                                    </div>
                                )
                            }
                        </div>
                    ) : (
                        <div
                            onClick={() => window.open('https://cookieeditor.org/login', '_blank')}
                            className={actionClass(false)}>
                            <UserIcon cname={iconClass}/>
                        </div>
                    )
                }
            </div>
        </>
    )
}

export default observer(Sidebar)
