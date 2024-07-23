import { IoIosArrowForward } from "react-icons/io";
import Link from "next/link";

interface Student {
  id: number
  firstName: string
  lastName: string
  college: string
  yearLevel: number
  section: string
}

const  StudentCard: React.FC<{studentData: Student}> = ({ studentData }) => {
return (
  <Link href={'/students/student'} className={`student-card__student-container`}>
    <div>
      <h2 className='text-[14px]'>{`${studentData.lastName}, ${studentData.firstName}`}</h2>
      <div className={`student-card__info-container`}>
        <span className={`student-card__info`}>{studentData.id}</span>
        <div className='min-h-[2px] min-w-[2px] max-h-[2px] max-w-[2px] bg-black opacity-40 rounded-full m-2'></div>
        <span className={`student-card__info`}>{`${studentData.college} ${studentData.yearLevel}${studentData.section}`}</span>
      </div>
    </div>
    <IoIosArrowForward className="opacity-80"/>
  </Link>
)
}

export default StudentCard