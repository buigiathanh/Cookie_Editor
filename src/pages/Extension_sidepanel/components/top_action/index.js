import {useEffect, useState} from "react";
import CopyCookie from "../popup/copy_cookie";
import ClearCookie from "../popup/clear_cookie";
import ShareCookie from "../popup/share_cookie";
import AddCookie from "../popup/add_cookie";
import {extension} from "../../../../utils/chrome";
import ExportCookie from "../popup/export_cookie";
import ImportCookie from "../popup/import_cookie";
import {clearCookie, copyCookie} from "../../../../utils/cookie";
import {settingStore} from "../../../../mobx/setting.store";
import {observer} from "mobx-react-lite";
import IconCopy from "../../../../icons/copy";
import IconExport from "../../../../icons/export";
import IconImport from "../../../../icons/import";
import IconShare from "../../../../icons/share";
import IconAdd from "../../../../icons/add";
import IconDelete from "../../../../icons/delete";
import {accountStore} from "../../../../mobx/account.store";

const TopAction = ({cookies, tab}) => {
    const confirmDialog = settingStore.confirm_dialog;

    return (
        <>
            <div className={`w-full flex flex-wrap justify-right mb-[5px]`}>
                {
                    cookies.length > 0 && (
                        <>
                            <div className={`relative group`}>
                                <div
                                    onClick={() => {
                                        confirmDialog.includes("copy") ? (settingStore.popup = "copy_cookie") : copyCookie(cookies)
                                    }}
                                    className={`h-[30px] w-[30px] bg-[#3C3C3C] me-2 mb-2 last:mb-0 text-white rounded flex items-center cursor-pointer group hover:bg-white hover:text-gray-800`}>
                                    <IconCopy cname={`w-5 h-5 mx-auto my-[5px]`} />
                                </div>

                                <div
                                    className="absolute top-[35px] left-1/2 translate-x-[-50%] z-10 hidden group-hover:block px-3 py-2 text-xs text-white bg-gray-900 rounded-lg shadow-xs">
                                    {extension.getLang("btn_copy")}
                                </div>
                            </div>

                            <div className={`relative group`}>
                                <div
                                    onClick={() => settingStore.popup = "export_cookie"}
                                    className={`h-[30px] w-[30px] bg-[#3C3C3C] me-2 mb-2 last:mb-0 text-white rounded flex items-center cursor-pointer group hover:bg-white hover:text-gray-800`}>
                                    <IconExport cname={"w-5 h-5 mx-auto my-[5px]"} />
                                </div>

                                <div
                                    className="absolute top-[35px] left-1/2 translate-x-[-50%] z-10 hidden group-hover:block px-3 py-2 text-xs text-white bg-gray-900 rounded-lg shadow-xs">
                                    {extension.getLang("sidebar_export")}
                                </div>
                            </div>
                        </>
                    )
                }

                {
                    tab?.url.startsWith("http") && (
                        <div className={`relative group`}>
                            <div
                                onClick={() => settingStore.popup = "import_cookie"}
                                className={`h-[30px] w-[30px] bg-[#3C3C3C] me-2 mb-2 last:mb-0 text-white rounded flex items-center cursor-pointer group hover:bg-white hover:text-gray-800`}>
                                <IconImport cname={"w-5 h-5 mx-auto my-[5px]"} />
                            </div>

                            <div
                                className="absolute top-[35px] left-1/2 translate-x-[-50%] z-10 hidden group-hover:block px-3 py-2 text-xs text-white bg-gray-900 rounded-lg shadow-xs">
                                {extension.getLang("sidebar_import")}
                            </div>
                        </div>
                    )
                }

                {
                    cookies.length > 0 && (
                        <div className={`relative group`}>
                            <div
                                onClick={() =>  settingStore.popup = (accountStore.account?.email ? "share_cookie" : "remind_login")}
                                className={`h-[30px] w-[30px] bg-[#3C3C3C] me-2 mb-2 last:mb-0 text-white rounded flex items-center cursor-pointer group hover:bg-white hover:text-gray-800`}>
                                <IconShare cname={`w-5 h-5 mx-auto my-[5px]`} />
                            </div>

                            <div
                                className="absolute top-[35px] left-1/2 translate-x-[-50%] z-10 hidden group-hover:block px-3 py-2 text-xs text-white bg-gray-900 rounded-lg shadow-xs">
                                {extension.getLang("tooltip_top_action_share")}
                            </div>
                        </div>
                    )
                }


                {
                    tab?.url.startsWith("http") && (
                        <div className={`relative group`}>
                            <div
                                onClick={() => settingStore.popup = "add_cookie"}
                                className={`h-[30px] w-[30px] bg-[#3C3C3C] me-2 mb-2 last:mb-0 text-white rounded flex items-center cursor-pointer group hover:bg-white hover:text-gray-800`}>
                                <IconAdd cname={`w-5 h-5 mx-auto my-[5px]`} />
                            </div>

                            <div
                                className="absolute top-[35px] left-1/2 translate-x-[-50%] z-10 hidden group-hover:block px-3 py-2 text-xs text-white bg-gray-900 rounded-lg shadow-xs">
                                {extension.getLang("btn_add")}
                            </div>
                        </div>
                    )
                }

                {
                    cookies.length > 0 && (
                        <div className={`relative group`}>
                            <div
                                onClick={() => {
                                    confirmDialog.includes("delete_all") ? (settingStore.popup = "delete_all_cookie") : clearCookie(cookies)
                                }}
                                className={`h-[30px] w-[30px] bg-[#3C3C3C] me-2 mb-2 last:mb-0 text-white rounded flex items-center cursor-pointer group hover:bg-white hover:text-gray-800`}>
                                <IconDelete cname={`w-5 h-5 mx-auto my-[5px]`} />
                            </div>

                            <div
                                className="absolute top-[35px] left-1/2 translate-x-[-50%] z-10 hidden group-hover:block px-3 py-2 text-xs text-white bg-gray-900 rounded-lg shadow-xs whitespace-nowrap">
                                {extension.getLang("btn_remove")}
                            </div>
                        </div>
                    )
                }
            </div>

            <CopyCookie cookies={cookies}/>

            <ClearCookie cookies={cookies}/>

            <ShareCookie cookies={cookies}/>

            <AddCookie />

            <ImportCookie />

            <ExportCookie />
        </>
    )
}

export default observer(TopAction)