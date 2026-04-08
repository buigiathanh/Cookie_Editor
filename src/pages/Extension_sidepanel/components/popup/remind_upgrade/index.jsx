import {useRef} from "react";
import {useClickOutside} from "../../../../../hooks/useClickOutside";
import {settingStore} from "../../../../../mobx/setting.store";
import ModalPopup from "../modal_popup";
import {motion} from "framer-motion";
import RocketIcon from "../../../../../icons/rocket";
import ArrowRightIcon from "../../../../../icons/arrow_right";
import {observer} from "mobx-react-lite";
import {extension} from "../../../../../utils/chrome";

const RemindUpgrade = () => {
    const ref = useRef(null);
    useClickOutside(ref, () => {
        settingStore.popup = "";
    })

    return (
        <>
            {
                settingStore.popup === "remind_upgrade" && (
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
                                <div className={`w-[40px] h-[40px] bg-blue-100 rounded-md p-[5px] mb-3`}>
                                    <RocketIcon cname={"w-[30px] h-[30px] text-blue-600"} strokeWidth={"1.5"}/>
                                </div>
                                <p className={`text-gray-900 font-medium text-sm mb-2 uppercase`}>
                                    {extension.getLang("remind_upgrade_title")}
                                </p>
                                <p className={`text-gray-500 text-xs mb-3`}>
                                    {extension.getLang("remind_upgrade_description")}
                                </p>
                                <div className={`w-full mb-[10px]`}>
                                    <button
                                        onClick={() => settingStore.popup = "upgrade"}
                                        type="button"
                                        className="text-white cursor-pointer bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xs px-5 py-2 text-center inline-flex items-center">
                                        {extension.getLang("remind_upgrade_btn")}
                                        <ArrowRightIcon cname="w-3.5 h-3.5 ms-2"/>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )
            }
        </>
    )
}

export default observer(RemindUpgrade)