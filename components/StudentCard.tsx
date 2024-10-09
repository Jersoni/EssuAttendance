'use client'
import { ConfirmationModal } from "@/components";
import supabase from "@/lib/supabaseClient";
import { StudentProps } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import { IoIosArrowForward } from "react-icons/io";
import { HiLogin } from "react-icons/hi";
import { HiLogout } from "react-icons/hi";
import { FaCheck } from "react-icons/fa";

const  StudentCard: React.FC<{studentData: StudentProps, eventId?: number, className?: string}> = ({ studentData, eventId, className }) => {
  
  // Course formatting
  let course: string = studentData.course
  if (course === 'BSINFOTECH') {
    course = 'BS INFO TECH'
  }
  
  // Section formatting
  let section = studentData.section.toUpperCase()

  const pathname = usePathname()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const [isLoginPresent, setIsLoginPresent] = useState(studentData.isLoginPresent)
  const [isLogoutPresent, setIsLogoutPresent] = useState(studentData.isLogoutPresent)

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
      const { data, error } = await supabase
      .from('attendance')
      .update({ isLoginPresent: isLoginPresent })
      .eq('studentId', studentId)
      .eq('eventId', eventId)
      if (error) {
        console.error(error);
        // Handle error, e.g., show error message to user
      } else {
        // console.log('Database updated successfully for login status');
      }
    }
    
    updateQuery(studentData.id, eventId, isLoginPresent)
  }, [studentData.id, isLoginPresent, eventId])

  // UPDATE DATABASE LOGOUT STATUS
  useEffect(() => {
    // if isLogoutPresent changes
    // A query to update 'isLogoutPresent' in the database, table 'attendance'
    async function updateQuery( studentId: string, eventId: any, isLogoutPresent:boolean | undefined) {
      const { data, error } = await supabase
      .from('attendance')
      .update({ isLogoutPresent: isLogoutPresent })
      .eq('studentId', studentId)
      .eq('eventId', eventId)
      if (error) {
        console.error(error);
        // Handle error, e.g., show error message to user
      } else {
        // console.log('Database updated successfully for logout status');
      }
    }
    
    updateQuery(studentData.id, eventId, isLogoutPresent)
  }, [studentData.id, isLogoutPresent, eventId])

  // MODALS DESCRIPTION
  function handleLoginModalToggle() {
    if (isLogoutPresent === true) {
      setIsLogoutModalOpen(!isLogoutModalOpen)
    } else {
      setIsLoginModalOpen(!isLoginModalOpen)
    }
  }

  function handleLogoutModalToggle() {
    if (isLoginPresent === false) {
      setIsLoginModalOpen(!isLoginModalOpen)
    } else {
      setIsLogoutModalOpen(!isLogoutModalOpen)
    }
  }

  return (
    <div className={`flex flex-row items-center gap-4 border-gray-200 border-b z-100 ${className}`}>

      {/* STUDENT */}
      <Link href={`/students/${studentData.id}`} className={`flex flex-row justify-between w-full items-center py-3 z-100`}>
        <div>
          <h2 className='text-sm font-[400]'>{`${studentData.name}`} </h2>
          <div className={`student-card__info-container !z-100 mt-[2px] gap-3`}>
            <span className={`student-card__info !font-semibold !text-gray-700`}>{studentData.id}</span>
            {/* <div className='min-h-[2px] min-w-[2px] max-h-[2px] max-w-[2px] bg-black opacity-40 rounded-full m-2 z-100'></div> */}
            <span className={`student-card__info text-gray-700`}>{`${course} ${studentData.year}${section}`}</span>
          </div>
        </div>
        {/* <IoIosArrowForward className="opacity-40 mr-3"/> */}
      </Link>

      {/* CHECKBOX */}
      {pathname.slice(0, 7) === '/events' && (
        // <div>
        //   {
        //     isPresent 
        //     ? <FaCircleCheck 
        //         onClick={handleModalToggle} 
        //         size={28}   
        //         fill="rgb(5 150 105)" 
        //         className="border-0 m-0 p-0" 
        //       /> 
        //     : <div 
        //         onClick={handleModalToggle} 
        //         className="bg-gray-200 h-7 min-w-7 rounded-full"
        //       >
        //       </div>
        //   }
        //   <input checked={isPresent} type="checkbox" className={`h-6 w-6 hidden`} onChange={handleModalToggle}  />
        // </div>
        <div className={`flex flex-row gap-2`}>
          <div
            onClick={handleLoginModalToggle} 
            className={`bg-gray-200 bg-opacity-80 border border-gray-300 h-9 min-w-9 rounded-md grid place-items-center`}>
            {isLoginPresent && <FaCheck size={18} />}
            <input 
              checked={isLoginPresent} 
              onChange={handleLoginModalToggle}  
              type="checkbox" 
              className={`h-6 w-6 hidden`} 
            />
          </div>
          <div
            onClick={handleLogoutModalToggle} 
            className={`bg-gray-200 bg-opacity-80 border border-gray-300 h-9 min-w-9 rounded-md grid place-items-center`}>
            {isLogoutPresent && <FaCheck size={18} />}
            <input 
              checked={isLogoutPresent} 
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
          <div>Mark {studentData.name}&apos;s <span className="font-bold">login status</span> as <span className="font-bold">{isLoginPresent ? 'absent' : 'present'}</span>?</div>
        } 
        onClose={handleLoginModalToggle}
        onConfirm={handleLoginCheckboxChange}  
      />

      <ConfirmationModal
        isOpen={isLogoutModalOpen} 
        title="Confirm Attendance"
        content={
          <div>Mark {studentData.name}&apos;s <span className="font-bold">logout status</span> as <span className="font-bold">{isLogoutPresent ? 'absent' : 'present'}</span>?</div>
        } 
        onClose={handleLogoutModalToggle}
        onConfirm={handleLogoutCheckboxChange}  
      />
      
    </div>
  )

}

export default StudentCard