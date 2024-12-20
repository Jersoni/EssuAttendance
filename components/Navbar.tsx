"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

// Imported icons from https://react-icons.github.io/react-icons/search/#q=help (see installation documentation)
import { useAppContext } from "@/context";
import supabase from "@/lib/supabaseClient";
import { AuthProps } from "@/types";
import { checkAuth } from "@/utils/utils";
import { FaCalendarWeek, FaSignOutAlt } from "react-icons/fa";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { HiArchiveBox, HiMiniUserGroup } from "react-icons/hi2";
import { TbMenu } from "react-icons/tb";

const Navbar = ({ className }: { className?: string }) => {
  // given default value for navbar title

  const pathname = usePathname();
  const router = useRouter();

  // auth verification
  const [auth, setAuth] = useState<AuthProps>();

  useEffect(() => {
    const payload = checkAuth(router, pathname) as { id: number; role: string };

    if (payload) {
      (async () => {
        try {
          const { data, error } = await supabase
            .from("organizations")
            .select()
            .eq("id", payload?.id)
            .single();

          if (error) {
            console.error(error);
            return;
          }

          setAuth({
            university: data.university,
            organization: data.organization,
            role: payload.role,
          });
        } catch (err) {
          console.error(err);
        }
      })();
    }
  }, [router, pathname]);

  let convertedPathname =
    pathname.slice(1).charAt(0).toUpperCase() + pathname.slice(1).slice(1);
  if (convertedPathname === "") convertedPathname = "Schedule";

  const excludedRoutes = useMemo(
    () => [
      "/login",
      "/signup",
      "/scanner",
      "/students/student",
      "/notfound",
      "/auth",
    ],
    []
  );
  const isDynamicRoute = /\w+\/\d+/.test(pathname);
  const condition = excludedRoutes.indexOf(pathname) === -1 && !isDynamicRoute;

  const [isOpen, setIsOpen] = useState(false);

  function toggle() {
    setIsOpen(!isOpen);
  }

  function handleClick() {
    setTimeout(() => {
      toggle();
    }, 500);
  }

  const [isProfileOptionsOpen, setIsProfileOptionsOpen] = useState(false);
  const toggleProfileOptions = () => {
    setIsProfileOptionsOpen(!isProfileOptionsOpen);
  };

  // app context
  const { isNavOpen, setIsNavOpen } = useAppContext();

  useEffect(() => {
    setIsNavOpen(isOpen);
  }, [isOpen]);

  // scroll
  const [scrollY, setSrollY] = useState(0);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      setSrollY(window.scrollY);
    });
  }, []);

  function setThemeColor(color: string) {
    let meta = document.querySelector("meta[name='theme-color']") as HTMLMetaElement;

    if (meta !== null && meta.content === color) {
      return null
    }

    if (meta) {
      document.head.removeChild(meta)
    }

    meta = document.createElement("meta") as HTMLMetaElement;
    meta.name = "theme-color";
    meta.content = color;
    document.head.appendChild(meta)
  }

  useEffect(() => {
    if (isOpen === true) {
      setThemeColor("#fff")
    } else {
      if (pathname === "/") {
        setTimeout(() => {
          if (scrollY > 40) {
            setThemeColor("#fff")
          } else {
            setThemeColor("#f3f4f6")
          }
        }, 60)
      } else {
        setThemeColor("#fff")
      }
    }
  }, [scrollY, pathname, isOpen])

  return condition ? (
    <div className="z-[1000]">
      {/* header */}
      <div
        className={` 
          ${pathname === "/" ? "" : ""} 
          ${scrollY > 40 ? "border-b" : "bg-opacity-0"}
          h-14 flex items-center bg-white transition-all duration-200 border-gray-200 w-[100vw] fixed top-0 z-[1300]
        `}
      >
        <button onClick={toggle} className={` ml-3 rounded-full p-2`}>
          <TbMenu size={22} fill="blue" className="text-gray-800" />
        </button>
        <h1
          className={`text-gray-600 h-fit z-30 text-[20px] ml-1 w-full text-base font-semibold ${className}`}
        >
          {convertedPathname}
        </h1>
      </div>

      {/* Navbar menu */}
      <div
        className={`bg-white border-r border-gray-300 fixed bottom-0 left-0 top-0 z-[1200] pt-20 duration-300 transition-all ease-out overflow-hidden flex flex-col justify-between
        ${isOpen ? "w-[60vw]" : "w-0"}
        `}
      >
        <ul className="flex flex-col gap-1">
          <li
            onClick={handleClick}
            className={`px-5 w-full grid place-items-center py-4 ${
              pathname === "/"
                ? "bg-sky-100 text-blue-500 bg-opacity-50"
                : ""
            }`}
          >
            <Link className="flex flex-row gap-4 items-center w-full" href="/">
              <FaCalendarWeek
                className={
                  pathname === "/"
                    ? "text-blue-500 text-opacity-90"
                    : "text-gray-400"
                }
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
          <li
            onClick={handleClick}
            className={`px-5 w-full grid place-items-center py-4 ${
              pathname === "/students"
                ? "bg-sky-100 text-blue-500 bg-opacity-50"
                : ""
            }`}
          >
            <Link
              className="flex flex-row gap-4 items-center w-full"
              href="/students"
            >
              <HiMiniUserGroup
                className={
                  pathname === "/students"
                    ? "text-blue-500 text-opacity-90"
                    : "text-gray-400"
                }
                size={20}
              />
              <p
                className={`text-sm font-semibold ${
                  pathname === "/students"
                    ? "text-blue-500 text-opacity-90"
                    : "text-gray-400"
                }`}
              >
                Students
              </p>
            </Link>
          </li>
          <li
            onClick={handleClick}
            className={`px-5 w-full grid place-items-center py-4 ${
              pathname === "/archive"
                ? "bg-blue-100 text-blue-500 bg-opacity-50"
                : ""
            }`}
          >
            <Link
              className="flex flex-row gap-4 items-center w-full"
              href="/archive"
            >
              <HiArchiveBox
                className={pathname === "/archive" ? "" : "text-gray-400"}
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
          {auth ? (
            <span className="font-bold text-sm">{auth.organization}</span>
          ) : (
            <span className="w-28 h-5 rounded-md bg-gray-300 animate-pulse"></span>
          )}
          {auth && (
            <HiOutlineDotsHorizontal
              size={20}
              className="ml-auto mr-2 text-gray-400"
            />
          )}
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
              toggle();
              toggleProfileOptions();
              localStorage.removeItem("presenxiaAuthToken");
              router.push("/auth");
            }}
          >
            <FaSignOutAlt size={18} className="text-gray-400 ml-0.5" />
            <span>Sign out</span>
          </button>
        </div>
      </div>

      <div
        onClick={toggle}
        className={`fixed bg-black bg-opacity-10 top-0 left-0 bottom-0 right-0 z-[900] ${
          isOpen ? "" : "hidden"
        }`}
      ></div>
    </div>
  ) : (
    ""
  );
};

export default Navbar;
