import {useRef} from "react";
import {motion} from "framer-motion";
import ModalPopup from "../modal_popup";
import {useClickOutside} from "../../../../../hooks/useClickOutside";
import {settingStore} from "../../../../../mobx/setting.store";
import {observer} from "mobx-react-lite";
import FormShareCookie from "./form_share";
import {extension} from "../../../../../utils/chrome";

const ShareCookie = ({cookies}) => {
    const ref = useRef(null);
    useClickOutside(ref, () => {
        settingStore.popup = "";
    })

    return (
        <>
            {
                settingStore.popup === "share_cookie" && (
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
                                <p className={`font-bold text-[14px] mb-2`}>
                                    {extension.getLang("share_cookie_title")}
                                </p>
                                <p className={`text-[12px] mb-5`}>
                                    {extension.getLang("share_cookie_description")}
                                </p>
                                <FormShareCookie cookies={cookies}/>
                            </div>
                        </motion.div>
                    </>
                )
            }
        </>
    )
}

export default observer(ShareCookie)