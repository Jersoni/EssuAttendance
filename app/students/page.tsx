'use client'
import { Filter, SearchBar, StudentCard, StudentForm } from "@/components";
import { useEffect, useState } from "react";
import styles from './styles.module.css';

import supabase from '@/lib/supabaseClient';
import { StudentProps } from '@/types';

const Page: React.FC = () => {

  const [students, setStudents] = useState<StudentProps[]>([])

  const getStudents = async () => {
      try {
        const res = await fetch('/api/students');
        const json = await res.json();

        if (!res.ok) {
          throw new Error('Error fetching students');
        }
        
        setStudents(json)

      } catch (error) {
        console.error(error);
        throw error;
      }
  };
  
  useEffect(() => {
    getStudents()
  }, [])

  useEffect(() => {
    
    const channel = supabase
      .channel('realtime_students_A')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'student'
      }, (payload) => {
        console.log('new student: ')
        console.log(payload.new)
        setStudents([...students, (payload.new as StudentProps)])
        getStudents()
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'student'
      }, (payload) => {
        console.log('new student: ')
        console.log(payload.new)
        setStudents([...students, (payload.new as StudentProps)])
        getStudents()
      })
      .on('postgres_changes', {
        event: 'DELETE',
        schema: 'public',
        table: 'student'
      }, (payload) => {
        console.log('deleted student id: ' + payload.old)
        getStudents()
      })
      .subscribe()
    
    return () => {
      supabase.removeChannel(channel)
    }
  })

  return (
    <div className='bg-gray-100'>
      {/* TODO: student form client side functionality */}
      <StudentForm /> 
      <Filter buttonClassName='fixed right-2 top-1 grid place-items-center h-12 w-12 z-[30]' />
      <div className={` ${styles.studentsList} pb-40 px-5 min-h-[100vh]`}> 
        <SearchBar className='mb-6 pt-20' fill='bg-gray-200' />
        <div className='bg-white h-fit pl-5 shadow-sm rounded-xl'>
          {students.length !== 0 && students.map((student, index) => {
             
            if (index === students.length - 1) {
              return (
                <StudentCard key={student.id} studentData={student} className='!border-0' />
              ) 
            }

            return (
              <StudentCard key={student.id} studentData={student} />
            )

          })}
        </div>
        {!students.length && <span>...</span>}
      </div>
    </div>
  )
}

export default Page