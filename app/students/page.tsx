'use client'
import styles from './styles.module.css';
import { useEffect, useState } from "react";
import { SearchBar, StudentCard, StudentForm, Filter } from "@/components";

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
    <div className={` max-h-[90vh] `}>
      <StudentForm /> {/* Scroll down to see component */}
      <Filter buttonClassName='absolute right-2 top-1 grid place-items-center h-12 w-12 z-[30]' />
      <div className={` ${styles.studentsList} pb-40 px-5 overflow-y-auto min-h-[calc(100vh-4.5rem)] max-h-[calc(100vh-4.5rem)]`}> 
        <SearchBar className='mb-6 mt-6' />
        {students.length !== 0 && students.map(student => (
          <StudentCard key={student.id} studentData={student} />
        ))}
        {!students.length && <span>...</span>}
      </div>
    </div>
  )
}

export default Page