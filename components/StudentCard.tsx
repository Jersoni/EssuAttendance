'use client'
import { ConfirmationModal } from "@/components";
import supabase from "@/lib/supabaseClient";
import { Attendance, AuthProps, StudentProps } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import { IoIosArrowForward } from "react-icons/io";
import { HiLogin } from "react-icons/hi";
import { HiLogout } from "react-icons/hi";
import { FaCheck } from "react-icons/fa";
import { checkAuth } from "@/utils/utils";
import { useRouter } from "next/navigation";
import { FaCircleUser } from "react-icons/fa6";

const  StudentCard: React.FC<{studentData: StudentProps, eventId?: number, className?: string}> = ({ studentData, eventId, className }) => {
  
  const router = useRouter()
  const pathname = usePathname();

  // auth verification
  const [ auth, setAuth ] = useState<AuthProps>()
  useEffect(() => {
    setAuth(checkAuth(router, pathname))
  }, [router, pathname])

  // Course formatting
  let course: string = studentData.course
  if (course === 'BSINFOTECH') {
    course = 'BS INFO TECH'
  }
  
  // Section formatting
  let section = studentData.section.toUpperCase()

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const [isLoginPresent, setIsLoginPresent] = useState(studentData.isLoginPresent)
  const [isLogoutPresent, setIsLogoutPresent] = useState(studentData.isLogoutPresent)

  useEffect(() => {
    setIsLoginPresent(studentData.isLoginPresent)
  }, [studentData.isLoginPresent])

  useEffect(() => {
    setIsLogoutPresent(studentData.isLogoutPresent)
  }, [studentData.isLogoutPresent])

  function handleLoginCheckboxChange() {
    setIsLoginPresent(!isLoginPresent)
    setIsLoginModalOpen(!isLoginModalOpen)
  }

  function handleLogoutCheckboxChange() {
    setIsLogoutPresent(!isLogoutPresent)
    setIsLogoutModalOpen(!isLogoutModalOpen)
  }

  // UPDATE DATABASE LOGIN STATUS
  useEffect(() => {
    // if isLoginPresent changes
    // A query to update 'isLoginPresent' in the database, table 'attendance'
    async function updateQuery( studentId: string, eventId: any, isLoginPresent:boolean | undefined) {
      try {
        const { data, error } = await supabase
        .from('attendance')
        .update({ isLoginPresent: isLoginPresent })
        .eq('studentId', studentId)
        .eq('eventId', eventId)
        if (error) {
          console.error(error);
          // Handle error, e.g., show error message to user
        } else {
          console.log('Database updated successfully for login status');
        }
      } catch(e) {
        console.error(e)
      }
    }
    
    updateQuery(studentData.id, eventId, isLoginPresent)
  }, [studentData.id, isLoginPresent, eventId])

  // UPDATE DATABASE LOGOUT STATUS
  useEffect(() => {
    // if isLogoutPresent changes
    // A query to update 'isLogoutPresent' in the database, table 'attendance'
    async function updateQuery( studentId: string, eventId: any, isLogoutPresent:boolean | undefined) {
      try {
        const { data, error } = await supabase
        .from('attendance')
        .update({ isLogoutPresent: isLogoutPresent })
        .match({
          studentId: studentId,
          eventId: eventId
        })
        if (error) {
          console.error(error);
          // Handle error, e.g., show error message to user
        } else {
          console.log('Database updated successfully for logout status');
        }
      } catch(e) {
        console.error(e)
      }
    }
    
    updateQuery(studentData.id, eventId, isLogoutPresent)
  }, [studentData.id, isLogoutPresent, eventId])

  // MODALS DESCRIPTION
  function handleLoginModalToggle() {
    if (auth?.role === "admin") {
      if (isLogoutPresent === true) {
        setIsLogoutModalOpen(!isLogoutModalOpen)
      } else {
        setIsLoginModalOpen(!isLoginModalOpen)
      }
    }
  }

  function handleLogoutModalToggle() {
    if (auth?.role === "admin") {
      if (isLoginPresent === false) {
        setIsLoginModalOpen(!isLoginModalOpen)
      } else {
        setIsLogoutModalOpen(!isLogoutModalOpen)
      }
    }
  }

  function getFirstName() {
    if (studentData.name.indexOf(".") === -1) {
      return studentData.name.split(",")[1].trim()
    } else {
      return studentData.name.split(",")[1].slice(0, (studentData.name.split(",")[1].indexOf(".")-2)).trim()
    }
  }

  
  return (
    <div className={`flex flex-row items-center gap-4 border-gray-200 border- z-100 ${className}`}>
      {/* STUDENT */}
      <Link href={`/students/${studentData.id}`} className={`flex flex-row w-full items-center py-3 z-100`}>
        <FaCircleUser size={45} className="mr-3 text-gray-500" />
        <div className="">
          <h2 className='text-sm text-nowrap text-ellipsis overflow-hidden inline-block w-60 '>{`${studentData.name}`}</h2>
          <div className={`student-card__info-container !z-100 mt-[2px] gap-3`}>
            <span className={`student-card__info !text-gray-700`}>{studentData.id}</span>
            {/* <div className='min-h-[2px] min-w-[2px] max-h-[2px] max-w-[2px] bg-black opacity-40 rounded-full m-2 z-100'></div> */}
            <span className={`student-card__info text-gray-700`}>{`${course} ${studentData.year}${section}`}</span>
          </div>
        </div>
        {/* <IoIosArrowForward className="opacity-40 mr-3"/> */}
      </Link>

      {/* CHECKBOX */}
      {(pathname.slice(0, 7) === '/events' ) && (
        <div className={`flex flex-row gap-2 `}>
          <div
            onClick={handleLoginModalToggle} 
            className={`bg-gray-100 borde border-gray-300 h-9 min-w-9 rounded-md grid place-items-center ${auth?.role === "student" ? "!bg-white " : ""}`}>
            {isLoginPresent && <FaCheck className={"text-gray-600"} size={18} />}
            <input 
              checked={isLoginPresent}
              disabled={auth?.role === "student"}
              onChange={handleLoginModalToggle}  
              type="checkbox" 
              className={`h-6 w-6 hidden`} 
            />
          </div>
          <div
            onClick={handleLogoutModalToggle} 
            className={`bg-gray-200/60 borde border-gray-300 h-9 min-w-9 rounded-md grid place-items-center ${auth?.role === "student" ? "!bg-white " : ""}`}>
            {isLogoutPresent && <FaCheck className={"text-gray-600"} size={18} />}
            <input 
              checked={isLogoutPresent} 
              disabled={auth?.role === "student"}
              onChange={handleLogoutModalToggle}  
              type="checkbox" 
              className={`h-6 w-6 hidden`} 
            />
          </div>
        </div>
      )}

      {/* MODALS */}
      <ConfirmationModal 
        isOpen={isLoginModalOpen} 
        title="Confirm Attendance"
        content={
          <div className="text-sm">Mark {getFirstName()}&apos;s login status as {isLoginPresent ? 'absent' : 'present'}?</div>
        } 
        onClose={handleLoginModalToggle}
        onConfirm={handleLoginCheckboxChange} 
        className={"!bg-opacity-20"}
      />

      <ConfirmationModal
        isOpen={isLogoutModalOpen} 
        title="Confirm Attendance"
        content={
          <div className="text-sm">Mark {studentData.name}&apos;s logout status as {isLogoutPresent ? 'absent' : 'present'}?</div>
        } 
        onClose={handleLogoutModalToggle}
        onConfirm={handleLogoutCheckboxChange}  
      />
      
    </div>
  )

}

export default StudentCard