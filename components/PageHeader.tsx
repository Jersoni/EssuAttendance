'use client'
import { useRouter } from 'next/navigation';
import { IoChevronBack } from "react-icons/io5";
import { headerProps } from '@/types';

// PageHeader Component
const PageHeader: React.FC<headerProps> = ({title, subtitle, children, returnPath = null, className, buttonClassName}) => {

    const router = useRouter()

    return (
        <div className={`w-full h-14 bg-white border-b border-gray-200 pl-1 pr-5 flex !z-[1200] ${className} `}>
            <div className="flex flex-row items-center gap-2" >
                {/* return button */}
                <button 
                    type="button" 
                    className={`z-30 grid place-items-center h-12 min-w-12 rounded-full active:bg-gray-200 text-emerald-700 ${buttonClassName}`}
                    onClick={() => {
                        returnPath
                        ? router.push(returnPath)
                        : router.back()
                    }}
                >
                    <IoChevronBack size={20}/>
                </button>

                {/* header title */}
                {title ? (
                    <div className={`w-56 text-md font-bold flex flex-col text-emerald-600`}> 
                        <div className=' text-nowrap overflow-hidden text-ellipsis'>{title}</div>
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


