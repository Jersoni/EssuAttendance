'use client'
import { useRouter } from 'next/navigation';
import { IoChevronBack } from "react-icons/io5";
import { Suspense } from 'react';

// props for customizing the header properties
interface headerProps {
    title?: string; // header title
    subtitle?: string // text under title
    children?: React.ReactNode;
}

// PageHeader Component
const PageHeader: React.FC<headerProps> = ({title, subtitle, children}) => {

    const router = useRouter()
    const themeColorGreen: string = "#065f46"

    return (
        <div className="w-full bg-white z-50 p-3 pl-1 pr-5">
            <div className="flex flex-row items-center">
                {/* return button */}
                <button type="button" className="z-30 grid place-items-center h-12 min-w-12 rounded-full active:bg-gray-200" onClick={() => {router.back()}}>
                    <IoChevronBack size={24} color={themeColorGreen} />
                </button>

                {/* header title */}
                {title ? (
                    <div className={`text-emerald-800 left-0 w-full text-lg font-semibold absolute text-center flex flex-col `}>
                        <span>{title}</span>
                        <span className='text-sm font-normal'>{subtitle}</span> 
                    </div>
                ) : (
                    <div className='h-6 w-40 bg-gray-200 rounded-lg animate-pulse'></div>
                )}

                {children}
                
            </div>
        </div>
    )
}

export default PageHeader