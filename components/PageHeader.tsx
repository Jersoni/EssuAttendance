'use client'
import React from 'react'
import { useRouter } from 'next/navigation';
import { IoChevronBack } from "react-icons/io5";

// props for customizing the header properties
interface headerProps {
    title?: string; // header title
    returnPath?: string; // onClick path or route (ex. /about)
}

// PageHeader Component
const PageHeader: React.FC<headerProps> = ({title, returnPath}) => {

    const router = useRouter()
    const themeColorGreen: string = "#006C11"

    return (
        <div className=" absolute w-full bg-white z-50 p-3 pl-2">
            <div className="flex flex-row items-center">

                {/* return button */}
                <button type="button" className="z-30 grid place-items-center h-12 w-12 mr-2 rounded-full active:bg-gray-300" onClick={() => {router.push(`${returnPath}`)}}>
                    <IoChevronBack size={24} color={themeColorGreen} />
                </button>

                {/* header title */}
                <span className={`text-[#006C11] left-0 w-full text-xl font-extrabold`}>{title}</span>
                
            </div>
        </div>
    )
}

export default PageHeader