'use client'
import { useRouter } from 'next/navigation';
import { IoChevronBack } from "react-icons/io5";
import { Suspense } from 'react';

// props for customizing the header properties
interface headerProps {
    title?: string ; // header title
}

// PageHeader Component
const PageHeader: React.FC<headerProps> = ({title}) => {

    const router = useRouter()
    const themeColorGreen: string = "#045511"

    return (
        <div className="w-full bg-white z-50 p-2 pl-1">
            <div className="flex flex-row items-center">

                {/* return button */}
                <button type="button" className="z-30 grid place-items-center h-12 min-w-12 rounded-full active:bg-gray-200" onClick={() => {router.back()}}>
                    <IoChevronBack size={24} color={themeColorGreen} />
                </button>

                {/* header title */}
                {title ? (
                    <span className={`text-[#045511] left-0 w-full text-lg font-semibold absolute text-center `}>{title}</span>
                ) : (
                    <div className='h-6 w-40 bg-gray-200 rounded-lg animate-pulse'></div>
                )}
                
            </div>
        </div>
    )
}

export default PageHeader