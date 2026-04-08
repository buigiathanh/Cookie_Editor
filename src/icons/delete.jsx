const IconDelete = ({cname}) => {
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
                d="M5.05063 8.73418C4.20573 7.60763 5.00954 6 6.41772 6H17.5823C18.9905 6 19.7943 7.60763 18.9494 8.73418V8.73418C18.3331 9.55584 18 10.5552 18 11.5823V18C18 20.2091 16.2091 22 14 22H10C7.79086 22 6 20.2091 6 18V11.5823C6 10.5552 5.66688 9.55584 5.05063 8.73418V8.73418Z"
                stroke="currentColor"
                strokeWidth="1.5"
            />
            <path
                d="M14 17L14 11"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M10 17L10 11"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M16 6L15.4558 4.36754C15.1836 3.55086 14.4193 3 13.5585 3H10.4415C9.58066 3 8.81638 3.55086 8.54415 4.36754L8 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
        </svg>
    )
}

export default IconDelete