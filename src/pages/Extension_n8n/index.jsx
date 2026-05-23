/*global chrome*/
import {useEffect, useState} from "react";
import {observer} from "mobx-react-lite";
import {n8nStore} from "../../mobx/n8n.store";
import {extension} from "../../utils/chrome";
import {image} from "../../utils/images";
import N8nPermissionsModal from "./components/N8nPermissionsModal";
import N8nConnectModal from "./components/N8nConnectModal";
import N8nAlert from "./components/N8nAlert";

const N8N_DOCS_URL = "https://cookieeditor.org/docs/n8n";

const openN8nDocs = () => {
    window.open(N8N_DOCS_URL, "_blank");
};

const formatDate = (timestamp) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleString();
};

const ClientKeyBlock = () => (
    <section className="bg-[#3C3C3C] rounded-xl p-5 mb-6 border border-green-700/40">
        <p className="text-gray-400 text-[12px] mb-2">
            {extension.getLang("n8n_client_key")}
        </p>
        <div className="flex items-center gap-3 mb-3">
            <p className="flex-1 min-w-0 text-white text-[14px] break-all font-mono bg-[#282828] px-3 py-2 rounded-lg border border-gray-600">
                {n8nStore.clientKey}
            </p>
            <button
                type="button"
                onClick={() => n8nStore.disconnect()}
                disabled={n8nStore.loading}
                className="shrink-0 h-[40px] px-4 rounded-lg bg-red-500 hover:bg-red-600 text-white text-[13px] disabled:opacity-50"
            >
                {extension.getLang("n8n_btn_disconnect")}
            </button>
        </div>
        <div className="flex justify-end">
            <button
                type="button"
                onClick={openN8nDocs}
                className="text-blue-400 hover:text-blue-300 text-[13px] underline"
            >
                {extension.getLang("n8n_view_usage")}
            </button>
        </div>
    </section>
);

