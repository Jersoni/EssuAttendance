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

        </div>
    )
}

export default FilterButton