/*global chrome*/
import { makeAutoObservable } from 'mobx';

class SettingStore {
    constructor() {
        makeAutoObservable(this);
    }

    show_ads = false;
    loading = false;
    display_cookie = "default";
    customize_display_cookie = [
        "domain",
        "expirationDate",
        "hostOnly",
        "httpOnly",
        "name",
        "path",
        "sameSite",
        "secure",
        "session",
        "storeId",
        "value"
    ];
    format_copy = "header_string";
    format_export = "header_string";
    format_import = "text";
    option_import = ["reload_page"];
    confirm_dialog = [
        "copy",
        "delete",
        "delete_all"
    ];
    disable_show_popup_buy_coffee = "false";
    day_active = "";
    count_day_active = "0";
    auto_show_popup_feature_suggest = "";
    cookie_select = {};
    tab = "home";
    popup = "";
    alert = {
        type: "",
        message: ""
    }


    setDataSetting() {
        const keys = [
            {
                key: "display_cookie",
                type: "string"
            },
            {
                key: "customize_display_cookie",
                type: "object"
            },
            {
                key: "format_copy",
                type: "string"
            },
            {
                key: "format_export",
                type: "string"
            },
            {
                key: "format_import",
                type: "string"
            },
            {
                key: "option_import",
                type: "object"
            },
            {
                key: "confirm_dialog",
                type: "object"
            },
            {
                key: "disable_show_popup_buy_coffee",
                type: "string"
            },
            {
                key: "day_active",
                type: "string"
            },
            {
                key: "count_day_active",
                type: "string"
            },
            {
                key: "auto_show_popup_feature_suggest",
                type: "string"
            },
        ]

        for (let i = 0; i < keys.length; i++) {
            const item = localStorage.getItem(keys[i].key);
            if (item) {
                settingStore[keys[i].key] = keys[i].type === "string" ? item : JSON.parse(item)
            }
        }
    }

    setDisplayCookie(value) {
        this.display_cookie = value;
        localStorage.setItem("display_cookie", value)
    }

    setCustomDisplayCookie(value) {
        this.customize_display_cookie = value;
        localStorage.setItem("customize_display_cookie", JSON.stringify(value))
    }

    setFormatCopy(value) {
        this.format_copy = value;
        localStorage.setItem("format_copy", value)
    }

    setFormatExport(value) {
        this.format_export = value;
        localStorage.setItem("format_export", value)
    }

    setFormatImport(value) {
        this.format_import = value;
        localStorage.setItem("format_import", value)
    }

    setOptionImport(value) {
        this.option_import = value;
        localStorage.setItem("option_import", JSON.stringify(value))
    }

    setConfirmDialog(value) {
        this.confirm_dialog = value;
        localStorage.setItem("confirm_dialog", JSON.stringify(value))
    }

    setDisableShowPopupBuyCoffee(value) {
        this.disable_show_popup_buy_coffee = value;
        localStorage.setItem("disable_show_popup_buy_coffee", value)
    }

    setDayActive(value) {
        this.day_active = value;
        localStorage.setItem("day_active", value)
    }

    setCountDayActive(value) {
        this.count_day_active = value;
        localStorage.setItem("count_day_active", value)
    }

    setAutoShowPopupFeatureSuggest(value) {
        this.auto_show_popup_feature_suggest = value;
        localStorage.setItem("auto_show_popup_feature_suggest", value)
    }
}

export const settingStore = new SettingStore();
