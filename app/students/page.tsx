'use client'
import { Filter, SearchBar, StudentCard, StudentForm } from "@/components";
import supabase from '@/lib/supabaseClient';
import { StudentProps } from '@/types';
import { lineSpinner } from 'ldrs';
import { useEffect, useState } from "react";
import InfiniteScroll from 'react-infinite-scroll-component';
import styles from './styles.module.css';
import { BiSearchAlt } from "react-icons/bi";
import { RiFilter2Line } from "react-icons/ri";
import { IoSearch } from "react-icons/io5";
import { RiFilter2Fill } from "react-icons/ri";

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
      .order('name', { ascending: true })
      .range((page - 1) * 20, page * 20 - 1);

    if (error) {
      console.error('Error fetching posts:', error);
    } else {
      setStudents([...students, ...data]);
      setHasMore(data.length === 20);
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
        setStudents((prevStudents) => [...prevStudents, payload.new as StudentProps])
        getStudents()
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'student'
      }, (payload) => {
        console.log('updated student: ')
        console.log(payload.new)
        setStudents((prevStudents) => [...prevStudents, payload.new as StudentProps])
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
  }, [])

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<StudentProps[] | any>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className='bg-white h-[100vh] pt-20'>
      <StudentForm />

      {/* buttons */}
      <div className="fixed flex flex-row top-0 right-16 h-14 z-[1000] ">
        <button 
          onClick={() => {setIsSearchOpen(true)}}
          className="grid place-items-center p-2 h-full bg-neutral-10 text-gray-700"
        >
          <IoSearch size={20} />
        </button>
        <button 
          onClick={() => {setIsFilterOpen(true)}}
          className="grid place-items-center p-2 h-full bg-neutral-10 text-gray-700"
        >
          <RiFilter2Line size={20} />
        </button>
      </div>

      {/* <Filter buttonClassName='fixed right-2 top-1 grid place-items-center h-12 w-12 z-[30]' /> */}
      <div className={` ${styles.studentsList} pb-40 px-5`}>
        {/* <SearchBar className='mb-6 pt-20' fill='bg-gray-200' />  */}
        <div className='shadow-sm h-fit'>
          {/* TODO: Implement infinite scrolling on students list */}
          <InfiniteScroll
            dataLength={students.length}
            next={() => {setPage(page + 1)}}
            hasMore={hasMore}
            endMessage={<div className="absolute w-full text-center left-0 mt-5 text-sm text-gray-400" key={1}>End of list</div>}
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