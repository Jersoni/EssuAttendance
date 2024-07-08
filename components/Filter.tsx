"use client"
import React, { useRef, useState } from 'react'
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import { IoIosArrowForward } from "react-icons/io";
import { Button } from '@/components';

interface filterButtonProps {
    className?: string;
}

const Filter: React.FC<filterButtonProps> = ({className}) => {

    const [isOpen, setIsOpen] = useState(false)

    const handleClick = () => {
        setIsOpen(!isOpen)
    };

    return (
        <div>
            <button type={"button"} className={className} onClick={handleClick}>
                <HiOutlineAdjustmentsHorizontal size={24} />
            </button>
            
            
            {/* Filter */}
            <div>
                <div className={`bg-gray-100 absolute h-[550px] bottom-0 w-full left-0 right-0 mx-auto transition-all duration-200 ${isOpen ? "" : "translate-y-full" } z-[60] rounded-t-3xl flex flex-col justify-between`}>
                    <div className='p-5 pb-0'>
                        <h2 className='text-xl font-semibold text-center'>Filter</h2>
                        <Button variant='close' onClick={handleClick} className='absolute right-2 top-2'></Button>
                        <div className='flex flex-col rounded-2xl mt-4 overflow-hidden'>
                            <div className='filter__card'>
                                <span>Course</span>
                                <span className='filter__selected-total'>5</span>
                                <IoIosArrowForward size={15}/>
                            </div>
                            <div className='filter__card'>
                                <span>Year</span>
                                <span className='filter__selected-total'>All</span>
                                <IoIosArrowForward size={15}/>
                            </div>
                            <div className='filter__card'>
                                <span>Section</span>
                                <span className='filter__selected-total'>All</span>
                                <IoIosArrowForward size={15}/>
                            </div>
                        </div>
                        <div className='flex flex-col rounded-2xl mt-2 overflow-hidden bg-white h-fit w-full p-4'>
                            <div className='flex-col items-start h-fit'>
                                <span>Sort by</span>
                                <div className='mt-2 pl-1'>
                                    <div className='flex gap-3'>
                                        <input type="radio" name="sort" id="id"  />
                                        <label htmlFor="id" className='opacity-90'>Student ID</label>
                                    </div>
                                    <div className='flex gap-3'>
                                        <input type="radio" name="sort" id="surname" />
                                        <label htmlFor="surname" className='opacity-90'>Surname</label>
                                    </div>
                                </div>
                            </div>
                            <div className='flex-col items-start h-fit mt-4'>
                                <span>Order</span>
                                <div className='mt-2 pl-1'>
                                    <div className='flex gap-3'>
                                        <input type="radio" name="order" id="asc" />
                                        <label htmlFor="asc" className='opacity-90'>Ascending</label>
                                    </div>
                                    <div className='flex gap-3'>
                                        <input type="radio" name="order" id="desc" />
                                        <label htmlFor="desc" className='opacity-90'>Descending</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-row gap-3 left-0 w-full items-center p-5 pb-16'>
                        <Button variant='secondary'>Clear all</Button>
                        <Button variant='primary' onClick={handleClick}>Apply</Button>
                    </div>
                </div>
                <div onClick={handleClick} className={`bg-black bg-opacity-40 h-full w-full absolute top-0 left-0 z-50 transition-all ${isOpen ? "block" : "hidden"}`}></div>
            </div>


        </div>
    )
}

export default Filter