"use client";
import { Combobox, Spinner } from "@/components";
import supabase from "@/lib/supabaseClient";
import { checkAuth } from "@/utils/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { FaKey, FaRegEye, FaRegEyeSlash, FaUser } from "react-icons/fa";
import { GoArrowLeft } from "react-icons/go";
import { IoMail } from "react-icons/io5";
import { MdLocalPhone } from "react-icons/md";
import logo from "/public/icon.svg";

// Logo Font
import { Baloo_Bhai_2 } from "next/font/google";
import { IoMdArrowForward } from "react-icons/io";
const balooBhai = Baloo_Bhai_2({ subsets: ["latin"], weight: "500" });

const UniversityOptions: Array<string> = ["ESSU Guiuan"];

interface OrgProps {
  id: number;
  university: string;
  organization: string;
  password: string;
}

const Auth = () => {
  function scrollTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  const router = useRouter();

  // auth verification
  const pathname = usePathname();

  useEffect(() => {
    checkAuth(router, pathname);
  }, [router, pathname]);

  const [isPageLoaded, setPageLoaded] = useState(false);
  const [organizationOptions, setSelectedOrganizationOptions] = useState<
    string[]
  >([]);
  const [selectedUniversity, setSelectedUniversity] = useState<string>();
  const [selectedOrganization, setSelectedOrganization] = useState<string>();
  const [password, setPassword] = useState<string>();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<
    "query" | "runtime" | "wrongPassword" | "emptyPassword"
  >();
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  // Get organizationOptions
  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase
          .from("organizations")
          .select("organization");

        if (error) {
          console.error(error);
        } else {
          setSelectedOrganizationOptions(data.map((item) => item.organization));
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const getData = async () => {
    if (password === "" && password !== undefined) {
      console.log("password empty");
      setError("emptyPassword");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("organizations")
        .select()
        .match({
          university: selectedUniversity,
          organization: selectedOrganization,
        })
        .single();

      if (error) {
        console.error(error);
        setError("query");
        return;
      }

      const orgData = data as OrgProps;

      console.log(orgData);

      if (orgData.password && password) {
        if (orgData.password === password) {
          localStorage.setItem("presenxiaAuthToken", `${orgData.id}.admin`);
          router.push("/");
        } else {
          setIsSubmitLoading(false);
          setError("wrongPassword");

          console.error("wrong password");
          return;
        }
      } else {
        setIsSubmitLoading(false);
        localStorage.setItem("presenxiaAuthToken", `${orgData.id}.student`);
        router.push("/");
      }
    } catch (e) {
      console.error(e);
      setError("runtime");
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (selectedUniversity && selectedOrganization) {
      setIsSubmitLoading(true);
      getData();
    }
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (error === "wrongPassword") setError(undefined);
  };

  // Frontend functions _______________________________________________

  // toggle showPassword
  useEffect(() => {
    if (showPassword === true) {
      const timeoutID = setTimeout(() => {
        setShowPassword(false);
      }, 10000);

      return () => clearTimeout(timeoutID);
    }
  }, [showPassword]);

  const [page, setPage] = useState<string>("1");

  // clear
  useEffect(() => {
    setSelectedUniversity("");
    setSelectedOrganization("");
    if (page !== "admin") {
      setPassword(undefined);
    }
    setError(undefined);
  }, [page]);

  const loginContainer = useRef<HTMLDivElement>(null);

  // add / remove overflow-hidden
  useEffect(() => {
    if (loginContainer.current) {
      const container = loginContainer.current;

      loginContainer.current.classList.add("overflow-hidden");

      const timeoutId = setTimeout(() => {
        container.classList.remove("overflow-hidden");
      }, 200);

      return () => clearTimeout(timeoutId);
    }
  }, [page]);

  useEffect(() => {
    scrollTop();
  }, [selectedUniversity, selectedOrganization]);

  useEffect(() => {
    setPageLoaded(true);
  }, []);

  return (
    <>
      {!isPageLoaded && (
        <div className="fixed top-0 left-0 right-0 bottom-0 grid place-items-center">
          <Spinner />
        </div>
      )}

      {isPageLoaded && (
        <div className="h-fit overflow-x-hidden">
          <div className="bg-gradient-to-b. from-gray-100 to-gray-200 bg-white">
            <div
              className={`min-h-16 w-full items-center flex flex-row bg-white pl-6 border-b border-gray-400`}
            >
              <div className="flex flex-row items-center w-fit">
                {/* <PiBookOpenTextFill className='text-emerald-700' size={26} /> */}
                <Image
                  src={logo}
                  width={28}
                  height={28}
                  alt="app logo"
                  className="mr-2"
                />
                <span
                  className={`${balooBhai.className} font-medium text-2xl translate-y-[2.5px] text-gray-700`}
                >
                  Presenxia
                </span>
              </div>

              <div className="flex flex-row gap-7 ml-auto mr-7">
                <Link className="w-fit flex text-xs  " href={""}>
                  ABOUT US
                </Link>
                <Link className="w-fit flex text-xs  " href={""}>
                  FAQ
                </Link>
              </div>
            </div>

            {/* main */}
            <div className="main px-5 pt-20 pb-16 bg-gradient-to-b from-gray-50 via-gray-50 to-gray-100 min-h-[70vh] h-full ">
              {page ? (
                <div
                  ref={loginContainer}
                  className={`flex flex-col relative h-fit w-full transition-all duration-300`}
                >
                  <div
                    id="page-1"
                    className={`${
                      page === "1" ? "" : "-translate-x-[100vw] absolute"
                    } transition-all duration-300`}
                  >
                    <div className="flex flex-col">
                      <span className="bg-cyan-100 p-1 w-fit">
                        <h1 className="text-3xl font-bold ">Sign in.</h1>
                      </span>
                      <p className="text-gray-800 font-medium mt-2">
                        Select your role to continue
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 mt-12">
                      <button
                        type="button"
                        onClick={() => {
                          setPage("student");
                        }}
                        className=" border border-gray-400 text-black w-full flex flex-row items-center gap-4 bg-none h-fit font-semibold rounded-xl pl-6 py-4 text-sm"
                      >
                        <FaUser size={26} className="text-gray-300" />
                        <span>Sign in as student</span>
                        <IoMdArrowForward
                          size={20}
                          className="ml-auto mr-4 text-gray-500"
                        />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setPage("admin");
                          setPassword("");
                        }}
                        className=" border border-gray-400 text-black w-full flex flex-row items-center gap-4 bg-none h-fit font-semibold rounded-xl pl-6 py-4 text-sm"
                      >
                        <FaKey size={26} className="text-gray-300" />
                        <span>Sign in as admin</span>
                        <IoMdArrowForward
                          size={20}
                          className="ml-auto mr-4 text-gray-500"
                        />
                      </button>
                    </div>
                  </div>

                  <div
                    id="page-student"
                    className={`${
                      page === "student" ? "" : "translate-x-[100vw] absolute"
                    } transition-all duration-300`}
                  >
                    <div>
                      <div className="flex flex-row gap-3 items-center">
                        {/* <FaUser size={22} className="text-gray-600" /> */}
                        <h1 className="text-xl font-semibold ">
                          Sign in as student
                        </h1>
                      </div>

                      <form
                        action=""
                        className="mt-10"
                        onSubmit={handleFormSubmit}
                      >
                        <Combobox
                          label="University"
                          placeholder="Select a university"
                          options={UniversityOptions}
                          selectedOption={selectedUniversity}
                          setSelectedOption={setSelectedUniversity}
                        />

                        <Combobox
                          label="School organization"
                          placeholder="Select a school organization"
                          options={organizationOptions}
                          selectedOption={selectedOrganization}
                          setSelectedOption={setSelectedOrganization}
                          className="mt-6"
                        />

                        <div className="mt-12 flex flex-row justify-between items-center">
                          <button
                            onClick={() => {
                              setPage("1");
                            }}
                            type="button"
                            className="p-2 pl-0 text-gray-700 font-medium flex flex-row gap-2.5 items-center text-sm"
                          >
                            <GoArrowLeft size={18} />
                            Back
                          </button>

                          <button
                            type="submit"
                            className=" text-white w-fit max-h-10 bg-blue-500 h-fit font-semibold rounded-lg p-2.5 px-8 text-sm active:bg-blue-400 grid place-items-center"
                          >
                            {isSubmitLoading && <Spinner size="1.4" />}
                            Sign in
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>

                  <div
                    id="page-admin"
                    className={`${
                      page === "admin" ? "" : "translate-x-[100vw] absolute"
                    } transition-all duration-300`}
                  >
                    <div>
                      <div className="flex flex-row gap-3 items-center">
                        {/* <FaKey size={22} className="text-gray-600" /> */}
                        <h1 className="text-xl font-semibold ">
                          Sign in as admin
                        </h1>
                      </div>

                      <form
                        action=""
                        className="mt-10"
                        onSubmit={handleFormSubmit}
                      >
                        <Combobox
                          label="University"
                          placeholder="Select a university"
                          options={UniversityOptions}
                          selectedOption={selectedUniversity}
                          setSelectedOption={setSelectedUniversity}
                        />

                        <Combobox
                          label="School organization"
                          placeholder="Select a school organization"
                          options={organizationOptions}
                          selectedOption={selectedOrganization}
                          setSelectedOption={setSelectedOrganization}
                          className="mt-6"
                        />

                        <div className="flex flex-col gap-2 mt-6">
                          <label
                            htmlFor="pass"
                            className="text-sm font-semibold text-gray-700 !mb-2 flex"
                          >
                            Password
                          </label>
                          <div
                            className={`bg-gray-100 border border-gray-200 rounded-lg pl-4 focus:border-opacity-80 text-sm w-full flex flex-row items-center ${
                              error === "wrongPassword"
                                ? "!border-red-300 !border-2"
                                : ""
                            }`}
                          >
                            <input
                              type={showPassword ? "text" : "password"}
                              placeholder="•••••"
                              className="bg-transparent w-full mr-2 outline-none"
                              onChange={handlePasswordChange}
                            />
                            <button
                              className="text-gray-600 mr-1 p-3"
                              type="button"
                              onClick={() => {
                                scrollTop();
                                setShowPassword(true);
                              }}
                            >
                              {showPassword ? (
                                <FaRegEye size={16} />
                              ) : (
                                <FaRegEyeSlash size={16} />
                              )}
                            </button>
                          </div>
                          {error === "wrongPassword" && (
                            <span className="text-sm text-red-400">
                              Password is incorrect
                            </span>
                          )}
                          {error === "emptyPassword" && (
                            <span className="text-sm text-red-400">
                              Enter your password
                            </span>
                          )}
                        </div>

                        <div className="mt-12 flex flex-row justify-between items-center">
                          <button
                            onClick={() => {
                              setPage("1");
                            }}
                            type="button"
                            className="p-2 pl-0 text-gray-700 font-medium flex flex-row gap-2.5 items-center text-sm"
                          >
                            <GoArrowLeft size={18} />
                            Back
                          </button>

                          <button
                            type="submit"
                            className=" text-white w-fit max-h-10 bg-blue-500 h-fit font-semibold rounded-lg p-2.5 px-8 text-sm active:bg-blue-400 grid place-items-center"
                          >
                            {isSubmitLoading && <Spinner size="1.4" />}
                            Sign in
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="min-h-[50vh] grid place-items-center">
                  <Spinner />
                </div>
              )}

              {page !== "student" && (
                <div className="w-full h-fit border-t border-gray-300 mt-20 flex flex-col items-center pt-16">
                  <span className="text-sm text-center max-w-[300px]">
                    Not registered yet? Join us to streamline attendance
                    management!
                  </span>
                  <Link
                    href={"/signup"}
                    className="bg-white rounded-full border border-gray-400 cursor-pointer text-sm text- py-3 px-8 active:bg-gray-100 mt-6 font-medium flex flex-row items-center gap-2"
                  >
                    Sign up for free
                    {/* <IoMdArrowForward size={16} /> */}
                  </Link>
                </div>
              )}
            </div>

            <footer
              className={`mt-auto flex flex-col px-5 relative bg-gray-20 w-[100vw] h-fit`}
            >
              <div className="flex flex-col border- border-gray-400 w-full h-full pt-10 pb-14">
                <h1 className="font-semibold text-gray-700">Get in touch</h1>
                <div className="flex flex-col">
                  <Link
                    href={""}
                    className="flex flex-row items-center gap-4 mt-6"
                  >
                    <IoMail size={22} className="text-gray-300" />
                    <span className="text-gray-500 text-xs font-normal ">
                      jersoncaibog0423@gmail.com
                    </span>
                  </Link>

                  <Link
                    href={""}
                    className="flex flex-row items-center gap-4 mt-3"
                  >
                    <MdLocalPhone size={22} className="text-gray-300" />
                    <span className="text-gray-500 text-xs font-normal">
                      +639273240956
                    </span>
                  </Link>
                </div>
                <div className="mt-14 border-t border-gray-300 pt-8">
                  <p className="text-xs text-gray-500 text-center">
                    &copy; Jerson Caibog, 2024. All rights reserved.
                  </p>
                </div>
              </div>
            </footer>
          </div>
        </div>
      )}
    </>
  );
};

export default Auth;
