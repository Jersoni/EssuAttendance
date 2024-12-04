"use client";
import { Spinner, Combobox } from "@/components";
import supabase from "@/lib/supabaseClient";
import { AuthProps, UniversityOptionsProps } from "@/types";
import { checkAuth, hashString } from "@/utils/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { FaKey, FaRegEye, FaRegEyeSlash, FaUser } from "react-icons/fa";
import { GoArrowLeft } from "react-icons/go";
import { HiMiniUserGroup } from "react-icons/hi2";
import logo from "/public/icons/p.svg";

const UniversityOptions: Array<UniversityOptionsProps> = [
  { logo: "/logo/ESSU-logo.svg", name: "ESSU Guiuan" },
  { logo: "/logo/ESSU-logo.svg", name: "ESSU Salcedo" },
  { logo: "/logo/ESSU-logo.svg", name: "ESSU Borongan" },
  { logo: "", name: "ESSU Main" },
]

const OrganizationOptions: Array<UniversityOptionsProps> = [
  { logo: "/logo/ITSO-logo.svg", name: "ITSO" },
  { logo: "", name: "SSC" },
  { logo: "", name: "LCLD" },
]

const Auth = () => {
  function scrollTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  useEffect(() => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  }, []);

  const router = useRouter();

  // auth verification
  const pathname = usePathname();
  const [auth, setAuth] = useState<AuthProps>();

  useEffect(() => {
    setAuth(checkAuth(router, pathname));
  }, [router, pathname]);

  interface OrgProps {
    id: number;
    name: string;
    code: string;
  }

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [org, setOrg] = useState<OrgProps | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [error, setError] = useState("");
  const [isStudentLoading, setIsStudentLoading] = useState(false);
  const [isAdminLoading, setIsAdminLoading] = useState(false);
  const [nameOptions, setNameOptions] = useState<string[]>([]);
  const [isOptionsOpen, setIsOptionsOpen] = useState<boolean>(false);

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsOptionsOpen(false);
    setNameOptions([]);
    scrollTop();
    setName(event.target.value);
  };

  const handleNameInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    const newValue = value.toUpperCase().trim();

    setIsOptionsOpen(true);
    setError("");

    if (name === "name") {
      setName(newValue);
    }

    if (name === "code") {
      setCode(newValue);
    }

    const { data, error } = await supabase
      .from("organizations")
      .select("name")
      .like("name", `%${newValue}%`);

    if (error) {
      console.error(error);
    } else {
      setNameOptions(data.map((org) => org.name));
    }
  };

  const getData = async (
    name: string,
    isAdmin: boolean,
    isAdminSignin = false
  ) => {
    const { data, error } = await supabase
      .from("organizations")
      .select()
      .eq("name", name)
      .single();

    if (error) {
      console.error(error);
      setOrg(null);
      setError("name");
      setIsStudentLoading(false);
      setIsAdminLoading(false);
    } else {
      const orgData = data as OrgProps;
      console.log(orgData);

      if (isAdminSignin && orgData.code) {
        console.log("admin signin");

        if (orgData.code === code) {
          const hashedCode = await hashString(orgData.code);

          localStorage.setItem(
            "authToken",
            JSON.stringify({
              org_id: orgData.id,
              name: orgData.name,
              value: hashedCode,
              expiry: new Date().getTime() + 3600000 * 24, // TODO: Remove *24
            })
          );
        } else {
          console.log("wrong password");
          setIsAdminLoading(false);
          setError("code");
          return;
        }

        router.push("/");
      } else {
        if (isAdmin) {
          console.log("admin ");
          setOrg(orgData);
          setIsStudentLoading(false);
          setIsAdminLoading(false);
          setIsModalOpen(true);
        } else {
          localStorage.setItem(
            "authToken",
            JSON.stringify({
              org_id: orgData.id,
              name: orgData.name,
              value: "",
              expiry: new Date().getTime() + 3600000,
            })
          );

          router.push("/");
        }
      }
    }
  };

  const handleStudentSignin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (name) {
      setIsStudentLoading(true);
      getData(name, false);
    }
  };

  const handleAdminSignin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("1");
    if (name) {
      setIsAdminLoading(true);
      getData(name, true, true);
    }
  };

  const toggleModal = () => {
    if (name) {
      setIsAdminLoading(true);
      getData(name, true);
    } else {
      setError("name");
    }
  };

  useEffect(() => {
    if (showCode === true) {
      const timeoutID = setTimeout(() => {
        setShowCode(false);
      }, 500);

      return () => clearTimeout(timeoutID);
    }
  }, [showCode]);

  // useEffect(() => {
  //   const id = setInterval(() => {
  //     console.log("scroll")
  //     window.scrollTo({
  //       top: 0,
  //     });
  //   }, 500)

  //   return () => clearTimeout(id)
  // }, [])

  const [page, setPage] = useState<string>();

  useEffect(() => {
    setPage("admin");
  }, []);

  
  const [selectedUniversity, setSelectedUniversity] = useState<string>("");
  const [selectedOrganization, setSelectedOrganization] = useState<string>("");
  
  useEffect(() => {
    setSelectedUniversity("")
    setSelectedOrganization("")
  }, [page])

  return (
    <div className="fixed bottom-0 bg-gradient-to-b from-gray-100 to-gray-200 grid place-items-center h-[100vh] w-full scroll px-5">
      <div
        className={`fixed top-0 left-0 right-0 h-16 items-center flex flex-row bg-white pl-8`}
      >
        <div className="flex flex-row items-center w-full">
          {/* <PiBookOpenTextFill className='text-emerald-700' size={26} /> */}
          <Image src={logo} width={26} height={26} alt="app logo" />
          <span className="font-medium text-base text-gray-700">ProAttend</span>
          <Link
            href={"signup"}
            className="bg-gray-50 border border-gray-300 cursor-pointer text-sm text- py-2 px-5 ml-auto mr-4 rounded-full active:bg-gray-100 "
          >
            Register Organization
          </Link>
        </div>
      </div>

      {page ? (
        <div className="flex flex-col relative h-fit w-full transition-all duration-300 overflow-hidden p-8 pb-10 bg-white rounded-2xl ">
          <div
            id="page-1"
            className={`${
              page === "1" ? "" : "-translate-x-[100vw] absolute"
            } transition-all duration-300`}
          >
            <div className="flex flex-col">
              <h1 className="text-2xl font-extrabold bg-gradient-to-r from-teal-500 via-emerald-500 to-green-500 bg-clip-text text-transparent ">
                Welcome back
              </h1>
              <p className="text-gray-500 text-sm">
                Please Select Your Role to Continue
              </p>
            </div>

            <div className="flex flex-col gap-3 mt-10">
              <button
                type="button"
                onClick={() => {
                  setPage("student");
                }}
                className=" border border-gray-300 text-black/70 w-full flex flex-row items-center gap-4 bg-none h-fit font-semibold rounded-xl pl-6 py-4 text-sm"
              >
                <FaUser size={26} className="text-black/30" />
                <span>Student</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPage("admin");
                }}
                className=" border border-gray-300 text-black/70 w-full flex flex-row items-center gap-4 bg-none h-fit font-semibold rounded-xl pl-6 py-4 text-sm"
              >
                <FaKey size={26} className="text-black/30" />
                <span>Admin</span>
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
              <div className="flex flex-row gap-3 items-center mt-5">
                <FaUser size={22} className="text-gray-600" />
                <h1 className="text-xl font-semibold ">Sign in as student</h1>
              </div>

              <form 
                action="" 
                className="mt-10"
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="university"
                    className="text-sm font-semibold text-gray-600"
                  >
                    University
                  </label>
                  <Combobox 
                    placeholder="Select a university"
                    options={UniversityOptions}
                    selectedOption={selectedUniversity}
                    setSelectedOption={setSelectedUniversity}
                  />
                </div>

                <div className="flex flex-col gap-2 mt-6">
                  <label
                    htmlFor="org"
                    className="text-sm font-semibold text-gray-600"
                  >
                    Student organization
                  </label>
                  <Combobox 
                    placeholder="Select a school organization"
                    options={OrganizationOptions}
                    selectedOption={selectedOrganization}
                    setSelectedOption={setSelectedOrganization}
                  />
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
                    Go back
                  </button>

                  <button
                    type="submit"
                    className=" text-white w-fit max-h-10 flex flex-row items-center justify-center bg-emerald-500 h-fit font-semibold rounded-lg p-2.5 px-8 text-sm active:bg-emerald-400"
                  >
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
              <div className="flex flex-row gap-3 items-center mt-5">
                <FaKey size={22} className="text-gray-600" />
                <h1 className="text-xl font-semibold ">Sign in as admin</h1>
              </div>

              <form 
                action="" 
                className="mt-10"
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="university"
                    className="text-sm font-semibold text-gray-600"
                  >
                    University

                  </label>
                  <Combobox 
                    placeholder="Select a university"
                    options={UniversityOptions}
                    selectedOption={selectedUniversity}
                    setSelectedOption={setSelectedUniversity}
                  />
                </div>

                <div className="flex flex-col gap-2 mt-6">
                  <label
                    htmlFor="org"
                    className="text-sm font-semibold text-gray-600"
                  >
                    Student organization
                  </label>
                  <Combobox 
                    placeholder="Select a school organization"
                    options={OrganizationOptions}
                    selectedOption={selectedOrganization}
                    setSelectedOption={setSelectedOrganization}
                  />
                </div>

                <div className="flex flex-col gap-2 mt-6">
                  <label
                    htmlFor="pass"
                    className="text-sm font-semibold text-gray-600"
                  >
                    Password
                  </label>
                  <div className="bg-gray-100 border border-gray-200 rounded-lg p-1 pl-4 focus:border-opacity-80 text-sm w-full flex flex-row items-center">
                    <input
                      type="password"
                      placeholder="••••••"
                      className="bg-transparent w-full mr-2 outline-none"
                    />
                    <button
                      className="text-gray-600 mr-1 p-3"
                      type="button"
                      onClick={() => {
                        scrollTop();
                        setShowCode(true);
                      }}
                    >
                      {showCode ? (
                        <FaRegEye size={16} />
                      ) : (
                        <FaRegEyeSlash size={16} />
                      )}
                    </button>
                  </div>
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
                    Go back
                  </button>

                  <button
                    type="submit"
                    className=" text-white w-fit max-h-10 flex flex-row items-center justify-center bg-emerald-500 h-fit font-semibold rounded-lg p-2.5 px-8 text-sm active:bg-emerald-400"
                  >
                    Sign in
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <Spinner />
      )}

      {/* 
      <div className="hidden flex-col gap-3 mt-6">
        <button
          form="form-name"
          type="submit"
          className="b text-white w-full max-h-10 flex  flex-row items-center justify-center bg-emerald-500 h-fit font-semibold rounded-full p-2.5 text-sm active:bg-emerald-400"
        >
          {isStudentLoading ? (
            <span className="flex flex-row items-center gap-2">
              <Spinner size="1" color="white" className="translate-y-[3px]" />
              Signing in
            </span>
          ) : (
            <span>Sign in as student</span>
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            toggleModal();
          }}
          className=" text-emerald-600 w-full max-h-10 flex flex-row items-center justify-center bg-none h-fit font-semibold rounded-full p-2.5 text-sm"
        >
          {isAdminLoading ? (
            <span className="flex flex-row items-center gap-2">
              <Spinner size="1" className="translate-y-[3px]" />
              Signing in
            </span>
          ) : (
            <span>Sign in as admin</span>
          )}
        </button>
      </div>

      <form
        id="form-name"
        onSubmit={handleStudentSignin}
        className="hidden flex-col w-full mt-12 relative"
      >
        <input
          id="name"
          name="name"
          value={name}
          ref={nameInputRef}
          onChange={handleNameInputChange}
          onFocus={() =>
            setTimeout(() => {
              scrollTop();
            }, 500)
          }
          type="text"
          autoComplete="off"
          placeholder="Organization name"
          className={`
              ${error === "name" ? "!border-red-400" : ""}
              bg-gray-100 border border-gray-200 rounded-full p-2.5 pl-5 outline-none focus:border-opacity-80 mt-2 text-sm
            `}
        />

        <div className="w-full h-0 relative" ref={optionsRef} id="options">
          {nameOptions.length > 0 && isOptionsOpen && (
            <div className="bg-white border-gray-200 border w-full h-fit text-sm absolute shadow-xl rounded-2xl p-1 max-h-[9rem] overflow-y-scroll">
              {nameOptions.map((option, index) => {
                return (
                  <label
                    key={index}
                    className="p-3 rounded-xl inline-block w-full active:bg-gray-100"
                  >
                    <input
                      type="radio"
                      className="hidden"
                      onChange={handleOptionChange}
                      name="org-name"
                      value={option}
                    />{" "}
                    {option}
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {error === "name" && (
          <span className="text-red-400 text-sm mt-1 font-semibold">
            Organization not found, please try again.
          </span>
        )}
      </form> */}

      {/* {isModalOpen && (
        <div className="fixed top-0 left-0 right-0 bottom-0 grid place-items-center p-5">
          <div
            onClick={() => {
              setIsModalOpen(false);
              setCode("");
            }}
            className="bg-black backdrop-blur-sm bg-opacity-40 h-full w-full absolute z-[100]"
          ></div>
          <form
            id="form-code"
            onSubmit={handleAdminSignin}
            className="flex flex-col h-fit w-full bg-white z-[200] rounded-2xl p-8"
          >
            <div className="flex flex-row items-center gap-3">
              <div className="bg-gray-100 rounded-full p-1.5 border border-gray-200">
                <HiMiniUserGroup size={20} className="text-gray-600" />
              </div>
              <h1 className="font-bold text-xl text-gray-800">{org?.name}</h1>
            </div>
            <div
              id="password-container"
              className={`flex flex-row items-center bg-gray-100 border border-gray-30 rounded-full mt-8 pl-2 overflow-hidden ${
                error === "code" ? "!border-red-400" : ""
              }`}
            >
              <input
                id="code"
                name="code"
                value={code}
                onFocus={() =>
                  setTimeout(() => {
                    scrollTop();
                  }, 500)
                }
                onChange={handleNameInputChange}
                type={showCode ? "text" : "password"}
                autoComplete="off"
                placeholder="Passcode"
                className="bg-gray-100 text-sm p-2.5 w-full outline-none"
              />
              <button
                className="p-3 opacity-70"
                type="button"
                onClick={() => {
                  scrollTop();
                  setShowCode(true);
                }}
              >
                {showCode ? (
                  <FaRegEye size={16} />
                ) : (
                  <FaRegEyeSlash size={16} />
                )}
              </button>
            </div>
            {error === "code" && (
              <span className="text-red-400 text-sm mt-1 font-semibold">
                Wrong passcode
              </span>
            )}
            <button
              type="submit"
              form="form-code"
              className=" text-white w-full max-h-10 flex  flex-row items-center justify-center bg-emerald-500 h-fit font-semibold rounded-full p-2.5 text-sm active:bg-emerald-50 mt-4"
            >
              {isAdminLoading ? (
                <span className="flex flex-row items-center gap-2">
                  <Spinner
                    size="1"
                    color="white"
                    className="translate-y-[3px]"
                  />
                  Signing in
                </span>
              ) : (
                <span>Sign in as admin</span>
              )}
            </button>
          </form>
        </div>
      )} */}
    </div>
  );
};

export default Auth;
