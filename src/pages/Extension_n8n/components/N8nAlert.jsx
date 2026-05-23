import {useEffect} from "react";
import {observer} from "mobx-react-lite";
import {motion} from "framer-motion";
import {n8nStore} from "../../../mobx/n8n.store";

const N8nAlert = () => {
    const {type, message} = n8nStore.alert;

    useEffect(() => {
        if (!type || !message) return;

        const id = setTimeout(() => {
            n8nStore.clearAlert();
        }, 5000);

        return () => clearTimeout(id);
    }, [type, message]);

    if (!type || !message) {
        return null;
    }

    const colorClass = type === "error" ? "text-red-400" : "text-gray-800";

    return (
        <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center px-5 py-3 text-sm ${colorClass} bg-gray-100 rounded-lg shadow-lg max-w-lg`}
            role="alert"
        >
            {message}
        </motion.div>
    );
};

export default observer(N8nAlert);
