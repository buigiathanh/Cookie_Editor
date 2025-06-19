/*global chrome*/
import { makeAutoObservable } from 'mobx';
import {settingStore} from "./setting.store";

class CookieStore {
    constructor() {
        makeAutoObservable(this);
    }

    links = [];
    cookie_detail = {};
    has_next = false;

    async getLinks(page) {
        settingStore.loading = true;
        const response = await fetch(`${process.env.REACT_APP_WEBSITE}/api/cookie/list?page=${page}`, {
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
        });
        settingStore.loading = false;
        if (response.ok) {
            const dataResponse = await response.json();
            this.links = dataResponse.data.cookies;
            this.has_next = dataResponse.data.cookies.length === 100;
        }
    }

    async restoreLinks() {
        this.links = [];
        await this.getLinks(1)
    }

}

export const cookieStore = new CookieStore();
