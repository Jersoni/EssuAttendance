import React from 'react'
import styles from './styles.module.css';


interface Student {
    id: number
    firstName: string
    lastName: string
    college: string
    yearLevel: number
    section: string
}


const  StudentDetails: React.FC<{studentData: Student}> = ({ studentData }) => {
  return (
    <div className={`${styles.studentContainer}`}>
        <h2 className=''>{`${studentData.lastName}, ${studentData.firstName}`}</h2>
        <div className={`${styles.infoContainer}`}>
          <span className={`${styles.info}`}>{studentData.id}</span>
          <div className='min-h-[2px] min-w-[2px] bg-black opacity-40 rounded-full m-2'></div>
          <span className={`${styles.info}`}>{`${studentData.college} ${studentData.yearLevel}-${studentData.section}`}</span>
        </div>
    </div>
  )
}

export default StudentDetails
