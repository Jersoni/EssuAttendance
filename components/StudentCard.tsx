'use client'
import { ConfirmationModal } from "@/components";
import supabase from "@/lib/supabaseClient";
import { StudentProps } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import { IoIosArrowForward } from "react-icons/io";

const  StudentCard: React.FC<{studentData: StudentProps, eventId?: number, isChecked?: boolean, className?: string}> = ({ studentData, eventId, isChecked, className }) => {
  
  // First Name & Last Name formatting
  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
  let firstName = capitalizeFirstLetter(studentData.firstName)
  let lastName = capitalizeFirstLetter(studentData.lastName)
  
  // Middle Initial formatting
  let middleInitial: string = ''
  if (studentData.middleName !== null) {
    middleInitial = studentData.middleName.charAt(0).toUpperCase() + '.'
  }
  
  // Student ID formatting
  let studentID: string = studentData.id.toString()
  if (studentID.length > 2) {
    studentID = studentID.slice(0, 2) + '-' + studentID.slice(2, studentID.length)
  }
  
  // Course formatting
  let course: string = studentData.course
  if (course === 'BSINFOTECH') {
    course = 'BS INFO TECH'
  }
  
  // Section formatting
  let section = studentData.section.toUpperCase()

  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isPresent, setIsPresent] = useState(isChecked)

  // Event handler
  function handleCheckboxChange() {
    setIsPresent(!isPresent)
    setIsOpen(!isOpen)
  }

  // UPDATE 
  useEffect(() => {
    // A query to update 'isPresent' in the database, table 'attendance'
    async function updateQuery( studentId: number, eventId: any, isPresent:boolean | undefined ) {
      const { data, error } = await supabase
      .from('attendance')
      .update({ isPresent })
      .eq('studentId', studentId)
      .eq('eventId', eventId)
      if (error) {
        console.error(error);
        // Handle error, e.g., show error message to user
      } else {
        console.log('Database updated successfully');
      }
    }
    
    updateQuery(studentData.id, eventId, isPresent)
  }, [studentData.id, isPresent, eventId])

  // MODAL
  const modalDescription = `Mark ${firstName} ${lastName} as ${isPresent ? 'absent' : 'present'}?`

  function handleModalToggle() {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    console.log(isPresent)
  }, [isPresent])

  return (
    <div className={`flex flex-row items-center gap-4 border-gray-200 border-b z-100 ${className}`}>

      {/* CHECKBOX */}
      {pathname.slice(0, 7) === '/events' && (
        <>
          {
            isPresent 
            ? <FaCircleCheck 
                onClick={handleModalToggle} 
                size={36}   
                fill="rgb(5 150 105)" 
                className="border-0 m-0 p-0" 
              /> 
            : <div 
                onClick={handleModalToggle} 
                className="bg-gray-200 h-8 min-w-8 rounded-full"
              >
              </div>
          }
          <input checked={isPresent} type="checkbox" className={`h-7 w-7 hidden`} onChange={handleModalToggle}  />
        </>
      )}

      {/* STUDENT */}
      <Link href={`/students/${studentData.id}`} className={`flex flex-row justify-between w-full items-center py-3 z-100`}>
        <div>
          <h2 className='text-sm font-[400]'>{`${lastName}, ${firstName} ${middleInitial}`} </h2>
          <div className={`student-card__info-container !z-100 mt-[2px] gap-3`}>
            <span className={`student-card__info !font-semibold !text-gray-700`}>{studentID}</span>
            {/* <div className='min-h-[2px] min-w-[2px] max-h-[2px] max-w-[2px] bg-black opacity-40 rounded-full m-2 z-100'></div> */}
            <span className={`student-card__info text-gray-700`}>{`${course} ${studentData.year}${section}`}</span>
          </div>
        </div>
        <IoIosArrowForward className="opacity-40 mr-3"/>
      </Link>

      {/* MODAL */}
      <ConfirmationModal 
        isOpen={isOpen} 
        title="Confirm Attendance"
        content={modalDescription} 
        onClose={handleModalToggle}
        onConfirm={handleCheckboxChange}  
      />
      
    </div>
  )

}

export default StudentCard