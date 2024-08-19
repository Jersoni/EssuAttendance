'use client'
import React from 'react'
import { RiSearchLine } from "react-icons/ri"

// used to be able to add className for SearchBar
interface searchBarProps {
    className?: string;
}

// TODO: SearchBar component functionality
const SearchBar: React.FC<searchBarProps> = ({className}) => {
  return (
    <div className={`${className} flex flex-row items-center gap-3`}>
      <form className={`rounded-lg flex flex-row items-center pl-[12px] w-full bg-gray-100`}>
        <RiSearchLine size={22} />
        <input 
            type="text"
            className='w-[90%] text-sm bg-gray-100 outline-none p-2 pl-3'
            placeholder={"Search"}
        />
      </form>
    </div>
  )
}

export default SearchBar