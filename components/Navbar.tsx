"use client"
import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation'
import { Bebas_Neue } from "next/font/google";

// Imported icons from https://react-icons.github.io/react-icons/search/#q=help (see installation documentation)
import { RiHome2Line } from "react-icons/ri";
import { FiClipboard } from "react-icons/fi";

import { LuUser } from "react-icons/lu";
import { TbUsers } from "react-icons/tb";

import { LuArchive } from "react-icons/lu";


const bebasNeue = Bebas_Neue({ weight: "400", subsets: ["latin"] })

const Navbar = () => { // given default value for navbar title

    const pathname = usePathname()

    let convertedPathname = pathname.slice(1).charAt(0).toUpperCase() + pathname.slice(1).slice(1);
    if (convertedPathname === '') convertedPathname = "SSC LOGBOOK"

    const excludedRoutes = useMemo(() => ['/login', '/signup', '/scanner', '/students/student', '/notfound'], []);
    const isDynamicRoute = /\w+\/\d+/.test(pathname)
    const condition = excludedRoutes.indexOf(pathname) === -1 && !isDynamicRoute

    return (
        condition ? (
            <>
                {/* header */}
                <div className={` ${pathname === '/' ? "" : ""} bg-white z-30 h-14 flex items-center border-b border-gray-200 fixed left-0 right-0 top-0`}>
                    <h1 className={`text-emerald-800 h-fit font-bold z-30 text-[24px] ml-5 translate-y-[2px] ${bebasNeue.className}`}>{convertedPathname}</h1>
                </div>
                
                {/* Navbar menu */}
                <div className={`fixed duration-200 bg-white h-fit pb-3 z-50 bottom-0 left-0 right-0 border-t border-gray-200 `}>
                    <ul className='flex flex-row gap-1 p-1'>
                        <li className='w-full grid place-items-center py-2 rounded-md'>
                            <Link className='flex flex-col items-center gap-1 w-full' href="/">
                                <FiClipboard 
                                    className={pathname === '/' ? "" : "stroke-gray-400"} 
                                    size={26} />
                                <p className={`text-[10px] font-medium ${pathname === '/' ? "" : "text-gray-400"}`}>Attendance</p>
                            </Link>
                        </li>
                        <li className='w-full grid place-items-center py-2 rounded-md'>
                            <Link className='flex flex-col items-center gap-1 w-full' href="/students">
                                <TbUsers 
                                    className={pathname === '/students' ? "" : "stroke-gray-400"} 
                                    size={26} />
                                <p className={`text-[10px] font-medium ${pathname === '/students' ? "" : "text-gray-400"}`}>Students</p>
                            </Link>
                        </li>
                        <li className='w-full grid place-items-center py-2 rounded-md'>
                            <Link className='flex flex-col items-center gap-1 w-full' href="/archive">
                                <LuArchive 
                                    className={pathname === '/archive' ? "" : "stroke-gray-400"}  
                                    size={26} />
                                <p className={`text-[10px] font-medium ${pathname === '/archive' ? "" : "text-gray-400"}`}>Archive</p>
                            </Link>
                        </li>
                        {/* <li>
                            <Link href="/about" '/about'}>
                                <IoMdInformationCircleOutline className='mr-3' size={24} />
                            </Link>
                        </li> */}
                    </ul>
                </div>
            
            </>
        ) : ("")
    )
}

export default Navbar