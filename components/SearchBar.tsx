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
      <form className={`rounded-md flex flex-row items-center pl-[15px] w-full bg-gray-100`}>
        <RiSearchLine className='opacity-40' size={24} />
        <input 
            type="text" 
            className='bg-gray-100 outline-none rounded-md p-2 w-full'
            placeholder={"Search"}
        />
      </form>
      <Filter />
    </div>
  )
}

export default SearchBar