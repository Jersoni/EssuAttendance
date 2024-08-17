'use client'
import React from 'react'
import { RiSearchLine } from "react-icons/ri"
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import { Filter } from "@/components"

// used to be able to add className for SearchBar
interface searchBarProps {
    className?: string;
}

// SearchBar component
const SearchBar: React.FC<searchBarProps> = ({className}) => {
  return (
    <div className={`${className} flex flex-row items-center gap-3`}>
    <form className={`rounded-lg flex flex-row items-center pl-[12px] w-full bg-gray-100`}>
        <RiSearchLine size={22} />
        <input 
            type="text" 
            className='w-[90%] bg-gray-100 outline-none p-1.5'
            placeholder={"Search"}
        />
      </form>
    </div>
  )
}

export default SearchBar