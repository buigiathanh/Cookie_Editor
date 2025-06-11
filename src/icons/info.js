const IconInfo = ({cname}) => {
    return (
        <svg
            className={cname}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect x="2" y="2" width="20" height="20" rx="10" stroke="white" strokeWidth="1.5"/>
            <path d="M12.5 17L12.5 11" stroke="white" strokeWidth="1.5" strokeLinecap="round"
                  strokeLinejoin="round"/>
            <path d="M10.5 11L12.5 11" stroke="white" strokeWidth="1.5" strokeLinecap="round"
                  strokeLinejoin="round"/>
            <path d="M12.5 8L12.5 7" stroke="white" strokeWidth="1.5" strokeLinecap="round"
                  strokeLinejoin="round"/>
        </svg>
    )
}

export default IconInfo