const IconBuyCoffee = ({cname}) => {
    return (
        <svg
            className={cname}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M6 10H18L17.2292 19.2491C17.0997 20.804 15.7999 22 14.2396 22H9.7604C8.20013 22 6.90033 20.804 6.77076 19.2491L6 10Z"
                stroke="white"
                strokeWidth="1.5"
            />
            <circle
                cx="2"
                cy="2"
                r="2"
                transform="matrix(-1 0 0 1 14 14)"
                stroke="white"
                strokeWidth="1.5"
            />
            <path
                d="M4 8C4 6.89543 4.89543 6 6 6H18C19.1046 6 20 6.89543 20 8V8C20 9.10457 19.1046 10 18 10H6C4.89543 10 4 9.10457 4 8V8Z"
                stroke="white"
                strokeWidth="1.5"
            />
            <path
                d="M6 4C6 2.89543 6.89543 2 8 2H16C17.1046 2 18 2.89543 18 4V5C18 5.55228 17.5523 6 17 6H7C6.44772 6 6 5.55228 6 5V4Z"
                stroke="white"
                strokeWidth="1.5"
            />
        </svg>
    )
}

export default IconBuyCoffee