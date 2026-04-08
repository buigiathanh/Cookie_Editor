const WebsiteInfo = ({favicon, tab}) => {
    return (
        <>
            {
                tab !== undefined && (
                    <div className="w-full bg-[#3C3C3C] flex items-center rounded-[10px] p-4 mb-[10px]">
                        <div className={`w-[50px] inline-block bg-white rounded-[10px]`}>
                            <img
                                src={favicon}
                                alt={tab.url}
                                className={`w-8 h-8 mx-auto my-[9px]`}
                            />
                        </div>
                        <div className={`inline-block pl-5`} style={{width: "calc(100% - 50px)"}}>
                            <p className={`text-white text-12px font-bold truncate`}>{tab.title}</p>
                            <p className={`text-white text-12px truncate`}>{tab.url}</p>
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default WebsiteInfo