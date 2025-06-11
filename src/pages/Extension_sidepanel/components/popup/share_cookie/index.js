import {useEffect, useRef, useState} from "react";
import { motion } from "framer-motion";
import ModalPopup from "../modal_popup";
import {useClickOutside} from "../../../../../hooks/useClickOutside";
import {settingStore} from "../../../../../mobx/setting.store";
import {observer} from "mobx-react-lite";

const ShareCookie = ({cookies}) => {
    const ref = useRef(null);
    useClickOutside(ref, () => {
        settingStore.popup = "";
    })
    const [password, setPassword] = useState("");
    const [timeOption, setTimeOption] = useState("");

    return (
        <>
            {
                settingStore.popup === "share_cookie" && (
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
                                <p className={`font-bold text-[14px] mb-2`}>SHARE COOKIE</p>
                                <p className={`text-[12px] mb-5`}>Do you want to share the cookie?</p>
                                <div className={`w-full mb-5`}>
                                    <label
                                        htmlFor="hostOnly"
                                        className="block mb-2 text-[12px] font-medium text-gray-900">
                                        Title (<span className={"text-red-500"}>*</span>)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder={"A memorable name."}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-[12px] rounded-lg block w-full p-2.5 mb-1"
                                    />
                                    <p className={`text-gray-500`}>
                                        A memorable name to help you identify which website the cookie link belongs to. (Required)
                                    </p>
                                </div>
                                <div className={`w-full mb-5`}>
                                    <label
                                        htmlFor="hostOnly"
                                        className="block mb-2 text-[12px] font-medium text-gray-900">
                                        Password to decrypt cookies (<span className={"text-red-500"}>*</span>)
                                    </label>
                                    <input
                                        type="password"
                                        placeholder={"Password to encrypt cookies"}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-[12px] rounded-lg block w-full p-2.5 mb-1"
                                        value={password}
                                    />
                                    <p className={`text-gray-500`}>
                                        Enter a password to encrypt the cookie before sharing. This ensures that even we cannot read
                                        the
                                        content without the password. (Required)
                                    </p>
                                </div>
                                <div className={`w-full mb-5`}>
                                    <label
                                        htmlFor="hostOnly"
                                        className="block mb-2 text-[12px] font-medium text-gray-900">
                                        Link expiration time
                                    </label>
                                    <div className={`w-full flex flex-wrap justify-between`}>
                                        <div className="inline-flex w-fit pr-3 items-center mb-2">
                                            <input
                                                id={"option_1"}
                                                type="radio"
                                                value={"one"}
                                                name="option"
                                                onClick={(e) => setTimeOption(e.target.value)}
                                                checked={timeOption === "one"}
                                                className="w-4 h-4 text-blue-600 bg-gray-400 border-gray-300 focus:ring-blue-500"
                                            />
                                            <label
                                                htmlFor={"option_1"}
                                                className="ms-2 text-[12px] cursor-pointer font-medium text-gray-900"
                                            >
                                                1 hour
                                            </label>
                                        </div>
                                        <div className="inline-flex w-fit pr-3 items-center mb-2">
                                            <input
                                                id={"option_2"}
                                                type="radio"
                                                value={"custom"}
                                                name="option"
                                                onClick={(e) => setTimeOption(e.target.value)}
                                                checked={timeOption === "custom"}
                                                className="w-4 h-4 text-blue-600 bg-gray-400 border-gray-300 focus:ring-blue-500"
                                            />
                                            <label
                                                htmlFor={"option_2"}
                                                className="ms-2 text-[12px] cursor-pointer font-medium text-gray-900"
                                            >
                                                Custom
                                            </label>
                                        </div>
                                        <div className="inline-flex w-fit pr-3 items-center mb-2">
                                            <input
                                                id={"option_3"}
                                                type="radio"
                                                value={"unlimited"}
                                                name="option"
                                                onClick={(e) => setTimeOption(e.target.value)}
                                                checked={timeOption === "unlimited"}
                                                className="w-4 h-4 text-blue-600 bg-gray-400 border-gray-300 focus:ring-blue-500"
                                            />
                                            <label
                                                htmlFor={"option_3"}
                                                className="ms-2 text-[12px] cursor-pointer font-medium text-gray-900"
                                            >
                                                Unlimited
                                            </label>
                                        </div>
                                    </div>
                                    {
                                        timeOption === "custom" && (
                                            <>
                                                <div className={`w-full flex justify-between`}>
                                                    <div className={`inline-block`} style={{width: "calc(100% - 90px)"}}>
                                                        <input
                                                            type="text"
                                                            placeholder={"Link expiration time"}
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-[12px] rounded-lg block w-full p-2.5 mb-1"
                                                        />
                                                    </div>
                                                    <div className={`inline-block w-[80px]`}>
                                                        <select
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-[12px] rounded-lg block w-full p-2.5 mb-1"
                                                        >
                                                            <option>Hours</option>
                                                            <option>Days</option>
                                                            <option>Months</option>
                                                            <option>Years</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <p className={`text-gray-500`}>
                                                    Enter the link expiration time if you want to share it for a specific period.
                                                    Leave
                                                    it
                                                    blank
                                                    if
                                                    you don’t want to set an expiration time.
                                                </p>
                                            </>
                                        )
                                    }
                                </div>
                                <div className={`w-full flex justify-between`}>
                                    <div className={"inline-block w-[59%]"}>
                                        <button
                                            onClick={() => {
                                            }}
                                            className={`h-[40px] w-full rounded-[10px] bg-blue-500 text-white px-5`}>
                                            Share
                                        </button>
                                    </div>
                                    <div className={"inline-block w-[39%]"}>
                                        <button
                                            onClick={() => settingStore.popup = ""}
                                            className={`h-[40px] w-full rounded-[10px] bg-gray-200 text-gray-900 px-5`}>
                                            Cancel
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

export default observer(ShareCookie)