import {useEffect} from "react";
import { motion } from "framer-motion";
import {observer} from "mobx-react-lite";
import {settingStore} from "../../../../mobx/setting.store";

const AlertComponent = () => {
    const optionColor = {
        "info": "text-gray-800",
        "success": "text-green-400",
        "error": "text-red-400"
    }

    useEffect(() => {
        const idTimeout = setTimeout(() => {
            settingStore.alert = {...settingStore.alert, ...{type: "", message: ""}}
        }, 5000)

        return () => clearTimeout(idTimeout)
    }, [settingStore.alert])

    return (
        <>
            {
                (settingStore.alert?.type !== "" && settingStore.alert?.message !== "") && (
                    <motion.div
                        initial={{opacity: 0, y: 50}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: 50}}
                        transition={{duration: 0.5}}
                        className={`flex items-center p-4 text-sm ${optionColor[settingStore.alert?.type]} bg-gray-100 fixed bottom-[60px] right-[50px]`}
                        style={{width: "calc(100% - 50px)"}}
                        role="alert"
                    >
                        <svg
                            className="shrink-0 inline w-4 h-4 me-3"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                        </svg>
                        <span className="sr-only">Info</span>
                        <div>
                            {settingStore.alert?.message}
                        </div>
                    </motion.div>
                )
            }
        </>
    )
}

export default observer(AlertComponent)