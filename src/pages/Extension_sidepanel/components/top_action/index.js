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
                            <>
                                <div
                                    onClick={() => {
                                        confirmDialog.includes("copy") ? (settingStore.popup = "copy_cookie") : copyCookie(cookies)
                                    }}
                                    data-tooltip-target="tooltip-copy"
                                    data-tooltip-placement="bottom"
                                    className={`h-[30px] w-[30px] bg-[#3C3C3C] me-2 mb-2 last:mb-0 text-white rounded flex items-center cursor-pointer group hover:bg-white hover:text-gray-800`}>
                                    <IconCopy cname={`w-5 h-5 mx-auto my-[5px]`} />
                                </div>

                                <div
                                    id="tooltip-copy"
                                    role="tooltip"
                                    className="absolute z-10 invisible inline-block px-3 py-2 text-xs font-medium text-white bg-gray-900 rounded-lg shadow-xs opacity-0 tooltip">
                                    {extension.getLang("btn_copy")}
                                    <div className="tooltip-arrow" data-popper-arrow></div>
                                </div>
                            </>

                            <>
                                <div
                                    onClick={() => settingStore.popup = "export_cookie"}
                                    data-tooltip-target="tooltip-export"
                                    data-tooltip-placement="bottom"
                                    className={`h-[30px] w-[30px] bg-[#3C3C3C] me-2 mb-2 last:mb-0 text-white rounded flex items-center cursor-pointer group hover:bg-white hover:text-gray-800`}>
                                    <IconExport cname={"w-5 h-5 mx-auto my-[5px]"} />
                                </div>

                                <div
                                    id="tooltip-export"
                                    role="tooltip"
                                    className="absolute z-10 invisible inline-block px-3 py-2 text-xs font-medium text-white bg-gray-900 rounded-lg shadow-xs opacity-0 tooltip">
                                    {extension.getLang("sidebar_export")}
                                    <div className="tooltip-arrow" data-popper-arrow></div>
                                </div>
                            </>
                        </>
                    )
                }

                {
                    tab?.url.startsWith("http") && (
                        <>
                            <div
                                onClick={() => settingStore.popup = "import_cookie"}
                                data-tooltip-target="tooltip-import"
                                data-tooltip-placement="bottom"
                                className={`h-[30px] w-[30px] bg-[#3C3C3C] me-2 mb-2 last:mb-0 text-white rounded flex items-center cursor-pointer group hover:bg-white hover:text-gray-800`}>
                                <IconImport cname={"w-5 h-5 mx-auto my-[5px]"} />
                            </div>

                            <div
                                id="tooltip-import"
                                role="tooltip"
                                className="absolute z-10 invisible inline-block px-3 py-2 text-xs font-medium text-white bg-gray-900 rounded-lg shadow-xs opacity-0 tooltip">
                                {extension.getLang("sidebar_import")}
                                <div className="tooltip-arrow" data-popper-arrow></div>
                            </div>
                        </>
                    )
                }

                {
                    cookies.length > 0 && (
                        <>
                            <div
                                onClick={() =>  settingStore.popup = (accountStore.account?.email ? "share_cookie" : "remind_login")}
                                data-tooltip-target="tooltip-share"
                                data-tooltip-placement="bottom"
                                className={`h-[30px] w-[30px] bg-[#3C3C3C] me-2 mb-2 last:mb-0 text-white rounded flex items-center cursor-pointer group hover:bg-white hover:text-gray-800`}>
                                <IconShare cname={`w-5 h-5 mx-auto my-[5px]`} />
                            </div>

                            <div
                                id="tooltip-share"
                                role="tooltip"
                                className="absolute z-10 invisible inline-block px-3 py-2 text-xs font-medium text-white bg-gray-900 rounded-lg shadow-xs opacity-0 tooltip">
                                {extension.getLang("tooltip_top_action_share")}
                                <div className="tooltip-arrow" data-popper-arrow></div>
                            </div>
                        </>
                    )
                }


                {
                    tab?.url.startsWith("http") && (
                        <>
                            <div
                                onClick={() => settingStore.popup = "add_cookie"}
                                data-tooltip-target="tooltip-add"
                                data-tooltip-placement="bottom"
                                className={`h-[30px] w-[30px] bg-[#3C3C3C] me-2 mb-2 last:mb-0 text-white rounded flex items-center cursor-pointer group hover:bg-white hover:text-gray-800`}>
                                <IconAdd cname={`w-5 h-5 mx-auto my-[5px]`} />
                            </div>

                            <div
                                id="tooltip-add"
                                role="tooltip"
                                className="absolute z-10 invisible inline-block px-3 py-2 text-xs font-medium text-white bg-gray-900 rounded-lg shadow-xs opacity-0 tooltip">
                                {extension.getLang("btn_add")}
                                <div className="tooltip-arrow" data-popper-arrow></div>
                            </div>
                        </>
                    )
                }

                {
                    cookies.length > 0 && (
                        <>
                            <div
                                onClick={() => {
                                    confirmDialog.includes("delete_all") ? (settingStore.popup = "delete_all_cookie") : clearCookie(cookies)
                                }}
                                data-tooltip-target="tooltip-delete"
                                data-tooltip-placement="bottom"
                                className={`h-[30px] w-[30px] bg-[#3C3C3C] me-2 mb-2 last:mb-0 text-white rounded flex items-center cursor-pointer group hover:bg-white hover:text-gray-800`}>
                                <IconDelete cname={`w-5 h-5 mx-auto my-[5px]`} />
                            </div>

                            <div
                                id="tooltip-delete"
                                role="tooltip"
                                className="absolute z-10 invisible inline-block px-3 py-2 text-xs font-medium text-white bg-gray-900 rounded-lg shadow-xs opacity-0 tooltip">
                                {extension.getLang("btn_remove")}
                                <div className="tooltip-arrow" data-popper-arrow></div>
                            </div>
                        </>
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