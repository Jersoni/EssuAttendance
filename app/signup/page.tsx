"use client";

import { InputComponent, Spinner, Combobox } from "@/components";
import supabase from "@/lib/supabaseClient";
import { Baloo_Bhai_2 } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaCheck, FaCheckCircle } from "react-icons/fa";
import { IoMdArrowBack, IoMdArrowForward } from "react-icons/io";
import { IoCloseCircle } from "react-icons/io5";
import logo from "/public/logo/presenxia-fill.svg";

const balooBhai = Baloo_Bhai_2({ subsets: ["latin"], weight: "500" });

interface formProps {
  university: string;
  organization: string;
  password: string;
  repeatPassword: string;
  program: string; 
}

const UniversityOptions: Array<string> = [
  "ESSU Guiuan",
 ]

const programOptions: Array<string> = [
  "BS INFO TECH",
  "BSHM",
  "BSCRIM",
  "BTVTED",
  "BSTM",
  "BSCE",
  "BSIT",
  "BOT",
  "BSE",
  "BSBA",
  "BSAIS",
  "BAC",
  "BSEd.",
  "BEED",
  "BSN",
];

const Signup = () => {
  const [page, setPage] = useState(0);
  const [error, setError] = useState<
    "passwordMatch" | "passwordLength" | "accountExists"
  >();
  const [loading, setLoading] = useState(false);

  const [selectedUniversity, setSelectedUniversity] = useState<string>();
  const [selectedProgram, setSelectedProgram] = useState<string>();
  const [formData, setFormData] = useState<formProps>({
    university: "",
    organization: "",
    password: "",
    repeatPassword: "",
    program: "",
  });

  useEffect(() => {
    if (selectedProgram) {
      setFormData(prev => {
        return {
         ...prev,
          program: selectedProgram,
        };
      })
    }
  }, [selectedProgram])

  useEffect(() => {
    if (selectedUniversity) {
      setFormData(prev => {
        return {
         ...prev,
          program: selectedUniversity,
        };
      })
    }
  }, [selectedUniversity])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setError(undefined);
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // Update only the field that changed
    }));
  };

  const handleNextClick = () => {
    if (selectedUniversity && formData.organization && selectedProgram ) {
      setLoading(true)

      ;(async () => {
        try {
          const { data, error } = await supabase
            .from("organizations")
            .select("*")
            .ilike("university", `%${formData.university}%`)
            .ilike("organization", `%${formData.organization}%`)
            .limit(1)
            .single();

          if (error) {
            if (error.code === "PGRST116") {
              setPage(page + 1);
            } else {
              console.error(error);
            }
          } else {
            console.log(data);
            setError("accountExists");
          }

          setLoading(false);
        } catch (err) {
          console.error(err);
        }
      })();
    }
    if (page === 1 && formData.password && formData.repeatPassword) {
      if (formData.password !== formData.repeatPassword) {
        setError("passwordMatch");
      } else if (formData.password.length < 6) {
        setError("passwordLength");
      } else {
        setError(undefined);
        setPage(page + 1);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);

    e.preventDefault();
    console.log("Form Data:", formData);

    (async () => {
      try {
        const { data, error } = await supabase.from("organizations").insert({
          university: formData.university,
          organization: formData.organization,
          password: formData.password,
        });

        if (error) {
          console.error(error);
        } else {
          console.log(data);
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    })();
  };

  const [selectedPlan, setSelectedPlan] = useState<string>("basic");

  const handlePlanChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPlan(event.target.value);
  };

  useEffect(() => {
    console.log(formData)
  }, [formData])

  return (
    <div className="bg-white min-h-[100vh] pb-60 w-[100vw] overflow-x-hidden">
      {/* HEADER */}
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

      {/* MAIN */}
      <form
        id="form"
        className="flex flex-col relative"
        onSubmit={handleSubmit}
      >
        <div
          className={`${page === 0 ? "" : "-translate-x-[100vw] absolute"} 
            transition-all duration-300 px-5`}
        >
          <div className="flex flex-col mt-10 border- border-gray-300 pb-6">
            <h1 className="text-2xl font-bold ">Sign up</h1>
            <p className="text-gray-800 text-sm mt-2">
              Complete simple steps to get started
            </p>
          </div>

          {error === "accountExists" && (
            <p className="text-sm text-red-400 flex flex-row items-center gap-2">
              <IoCloseCircle size={18} />
              Account already exists
            </p>
          )}

          <div className="mt-6 flex flex-col gap-6">
            <Combobox 
              label="University"
              placeholder="Select a university"
              options={UniversityOptions}
              selectedOption={selectedUniversity}
              setSelectedOption={setSelectedUniversity}
            />

            <InputComponent
              label="Organization name"
              type="text"
              name="organization"
              onChange={handleChange}
            />
            
            <Combobox
              label="Program of students managed"
              options={programOptions}
              selectedOption={selectedProgram}
              setSelectedOption={setSelectedProgram}
              className="z-[5000] rerlative"
            />
          </div>
        </div>

        <div
          className={`
            ${page < 1 ? "absolute translate-x-[100vw]" : ""} 
            ${page > 1 ? "absolute -translate-x-[100vw]" : ""}
            transition-all px-5 duration-300 `}
        >
          <div className="flex flex-col mt-10 border- border-gray-300 pb-6">
            <h1 className="text-2xl font-bold ">Admin Account Setup</h1>
            <p className="text-gray-800 text-sm mt-2">
              Set up your admin account for managing students and attendance
              records.
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-6">
            <InputComponent
              label="Admin password"
              description="Minimum: 6 characters"
              type="password"
              name="password"
              onChange={handleChange}
            />

            {error === "passwordLength" && (
              <p className="text-sm text-red-400 flex flex-row items-center gap-2">
                <IoCloseCircle size={18} />
                Password must have atleast 6 characters
              </p>
            )}

            <InputComponent
              label="Repeat password"
              type="password"
              name="repeatPassword"
              onChange={handleChange}
            />

            {error === "passwordMatch" && (
              <p className="text-sm text-red-400 flex flex-row items-center gap-2">
                <IoCloseCircle size={18} />
                Passwords do not match
              </p>
            )}

            <p className="text-sm text-gray-500">
              Reminder: Save this password securely. You can change it later if
              needed.
            </p>
          </div>
        </div>

        <div
          className={`
            ${page < 2 ? "absolute translate-x-[100vw]" : ""} 
            ${page > 2 ? "absolute -translate-x-[100vw]" : ""}
            transition-all px-5 duration-300 `}
        >
          <div className="flex flex-col mt-10 border- border-gray-300 pb-6">
            <h1 className="text-2xl font-bold max-w-80 ">
              Choose the plan that&apos;s right for you.
            </h1>
          </div>

          <div className="mt-6 flex flex-row gap-4">
            <div
              onClick={() => {
                setSelectedPlan("basic");
              }}
              className={`${
                selectedPlan === "basic" ? "border-gray-800 border-2" : ""
              } border border-gray-300 rounded-xl w-full h-32 relative p-5 flex flex-col cursor-pointer`}
            >
              <input
                type="radio"
                name="plan"
                value={"basic"}
                onChange={handlePlanChange}
                checked={selectedPlan === "basic"}
                className={`hidden`}
              />
              <span className="font-medium text-lg">Basic</span>
              <div className="text-sm text-gray-600">
                <span className="mt-0.5">Free</span>
              </div>
              {selectedPlan === "basic" && (
                <FaCheckCircle
                  size={20}
                  className="absolute bottom-3 right-3"
                />
              )}
            </div>
            <div
              // onClick={() => {setSelectedPlan("pro")}}
              className={`${
                selectedPlan === "pro" ? "border-gray-800 border-2" : ""
              } border border-gray-300 rounded-xl w-full h-32 relative p-5 flex flex-col cursor-not-allowed `}
            >
              <input
                type="radio"
                name="plan"
                value={"pro"}
                onChange={handlePlanChange}
                checked={selectedPlan === "pro"}
                className={`hidden`}
              />
              <span className="font-medium text-lg opacity-50">Pro</span>
              <div className="text-sm text-gray-600">
                <span className="mt-0.5 mr-2 opacity-50">₱100</span>
                {/* <span className="text-xs">(Buy me a coffee)</span> */}
              </div>
              {selectedPlan === "pro" && (
                <FaCheckCircle
                  size={20}
                  className="absolute bottom-3 right-3"
                />
              )}
              <span className="text-sm absolute bottom-3 right-3 bg-gray-100 ">
                Coming soon
              </span>
            </div>
          </div>

          <div className="mt-10 flex flex-col px-3">
            <Feature
              label="Annual price"
              value={selectedPlan === "basic" ? "₱0" : "₱100"}
              // include={selectedPlan === "pro"}
            />
            <Feature label="Real-time attendance tracking" />
            {/* <Feature 
              label="Bulk student data import"
              description="Easily import user data via CSV"
            />
            <Feature 
              label="Data export options"
              description="Export in PDF format"
            /> */}
            <Feature
              label="Unlimited secure data storage"
              // include={selectedPlan === "pro"}
            />
            <Feature
              label="RFID scan"
              description="RFID scanner for instant check-ins"
              // include={selectedPlan === "pro"}
            />
            <Feature
              label="School ID scan"
              description="School ID scanner for instant check-ins"
              // include={selectedPlan === "pro"}
            />
            <Feature
              label="Ongoing support for help when you need it" // include={selectedPlan === "pro"}
            />
          </div>
        </div>
      </form>

      <div className="flex flex-row items-center justify-between mt-16 px-5">
        {page === 0 ? (
          <Link
            href={"/auth"}
            className=" text-black w-fit max-h-10 bg-gray-200 h-fit font-semibold rounded-lg p-2.5 px-8 text-sm active:bg-gray-300 grid place-items-center"
          >
            {/* {isSubmitLoading && <Spinner size="1.4" />} */}
            Cancel
          </Link>
        ) : (
          <button
            onClick={() => {
              setPage(page - 1);
            }}
            className=" text-black flex flex-row items-center gap-2 w-fit max-h-10 bg-gray-200 h-fit font-semibold rounded-lg p-2.5 px-6 text-sm active:bg-gray-300"
          >
            {/* {isSubmitLoading && <Spinner size="1.4" />} */}
            <IoMdArrowBack size={16} />
            Back
          </button>
        )}

        {page !== 2 ? (
          <button
            type="button"
            onClick={() => {
              handleNextClick();
            }}
            className=" text-white w-fit max-h-10 bg-blue-500 h-fit font-semibold rounded-lg p-2.5 px-6 text-sm active:bg-blue-400 min-w-28"
          >
            {/* {isSubmitLoading && <Spinner size="1.4" />} */}
            {loading ? (
              <Spinner size="1.4" />
            ) : (
              <span className="flex flex-row items-center gap-2">
                Next
                <IoMdArrowForward size={16} />
              </span>
            )}
          </button>
        ) : (
          <button
            type="submit"
            form="form"
            onClick={() => {
              console.log("submit");
            }}
            className="text-white grid place-items-center gap-2 w-fit min-w-40 max-h-10 bg-blue-500 h-fit font-semibold rounded-lg p-2.5 px-6 text-sm active:bg-blue-400"
          >
            {loading ? <Spinner size="1.4" /> : <span>Start Membership</span>}
          </button>
        )}
      </div>
    </div>
  );
};

export default Signup;

const Feature = ({
  label,
  description,
  include = true,
  value,
}: {
  label?: string;
  description?: string;
  include?: boolean;
  value?: string;
}) => {
  return (
    <div
      className={`flex flex-row items-center border-b justify-between py-2.5 border-gray-300 h-fit w-full ${
        include ? "" : "opacity-50"
      } `}
    >
      <div className="flex flex-col">
        <span className="text-gray-600 text-sm font-medium">{label}</span>
        <span className="text-xs text-gray-400">{description}</span>
      </div>

      {value ? (
        <span className=" font-medium text-gray-800">{value}</span>
      ) : (
        <FaCheck
          size={16}
          className={`text-gray-700 ${include ? "" : "text-gray-700/40"}`}
        />
      )}
    </div>
  );
};
