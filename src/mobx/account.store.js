/*global chrome*/
import { makeAutoObservable } from 'mobx';
import {settingStore} from "./setting.store";

class AccountStore {
    constructor() {
        makeAutoObservable(this);
    }

    account = {};

    async getAccount() {
        const response = await fetch(`${process.env.REACT_APP_WEBSITE}/auth/info`, {
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        });

        const dataResponse = await response.json();
        if (dataResponse.data.user) {
            this.account = dataResponse.data.user;
            settingStore.show_ads = dataResponse.data.user.account_type === 1;
        } else {
            settingStore.show_ads = true;
        }
    }

    async logout() {
        await fetch(`${process.env.REACT_APP_WEBSITE}/logout`, {
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
        });

        this.account = {};
        settingStore.popup = "";
    }

}

export const accountStore = new AccountStore();
