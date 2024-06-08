'use client'
import React from 'react'
import { RiSearchLine } from "react-icons/ri"

// used to be able to add className for SearchBar
interface searchBarProps {
    className?: string;
}

// SearchBar component
const SearchBar: React.FC<searchBarProps> = ({className}) => {
  return (
    <form className={`${className}`}>
        <RiSearchLine className='absolute opacity-70 translate-x-4 translate-y-3' size={24} />
        <input 
            type="text" 
            className='border border-gray-500 rounded-md p-3 pl-[52px] w-full'
            placeholder='Search'
        />
    </form>
  )
}

export default SearchBar