const HistoryTable = observer(() => {
    const countText = extension
        .getLang("n8n_history_count")
        .replace("__COUNT__", String(n8nStore.historyCount));

    const handleClearHistory = async () => {
        if (!window.confirm(extension.getLang("n8n_history_clear_confirm"))) {
            return;
        }
        await n8nStore.clearHistory();
    };

    return (
    <section className="bg-[#3C3C3C] rounded-xl p-6">
        <div className="flex items-center justify-between mb-4 gap-3">
            <h2 className="text-[15px] font-bold">
                {extension.getLang("n8n_history_title")}
            </h2>
            <div className="flex items-center gap-2 shrink-0">
                <span className="text-[12px] text-gray-400 bg-[#282828] px-3 py-1 rounded-full border border-gray-600 whitespace-nowrap">
                    {countText}
                </span>
                {n8nStore.history.length > 0 && (
                    <button
                        type="button"
                        onClick={handleClearHistory}
                        className="text-[12px] text-red-400 hover:text-red-300 bg-[#282828] px-3 py-1 rounded-full border border-gray-600 hover:border-red-500 whitespace-nowrap transition-colors"
                    >
                        {extension.getLang("n8n_history_clear")}
                    </button>
                )}
            </div>
        </div>
        {n8nStore.history.length > 0 ? (
            <div className="overflow-x-auto rounded-lg border border-gray-700">
                <table className="w-full text-left text-[13px]">
                    <thead className="bg-[#282828] text-gray-300">
                        <tr>
                            <th className="px-4 py-3 font-medium">{extension.getLang("n8n_history_col_domain")}</th>
                            <th className="px-4 py-3 font-medium">{extension.getLang("n8n_history_col_url")}</th>
                            <th className="px-4 py-3 font-medium">{extension.getLang("n8n_history_col_time")}</th>
                            <th className="px-4 py-3 font-medium">{extension.getLang("n8n_history_col_status")}</th>
                            <th className="px-4 py-3 font-medium">{extension.getLang("n8n_history_col_cookies")}</th>
                            <th className="px-4 py-3 font-medium">{extension.getLang("n8n_history_col_message")}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {n8nStore.history.map((item) => (
                            <tr key={item.id} className="bg-[#333333] hover:bg-[#3a3a3a]">
                                <td className="px-4 py-3 text-white whitespace-nowrap">
                                    {item.domain || "-"}
                                </td>
                                <td className="px-4 py-3 text-gray-300 max-w-[200px] truncate" title={item.url}>
                                    {item.url || "-"}
                                </td>
                                <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                                    {formatDate(item.timestamp)}
                                </td>
                                <td className="px-4 py-3">
                                    <span
                                        className={`text-[11px] px-2 py-0.5 rounded-full ${
                                            item.status === "success"
                                                ? "bg-green-700 text-white"
                                                : "bg-red-700 text-white"
                                        }`}
                                    >
                                        {item.status === "success"
                                            ? extension.getLang("n8n_history_success")
                                            : extension.getLang("n8n_history_error")}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-gray-300 text-center">
                                    {item.status === "success" && item.cookieCount > 0
                                        ? item.cookieCount
                                        : "-"}
                                </td>
                                <td className="px-4 py-3 text-gray-400 max-w-[180px] truncate" title={item.message}>
                                    {item.message || "-"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        ) : (
            <p className="text-gray-400 text-[13px] text-center py-10">
                {extension.getLang("n8n_history_empty")}
            </p>
        )}
    </section>
    );
});

const ExtensionN8n = () => {
    const [error, setError] = useState("");

    useEffect(() => {
        n8nStore.checkPermissions().then((granted) => {
            if (granted) {
                n8nStore.fetchStatus().then();
            }
        });

        const onRuntimeMessage = (request) => {
            if (request.action === "n8n_status_changed" && request.data) {
                n8nStore.syncStatus(request.data);
            }
            if (request.action === "n8n_history_updated" && request.history) {
                n8nStore.syncHistory(request.history);
            }
        };

        const onStorageChange = (changes, area) => {
            if (area !== "local") return;

            if (changes.n8n_history) {
                n8nStore.syncHistory(changes.n8n_history.newValue ?? []);
            }

            if (
                changes.n8n_connected ||
                changes.n8n_client_key ||
                changes.n8n_connected_at
            ) {
                n8nStore.fetchStatus().then();
            }
        };

        chrome.runtime.onMessage.addListener(onRuntimeMessage);
        chrome.storage.onChanged.addListener(onStorageChange);

        return () => {
            chrome.runtime.onMessage.removeListener(onRuntimeMessage);
            chrome.storage.onChanged.removeListener(onStorageChange);
        };
    }, []);

    const handleConnectClick = async () => {
        setError("");

        const hasPermission = await n8nStore.ensurePermissions();
        if (!hasPermission) {
            n8nStore.requestConnectFlow();
            return;
        }

        n8nStore.openConnectPopup();
    };

    const handleSubmitConnect = async () => {
        setError("");

        const hasPermission = await n8nStore.ensurePermissions();
        if (!hasPermission) {
            n8nStore.requestConnectFlow();
            return;
        }

        const result = await n8nStore.connect();
        if (!result.success) {
            if (result.needPermission) {
                n8nStore.requestConnectFlow();
                return;
            }
            setError(result.message);
        } else {
            setError("");
        }
    };

    const renderConnectButton = () => {
        if (n8nStore.connected) {
            return null;
        }

        if (n8nStore.loading) {
            return (
                <button
                    disabled
                    className="h-[40px] px-5 rounded-lg bg-blue-500/50 text-white text-[13px] cursor-wait"
                >
                    {extension.getLang("n8n_status_connecting")}
                </button>
            );
        }

        return (
            <button
                onClick={handleConnectClick}
                className="h-[40px] px-5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-[13px]"
            >
                {extension.getLang("n8n_btn_connect")}
            </button>
        );
    };

    return (
        <div className="min-h-screen bg-[#282828] text-white">
            <header className="border-b border-gray-700 bg-[#1E1E1E]">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <img
                            src={image.inExtension("/icons/48x48.png")}
                            alt="Cookie Editor"
                            className="w-10 h-10 rounded-lg"
                        />
                        <div>
                            <h1 className="text-[18px] font-bold">
                                {extension.getLang("n8n_page_title")}
                            </h1>
                            <p className="text-gray-400 text-[13px]">
                                {extension.getLang("n8n_description")}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={openN8nDocs}
                            className="h-[40px] px-5 rounded-lg text-[13px] bg-gray-700 text-gray-200 hover:bg-gray-600 transition-colors"
                        >
                            {extension.getLang("n8n_tab_guide")}
                        </button>
                        {renderConnectButton()}
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-8">
                {n8nStore.connected && n8nStore.clientKey && (
                    <ClientKeyBlock />
                )}
                <HistoryTable />
            </main>

            <N8nPermissionsModal />
            <N8nConnectModal
                error={error}
                onSubmitConnect={handleSubmitConnect}
            />
            <N8nAlert />
        </div>
    );
};

export default observer(ExtensionN8n);
