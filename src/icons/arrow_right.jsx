const ArrowRightIcon = ({cname, strokeWidth = "1"}) => {
    return (
        <svg
            className={cname}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
        >
            <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={strokeWidth}
                d="M1 5h12m0 0L9 1m4 4L9 9"
            />
        </svg>
    )
}

export default ArrowRightIcon