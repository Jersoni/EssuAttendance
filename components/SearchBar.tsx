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
    <div className={`${className} flex flex-row items-center`}>
      <form className={`rounded-full border-2 border-gray-200 flex flex-row items-center pl-[12px] w-full bg-gray-100`}>
        <RiSearchLine className='opacity-90' size={22} />
        <input 
            type="text" 
            className='bg-gray-100 outline-none rounded-md p-2 pr-0 w-full'
            placeholder={"Search"}
        />
        <Filter className={`p-2 pr-3 opacity-80`}/>
      </form>
    </div>
  )
}

export default SearchBar