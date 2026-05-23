import {useEffect, useRef, useState} from "react";
import {observer} from "mobx-react-lite";
import {motion} from "framer-motion";
import {useClickOutside} from "../../../hooks/useClickOutside";
import {n8nStore} from "../../../mobx/n8n.store";
import {extension} from "../../../utils/chrome";
import IconEye from "../../../icons/eye";
import IconEyeOff from "../../../icons/eye_off";

const N8nConnectModal = ({error, onSubmitConnect}) => {
    const ref = useRef(null);
    const [showPassword, setShowPassword] = useState(false);

    useClickOutside(ref, () => {
        n8nStore.closeConnectPopup();
    });

    useEffect(() => {
        if (!n8nStore.showConnectPopup) {
            setShowPassword(false);
        }
    }, [n8nStore.showConnectPopup]);

    if (!n8nStore.showConnectPopup) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
            <motion.div
                ref={ref}
                initial={{opacity: 0, scale: 0.95}}
                animate={{opacity: 1, scale: 1}}
                className="w-full max-w-md bg-[#3C3C3C] rounded-xl p-6 shadow-xl border border-gray-700"
            >
                <p className="text-[16px] font-bold mb-2 text-white">
                    {extension.getLang("n8n_btn_connect")}
                </p>
                <p className="text-[13px] mb-4 text-gray-300">
                    {extension.getLang("n8n_password_hint")}
                </p>
                <div className="relative mb-3">
                    <input
                        type={showPassword ? "text" : "password"}
                        value={n8nStore.password}
                        onChange={(e) => {
                            n8nStore.password = e.target.value;
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                onSubmitConnect();
                            }
                        }}
                        placeholder={extension.getLang("pl_password")}
                        className="w-full h-[40px] px-4 pr-11 rounded-lg bg-[#282828] text-white text-[14px] border border-gray-600 focus:outline-none focus:border-blue-500"
                        autoFocus
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-0 flex items-center justify-center w-10 p-0 border-0 bg-transparent text-gray-400 hover:text-gray-200 transition-colors cursor-pointer"
                        aria-label={extension.getLang(showPassword ? "n8n_hide_password" : "n8n_show_password")}
                    >
                        {showPassword ? (
                            <IconEyeOff cname="w-5 h-5 block" />
                        ) : (
                            <IconEye cname="w-5 h-5 block" />
                        )}
                    </button>
                </div>
                {error && (
                    <p className="text-red-400 text-[13px] mb-3">{error}</p>
                )}
                <div className="flex gap-3">
                    <button
                        onClick={onSubmitConnect}
                        disabled={n8nStore.loading}
                        className="flex-1 h-[44px] rounded-lg bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
                    >
                        {extension.getLang("n8n_btn_connect")}
                    </button>
                    <button
                        onClick={() => n8nStore.closeConnectPopup()}
                        className="flex-1 h-[44px] rounded-lg bg-gray-600 hover:bg-gray-500 text-white"
                    >
                        {extension.getLang("btn_cancel")}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default observer(N8nConnectModal);
