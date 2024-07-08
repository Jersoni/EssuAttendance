'use client'
import styles from './styles.module.css';
import { useEffect, useRef, useState } from "react";

// imported components
import { SearchBar, StudentCard } from "@/components";

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
  const fetchRef = useRef(false)

  useEffect(() => {

    if(fetchRef.current) return;
    fetchRef.current = true;
    
    const getStudents = async () => {
      try {
        const res = await fetch('/api/students')
        const json = await res.json()

        if(!res.ok) {
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
    <div className="max-h-[100vh] overflow-y-auto pt-24 pb-40 px-5">
      <SearchBar className="mt-5"/>
      <div className={` ${styles.studentsList} mt-6`}> 
        {data.length !== 0 && data.map(student => (
          <StudentCard key={student.id} studentData={student}/>
        ))}
        {!data && <span>Could not fetch students forn the database.</span>}
      </div>
    </div>
  )
}

export default Page