'use client'
import styles from './styles.module.css';
import { useEffect, useState } from "react";

// imported components
import { SearchBar } from "@/components";
import StudentList from "@/components/StudentList";

interface Student {
  id: number
  firstName: string
  lastName: string
  college: string
  yearLevel: number
  section: string
}

const Page: React.FC = () => {

  const [ data, setData ] = useState<Student[]>([])

  useEffect(() => {
    const getStudents = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/students')
        const json = await res.json()

        if(!res.status) {
          console.error('Error fetch students.')
          return
        }

        if(!data) {
          console.log('No student Found')
        }

        setData(json)
        return

      } catch (error) {
        console.error(error)
      }

    }

    getStudents()


  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  console.log(data)

  
  return (
    <>
      
      <div className="max-h-[100vh] overflow-y-auto pt-24 pb-40">

        <div className="px-3">
          <SearchBar className="mt-5"/>
        </div>

        <div className={` ${styles.studentsList} mt-8 `}> 
          {data.map(student => (
            <StudentList key={student.id} studentData={student} />
          ))}
          
        </div>
      </div>
    </>
  )
}

export default Page