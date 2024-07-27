import { PageHeader, Button } from '@/components'
import { GoArrowUpRight } from "react-icons/go";
import { RiEdit2Line } from "react-icons/ri";
import { BiEraser } from "react-icons/bi";
import { FiPlus } from "react-icons/fi";

const Student = () => {
  return (
    <div className='h-[100vh] bg-gray-100'>

        <PageHeader title="Student Profile" />
        <div className="max-h-[100vh] overflow-y-auto pb-40 px-5">
            <div className='flex mt-7 items-center justify-between'>
                <h2 className='text-sm font-semibold text-[#414855]'>PROFILE</h2>
                <RiEdit2Line size={24} className='fill-gray-700'/>
            </div>
            <div className='flex flex-col gap-1 mt-3 h-fit p-5 pr-7 w-full bg-white rounded-lg text-sm'>
                <div className='flex flex-row gap-4'>
                    <p className='min-w-14 text-gray-500'>Name</p>
                    <span>Ranido, Christian Rhey D.</span>
                </div>
                <div className='flex flex-row gap-4'>
                    <p className='min-w-14 text-gray-500'>ID No</p>
                    <span>22-0245</span>
                </div>
                <div className='flex flex-row gap-4'>
                    <p className='min-w-14 text-gray-500'>Class</p>
                    <span>BSIT 2A</span>
                </div>
            </div>
            <div className='flex mt-7 items-center justify-between'>
                <h2 className='text-sm font-semibold text-[#414855]'>ACCUMULATED FINES</h2>
                <BiEraser size={24} className='fill-gray-700'/>
            </div>
            <div className='mt-3 h-fit p-5 w-full bg-white rounded-lg flex flex-col text-sm'>
                <div className='flex flex-col gap-2'>
                    <div className='flex items-center'>
                        <p className='flex flex-row items-center gap-1 max-w-[70%]'>
                            <span className='w-fit whitespace-nowrap overflow-hidden text-ellipsis'>Christmas Party</span>
                            <GoArrowUpRight className='min-w-fit' size={16}/> 
                        </p>
                        <p className='text-gray-500 ml-auto min-w-fit'>₱ 25.00</p>
                    </div>
                    <div className='flex items-center'>
                        <p className='flex flex-row items-center gap-1 max-w-[70%]'>
                            Intramurals - Morning 
                            <GoArrowUpRight className='min-w-fit' size={16}/> 
                        </p>
                        <p className='text-gray-500 ml-auto min-w-fit'>₱ 25.00</p>
                    </div>
                    <div className='flex items-center'>
                        <p className='flex flex-row items-center gap-1 max-w-[70%]'>
                            Victory Ball 
                            <GoArrowUpRight className='min-w-fit' size={16}/> 
                        </p>
                        <p className='text-gray-500 ml-auto min-w-fit'>₱ 25.00</p>
                    </div>
                </div>
                <div className='flex pt-5 mt-10 border-t border-gray-300 justify-between'>
                    <p className='text-sm text-gray-500'>TOTAL</p>
                    <p className='text-gray-500'>₱ 75.00</p>
                </div>
            </div>
            <div className='flex flex-col items-end mt-5 gap-2'>
                <Button variant='secondary' >Download QR Code</Button>
                <Button variant='secondary' >Delete Student Data</Button>
            </div>
        </div>
    </div>
  )
}

export default Student