import React from "react"


interface Student {
  id: number
  firstName: string
  lastName: string
  college: string
  yearLevel: number
  section: string
}

const StudentList: React.FC<{ studentData: Student }> = ({ studentData }) => {
  return (
    <div>

      <div className={'.studentContainer'}>
            <h2>{`${studentData.lastName}, ${studentData.firstName}`}</h2>
            <div className='mt-2'>
              <div className='flex flex-row'>
                <span className=".info">Student ID</span>
                <span className='.info .description'>{studentData.id}</span>
              </div>
              <div className='flex flex-row'>
                <span className=".info">Course</span>
                <span className='.info .description'>{studentData.college}</span>
              </div>
              <div className='flex flex-row'>
                <span className=".info">Year & Section</span>
                <span className='.info .description'>{`${studentData.yearLevel}- ${studentData.section}`}</span>
              </div>
            </div>
          </div>
    </div>
  )
}


export default StudentList;