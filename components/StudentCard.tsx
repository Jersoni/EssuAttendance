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
  <div className={`student-card__student-container`}>
      <h2 className=''>{`${studentData.lastName}, ${studentData.firstName}`}</h2>
      <div className={`student-card__info-container`}>
        <span className={`student-card__info`}>{studentData.id}</span>
        <div className='min-h-[2px] min-w-[2px] bg-black opacity-40 rounded-full m-2'></div>
        <span className={`student-card__info`}>{`${studentData.college} ${studentData.yearLevel}-${studentData.section}`}</span>
      </div>
  </div>
)
}

export default StudentCard