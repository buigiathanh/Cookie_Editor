/*global chrome*/
import {useEffect, useState} from "react";
import {observer} from "mobx-react-lite";
import {settingStore} from "../../../mobx/setting.store";
import {image} from "../../../utils/images";
import {icons} from "../../../constants/icon";
import {cookieStore} from "../../../mobx/cookie.store";
import IconShare from "../../../icons/share";
import {extension} from "../../../utils/chrome";

const LinkCookies = () => {
    const [page, setPage] = useState(1);

    const handleCopyLink = (uuid) => {
        navigator.clipboard.writeText(`https://cookieeditor.org/cookie/link/${uuid}`)
            .then(() => {
                settingStore.alert = {type: "info", message: extension.getLang("message_copy_link_success")}
            })
            .catch((err) => {
                settingStore.alert = {type: "info", message: extension.getLang("message_copy_link_error")}
            });
    }

    useEffect(() => {
        cookieStore.getLinks(page).then()
    }, [page])


    return (
        <div className={`w-full py-3 px-2`}>
            <p className={`text-white font-bold text-[14px] mb-2`}>
                {`COOKIES YOU'VE SHARED`}
            </p>
            <p className={`text-white text-[12px]`}>List of cookies you've shared as a link.</p>
            <div className={`w-full mt-5`}>
                {
                    cookieStore.links.length > 0 ? (
                        <>
                            {
                                cookieStore.links.map((link, key) => (
                                    <div
                                        key={key}
                                        className="w-full bg-[#3C3C3C] hover:bg-[#676464] flex items-center cursor-pointer relative group rounded-lg p-2 mb-[10px] last:mb-0">
                                        <div className={`w-10 inline-block bg-white rounded-[10px]`}>
                                            <img
                                                src={image.favicon(link.domain)}
                                                alt={link.domain}
                                                className={`w-8 h-8 mx-auto my-1 rounded-[7px]`}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = icons.chrome;
                                                }}
                                            />
                                        </div>
                                        <div
                                            onClick={() => {
                                                settingStore.popup = "detail_cookie";
                                                cookieStore.cookie_detail = {...cookieStore.cookie_detail, ...link};
                                            }}
                                            className={`inline-block pl-3`}
                                            style={{width: "calc(100% - 70px)"}}
                                        >
                                            <p className={`text-white text-12px font-bold truncate`}>
                                                {link.title}
                                            </p>
                                            <p className={`text-white text-12px truncate`}>
                                                {link.domain}
                                            </p>
                                        </div>
                                        <div
                                            className={`w-6 absolute top-1/2 translate-y-[-50%] right-3`}>
                                            <div
                                                onClick={() => handleCopyLink(link.uuid)}
                                                className={`w-6 h-6 p-1 rounded-[5px] cursor-pointer hover:bg-gray-500`}>
                                                <IconShare cname={`w-4 h-4 text-white`}/>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }

                            {
                                cookieStore.has_next && (
                                    <button
                                        onClick={() => setPage(page + 1)}
                                        className={`h-[40px] w-full mt-5 rounded-[10px] bg-blue-500 text-white px-5`}
                                    >
                                        Load more
                                    </button>
                                )
                            }

                            <div id="load-trigger"></div>
                        </>
                    ) : (
                        <div className={`w-full bg-[#3C3C3C] rounded-lg py-[100px] text-center`}>
                            <p className={`text-white text-[16px] mb-2`}>
                                No links
                            </p>
                            <p className={`text-gray-200`}>
                                {`You don't have any cookie links`}
                            </p>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default observer(LinkCookies)