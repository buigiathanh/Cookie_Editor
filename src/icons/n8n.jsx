const IconN8n = ({cname = ""}) => {
    return (
        <svg
            className={cname}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M4 7.5C4 6.11929 5.11929 5 6.5 5H17.5C18.8807 5 20 6.11929 20 7.5V16.5C20 17.8807 18.8807 19 17.5 19H6.5C5.11929 19 4 17.8807 4 16.5V7.5Z"
                stroke="currentColor"
                strokeWidth="1.5"
            />
            <path
                d="M8 9.5H16M8 12.5H13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
            <circle cx="17" cy="12.5" r="1.5" fill="currentColor"/>
            <path
                d="M4 10L2 12L4 14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M20 10L22 12L20 14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default IconN8n;
