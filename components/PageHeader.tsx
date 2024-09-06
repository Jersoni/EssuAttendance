'use client'
import { useRouter } from 'next/navigation';
import { IoChevronBack } from "react-icons/io5";
import { headerProps } from '@/types';

// PageHeader Component
const PageHeader: React.FC<headerProps> = ({title, subtitle, children}) => {

    const router = useRouter()

    return (
        <div className="w-full h-14 bg-white border-b border-gray-200 z-50 pl-1 pr-5 flex fixed ">
            <div className="flex flex-row items-center">
                {/* return button */}
                <button type="button" className="z-30 grid place-items-center h-12 min-w-12 rounded-full active:bg-gray-200" onClick={() => {router.back()}}>
                    <IoChevronBack size={24} />
                </button>

                {/* header title */}
                {title ? (
                    <div className={`w-full text-md ml-3 font-semibold flex flex-col`}> 
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


