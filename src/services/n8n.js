/*global chrome*/
import CryptoJS from "crypto-js";
import {getN8nWsUrl} from "../constants/website";
import {checkN8nPermissions} from "../utils/n8n_permissions";

const STORAGE_KEYS = {
    password: "n8n_password",
    clientKey: "n8n_client_key",
    connected: "n8n_connected",
    connectedAt: "n8n_connected_at",
    history: "n8n_history",
};

const ALARM_NAME = "n8n_keepalive";
const HEARTBEAT_INTERVAL_MS = 25000;
const MAX_HISTORY = 50;
const MAX_RECONNECT_ATTEMPTS = 5;
const CONNECT_TIMEOUT_MS = 15000;

let socket = null;
let reconnectTimer = null;
let reconnectAttempts = 0;
let pendingConnectResolve = null;
let pendingConnectReject = null;
let heartbeatInterval = null;
let alarmListenerRegistered = false;

const hasRequiredPermissions = () => checkN8nPermissions();

const storageGet = (keys) => {
    return new Promise((resolve) => {
        chrome.storage.local.get(keys, resolve);
    });
};

const storageSet = (data) => {
    return new Promise((resolve) => {
        chrome.storage.local.set(data, resolve);
    });
};

const storageRemove = (keys) => {
    return new Promise((resolve) => {
        chrome.storage.local.remove(keys, resolve);
    });
};

const isSocketOpen = () => socket && socket.readyState === WebSocket.OPEN;

const broadcastUpdate = (data) => {
    chrome.runtime.sendMessage({action: "n8n_status_changed", data}).catch(() => {});
    if (data?.history) {
        chrome.runtime.sendMessage({
            action: "n8n_history_updated",
            history: data.history,
        }).catch(() => {});
    }
};

const getStatus = async () => {
    const data = await storageGet([
        STORAGE_KEYS.password,
        STORAGE_KEYS.clientKey,
        STORAGE_KEYS.connected,
        STORAGE_KEYS.connectedAt,
        STORAGE_KEYS.history,
    ]);

    return {
        connected: Boolean(data[STORAGE_KEYS.connected]) && isSocketOpen(),
        clientKey: data[STORAGE_KEYS.clientKey] || "",
        connectedAt: data[STORAGE_KEYS.connectedAt] || null,
        hasPassword: Boolean(data[STORAGE_KEYS.password]),
        history: data[STORAGE_KEYS.history] || [],
    };
};

const addHistoryEntry = async (entry) => {
    const data = await storageGet([STORAGE_KEYS.history]);
    const history = [entry, ...(data[STORAGE_KEYS.history] || [])].slice(0, MAX_HISTORY);
    await storageSet({[STORAGE_KEYS.history]: history});
    return history;
};

const clearHistory = async () => {
    await storageSet({[STORAGE_KEYS.history]: []});
    const status = await getStatus();
    broadcastUpdate(status);
    return status;
};

const encryptCookies = (cookies, password) => {
    const cookieBase64 = btoa(JSON.stringify(cookies));
    return CryptoJS.AES.encrypt(cookieBase64, password).toString();
};

const normalizeUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) {
        return url;
    }
    return `https://${url}`;
};

const resolvePendingConnect = (status) => {
    if (pendingConnectResolve) {
        pendingConnectResolve(status);
        pendingConnectResolve = null;
        pendingConnectReject = null;
    }
};

const rejectPendingConnect = (error) => {
    if (pendingConnectReject) {
        pendingConnectReject(error);
        pendingConnectResolve = null;
        pendingConnectReject = null;
    }
};

const closeSocket = () => {
    if (!socket) return;

    socket.onopen = null;
    socket.onmessage = null;
    socket.onerror = null;
    socket.onclose = null;

    if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
        try {
            socket.close();
        } catch {
            // ignore
        }
    }

    socket = null;
};

const startHeartbeat = () => {
    stopHeartbeat();
    heartbeatInterval = setInterval(() => {
        maintainConnection().catch(() => {});
    }, HEARTBEAT_INTERVAL_MS);
};

