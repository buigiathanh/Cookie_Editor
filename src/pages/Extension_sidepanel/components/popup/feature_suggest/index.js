import {motion, AnimatePresence} from "framer-motion";
import ModalPopup from "../modal_popup";
import {useEffect, useRef, useState} from "react";
import {useClickOutside} from "../../../../../hooks/useClickOutside";
import {extension} from "../../../../../utils/chrome";
import {googleAnalytics} from "../../../../../utils/google_analytics";
import {observer} from "mobx-react-lite";
import {settingStore} from "../../../../../mobx/setting.store";

const FeatureSuggest = () => {
    const ref = useRef(null);
    useClickOutside(ref, () => {
        settingStore.popup = ""
    });

    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState("");
    const [feature, setFeature] = useState("");
    const [payment, setPayment] = useState("false");

    const handleSuggest = async () => {
        if (feature.length > 0) {
            setIsLoading(true);
            await fetch("https://script.google.com/macros/s/AKfycbx6Y6lWMrIvjSxRIVIUBN6QOvji0A9v4gwAEF5Go_223LLoHDGVO53Je3uB-ITxxWb4/exec", {
                headers: {
                    "content-type": "application/json"
                },
                method: "POST",
                body: JSON.stringify({
                    email,
                    payment,
                    feature_suggest: feature
                })
            })
            googleAnalytics({name: "submit_feature_suggest", params: []})
            settingStore.popup = "";
        }
    }

    useEffect(() => {
        googleAnalytics({name: "show_popup_feature_suggest", params: []})
    }, [])

    return (
        <>
            {
                settingStore.popup === "feature_suggest" && (
                    <>
                        <ModalPopup/>
                        <AnimatePresence>
                            <motion.div
                                ref={ref}
                                initial={{opacity: 0, y: 50}}
                                animate={{opacity: 1, y: 0}}
                                exit={{opacity: 0, y: 50}}
                                transition={{duration: 0.5, ease: "easeOut"}}
                                className={`fixed bottom-[60px] left-0 p-[10px]`}
                                style={{zIndex: 50, width: "calc(100% - 50px)"}}
                            >
                                <div className={`bg-white rounded-[10px] p-5`}>
                                    <p className={`font-bold text-[14px] uppercase mb-2`}>
                                        What feature would you like to see added?
                                    </p>
                                    <p className={`text-[12px] mb-5`}>
                                        Suggest a necessary feature if you'd like us to develop it further.
                                    </p>
                                    <div className={`w-full mb-5`}>
                                        <label
                                            htmlFor="hostOnly"
                                            className="block mb-2 text-[12px] font-medium text-gray-900">
                                            Email
                                        </label>
                                        <input
                                            onChange={(e) => setEmail(e.target.value)}
                                            type="email"
                                            placeholder={"Your email address"}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-[12px] rounded-lg block w-full p-2.5 mb-1"
                                        />
                                        <p className={`text-gray-500`}>
                                            Enter your email address. We may contact you if we need to clarify your request.
                                            (optional)
                                        </p>
                                    </div>
                                    <div className={`w-full mb-5`}>
                                        <label
                                            htmlFor="hostOnly"
                                            className="block mb-2 text-[12px] font-medium text-gray-900">
                                            Feature Suggest <span className={`text-red-500`}>(*)</span>
                                        </label>
                                        <textarea
                                            onChange={(e) => setFeature(e.target.value)}
                                            rows={5}
                                            placeholder={"A feature you’d like us to develop next"}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-[12px] rounded-lg block w-full p-2.5 mb-1"
                                        />
                                    </div>
                                    <div className={`w-full mb-5`}>
                                        <input
                                            id={`checkbox_payment`}
                                            type="checkbox"
                                            onChange={(e) => {
                                                const { checked } = e.target;
                                                setPayment(checked ? "true" : "false")
                                            }}
                                            checked={payment === "true"}
                                            className="w-4 h-4 text-blue-600 cursor-pointer rounded-sm focus:ring-blue-500 focus:ring-blue-600 ring-offset-gray-800 focus:ring-2 bg-gray-300 border-gray-400"
                                        />
                                        <label
                                            htmlFor={`checkbox_payment`}
                                            className="pl-2 text-[12px] cursor-pointer font-medium text-gray-900">
                                            Would you be willing to pay for that feature?
                                        </label>
                                    </div>
                                    <div className={`w-full flex justify-between`}>
                                        <div className={"inline-block w-[59%]"}>
                                            <button
                                                onClick={handleSuggest}
                                                className={`h-[40px] w-full rounded-[10px] bg-blue-500 text-white px-5`}>
                                                {isLoading ? "Loading ..." : "Suggest"}
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
                        </AnimatePresence>
                    </>
                )
            }
        </>
    )
}

export default observer(FeatureSuggest)