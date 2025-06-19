import {motion} from "framer-motion";
import ModalPopup from "../modal_popup";
import {useRef} from "react";
import {settingStore} from "../../../../../mobx/setting.store";
import {observer} from "mobx-react-lite";
import {useClickOutside} from "../../../../../hooks/useClickOutside";
import {accountStore} from "../../../../../mobx/account.store";
import {extension} from "../../../../../utils/chrome";

const AccountPopup = () => {
    const ref = useRef(null);
    useClickOutside(ref, () => {
        settingStore.popup = ""
    });

    const handleLogout = async () => {
        await accountStore.logout();
    }

    return (
        <>
            {
                settingStore.popup === "account" && Object.keys(accountStore.account).length > 0 && (
                    <>
                        <ModalPopup/>

                        <motion.div
                            ref={ref}
                            initial={{opacity: 0, y: 50}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: 50}}
                            transition={{duration: 0.5}}
                            className={`fixed ${settingStore.show_ads ? "bottom-[60px]" : "bottom-[10px]"} left-0 p-[10px]`}
                            style={{zIndex: 50, width: "calc(100% - 50px)"}}
                        >
                            <div className={`bg-white rounded-[10px] p-5`}>
                                <p className={`text-gray-900 font-bold text-[14px] mb-3`}>
                                    {accountStore.account.name} <span className={`${accountStore.account.account_type === 1 ? "bg-green-500" : "bg-yellow-500"} px-2 py-1 rounded text-xs text-white font-medium`}>{accountStore.account.account_type === 1 ? extension.getLang("account_type_free") : extension.getLang("account_type_premium")}</span>
                                </p>
                                <p className={`text-gray-900 text-[12px] mb-1`}>
                                    <strong>{extension.getLang("email")}: </strong>{accountStore.account.email}
                                </p>
                                <p className={`text-gray-900 text-[12px] mb-1`}>
                                    <strong>{extension.getLang("created_at")}: </strong>{accountStore.account.created_at.slice(0, 10)}
                                </p>
                                {
                                    accountStore.account.account_type === 2 && (
                                        <p className={`text-gray-900 text-[12px] mb-1`}>
                                            <strong>{extension.getLang("expiry_date")}: </strong>{accountStore.account.expiry_date.slice(0, 10)}
                                        </p>
                                    )
                                }

                                <button
                                    onClick={handleLogout}
                                    className={`w-full h-[40px] mt-5 rounded-lg bg-gray-300 hovẻ:bg-gray-400 text-gray-800`}>
                                    {extension.getLang("logout")}
                                </button>
                            </div>
                        </motion.div>
                    </>
                )
            }
        </>
    )
}

export default observer(AccountPopup)