import React from "react"
import styles from './styles.module.css';



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

      <div className={styles.studentContainer}>
            <h2>{`${studentData.lastName}, ${studentData.firstName}`}</h2>
            <div className='mt-2'>
              <div className='flex flex-row'>
                <span className={styles.info}>Student ID</span>
                <span className={`${styles.info} ${styles.description}`}>{studentData.id}</span>
              </div>
              <div className='flex flex-row'>
                <span className={styles.info}>Course</span>
                <span className={`${styles.info} ${styles.description}`}>{studentData.college}</span>
              </div>
              <div className='flex flex-row'>
                <span className={styles.info}>Year & Section</span>
                <span className={`${styles.info} ${styles.description}`}>{`${studentData.yearLevel}- ${studentData.section}`}</span>
              </div>
            </div>
          </div>
    </div>
  )
}


export default StudentList;