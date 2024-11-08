'use client'
import supabase from '@/lib/supabaseClient'
import { AuthProps } from '@/types';
import { checkAuth } from '@/utils/utils';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { Spinner } from '@/components';
import { PiBookOpenTextFill } from "react-icons/pi";
import { hashString } from '@/utils/utils';
import { HiMiniUserGroup } from "react-icons/hi2";
import { useAppContext } from '@/context';

const Auth = () => {

  const [count, setCount] = useState<number>(0)

  useEffect(() => { 
    setTimeout(() => {
      setCount(count + 1)
    }, 1000)
  }, [count])

  function scrollTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }

  useEffect(() => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth' 
    });
  }, [])

  const router = useRouter()

  // auth verification
  const [ auth, setAuth ] = useState<AuthProps>()

  useEffect(() => {
    setAuth(checkAuth(router, true))
  }, [router])

  interface OrgProps {
    id: number
    name: string
    code: string
  }

  const [name, setName] = useState("")
  const [code, setCode] = useState("")
  const [org, setOrg] = useState<OrgProps | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showCode, setShowCode] = useState(false)
  const [error, setError] = useState("")
  const [isStudentLoading, setIsStudentLoading] = useState(false)
  const [isAdminLoading, setIsAdminLoading] = useState(false)
  const [nameOptions, setNameOptions] = useState<string[]>([])
  const [isOptionsOpen, setIsOptionsOpen] = useState<boolean>(false)

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsOptionsOpen(false)
    setNameOptions([])
    scrollTop()
    setName(event.target.value)
  }

  const handleNameInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = event.target
    const newValue = value.toUpperCase().trim()

    setIsOptionsOpen(true)
    setError("")

    if (name === "name") {
      setName(newValue)
    } 

    if (name === "code") {
      setCode(newValue)
    }

    const {data, error} = await supabase
      .from("organizations")
      .select("name")
      .like('name', `%${newValue}%`)
  
    if (error) {
      console.error(error)
    } else {
      setNameOptions(data.map((org) => org.name))
    }
    
  }

  const getData = async (name: string, isAdmin: boolean, isAdminSignin = false) => {

    const {data, error} = await supabase
      .from("organizations")
      .select()
      .eq("name", name)
      .single()

    if (error) {
      console.error(error)
      setOrg(null)
      setError("name")
      setIsStudentLoading(false)
      setIsAdminLoading(false)
    } else {

      const orgData = data as OrgProps
      console.log(orgData)

      if (isAdminSignin && orgData.code) {
        console.log("admin signin")

        if (orgData.code === code) {
          const hashedCode = await hashString(orgData.code)
  
          localStorage.setItem('authToken', JSON.stringify({
            org_id: orgData.id,
            name: orgData.name,
            value: hashedCode,
            expiry: new Date().getTime() + 3600000
          }))
        } else {
          console.log("wrong password")
          setIsAdminLoading(false)
          setError("code")
          return
        }

        router.push("/")

      } else {

        if (isAdmin) {
          console.log("admin ")
          setOrg(orgData)
          setIsStudentLoading(false)
          setIsAdminLoading(false)
          setIsModalOpen(true)
        } else {
          localStorage.setItem('authToken', JSON.stringify({
            org_id: orgData.id,
            name: orgData.name,
            value: "",
            expiry: new Date().getTime() + 3600000
          }))
  
          router.push("/")
        }

      }
      
    }
  }

  const handleStudentSignin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    
    if (name) {
      setIsStudentLoading(true)
      getData(name, false)
    }
  }

  const handleAdminSignin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log("1")
    if (name) {
      setIsAdminLoading(true)
      getData(name, true, true)
    }
  }

  const toggleModal = () => {
    if (name) {
      setIsAdminLoading(true)
      getData(name, true)
    } else {
      setError("name")
    }
  }

  useEffect(() => {
    if (showCode === true) {
      const timeoutID = setTimeout(() => {
        setShowCode(false)
      }, 500)

      return () => clearTimeout(timeoutID);
    }  
  }, [showCode])

  // useEffect(() => {
  //   const id = setInterval(() => {
  //     console.log("scroll")
  //     window.scrollTo({
  //       top: 0,
  //     });
  //   }, 500)

  //   return () => clearTimeout(id)
  // }, [])

  return (
    <div className='fixed bottom-0 bg-white grid place-items-center h-[100vh] w-full scroll'>

      <div className={`fixed top-0 left-0 right-0 h-20 items-center flex flex-row bg-white pl-8`}>
        <div className='flex flex-row items-center gap-2 w-full'>
          <PiBookOpenTextFill className='text-emerald-700' size={26} />
          <span className='font-bold text-lg text-gray-700'>ESSUattend</span>
        </div>
      </div>

      <span className='fixed top-8 right-8'>{count}</span>

      <div className='flex flex-col w-full p-10'>
        <div className='flex flex-col'>
          <h1 className='text-2xl font-extrabold text-gray-900'>Welcome back</h1>
          <p className='text-gray-500 font-semibold text-sm'>Sign in to your school student organization</p>
        </div>
        <form  
          id='form-name'
          onSubmit={handleStudentSignin} 
          className='flex flex-col w-full mt-12 relative'
        >
          <label 
            htmlFor="name" 
            className='font-semibold text-sm text-gray-900'
          >Organization name</label>
          <input 
            id='name' 
            name='name' 
            value={name} 
            onChange={handleNameInputChange}
            onFocus={() => setTimeout(() => { scrollTop() }, 500) }
            type="text" 
            autoComplete='off' 
            className={`
              ${error === "name" ? "!border-red-400" : ""}
              bg-gray-100 border border-green-900 border-opacity-40 tracking-wide rounded-lg p-3 outline-none focus:border-opacity-80 mt-2 font-semibold text-gray-900 text-sm
            `}
          />

          {/* Name Options */}
          <div className='w-full h-0 relative'>
            {(nameOptions.length > 0 && isOptionsOpen) && (
              <div className='bg-white border-gray-300 border w-full h-fit text-sm font-semibold text-gray-700 absolute shadow-xl rounded-lg p-1 max-h-[9rem] overflow-y-scroll'>

                {nameOptions.map((option, index) => {
                  return (
                    <label key={index} className='p-3 rounded-md inline-block w-full active:bg-gray-100'>
                      <input 
                        type="radio" 
                        className='hidden'
                        onChange={handleOptionChange}
                        name='org-name'
                        value={option}
                      /> {option}
                    </label>
                  )
                })}
              </div>
            )}
          </div>

          {/* Buttons */}
          {error === "name" && <span className='text-red-400 text-sm mt-1 font-semibold'>Organization not found, please try again.</span>}
          <div className='flex flex-col gap-3 mt-12'>

            <button 
              type='button' 
              onClick={() => {
                toggleModal()
              }}
              className=' border-green-900 border-opacity-50 text-white w-full max-h-10 flex  flex-row items-center justify-center bg-emerald-600 h-fit font-semibold rounded-lg p-2.5 border text-sm active:bg-emerald-500'
            >
              {isAdminLoading
              ? (
                <span className='flex flex-row items-center gap-2'>
                  <Spinner size='1' color='white' className='translate-y-[3px]' />
                  Signing in
                </span>
              ) : (
                <span>Sign in as admin</span>
              )}
            </button>

            <button 
              form='form-name'
              type='submit'
              className='border-green-900 border-opacity-50 text-gray-800 w-full max-h-10 flex  flex-row items-center justify-center h-fit font-semibold rounded-lg p-2.5 border text-sm active:bg-emerald-50'
            >
              {isStudentLoading
              ? (
                <span className='flex flex-row items-center gap-2'>
                  <Spinner size='1' className='translate-y-[3px]' />
                  Signing in
                </span>
              ) : (
                <span>Sign in as student</span>
              )}
            </button>

          </div>
        </form>
        {/* <div className='flex flex-row gap-3 h-fit mt-10'>
          <div className='w-full border-t translate-y-[50%] border-gray-400 '></div>
          <span className='font-semibold text-gray-500 text-sm'>or</span>
          <div className='w-full border-t translate-y-[50%] border-gray-400 '></div>
        </div>
        <button 
          type='button' 
          className=' w-full active:bg-emerald-50 grid place-items-center font-semibold text-gray-800 rounded-lg max-h-10 h-10 border text-sm border-green-900 border-opacity-50 mt-10'
        >Register a new organization</button> */}
      </div>

      {isModalOpen && (
        <div className="fixed top-0 left-0 right-0 bottom-0 grid place-items-center p-5">
          <div
            onClick={() => {
              setIsModalOpen(false)
              setCode("")
            }} 
            className='bg-black bg-opacity-40 h-full w-full absolute z-[100]'
          ></div>
          <form id='form-code' onSubmit={handleAdminSignin} className='flex flex-col h-fit w-full bg-white z-[200] rounded-lg p-5'>
            <div className='flex flex-row items-center gap-3'>
              <div className='bg-gray-200 rounded-full p-1.5 border border-gray-300'>
                <HiMiniUserGroup size={20} className='text-gray-600' />
              </div>
              <h1 className='font-extrabold text-xl text-gray-800'>{org?.name}</h1>
            </div>
            <label
              htmlFor="code"
              className='font-semibold text-sm mt-6 text-gray-900'
            >Passcode</label>
            <div id='password-container' className={`flex flex-row items-center bg-gray-100 border border-green-900 border-opacity-40 tracking-wide rounded-lg mt-2 font-semibold text-gray-900 overflow-hidden ${error === "code" ? "!border-red-400" : ""}`}>
              <input
                id='code' 
                name='code'
                value={code} 
                onFocus={() => setTimeout(() => { scrollTop() }, 500) }
                onChange={handleNameInputChange} 
                type={showCode ? "text" : "password"} 
                autoComplete='off' 
                className='bg-gray-100 text-sm p-3 w-full outline-none' 
              />
              <button
                className='p-3 opacity-70'
                type='button'
                onClick={() => {
                  scrollTop()
                  setShowCode(true)
                }}
              >
                {showCode
                  ? <FaRegEye size={16} />
                  : <FaRegEyeSlash size={16} />
                }
              </button>
            </div>
            {error === "code" && <span className='text-red-400 text-sm mt-1 font-semibold'>Wrong passcode</span>}
            <button 
              type='submit'
              form='form-code'
              className='border-green-900 border-opacity-50 text-white w-full max-h-10 flex  flex-row items-center justify-center bg-emerald-600 h-fit font-semibold rounded-lg p-2.5 border text-sm active:bg-emerald-50 mt-8'
            >
              {isAdminLoading
              ? (
                <span className='flex flex-row items-center gap-2'>
                  <Spinner size='1' color='white' className='translate-y-[3px]' />
                  Signing in
                </span>
              ) : (
                <span>Sign in as admin</span>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default Auth