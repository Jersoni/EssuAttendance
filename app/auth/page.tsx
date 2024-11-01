'use client'
import supabase from '@/lib/supabaseClient'
import { AuthProps } from '@/types';
import { checkAuth } from '@/utils/utils';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useJwt } from "react-jwt";
import crypto from 'crypto';

const Auth = () => {

  const router = useRouter()

  // auth verification
  const [ auth, setAuth ] = useState<AuthProps>()
  useEffect(() => {
    setAuth(checkAuth(router, true))
  }, [router])

  async function hashString(input: string) {
    return crypto.createHash('sha256').update(input).digest('hex');
  }

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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = event.target
    const newValue = value.toUpperCase()

    setError("")

    if (name === "name") {
      setName(newValue)
    } 

    if (name === "code") {
      setCode(newValue)
    }
  }

  const getData = async (name: string, isAdmin: boolean, isAdminSignin = false) => {
    console.log("2")
    const {data, error} = await supabase
      .from("organizations")
      .select()
      .eq("name", name)
      .single()

    if (error) {
      console.error(error)
      setOrg(null)
      setError("name")
    } else {
      console.log("3")
      console.log(data)
      const authData = data as AuthProps

      if (isAdminSignin && data.code) {
        console.log("admin signin")
        const hashedCode = await hashString(data.code)

        localStorage.setItem('authToken', JSON.stringify({
          name: data.name,
          value: hashedCode,
          expiry: new Date().getTime() + 3600000
        }))

        router.push("/")
      } else {
        if (isAdmin) {
          setOrg(data)
          setIsModalOpen(!isModalOpen)
        } else {
          localStorage.setItem('authToken', JSON.stringify({
            name: authData.name,
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
    if (name) getData(name, false)
  }

  const handleAdminSignin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log("1")
    if (name) getData(name, true, true)
  }

  const toggleModal = () => {
    if (name) {
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

  return (
    <div className='grid place-items-center h-[90vh] w-full'>
      <div className='flex flex-col w-full p-10'>
        <div className='flex flex-col'>
          <h1 className='text-2xl font-bold text-emerald-700'>Welcome back</h1>
          <p className='text-gray-600 font-semibold text-sm'>Sign in to your organization</p>
        </div>
        <form 
          id='form-name'
          onSubmit={handleStudentSignin} 
          className='flex flex-col w-full mt-12'
        >
          <label 
            htmlFor="name" 
            className='font-semibold text-sm text-gray-600'
          >Organization name</label>
          <input 
            id='name' 
            name='name' 
            value={name} 
            onChange={handleChange} 
            type="text" 
            autoComplete='off' 
            className={`
              ${error === "name" ? "!border-red-400" : ""}
              bg-gray-100 border border-green-900 border-opacity-40 tracking-wide rounded-lg p-3 outline-none mt-3 font-semibold text-gray-900 text-sm
            `} 
          />
          {error === "name" && <span className='text-red-400 text-sm mt-1 font-semibold'>Organization not found, please try again.</span>}
          <div className='flex flex-row gap-3 mt-8'>
            <button 
              form='form-name'
              type='submit'
              className='border-green-900 border-opacity-70 text-gray-700 w-full h-fit font-semibold rounded-lg p-2.5 border text-sm active:bg-emerald-50'
            >Sign in as student</button>
            <button 
              type='button' 
              onClick={toggleModal}
              className='bg-emerald-600 w-full h-fit font-semibold text-white rounded-lg p-2.5 border border-emerald-500 text-sm active:bg-emerald-500'
            >Sign in as admin</button>
          </div>
        </form>
        <div className='flex flex-row gap-3 h-fit mt-10'>
          <div className='w-full border-t translate-y-[50%] border-gray-400 '></div>
          <span className='font-semibold text-gray-500 text-sm'>or</span>
          <div className='w-full border-t translate-y-[50%] border-gray-400 '></div>
        </div>
        <button 
          type='button' 
          className='w-full active:bg-emerald-50 h-fit font-semibold text-gray-700 rounded-lg p-3 border text-sm border-green-900 border-opacity-70 mt-10'
        >Register a new organization</button>
      </div>

      {isModalOpen && (
        <div className="fixed top-0 left-0 right-0 bottom-0 grid place-items-center p-5">
          <div
            onClick={() => {
              toggleModal()
              setCode("")
            }} 
            className='bg-black bg-opacity-40 h-full w-full absolute z-[100]'
          ></div>
          <form id='form-code' onSubmit={handleAdminSignin} className='flex flex-col h-fit w-full bg-white z-[200] rounded-lg p-5'>
            <h1 className='font-bold text-xl text-gray-700'>{org?.name}</h1>
            <label 
              htmlFor="code" 
              className='font-semibold text-sm text-gray-600'
            >Organization passcode</label>
            <div className={`flex flex-row items-center bg-gray-100 border border-green-900 border-opacity-40 tracking-wide rounded-lg mt-3 font-semibold text-gray-900 overflow-hidden ${error === "code" ? "!border-red-400" : ""}`}>
              <input
                id='code' 
                name='code'
                value={code} 
                onChange={handleChange} 
                type={showCode ? "text" : "password"} 
                autoComplete='off' 
                className='bg-gray-100 text-sm p-3 w-full outline-none' 
              />
              <button
                className='p-3 opacity-70'
                type='button'
                onClick={() => setShowCode(true)}
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
              className='bg-emerald-600 w-full h-fit font-semibold text-white rounded-lg p-2.5 border active:bg-emerald-500 mt-8 text-sm'
            >Sign in as admin</button>
          </form>
        </div>
      )}
    </div>
  )
}

export default Auth