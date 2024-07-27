import { IoIosArrowForward } from "react-icons/io";
import Link from "next/link";

interface Student {
  id: number
  firstName: string
  lastName: string
  middleName: string
  course: string
  year: number
  section: string
}

const  StudentCard: React.FC<{studentData: Student}> = ({ studentData }) => {

  
  // First Name & Last Name
  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
  let firstName = capitalizeFirstLetter(studentData.firstName)
  let lastName = capitalizeFirstLetter(studentData.lastName)

  // Middle Initial
  let middleInitial: string = ''
  if (studentData.middleName !== null) {
    middleInitial = studentData.middleName.charAt(0).toUpperCase() + '.'
  }

  // Student ID
  let studentID: string = studentData.id.toString()
  if (studentID.length > 2) {
    studentID = studentID.slice(0, 2) + '-' + studentID.slice(2, studentID.length)
  }

  // Course
  let course: string = studentData.course
  if (course === 'BSINFOTECH') {
    course = 'BS INFO TECH'
  }

  // Section
  let section = studentData.section.toUpperCase()



  return (
    <Link href={'/students/student'} className={`student-card__student-container`}>
      <div>
        <h2 className='text-[14px]'>{`${lastName}, ${firstName} ${middleInitial}`} </h2>
        <div className={`student-card__info-container`}>
          <span className={`student-card__info`}>{studentID}</span>
          <div className='min-h-[2px] min-w-[2px] max-h-[2px] max-w-[2px] bg-black opacity-40 rounded-full m-2'></div>
          <span className={`student-card__info`}>{`${course} ${studentData.year}${section}`}</span>
        </div>
      </div>
      <IoIosArrowForward className="opacity-80"/>
    </Link>
  )

}

export default StudentCard