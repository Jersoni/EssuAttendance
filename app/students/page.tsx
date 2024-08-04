'use client'
import styles from './styles.module.css';
import { useEffect, useState } from "react";
import { SearchBar, StudentCard, StudentForm, Filter } from "@/components";
import { StudentProps } from '@/types';

const Page: React.FC = () => {

  const [ data, setData ] = useState<StudentProps[]>([])

  useEffect(() => {
    
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
        console.log(json)
        return

      } catch (error) {
        console.error(error)
      }
    }

    getStudents()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
    
  return (
    <div className={` max-h-[100vh] pt-[4.5rem]`}>
      <StudentForm /> {/* Scroll down to see component */}
      <Filter className='absolute right-5 top-4 z-[30]' />
      <div className={` ${styles.studentsList} pb-40 px-5 overflow-y-auto min-h-[calc(100vh-4.5rem)] max-h-[calc(100vh-4.5rem)]`}> 
        <SearchBar className='mb-6 mt-5' />
        {data.length !== 0 && data.map(student => (
          <StudentCard key={student.id} studentData={student} />
        ))}
        {!data && <span>Could not fetch students forn the database.</span>}
      </div>
    </div>
  )
}

export default Page