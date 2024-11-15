'use client'
import { useRouter } from 'next/navigation';
import { IoChevronBack } from "react-icons/io5";
import { headerProps } from '@/types';

// PageHeader Component
const PageHeader: React.FC<headerProps> = ({title, subtitle, children, returnPath = null, className}) => {

    const router = useRouter()

    return (
        <div className={`w-full h-14 bg-white border-b border-gray-200 pl-1 pr-5 flex !z-[1200] ${className} `}>
            <div className="flex flex-row items-center">
                {/* return button */}
                <button 
                    type="button" 
                    className="z-30 grid place-items-center h-12 min-w-12 rounded-full active:bg-gray-200" 
                    onClick={() => {
                        returnPath
                        ? router.push(returnPath)
                        : router.back()
                    }}
                >
                    <IoChevronBack size={24} className='text-emerald-800 ' />
                </button>

                {/* header title */}
                {title ? (
                    <div className={`w-full text-md font-bold flex flex-col text-emerald-700`}> 
                        <span>{title}</span>
                        <span className='text-xs font-medium text-gray-400'>{subtitle}</span> 
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


