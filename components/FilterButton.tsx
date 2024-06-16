"use client"
import React, { useEffect, useRef, useState } from 'react'
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";

const FilterButton = () => {

    const [isOpen, setIsOpen] = useState(false)

    return (
        <div>
            <button className="flex flex-row rounded-md p-3 px-4 items-center ml-3 shadow border h-fit" onClick={() => setIsOpen(!isOpen)}>
                <HiOutlineAdjustmentsHorizontal size={24} />
            <span className="ml-2 font-medium">Filter</span>
            </button>

            <dialog open={isOpen} className={`bg-blue-300 absolute h-[90vh] w-full left-0 transition-all top-full ${isOpen ? ("translate-y-[-90vh]") : ("")}`}>
                <button onClick={() => {setIsOpen(!isOpen)}}>Close</button>
            </dialog>

            {/* backdrop */}
            <div></div>
        </div>
    )
}

export default FilterButton