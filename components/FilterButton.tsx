"use client"
import React, { useEffect, useState } from 'react'
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";

const FilterButton = () => {

    const [isOpen, setIsOpen] = useState(false)
    
    return (
        <div>
            <button className="flex flex-row rounded-md p-3 px-4 items-center ml-3 shadow border h-fit" onClick={() => setIsOpen(!isOpen)}>
                <HiOutlineAdjustmentsHorizontal size={24} />
            <span className="ml-2 font-medium">Filter</span>
            </button>

            <div className={`bg-blue-300 absolute h-fit w-full left-0 transition-all ${isOpen ? ("bottom-0") : ("top-3/4")}`}>
                he
            </div>
        </div>
    )
}

export default FilterButton