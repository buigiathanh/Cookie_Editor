/*global chrome*/
import {useRef} from "react";
import {useClickOutside} from "../../../../../hooks/useClickOutside";
import {settingStore} from "../../../../../mobx/setting.store";
import ModalPopup from "../modal_popup";
import {motion} from "framer-motion";
import {observer} from "mobx-react-lite";
import CheckedIcon from "../../../../../icons/checked";
import {accountStore} from "../../../../../mobx/account.store";
import {extension} from "../../../../../utils/chrome";

const Upgrade = () => {
    const ref = useRef(null);
    useClickOutside(ref, () => {
        settingStore.popup = "";
    })

    const handleUpgrade = (type) => {
        if (accountStore.account?.email) {
            window.open(`${process.env.REACT_APP_WEBSITE}/api/payment/checkout/${type}`, '_blank');
        } else {
            window.open(`${process.env.REACT_APP_WEBSITE}/login?next=${process.env.REACT_APP_WEBSITE}/api/payment/checkout/${type}`, '_blank');
        }
    }

    return (
        <>
            {
                settingStore.popup === "upgrade" && (
                    <>
                        <ModalPopup/>
                        <motion.div
                            ref={ref}
                            initial={{opacity: 0, y: -50}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -50}}
                            transition={{duration: 0.5}}
                            className={`fixed top-0 left-0 p-[10px]`}
                            style={{zIndex: 50, width: "calc(100% - 50px)"}}
                        >
                            <div className={`bg-white rounded-[10px] p-5`}>
                                <div className={`w-full text-center`}>
                                    <h2 className={`text-xl font-bold tracking-tight text-gray-900 mb-5 uppercase`}>
                                        {extension.getLang("title_upgrade")}
                                    </h2>
                                    <p className={`text-xs text-gray-900 mb-2`}>
                                        {extension.getLang("upgrade_description")}
                                    </p>
                                </div>
                                <div className={`w-full hidden justify-between`}>
                                    <div className={`inline-block`}>
                                        <p className="mt-4 mb-5 flex items-baseline gap-x-1">
                                            <span className="text-xl font-bold tracking-tight text-gray-900">
                                                $3
                                            </span>
                                            <span className="text-xs leading-6 text-gray-600 lowercase">
                                                /{extension.getLang("type_option_exp_m")}
                                            </span>
                                        </p>
                                    </div>
                                    <div className={`inline-block`}>
                                        <p className="mt-4 mb-5 flex items-baseline gap-x-1">
                                            <span className="text-xl font-bold tracking-tight text-gray-900">$27</span>
                                            <span className="text-xs leading-6 text-gray-600 lowercase">
                                                /{extension.getLang("type_option_exp_y")}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <div className={`w-full flex flex-wrap justify-between mt-5`}>
                                    <div className={`w-full md:w-[39%] inline-block mb-2`}>
                                        <button
                                            onClick={() => handleUpgrade("month")}
                                            className={`w-full text-xs py-2.5 border border-blue-600 bg-white text-blue-600 rounded-lg hover:bg-blue-700 hover:text-white cursor-pointer`}>
                                            {extension.getLang("btn_upgrade_month").replaceAll("___price___", `$3`)}
                                        </button>
                                    </div>
                                    <div className={`w-full md:w-[59%] inline-block mb-2`}>
                                        <button
                                            onClick={() => handleUpgrade("year")}
                                            className={`w-full text-xs py-2.5 border-1 border-blue-600 bg-blue-600 rounded-lg text-white hover:bg-blue-700 cursor-pointer`}>
                                            {extension.getLang("btn_upgrade_year").replaceAll("___price___", `$27`)}
                                        </button>
                                    </div>
                                </div>

                                <div className={`w-full my-2 text-center`}>
                                    <p className={`text-blue-600 font-bold text-xs uppercase`}>
                                        {extension.getLang("msg_upgrade").replaceAll("___price___", `$36`).replaceAll("___sale___", "$27")}
                                    </p>
                                </div>

                                <ul role="list" className="my-7 space-y-3 text-xs leading-6 text-gray-600">
                                    <li className="flex gap-x-3">
                                        <CheckedIcon cname={"h-6 w-5 flex-none text-blue-600"}/>
                                        {extension.getLang("upgrade_fs_1")}
                                    </li>
                                    <li className="flex gap-x-3">
                                        <CheckedIcon cname={"h-6 w-5 flex-none text-blue-600"}/>
                                        {extension.getLang("upgrade_fs_2")}
                                    </li>
                                    <li className="flex gap-x-3">
                                        <CheckedIcon cname={"h-6 w-5 flex-none text-blue-600"}/>
                                        {extension.getLang("upgrade_fs_3")}
                                    </li>
                                    <li className="flex gap-x-3">
                                        <CheckedIcon cname={"h-6 w-5 flex-none text-blue-600"}/>
                                        {extension.getLang("upgrade_fs_4")}
                                    </li>
                                    <li className="flex gap-x-3">
                                        <CheckedIcon cname={"h-6 w-5 flex-none text-blue-600"}/>
                                        {extension.getLang("upgrade_fs_5")}
                                    </li>
                                </ul>
                            </div>
                        </motion.div>
                    </>
                )
            }
        </>
    )
}

export default observer(Upgrade)