import {motion} from "framer-motion";
import ModalPopup from "../modal_popup";
import {useEffect, useRef} from "react";
import {settingStore} from "../../../../../mobx/setting.store";
import {observer} from "mobx-react-lite";
import {useClickOutside} from "../../../../../hooks/useClickOutside";

const About = () => {
    const ref = useRef(null);
    useClickOutside(ref, () => {
        settingStore.popup = ""
    });

    return (
        <>
            {
                settingStore.popup === "about" && (
                    <>
                        <ModalPopup/>

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
                                <p className={`text-gray-900 font-bold text-[14px] mb-3`}>
                                    About ThanhBui
                                </p>
                                <p className={`text-gray-900 text-[12px] mb-3`}>
                                    I am a developer and I enjoy creating extensions for Chrome. Helping you develop and market
                                    social
                                    media communications.
                                </p>
                                <p className={`text-gray-900 text-[12px] mb-3`}>
                                    You can learn more about me and get in touch through the following social media platforms.
                                </p>
                                <div className={`w-full flex justify-between`}>
                                    <div className={`inline-block w-[48%]`}>
                                        <button
                                            onClick={() => window.open('https://www.facebook.com/profile.php?id=100006007122729', '_blank')}
                                            className={`w-full h-10 rounded-[10px] bg-blue-600 text-white`}>
                                            Facebook
                                        </button>
                                    </div>
                                    <div className={`inline-block w-[48%]`}>
                                        <button
                                            onClick={() => window.open('https://x.com/buigiathanh2802', '_blank')}
                                            className={`w-full h-10 rounded-[10px] bg-black text-white`}>
                                            X
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

export default observer(About)