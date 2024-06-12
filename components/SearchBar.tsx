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
    <form className={`${className} rounded-md flex flex-row items-center pl-[15px] w-full bg-[#ECEDF1]`}>
      <RiSearchLine className='opacity-60' size={24} />
      <input 
          type="text" 
          className='bg-[#ECEDF1] outline-none rounded-md p-3 w-full'
          placeholder={"Search name, ID, etc..."}
      />
    </form>
  )
}

export default SearchBar