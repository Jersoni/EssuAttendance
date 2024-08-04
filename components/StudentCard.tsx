'use client'
import { IoIosArrowForward } from "react-icons/io";
import Link from "next/link";
import { StudentProps } from "@/types";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import { ConfirmationModal } from "@/components";

const  StudentCard: React.FC<{studentData: StudentProps, eventId?: number, isChecked?: boolean, pageState?: string}> = ({ studentData, eventId, isChecked, pageState /* pageState = present or absent */ }) => {
  
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

  const [isPresent, setIsPresent] = useState(isChecked)

  // Event handler
  function handleCheckboxChange() {
    setIsPresent(!isPresent)
    setIsOpen(!isOpen)
  }

  // make query on state change
  useEffect(() => {
    // A query to update 'isPresent' in the database
    async function updateQuery( studentId: number, eventId: any, isPresent:boolean ) {
      const { data, error } = await supabase
      .from('attendance')
      .update({ isPresent })
      .eq('studentId', studentId)
      .eq('eventId', eventId)
      if (error) {
        console.error(error);
        // Handle error, e.g., show error message to user
      } else {
        console.log('Database updated successfully:', data);
        // Handle success, e.g., update UI, show success message
      }
    }
    
    if (isPresent){
      updateQuery(studentData.id, eventId, isPresent)
    }
  }, [studentData.id, isPresent, eventId])

  // Just some frontend script
  let isHidden = true;
  if ((pageState === 'absent' && !isPresent) || (pageState === 'present' && isPresent) || (pathname.slice(0, 9) === '/students')) {
    isHidden = false
  }

  // MODAL
  const modalDescription = `Please confirm the attendance update: Mark ${firstName} ${lastName} as ${pageState === 'present' ? 'absent' : 'present'}.`
  const [isOpen, setIsOpen] = useState(false)

  function handleModalToggle() {
    setIsOpen(!isOpen)
  }
  
  return (
    <div className={`${isHidden && 'hidden'} flex flex-row items-center gap-4 border-gray-300 border-b z-100`}>
      {pathname.slice(0, 7) === '/events' && (
        <input checked={isPresent} type="checkbox" className={`h-7 w-7`} onChange={handleModalToggle}  />
      )}
      <Link href={`/students/${studentData.id}`} className={`flex flex-row justify-between w-full items-center py-3 z-100`}>
        <div>
          <h2 className='text-[14px]'>{`${lastName}, ${firstName} ${middleInitial}`} </h2>
          <div className={`student-card__info-container !z-100`}>
            <span className={`student-card__info`}>{studentID}</span>
            <div className='min-h-[2px] min-w-[2px] max-h-[2px] max-w-[2px] bg-black opacity-40 rounded-full m-2 z-100'></div>
            <span className={`student-card__info`}>{`${course} ${studentData.year}${section}`}</span>
          </div>
        </div>
        <IoIosArrowForward className="opacity-40"/>
      </Link>

      <ConfirmationModal 
        isOpen={false} 
        title="Confirm Attendance Update"
        content={modalDescription} 
        onClose={handleModalToggle}
        onConfirm={handleCheckboxChange}  
      />
      
    </div>
  )

}

export default StudentCard