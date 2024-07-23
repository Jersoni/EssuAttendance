"use client"
import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation'
import { Bebas_Neue } from "next/font/google";

// Imported icons from https://react-icons.github.io/react-icons/search/#q=help (see installation documentation)
import { RiHome2Line } from "react-icons/ri";
import { LuUser } from "react-icons/lu";
import { LuArchive } from "react-icons/lu";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";
import { HiOutlineMenuAlt2 } from "react-icons/hi";

const bebasNeue = Bebas_Neue({ weight: "400", subsets: ["latin"] })

const Navbar = () => { // given default value for navbar title

    const themeColorGreen: string = "#045511" // theme color
    const pathname = usePathname() // get current path

    let convertedPathname = pathname.slice(1).charAt(0).toUpperCase() + pathname.slice(1).slice(1);
    if (convertedPathname === '') convertedPathname = "SSC LOGBOOK"

    const excludedRoutes = useMemo(() => ['/login', '/signup', '/scanner', '/students/student'], []);
    const condition = excludedRoutes.indexOf(pathname) === -1 && pathname.substring(0, 7) !== "/events"

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
                <div className={` absolute w-full ${pathname === '/' ? "" : ""} bg-white z-30 h-[4.5rem]`}></div>

                {/* menu button */}
                <div className='flex flex-row items-center absolute z-[100] p-3 pl-2'>
                    <button className='z-[70] grid place-items-center h-12 w-12 mr-2 rounded-full active:bg-gray-200' type="button" aria-label="Open Menu" onClick={handleClick}>
                        {isOpen ? (
                            <IoCloseOutline color={themeColorGreen} size={32} />
                        ) : (
                            <HiOutlineMenuAlt2 color={themeColorGreen} size={28} />
                        )}
                    </button>
                    
                    {/* TITLE */}
                    <h1 onClick={handleClick} className={`text-[#045511] font-bold z-30 translate-y-[1px] text-2xl ${bebasNeue.className}`}>{convertedPathname}</h1>
                </div>
                
                {/* Navbar menu */}
                <div className={`absolute transition-all duration-200 bg-white flex min-h-[100vh] p-3 w-[70vw] max-w-[336px] pt-20 z-50 top-0 left-0
                ${isOpen ? ("") : ("translate-x-[-100%]")}`}>
                    <ul>
                        <li>
                            <Link href="/" className={`nav-item ${pathname === '/' ? 'bg-[#E5E7EB] bg-opacity-60' : ''}`}>
                                <RiHome2Line className='mr-3' size={24} />
                                <span>Home</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/students" className={`nav-item ${pathname === '/students' ? 'bg-[#E5E7EB] bg-opacity-60' : ''}`}>
                                <LuUser className='mr-3' size={24} />
                                <span>Students</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/archive" className={`nav-item ${pathname === '/archive' ? 'bg-[#E5E7EB] bg-opacity-60' : ''}`}>
                                <LuArchive className='mr-3' size={24} />
                                <span>Archive</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/about" className={`nav-item ${pathname === '/about' ? 'bg-[#E5E7EB] bg-opacity-60' : ''}`}>
                                <IoMdInformationCircleOutline className='mr-3' size={24} />
                                <span>About</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            
                {/* Just a backdrop */}
                <div className={`absolute top-0 left-0 h-full w-full bg-black z-40 transition-all ${isOpen ? ("opacity-70 block") : ("opacity-0 delay-100 hidden")}`} onClick={isOpen ? handleClick : undefined}></div>
            </>
        ) : ("")
    )
}

export default Navbar