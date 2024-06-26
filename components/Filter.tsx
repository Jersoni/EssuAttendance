"use client"
import React, { useRef, useState } from 'react'
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import { GoPlus } from "react-icons/go";
import { Button } from '@/components';

const Filter = () => {

    const [isOpen, setIsOpen] = useState(false)

    const handleClick = () => {
        setIsOpen(!isOpen)
    };

    return (
        <div>
            <button className="flex flex-row rounded-md p-2 items-center ml-3 shadow border h-fit" onClick={handleClick}>
                <HiOutlineAdjustmentsHorizontal size={24} />
            </button>
            

            {/* Filter */}
            <div>
                <div className={`bg-gray-200 absolute h-[95vh] w-full left-0 transition-all ${isOpen ? "top-[5vh]" : "translate-y-full" } z-[60] rounded-t-[30px] flex flex-col justify-between`}>
                    <div className='p-5'>
                        <h2 className='text-xl font-semibold text-center'>Filter</h2>
                        <div className='flex flex-col '>
                            <div className='filter__card !mt-6'>
                                <span>Course</span>
                                <GoPlus size={20} className='opacity-80'/>
                            </div>
                            <div className='filter__card'>
                                <span>Year</span>
                                <GoPlus size={20} className='opacity-80'/>
                            </div>
                            <div className='filter__card'>
                                <span>Section</span>
                                <GoPlus size={20} className='opacity-80'/>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-row gap-3 left-0 w-full border h-24 bg-gray-500 items-center p-5'>
                        <Button variant='secondary'>Reset</Button>
                        <Button variant='primary' onClick={handleClick}>Apply</Button>
                    </div>
                </div>
                <div className={`bg-black bg-opacity-40 h-full w-full absolute top-0 left-0 z-50 transition-all ${isOpen ? "block" : "hidden"}`}></div>
            </div>


        </div>
    )
}

export default Filter