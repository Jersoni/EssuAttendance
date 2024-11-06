"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

// Imported icons from https://react-icons.github.io/react-icons/search/#q=help (see installation documentation)
import { FiClipboard, FiMenu } from "react-icons/fi";
import { BsClipboard2Fill } from "react-icons/bs";
import { IoMdMenu } from "react-icons/io";
import { LuArchive } from "react-icons/lu";
import { TbUsers } from "react-icons/tb";
import { AuthProps } from "@/types";
import { checkAuth } from "@/utils/utils";
import { HiMiniUserGroup } from "react-icons/hi2";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { PiSignOutBold } from "react-icons/pi";
import { FaSignOutAlt } from "react-icons/fa";
import { useAppContext } from "@/context";
import { FaCalendarWeek } from "react-icons/fa";
import { HiArchiveBox } from "react-icons/hi2";

const Navbar = ({ className }: { className: string }) => {
  // given default value for navbar title

  const pathname = usePathname();
  const router = useRouter()

  // auth verification
  const [ auth, setAuth ] = useState<AuthProps>()
  useEffect(() => {
    console.log("check auth")
    setAuth(checkAuth(router))
  }, [router, pathname])

  useEffect(() => {
    console.log(auth)
  }, [auth])

  let convertedPathname =
    pathname.slice(1).charAt(0).toUpperCase() + pathname.slice(1).slice(1);
  if (convertedPathname === "") convertedPathname = "Schedule";

  const excludedRoutes = useMemo(
    () => ["/login", "/signup", "/scanner", "/students/student", "/notfound", "/auth"],
    []
  );
  const isDynamicRoute = /\w+\/\d+/.test(pathname);
  const condition = excludedRoutes.indexOf(pathname) === -1 && !isDynamicRoute;

  const [isOpen, setIsOpen] = useState(false)

  function toggle() {
    setIsOpen(!isOpen)
  }

  function handleClick() {
      setTimeout(() => {
        toggle()
      }, 500)
  }

  const [isProfileOptionsOpen, setIsProfileOptionsOpen] = useState(false)
  const toggleProfileOptions = () => {
    setIsProfileOptionsOpen(!isProfileOptionsOpen)
  }

  // app context
  const { isNavOpen, setIsNavOpen } = useAppContext()

  useEffect(() => {
    setIsNavOpen(isOpen)
  }, [isOpen])
  
  return condition ? (
    <div className="z-[1000]">
      {/* header */}
      <div
        className={` ${
          pathname === "/" ? "" : ""
        } bg-white h-14 flex items-center border-b border-gray-200 w-[100vw] fixed top-0 z-[1300]`}
      >
        <button
          onClick={toggle} 
          className={`active:bg-gray-200 ml-3 rounded-full p-2`}
        >
          <IoMdMenu size={26} fill="blue" className="fill-green-700" />
        </button>
        <h1 className={`text-emerald-700 translate-y-[1px] h-fit z-30 text-[20px] ml-2 w-full ${className}`}>{convertedPathname}</h1>
      </div>

      {/* Navbar menu */}
      <div
        className={`bg-white border-r border-gray-300 fixed bottom-0 left-0 top-0 z-[1200] pt-20 duration-300 transition-all ease-out overflow-hidden flex flex-col justify-between
        ${isOpen ? "w-[60vw]" : "w-0"}
        `}
      >
        <ul className="flex flex-col gap-1">
          <li onClick={handleClick} className={`px-5 w-full grid place-items-center py-4 ${pathname === "/" ? "bg-emerald-100 text-green-900 bg-opacity-50" : ""}`}>
            <Link 
                className="flex flex-row gap-4 items-center w-full" 
                href="/"
            >
              <FaCalendarWeek
                className={pathname === "/" 
                  ? "text-green-900 text-opacity-90" 
                    : "text-gray-400"}
                size={18}
              />
              <p
                className={`text-sm font-semibold ${
                  pathname === "/" ? "" : "text-gray-400"
                }`}
              >
                Schedule
              </p>
            </Link>
          </li>
          <li onClick={handleClick} className={`px-5 w-full grid place-items-center py-4 ${pathname === "/students" ? "bg-emerald-100 text-green-900 fill-green-900 bg-opacity-50" : ""}`}>
            <Link
              className="flex flex-row gap-4 items-center w-full"
              href="/students"
            >
              <HiMiniUserGroup
                className={pathname === "/students" 
                  ? "text-green-900 text-opacity-90" 
                  : "text-gray-400"}
                size={20}
              />
              <p
                className={`text-sm font-semibold ${
                  pathname === "/students" ? "text-green-900 text-opacity-90" : "text-gray-400"
                }`}
              >
                Students
              </p>
            </Link>
          </li>
          <li onClick={handleClick} className={`px-5 w-full grid place-items-center py-4 ${pathname === "/archive" ? "bg-emerald-100 text-green-900 fill-green-900 bg-opacity-50" : ""}`}>
            <Link
              className="flex flex-row gap-4 items-center w-full"
              href="/archive"
            >
              <HiArchiveBox
                className={pathname === "/archive" 
                  ? "" 
                  : "text-gray-400"}
                size={20}
              />
              <p
                className={`text-sm font-semibold ${
                  pathname === "/archive" ? "" : "text-gray-400"
                }`}
              >
                Archive
              </p>
            </Link>
          </li>

          {/* <li>
            <Link href="/about" '/about'}>
                <IoMdInformationCircleOutline className='mr-3' size={24} />
            </Link>
        </li> */}
        </ul>

        <div
          onClick={toggleProfileOptions}
          className="flex flex-row w-full gap-3.5 h-fit items-center p-3 border-t bg-gradient-to-b from-gray-50 to-white "
        >
          <div className="bg-gray-200 border border-gray-200 rounded-full p-1">
            <HiMiniUserGroup size={24} className="text-gray-400" />
          </div>
          {auth
            ? <span className="font-bold text-sm">{auth.name}</span>
            : <span className="w-28 h-5 rounded-md bg-gray-300 animate-pulse"></span>
          }
          {auth && <HiOutlineDotsHorizontal size={20} className="ml-auto mr-2 text-gray-400" />}
        </div>

        {/* profile options modal */}
        <div 
          onClick={toggleProfileOptions}
          className={`fixed top-0 bottom-0 left-0 right-0 
            ${isProfileOptionsOpen ? "" : "hidden"}  
          `}
        ></div>
        <div
          className={`bg-white absolute bottom-[4.5rem] rounded-lg border shadow border-gray-300 gap-1 p-1 w-[90%] h-fit self-center flex flex-col text-sm text-gray-600 font-semibold transition-all
             ${isProfileOptionsOpen ? "" : "opacity-0 pointer-events-none"}
          `}
        >
          <button 
            className="p-3 w-full text-start bg-white rounded-md gap-4 flex flex-row items-center active:bg-gray-100" 
            type="button"
          >
            <HiMiniUserGroup size={20} className="text-gray-400" />
            <span>Organization Profile</span>
          </button>
          <button 
            className="p-3 w-full text-start bg-white rounded-md gap-4 flex flex-row items-center active:bg-gray-100" 
            type="button"
            onClick={() => {
              toggle()
              toggleProfileOptions()
              auth?.signout()
            }}
          >
            <FaSignOutAlt size={18} className="text-gray-400 ml-0.5" />
            <span>Sign out</span>
          </button>
        </div>
      </div>

      <div 
        onClick={toggle}
        className={`fixed bg-black bg-opacity-10 top-0 left-0 bottom-0 right-0 z-[900] ${isOpen ? "" : "hidden"}`}
      ></div>

    </div>
  ) : (
    ""
  );
};

export default Navbar;
