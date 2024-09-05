'use client'
import { Filter, SearchBar, StudentCard, StudentForm } from "@/components";
import supabase from '@/lib/supabaseClient';
import { StudentProps } from '@/types';
import { lineSpinner } from 'ldrs';
import { useEffect, useState } from "react";
import InfiniteScroll from 'react-infinite-scroll-component';
import styles from './styles.module.css';

const Page = () => {

  lineSpinner.register()

  const [students, setStudents] = useState<StudentProps[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const getStudents = async () => {
    const { data, error } = await supabase
      .from('student')
      .select('*')
      .order('lastName', { ascending: true })
      .range((page - 1) * 10, page * 10 - 1);

    if (error) {
      console.error('Error fetching posts:', error);
    } else {
      setStudents([...students, ...data]);
      setHasMore(data.length === 10);
    }

    setLoading(false);
  };
  
  useEffect(() => {
    getStudents()
  }, [page])

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
        console.log('updated student: ')
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
      <StudentForm /> 
      {/* <Filter buttonClassName='fixed right-2 top-1 grid place-items-center h-12 w-12 z-[30]' /> */}
      <div className={` ${styles.studentsList} pb-40 px-5 min-h-[100vh]`}> 
        <SearchBar className='mb-6 pt-20' fill='bg-gray-200' />
        <div className='bg-white h-fit pl-5 shadow-sm rounded-xl overflow-hidden'>
          {/* TODO: Implement infinite scrolling on students list */}
          <InfiniteScroll
            dataLength={students.length}
            next={() => {setPage(page + 1)}}
            hasMore={hasMore}
            endMessage={<div className="absolute w-full text-center left-0 mt-5 text-sm text-gray-600" key={1}>End of list</div>}
            loader={<div className="h-14 absolute left-0 w-full mt-5 items-center flex justify-center" key={0}>
                      <l-line-spinner
                        size="25"
                        stroke="2"
                        speed="1" 
                        color="black"
                      ></l-line-spinner>
                    </div>}
          >
            {students.length !== 0 && students.map((student, index) => {
              return (
                <StudentCard key={student.id} studentData={student} />
              )
            })}
          </InfiniteScroll>
        </div>
      </div>
    </div>
  )
}

export default Page