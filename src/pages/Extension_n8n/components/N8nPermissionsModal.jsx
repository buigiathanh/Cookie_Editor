import {useRef} from "react";
import {observer} from "mobx-react-lite";
import {motion} from "framer-motion";
import {useClickOutside} from "../../../hooks/useClickOutside";
import {n8nStore} from "../../../mobx/n8n.store";
import {extension} from "../../../utils/chrome";

const N8nPermissionsModal = () => {
    const ref = useRef(null);

    useClickOutside(ref, () => {
        n8nStore.closePermissionPopup();
    });

    const handleRequestPermissions = async () => {
        const granted = await n8nStore.requestPermissions();
        if (granted) {
            await n8nStore.onPermissionsGranted();
            n8nStore.completeConnectFlowAfterPermission();
            n8nStore.closePermissionPopup(false);
            n8nStore.setAlert("info", extension.getLang("n8n_permissions_granted"));
        } else {
            n8nStore.closePermissionPopup();
            n8nStore.setAlert("error", extension.getLang("n8n_permissions_denied"));
        }
    };

    if (!n8nStore.showPermissionPopup) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
            <motion.div
                ref={ref}
                initial={{opacity: 0, scale: 0.95}}
                animate={{opacity: 1, scale: 1}}
                className="w-full max-w-md bg-white rounded-xl p-6 shadow-xl"
            >
                <p className="text-[16px] font-bold mb-2 text-gray-900">
                    {extension.getLang("n8n_permissions_title")}
                </p>
                <p className="text-[13px] mb-4 text-gray-700">
                    {extension.getLang("n8n_permissions_description")}
                </p>
                <ul className="text-[13px] mb-6 text-gray-700 list-disc pl-5 space-y-2">
                    <li>{extension.getLang("n8n_permissions_storage")}</li>
                    <li>{extension.getLang("n8n_permissions_alarms")}</li>
                </ul>
                <div className="flex gap-3">
                    <button
                        onClick={handleRequestPermissions}
                        className="flex-1 h-[44px] rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
                    >
                        {extension.getLang("n8n_permissions_btn_grant")}
                    </button>
                    <button
                        onClick={() => n8nStore.closePermissionPopup()}
                        className="flex-1 h-[44px] rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800"
                    >
                        {extension.getLang("btn_cancel")}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default observer(N8nPermissionsModal);