const stopHeartbeat = () => {
    if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
        heartbeatInterval = null;
    }
};

const startKeepAlive = async () => {
    if (!(await hasRequiredPermissions())) {
        return;
    }

    await chrome.alarms.create(ALARM_NAME, {periodInMinutes: 1});
    startHeartbeat();
};

const stopKeepAlive = async () => {
    await chrome.alarms.clear(ALARM_NAME);
    stopHeartbeat();
};

const sendPing = () => {
    if (isSocketOpen()) {
        socket.send(JSON.stringify({type: "ping"}));
    }
};

const handleGetCookies = async (payload) => {
    const requestId = payload.request_id || payload.requestId;
    const url = normalizeUrl(payload.url);
    const domain = payload.domain || (url ? new URL(url).hostname : "");
    let status = "success";
    let message = "";
    let cookieCount = 0;

    try {
        const stored = await storageGet([STORAGE_KEYS.password]);
        const password = stored[STORAGE_KEYS.password];

        if (!password) {
            throw new Error("Missing local encryption password");
        }

        if (!url) {
            throw new Error("Missing url");
        }

        const cookies = await chrome.cookies.getAll({url});

        if (cookies.length === 0) {
            throw new Error("No cookies found for this url");
        }

        cookieCount = cookies.length;
        const encryptedData = encryptCookies(cookies, password);

        if (isSocketOpen()) {
            socket.send(JSON.stringify({
                type: "cookies_result",
                request_id: requestId,
                data: encryptedData,
                domain,
                url,
            }));
        }
    } catch (error) {
        status = "error";
        message = error.message || "Failed to fetch cookies";

        if (isSocketOpen()) {
            socket.send(JSON.stringify({
                type: "cookies_error",
                request_id: requestId,
                message,
                domain,
                url,
            }));
        }
    }

    await addHistoryEntry({
        id: requestId || String(Date.now()),
        url,
        domain,
        timestamp: Date.now(),
        status,
        cookieCount,
        message,
    });

    broadcastUpdate(await getStatus());
};

const handleSocketMessage = async (event) => {
    let payload;
    try {
        payload = JSON.parse(event.data);
    } catch {
        return;
    }

    const type = payload.type || payload.action;

    switch (type) {
        case "connected":
            await storageSet({
                [STORAGE_KEYS.connected]: true,
                [STORAGE_KEYS.clientKey]: payload.client_key || payload.clientKey || "",
                [STORAGE_KEYS.connectedAt]: Date.now(),
            });
            reconnectAttempts = 0;
            await startKeepAlive();
            {
                const status = await getStatus();
                broadcastUpdate(status);
                resolvePendingConnect(status);
            }
            break;

        case "get_cookies":
            await handleGetCookies(payload);
            break;

        case "ping":
            if (isSocketOpen()) {
                socket.send(JSON.stringify({type: "pong"}));
            }
            break;

        default:
            break;
    }
};

const scheduleReconnect = () => {
    if (reconnectTimer) {
        clearTimeout(reconnectTimer);
    }

    reconnectTimer = setTimeout(async () => {
        reconnectTimer = null;

        const data = await storageGet([STORAGE_KEYS.connected, STORAGE_KEYS.password]);
        if (!data[STORAGE_KEYS.connected] || !data[STORAGE_KEYS.password]) {
            return;
        }

        reconnectAttempts += 1;
        if (reconnectAttempts > MAX_RECONNECT_ATTEMPTS) {
            await disconnect(false);
            return;
        }

        connect(data[STORAGE_KEYS.password], {awaitConnected: false}).catch(() => {});
    }, Math.min(1000 * reconnectAttempts, 10000));
};

const setDisconnectedState = async (notify = true) => {
    await stopKeepAlive();
    await storageSet({
        [STORAGE_KEYS.connected]: false,
        [STORAGE_KEYS.clientKey]: "",
        [STORAGE_KEYS.connectedAt]: null,
    });

    if (notify) {
        broadcastUpdate(await getStatus());
    }
};

