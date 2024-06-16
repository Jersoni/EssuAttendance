'use client'
import { Navbar, SearchBar } from "@/components";
import styles from './styles.module.css';
import { useState } from "react";

const Page = () => {

  return (
    <>
      
      <div className="max-h-[100vh] overflow-y-auto pt-24 pb-40">

        <div className="px-3">
          <SearchBar className="mt-5"/>
        </div>

        <div className={` ${styles.studentsList} mt-8 `}> 
          
        </div>
      </div>
    </>
  )
}

export default Page