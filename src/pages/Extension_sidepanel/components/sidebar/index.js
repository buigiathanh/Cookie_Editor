import {observer} from "mobx-react-lite";
import {extension} from "../../../../utils/chrome";
import {image} from "../../../../utils/images";
import {settingStore} from "../../../../mobx/setting.store";
import IconCookie from "../../../../icons/cookie";
import IconShare from "../../../../icons/share";
import IconSetting from "../../../../icons/setting";
import IconFeatureSuggest from "../../../../icons/feature_suggest";
import IconBuyCoffee from "../../../../icons/buy_coffee";
import IconStar from "../../../../icons/star";
import IconInfo from "../../../../icons/info";

const Sidebar = () => {

    const handleSelectAction = (action, type = "tab") => {
        if (type === "tab") {
            settingStore.tab = action
        } else {
            settingStore.popup = action;
            settingStore.tab = "home";
        }
    }

    return (
        <>
            <div className="w-full relative" style={{height: "calc(100% - 110px)"}}>
                <div className="w-full">
                    <div
                        onClick={() => handleSelectAction("home")}
                        className={`w-[40px] m-[5px] rounded-[3px] ${settingStore.tab === "home" ? "bg-[#2E3135]" : ""} hover:bg-[#2E3135] p-[10px] cursor-pointer group relative`}
                    >
                        <IconCookie cname={"w-[20px] h-[20px] text-white"} />
                        <div
                            className="hidden group-hover:block bg-white absolute right-[50px] top-[50%] translate-y-[-50%] rounded-[5px] p-[5px]">
                            <span className="text-gray-900 whitespace-nowrap">Cookie</span>
                        </div>
                    </div>
                    <div
                        onClick={() => handleSelectAction("link")}
                        className={`hidden w-[40px] m-[5px] rounded-[3px] ${settingStore.tab === "link" ? "bg-[#2E3135]" : ""} hover:bg-[#2E3135] p-[10px] cursor-pointer group relative`}
                    >
                        <IconShare cname={"w-[20px] h-[20px] text-white"} />
                        <div
                            className="hidden group-hover:block bg-white absolute right-[50px] top-[50%] translate-y-[-50%] rounded-[5px] p-[5px]">
                            <span className="text-gray-900 whitespace-nowrap">Links</span>
                        </div>
                    </div>
                </div>

                <div onClick={() => handleSelectAction("clear_data_web")}
                     className={`w-[40px] m-[5px] rounded-[3px] ${settingStore.tab === "clear_data_web" ? "bg-[#2E3135]" : ""}  hover:bg-[#2E3135] p-[10px] cursor-pointer group relative`}
                >
                    <img
                        src={image.inExtension("/images/icons8-broom-26.png")}
                        alt={"clear data"}
                        className="w-[20px] h-[20px] text-white"
                    />
                    <div
                        className="hidden group-hover:block bg-white absolute right-[50px] top-[50%] translate-y-[-50%] rounded-[5px] p-[5px]">
                            <span className="text-gray-900 whitespace-nowrap">
                                Clear data browser
                            </span>
                    </div>
                </div>

                <div
                    onClick={() => handleSelectAction("setting")}
                    className={`w-[40px] m-[5px] rounded-[3px] ${settingStore.tab === "setting" ? "bg-[#2E3135]" : ""} hover:bg-[#2E3135] p-[10px] cursor-pointer group relative`}
                >
                    <IconSetting cname={"w-[20px] h-[20px] text-white"} />

                    <div
                        className="hidden group-hover:block bg-white absolute right-[50px] top-[50%] translate-y-[-50%] rounded-[5px] p-[5px]">
                            <span className="text-gray-900 whitespace-nowrap">
                                {extension.getLang("sidebar_setting")}
                            </span>
                    </div>
                </div>

                <div
                    onClick={() => handleSelectAction("feature_suggest", "popup")}
                    className={`w-[40px] m-[5px] rounded-[3px] ${settingStore.popup === "feature_suggest" ? "bg-[#2E3135]" : ""} hover:bg-[#2E3135] p-[10px] cursor-pointer group relative`}
                >
                    <IconFeatureSuggest cname={"w-[20px] h-[20px] text-white"} />
                    <div
                        className="hidden group-hover:block bg-white absolute right-[50px] top-[50%] translate-y-[-50%] rounded-[5px] p-[5px]">
                            <span className="text-gray-900 whitespace-nowrap">
                               Feature suggestion
                            </span>
                    </div>
                </div>

                <div
                    onClick={() => handleSelectAction("buy_coffee", "popup")}
                    className={`w-[40px] m-[5px] rounded-[3px] hover:bg-[#2E3135] p-[10px] cursor-pointer group relative`}
                >
                    <IconBuyCoffee cname={"w-[20px] h-[20px] text-white"} />
                    <div
                        className="hidden group-hover:block bg-white absolute right-[50px] top-[50%] translate-y-[-50%] rounded-[5px] p-[5px]">
                            <span className="text-gray-900 whitespace-nowrap">
                                Buy me a coffee
                            </span>
                    </div>
                </div>

                <div
                    onClick={() => window.open('https://chromewebstore.google.com/detail/cookie-editor/ookdjilphngeeeghgngjabigmpepanpl/reviews', '_blank')}
                    className={`w-[40px] m-[5px] rounded-[3px] hover:bg-[#2E3135] p-[10px] cursor-pointer group relative`}
                >
                    <IconStar cname={"w-[20px] h-[20px] text-white"} />
                    <div
                        className="hidden group-hover:block bg-white absolute right-[50px] top-[50%] translate-y-[-50%] rounded-[5px] p-[5px]">
                            <span className="text-gray-900 whitespace-nowrap">
                                {extension.getLang("sidebar_reviews")}
                            </span>
                    </div>
                </div>

                <div
                    onClick={() => handleSelectAction("about", "popup")}
                    className={`w-[40px] m-[5px] rounded-[3px] hover:bg-[#2E3135] p-[10px] absolute bottom-[-100px] left-0 cursor-pointer`}>
                    <IconInfo cname={"w-[20px] h-[20px] text-white"} />
                </div>
            </div>
        </>
    )
}

export default observer(Sidebar)