const createSocket = (password) => {
    closeSocket();

    try {
        socket = new WebSocket(getN8nWsUrl());
    } catch (error) {
        throw error;
    }

    const connectionTimeout = setTimeout(() => {
        if (socket && socket.readyState !== WebSocket.OPEN) {
            closeSocket();
            rejectPendingConnect(new Error("Connection timeout"));
            scheduleReconnect();
        }
    }, CONNECT_TIMEOUT_MS);

    socket.onopen = () => {
        clearTimeout(connectionTimeout);
        socket.send(JSON.stringify({
            type: "connect",
            extension_id: chrome.runtime.id,
        }));
    };

    socket.onmessage = (event) => {
        handleSocketMessage(event).catch(() => {});
    };

    socket.onerror = () => {
        clearTimeout(connectionTimeout);
        rejectPendingConnect(new Error("WebSocket connection failed"));
    };

    socket.onclose = async () => {
        clearTimeout(connectionTimeout);
        socket = null;

        const data = await storageGet([STORAGE_KEYS.connected]);
        if (data[STORAGE_KEYS.connected]) {
            scheduleReconnect();
        } else {
            rejectPendingConnect(new Error("Connection closed"));
        }
    };
};

const connect = async (password, options = {}) => {
    const {awaitConnected = true} = options;

    if (!password) {
        throw new Error("Password is required");
    }

    if (!(await hasRequiredPermissions())) {
        throw new Error("Missing n8n permissions");
    }

    if (isSocketOpen()) {
        return getStatus();
    }

    await storageSet({
        [STORAGE_KEYS.password]: password,
        [STORAGE_KEYS.connected]: true,
    });

    if (awaitConnected) {
        return new Promise((resolve, reject) => {
            pendingConnectResolve = resolve;
            pendingConnectReject = reject;
            createSocket(password);
        });
    }

    createSocket(password);
    return getStatus();
};

const disconnect = async (clearPassword = true) => {
    if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
    }

    reconnectAttempts = 0;
    await stopKeepAlive();

    if (isSocketOpen()) {
        socket.send(JSON.stringify({type: "disconnect"}));
    }

    closeSocket();

    const keysToRemove = [
        STORAGE_KEYS.connected,
        STORAGE_KEYS.clientKey,
        STORAGE_KEYS.connectedAt,
    ];

    if (clearPassword) {
        keysToRemove.push(STORAGE_KEYS.password);
    }

    await storageRemove(keysToRemove);
    await storageSet({[STORAGE_KEYS.connected]: false});

    const status = await getStatus();
    broadcastUpdate(status);
    return status;
};

const maintainConnection = async () => {
    const data = await storageGet([STORAGE_KEYS.connected, STORAGE_KEYS.password]);

    if (!data[STORAGE_KEYS.connected] || !data[STORAGE_KEYS.password]) {
        await stopKeepAlive();
        return;
    }

    if (isSocketOpen()) {
        sendPing();
        return;
    }

    if (reconnectTimer) {
        return;
    }

    reconnectAttempts = 0;
    await connect(data[STORAGE_KEYS.password], {awaitConnected: false});
};

const registerAlarmListener = () => {
    if (alarmListenerRegistered) {
        return;
    }

    alarmListenerRegistered = true;
    chrome.alarms.onAlarm.addListener((alarm) => {
        if (alarm.name === ALARM_NAME) {
            maintainConnection().catch(() => {});
        }
    });
};

const resumeConnection = async () => {
    if (!(await hasRequiredPermissions())) {
        return;
    }

    const data = await storageGet([STORAGE_KEYS.connected, STORAGE_KEYS.password]);
    if (data[STORAGE_KEYS.connected] && data[STORAGE_KEYS.password]) {
        await startKeepAlive();
        await maintainConnection();
    }
};

const init = async () => {
    registerAlarmListener();
    await resumeConnection();
};

export const n8nService = {
    init,
    connect,
    disconnect,
    clearHistory,
    getStatus,
    maintainConnection,
    resumeConnection,
    hasRequiredPermissions,
};
