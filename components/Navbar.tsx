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

    // click handler for menu btn
    const [isOpen, setIsOpen] = useState(false);
    const handleClick = () => {
        setIsOpen(!isOpen);
    };

    // set previous pathname
    const [prevPathname, setPrevPathname] = useState(pathname);

    // Close navbar after navigation (using useEffect)
    useEffect(() => {
        setPrevPathname(pathname)

        const closeNavbar = async () => {
            if (isOpen) {
                await new Promise((resolve) => setTimeout(resolve, 500)); 
                setIsOpen(false);
            }
        };

        // Close navbar on navigation (except excluded routes)
        if (pathname !== prevPathname && excludedRoutes.indexOf(pathname) === -1) {
            closeNavbar();
        }

        // Cleanup function to prevent memory leaks
        return () => {};
    }, [pathname, isOpen, excludedRoutes, prevPathname]); // Re-run effect on pathname or isOpen change

    return (
        condition ? (
            <>
                {/* header */}
                <div className={` absolute w-full ${pathname === '/' ? "" : ""} bg-white z-30 h-[4.5rem] border-b border-gray-200`}></div>

                {/* menu button */}
                <div className='flex flex-row items-center absolute z-[100] p-3 pl-2'>
                    {/* <button className='z-[70] grid place-items-center h-12 w-12 mr-2 rounded-full active:bg-gray-200' type="button" aria-label="Open Menu" onClick={handleClick}>
                        {isOpen ? (
                            <IoCloseOutline color={'#065f46'} size={32} />
                        ) : (
                            <HiOutlineMenuAlt2 color={'#065f46'} size={28} />
                        )}
                    </button> */}
                    
                    {/* TITLE */}
                    <h1 onClick={handleClick} className={`text-emerald-800 font-bold z-30 translate-y-[1px] text-2xl ${bebasNeue.className}`}>{convertedPathname}</h1>
                </div>
                
                {/* Navbar menu */}
                <div className={`fixed duration-200 bg-white h-fit pb-2 z-50 bottom-0 left-0 right-0 border-gray-200 border-t`}>
                    <ul className='flex flex-row gap-1 p-2'>
                        <li className='w-full grid place-items-center py-2 rounded-md'>
                            <Link className='flex flex-col items-center gap-1 w-full' href="/">
                                <FiClipboard 
                                    className={pathname === '/' ? "" : "stroke-gray-400"} 
                                    size={26} />
                                <p className={`text-xs font-medium ${pathname === '/' ? "" : "text-gray-400"}`}>Attendance</p>
                            </Link>
                        </li>
                        <li className='w-full grid place-items-center py-2 rounded-md'>
                            <Link className='flex flex-col items-center gap-1 w-full' href="/students">
                                <TbUsers 
                                    className={pathname === '/students' ? "" : "stroke-gray-400"} 
                                    size={26} />
                                <p className={`text-xs font-medium ${pathname === '/students' ? "" : "text-gray-400"}`}>Students</p>
                            </Link>
                        </li>
                        <li className='w-full grid place-items-center py-2 rounded-md'>
                            <Link className='flex flex-col items-center gap-1 w-full' href="/archive">
                                <LuArchive 
                                    className={pathname === '/archive' ? "" : "stroke-gray-400"}  
                                    size={26} />
                                <p className={`text-xs font-medium ${pathname === '/archive' ? "" : "text-gray-400"}`}>Archive</p>
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