import {image} from "../../../../utils/images";
import {extension} from "../../../../utils/chrome";
import {settingStore} from "../../../../mobx/setting.store";
import {observer} from "mobx-react-lite";

const BuyMeACoffee = () => {

    return (
        <div onClick={() => settingStore.popup = "buy_coffee"} className={`w-full flex items-center cursor-pointer`}>
            <div className={`inline-block w-[50px] p-[5px]`}>
                <img
                    className={`w-[40px] h-[40px] rounded-[5px]`}
                    src={image.inExtension(`/images/buy_me_a_coffee.png`)}
                    alt={"buy me a coffee"}
                />
            </div>
            <div className={`inline-block pl-[10px]`}>
                <p className={`text-[14px] font-bold`}>{extension.getLang("sidebar_buy_me_a_coffee")}</p>
                <p className={`text-[12px] w-full truncate`}>{extension.getLang("description_buy_me_a_coffee")}</p>
            </div>
        </div>
    )
}

export default observer(BuyMeACoffee)