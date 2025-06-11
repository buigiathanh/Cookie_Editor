import ModalPopup from "../modal_popup";
import {motion} from "framer-motion";
import {extension} from "../../../../../utils/chrome";
import {useRef} from "react";
import {useClickOutside} from "../../../../../hooks/useClickOutside";
import {settingStore} from "../../../../../mobx/setting.store";

const PopupClearDataBrowser = ({clear}) => {
    const ref = useRef(null);
    useClickOutside(ref, () => settingStore.popup = "");


    return (
        <>
            {
                settingStore.popup === "delete_browser_data" && (
                    <>
                        <ModalPopup />
                        <motion.div
                            ref={ref}
                            initial={{opacity: 0, y: 50}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: 50}}
                            transition={{duration: 0.5}}
                            className={`fixed bottom-[60px] left-0 p-[10px]`}
                            style={{zIndex: 50, width: "calc(100% - 50px)"}}
                        >
                            <div className={`bg-white rounded-[10px] p-5`}>
                                <p className={`font-bold text-[14px] mb-2`}>
                                    CONFIRM BROWSER DATA DELETION
                                </p>
                                <p className={`text-[12px] mb-5`}>
                                    Browser data will be deleted and cannot be recovered.
                                </p>
                                <div className={`w-full flex justify-between`}>
                                    <div className={"inline-block w-[59%]"}>
                                        <button
                                            onClick={clear}
                                            className={`h-[40px] w-full rounded-[10px] bg-blue-500 text-white px-5`}>
                                            {extension.getLang("btn_delete")}
                                        </button>
                                    </div>
                                    <div className={"inline-block w-[39%]"}>
                                        <button
                                            onClick={() => settingStore.popup = ""}
                                            className={`h-[40px] w-full rounded-[10px] bg-gray-200 text-gray-900 px-5`}>
                                            {extension.getLang("btn_cancel")}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )
            }
        </>
    )
}

export default PopupClearDataBrowser