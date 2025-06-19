import {useRef} from "react";
import {useClickOutside} from "../../../../../hooks/useClickOutside";
import {settingStore} from "../../../../../mobx/setting.store";
import ModalPopup from "../modal_popup";
import {motion} from "framer-motion";
import {observer} from "mobx-react-lite";
import {extension} from "../../../../../utils/chrome";

const RemindLogin = () => {
    const ref = useRef(null);
    useClickOutside(ref, () => {
        settingStore.popup = "";
    })

    return (
        <>
            {
                settingStore.popup === "remind_login" && (
                    <>
                        <ModalPopup />
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
                                <p className={`text-[12px] mb-5`}>
                                    {extension.getLang("remind_login")}
                                </p>

                                <button
                                    onClick={() => window.open('https://cookieeditor.org/login', '_blank')}
                                    className={`h-[40px] w-full rounded-[10px] bg-blue-500 text-white px-5`}
                                >
                                    {extension.getLang("remind_login_btn")}
                                </button>
                            </div>
                        </motion.div>
                    </>
                )
            }
        </>
    )
}

export default observer(RemindLogin)