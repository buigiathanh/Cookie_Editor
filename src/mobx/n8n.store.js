/*global chrome*/
import {makeAutoObservable, runInAction} from "mobx";
import {checkN8nPermissions, requestN8nPermissions} from "../utils/n8n_permissions";

class N8nStore {
    connected = false;
    clientKey = "";
    connectedAt = null;
    hasPassword = false;
    history = [];
    loading = false;
    showConnectForm = false;
    password = "";
    hasPermissions = false;
    showPermissionPopup = false;
    alert = {type: "", message: ""};
    pendingConnectAfterPermission = false;
    showConnectPopup = false;
    showStatusPanel = false;

    constructor() {
        makeAutoObservable(this);
    }

    setAlert(type, message) {
        this.alert = {type, message};
    }

    clearAlert() {
        this.alert = {type: "", message: ""};
    }

    openPermissionPopup() {
        this.showPermissionPopup = true;
    }

    closePermissionPopup(clearPending = true) {
        this.showPermissionPopup = false;
        if (clearPending) {
            this.pendingConnectAfterPermission = false;
        }
    }

    requestConnectFlow() {
        this.pendingConnectAfterPermission = true;
        this.openPermissionPopup();
    }

    completeConnectFlowAfterPermission() {
        if (this.pendingConnectAfterPermission) {
            this.pendingConnectAfterPermission = false;
            this.openConnectPopup();
        }
    }

    openConnectPopup() {
        this.showConnectPopup = true;
        this.showConnectForm = true;
    }

    closeConnectPopup() {
        this.showConnectPopup = false;
        this.showConnectForm = false;
        this.password = "";
    }

    toggleStatusPanel() {
        this.showStatusPanel = !this.showStatusPanel;
    }

    closeStatusPanel() {
        this.showStatusPanel = false;
    }

    syncStatus(data) {
        runInAction(() => {
            this.connected = data.connected;
            this.clientKey = data.clientKey;
            this.connectedAt = data.connectedAt;
            this.hasPassword = data.hasPassword;
            this.history = data.history || [];
        });
    }

    syncHistory(history) {
        runInAction(() => {
            this.history = history || [];
        });
    }

    get historyCount() {
        return this.history.length;
    }

    async checkPermissions() {
        const granted = await checkN8nPermissions();
        runInAction(() => {
            this.hasPermissions = granted;
        });
        return granted;
    }

    async requestPermissions() {
        const granted = await requestN8nPermissions();
        runInAction(() => {
            this.hasPermissions = granted;
        });
        return granted;
    }

    async onPermissionsGranted() {
        await chrome.runtime.sendMessage({action: "n8n_init"});
        await this.fetchStatus();
    }

    async ensurePermissions() {
        const granted = await this.checkPermissions();
        if (!granted) {
            return false;
        }
        return true;
    }

    async fetchStatus() {
        const response = await chrome.runtime.sendMessage({action: "n8n_get_status"});
        if (response?.data) {
            this.syncStatus(response.data);
        }
    }

    async connect() {
        if (!this.password.trim()) {
            return {success: false, message: "Password is required"};
        }

        const hasPermission = await this.ensurePermissions();
        if (!hasPermission) {
            return {success: false, message: "missing_permissions", needPermission: true};
        }

        this.loading = true;
        try {
            const response = await chrome.runtime.sendMessage({
                action: "n8n_connect",
                password: this.password,
            });

            if (response?.success) {
                this.syncStatus(response.data);
                this.closeConnectPopup();
                this.closeStatusPanel();
                return {success: true};
            }

            return {success: false, message: response?.message || "Connection failed"};
        } catch (error) {
            return {success: false, message: error.message || "Connection failed"};
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    async disconnect() {
        this.loading = true;
        try {
            const response = await chrome.runtime.sendMessage({action: "n8n_disconnect"});
            if (response?.data) {
                this.syncStatus(response.data);
            }
            this.showConnectForm = false;
            this.password = "";
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    async clearHistory() {
        const response = await chrome.runtime.sendMessage({action: "n8n_clear_history"});
        if (response?.data) {
            this.syncStatus(response.data);
        }
        return response?.success ?? false;
    }
}

export const n8nStore = new N8nStore();
