export default function Loading() {
    // You can add any UI inside Loading, including a Skeleton.
    return (
        <div className="grid place-items-center min-h-[100vh]">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-[3px] border-solid opacity-70 border-current border-e-transparent align-[-0.125em] text-success motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
            </div>
        </div>
    )
}