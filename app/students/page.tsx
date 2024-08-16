'use client'
import styles from './styles.module.css';
import { useEffect, useState } from "react";
import { SearchBar, StudentCard, StudentForm, Filter } from "@/components";
import { StudentProps } from '@/types';
import supabase from '@/lib/supabaseClient';
import useFetchStudents from '@/hooks/useFetchStudents';

const Page: React.FC = () => {

  const { students, getStudents } = useFetchStudents()

  useEffect(() => {

    console.log('entered useEffect')

    getStudents()

    const channel = supabase.channel('realtime_students_A').on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'student'
      }, 
      (payload) => {
        // setStudents([...students, payload.new as StudentProps])
        console.log(payload)
      },
    ).subscribe()

    return () => {
      supabase.removeChannel(channel)
      console.log('removed channel')
    }

}, [])
    
  return (
    <div className={` max-h-[100vh] pt-[4.5rem]`}>
      <StudentForm /> {/* Scroll down to see component */}
      <Filter className='absolute right-5 top-4 z-[30]' />
      <div className={` ${styles.studentsList} pb-40 px-5 overflow-y-auto min-h-[calc(100vh-4.5rem)] max-h-[calc(100vh-4.5rem)]`}> 
        <SearchBar className='mb-6 mt-5' />
        {students.length !== 0 && students.map(student => (
          <StudentCard key={student.id} studentData={student} />
        ))}
        {!students.length && <span>Could not fetch students forn the database.</span>}
      </div>
    </div>
  )
}

export default Page