"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

// Imported icons from https://react-icons.github.io/react-icons/search/#q=help (see installation documentation)
import { FiClipboard, FiMenu } from "react-icons/fi";
import { BsClipboard2Fill } from "react-icons/bs";
import { IoMdMenu } from "react-icons/io";
import { LuArchive } from "react-icons/lu";
import { TbUsers } from "react-icons/tb";

const Navbar = ({ className }: { className: string }) => {
  // given default value for navbar title

  const pathname = usePathname();

  let convertedPathname =
    pathname.slice(1).charAt(0).toUpperCase() + pathname.slice(1).slice(1);
  if (convertedPathname === "") convertedPathname = "SSC attendance";

  const excludedRoutes = useMemo(
    () => ["/login", "/signup", "/scanner", "/students/student", "/notfound"],
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

  return condition ? (
    <div className="fixed top-0 left-0 z-[1000]">
      {/* header */}
      <div
        className={` ${
          pathname === "/" ? "" : ""
        } bg-white h-14 flex items-center border-b border-gray-200 w-[100vw] absolute z-[500]`}
      >
        <button 
          onClick={toggle} 
          className={`active:bg-gray-200 ml-3 rounded-full p-2`}
        >
          <IoMdMenu size={26} fill="blue" className="fill-green-700" />
        </button>
        <h1 className={`text-emerald-700 h-fit z-30 text-[20px] ml-2 w-full ${className}`}>{convertedPathname}</h1>
      </div>

      {/* Navbar menu */}
      <div
        className={`bg-white h-[100vh] top-0 left-0 border-r border-gray-200 absolute z-[400] pt-20 duration-300 transition-all ease-out overflow-hidden
        ${isOpen ? "w-[70vw]" : "w-0"}  
        `}
      >
        <ul className="flex flex-col gap-1">
          <li onClick={handleClick} className={`px-5 w-full grid place-items-center py-4 ${pathname === "/" ? "bg-emerald-100 text-green-900 fill-green-900 bg-opacity-50" : ""}`}>
            <Link 
                className="flex flex-row gap-4 items-center w-full" 
                href="/"
            >
              <FiClipboard
                className={pathname === "/" ? "" : "stroke-gray-400"}
                size={22}
              />
              <p
                className={`text-sm font-semibold ${
                  pathname === "/" ? "" : "text-gray-400"
                }`}
              >
                Attendance
              </p>
            </Link>
          </li>
          <li onClick={handleClick} className={`px-5 w-full grid place-items-center py-4 ${pathname === "/students" ? "bg-emerald-100 text-green-900 fill-green-900 bg-opacity-50" : ""}`}>
            <Link
              className="flex flex-row gap-4 items-center w-full"
              href="/students"
            >
              <TbUsers
                className={pathname === "/students" ? "" : "stroke-gray-400"}
                size={22}
              />
              <p
                className={`text-sm font-semibold ${
                  pathname === "/students" ? "" : "text-gray-400"
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
              <LuArchive
                className={pathname === "/archive" ? "" : "stroke-gray-400"}
                size={22}
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
      </div>

      <div
        onClick={toggle} 
        className={`absolute bg-black bg-opacity-10 h-[100vh] w-[100vw]
          ${isOpen ? "" : "hidden"}  
        `}
      >  
      </div>

    </div>
  ) : (
    ""
  );
};

export default Navbar;
