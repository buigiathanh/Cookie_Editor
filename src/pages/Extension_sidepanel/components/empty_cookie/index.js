import {extension} from "../../../../utils/chrome";

const EmptyCookie = () => {
    return (
        <div className={`w-full mt-[100px] text-center`}>
            <p className={`text-white text-[16px] mb-2`}>
                {extension.getLang("msg_no_cookies")}
            </p>
            <p className={`text-gray-200`}>
                {extension.getLang("no_cookie_description")}.
            </p>
        </div>
    )
}

export default EmptyCookie