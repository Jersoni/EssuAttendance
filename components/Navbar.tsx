"use client"

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation'

// Imported icons from https://react-icons.github.io/react-icons/search/#q=help (see installation documentation)
import { LuMenu } from "react-icons/lu";
import { RiHome2Line } from "react-icons/ri";
import { LuUser } from "react-icons/lu";
import { LuArchive } from "react-icons/lu";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";

// navbar props
interface navbarProps {
    title?: string; // to allow custom title for navbar header
}


const Navbar: React.FC<navbarProps> = ({title = 'SSC Attendance'}) => { // given default value for navbar title

    const themeColorGreen: string = "#006C11" // theme color
    const pathname = usePathname() // get current path

    // click handler for menu btn
    const [isOpen, setIsOpen] = useState(false);
    const handleClick = () => {``
        setIsOpen(!isOpen);
    };

    return (
        <>
            <div className='p-3 pl-2 absolute w-full bg-white/20 backdrop-filter backdrop-blur-md z-50 border-b border-b-black border-opacity-20 shadow'>

                {/* menu button */}
                <div className='flex flex-row items-center'>
                    <button className='z-30 grid place-items-center h-12 w-12 mr-2 rounded-full active:bg-gray-200' type="button" aria-label="Open Menu" onClick={handleClick}>
                        {isOpen ? (<IoCloseOutline color={themeColorGreen} size={30} />) : (<LuMenu color={themeColorGreen} size={24} />)}
                    </button>
                    
                    {/* TITLE */}
                    <h1 className={`text-[#006C11] text-[20px] font-extrabold z-30 translate-y-[1px]`}>{title}</h1>
                </div>

                {/* Navbar menu */}
                <div className={`absolute transition-all ease-out duration-200 bg-white flex min-h-[100vh] p-3 w-[85vw] pt-20 z-20 
                ${isOpen ? ("top-0 left-0") : ("left-[-85vw] top-0")}`}>
                    <ul>
                        <li>
                            <Link href="/" className={`nav-item ${pathname === '/' ? 'bg-gray-200' : ''}`}>
                                <RiHome2Line className='mr-3' size={24} />
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link href="/students" className={`nav-item ${pathname === '/students' ? 'bg-gray-200' : ''}`}>
                                <LuUser className='mr-3' size={24} />
                                Students
                            </Link>
                        </li>
                        <li>
                            <Link href="/archive" className={`nav-item ${pathname === '/archive' ? 'bg-gray-200' : ''}`}>
                                <LuArchive className='mr-3' size={24} />
                                Archive
                            </Link>
                        </li>
                        <li>
                            <Link href="/about" className={`nav-item ${pathname === '/about' ? 'bg-gray-200' : ''}`}>
                                <IoMdInformationCircleOutline className='mr-3' size={24} />
                                About
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Just a backdrop */}
            <div className={`absolute top-0 left-0 h-full w-full bg-black z-10 transition-all ${isOpen ? ("opacity-70 block") : ("opacity-0 delay-100 hidden")}`} onClick={isOpen ? handleClick : undefined}></div>
        </>
    )
}

export default Navbar