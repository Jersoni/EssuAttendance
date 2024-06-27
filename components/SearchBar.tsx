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
      <form className={`rounded-2xl border-2 border-gray-200 flex flex-row items-center pl-[12px] w-full bg-gray-100`}>
        <RiSearchLine className='opacity-90' size={22} />
        <input 
            type="text" 
            className='w-[90%] bg-gray-100 rounded-full outline-none p-2'
            placeholder={"Search"}
        />
      </form>
      <Filter className={`p-2 border-2 border-gray-200 rounded-2xl bg-gray-100`}/>
    </div>
  )
}

export default SearchBar