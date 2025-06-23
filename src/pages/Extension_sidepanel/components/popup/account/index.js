import {motion} from "framer-motion";
import ModalPopup from "../modal_popup";
import {useEffect, useRef, useState} from "react";
import {settingStore} from "../../../../../mobx/setting.store";
import {observer} from "mobx-react-lite";
import {useClickOutside} from "../../../../../hooks/useClickOutside";
import {accountStore} from "../../../../../mobx/account.store";
import {extension} from "../../../../../utils/chrome";

const accountTypes = [
    {
        type: 1,
        style: "bg-green-500",
        title: extension.getLang("account_type_free")
    },
    {
        type: 2,
        style: "bg-yellow-600",
        title: extension.getLang("account_type_premium")
    },
    {
        type: 3,
        style: "bg-purple-700",
        title: "No Ads"
    }
]

const AccountPopup = () => {
    const ref = useRef(null);
    const account = accountStore.account;
    const [accountOptionType, setAccountOptionType] = useState({});

    useClickOutside(ref, () => {
        settingStore.popup = ""
    });

    const handleLogout = async () => {
        await accountStore.logout();
    }

    useEffect(() => {
        if (Object.keys(account).length > 0) {
            setAccountOptionType(accountTypes.find(item => item.type === account.account_type))
        }
    }, [account])

    return (
        <>
            {
                settingStore.popup === "account" && Object.keys(account).length > 0 && (
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
                                    <span>{account.name} </span>
                                    <span className={`${accountOptionType.style} px-2 py-1 rounded text-[10px] text-white font-medium`}>
                                        {accountOptionType.title}
                                    </span>
                                </p>
                                <p className={`text-gray-900 text-[12px] mb-1`}>
                                    <strong>{extension.getLang("email")}: </strong>{account.email}
                                </p>
                                <p className={`text-gray-900 text-[12px] mb-1`}>
                                    <strong>{extension.getLang("created_at")}: </strong>{account.created_at.slice(0, 10)}
                                </p>
                                {
                                    account.account_type === 2 && (
                                        <p className={`text-gray-900 text-[12px] mb-1`}>
                                            <strong>{extension.getLang("expiry_date")}: </strong>{account.expiry_date.slice(0, 10)}
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