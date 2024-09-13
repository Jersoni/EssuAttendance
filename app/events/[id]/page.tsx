// eslint-disable @next/next/no-async-client-component 
"use client"
import { Filter, PageHeader, SearchBar, StudentCard } from '@/components';
import supabase from '@/lib/supabaseClient';
import { Attendance, EventProps, StudentProps } from '@/types';
import { formatDate } from '@/utils/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { LuScanLine } from "react-icons/lu";
import styles from './styles.module.css';
import { lineSpinner } from 'ldrs';


const EventPage: React.FC = ({ params }: any) => {

  lineSpinner.register()

  const searchParams = useSearchParams()
  const router = useRouter()

  // SERVER SIDE SCRIPT



  // FETCH EVENT
  const [event, setEvent] = useState<EventProps>()
  
  useEffect(() => {
    const getEvent = async () => {
      try {
        const res = await fetch(`/api/events/event?id=${params.id}`, {
          method: "GET"
        })
        
        if (res) {
          const json = await res.json() 
          if(json) setEvent(json)
          }
        
      } catch (error) {
        console.log(error)
      }
    }
    
    getEvent()
  }, [params.id])
  
  
  
  // FETCH ATTENDANCE
  const [attendanceData, setAttendanceData] = useState<Attendance[]>([]);
  const [students, setStudents] = useState<StudentProps[]>([])
  const [error, setError] = useState(null);

  useEffect(() => {

    if (searchParams.get('displayOption')) {

      const displayOptions: boolean[] = []

      searchParams.get('displayOption')?.split(',').map( value => 
        displayOptions.push(value === 'true')
      )

      const fetchAttendanceData = async () => {
        const { data: attendanceData, error } = await supabase
          .from('attendance')
          .select('*')
          .eq('eventId', 9)
          .in('isPresent', displayOptions)

        if (attendanceData) {
          const studentIDs = attendanceData.map(data => data.studentId)
          console.log(attendanceData)

          const queryParams = {
            courses: searchParams.get('courses')?.split(','),
            years: searchParams.get('years')?.split(',').map(i => parseInt(i)),
            sections: searchParams.get('sections')?.split(','),
            order: searchParams.get('order'),
            sortBy: searchParams.get('sortBy')
          }

          if (queryParams.courses && queryParams.years && queryParams.sections && queryParams.sortBy) {
            const { data, error } = await supabase
              .from('student')
              .select('*')
              .in('id', studentIDs)
              .in('course', queryParams.courses)
              .in('year', queryParams.years)
              .in('section', queryParams.sections)
              .order(queryParams.sortBy, { ascending: queryParams.order === 'true' })

            if(data) {
              let modifiedData = data.map((student) => {
                const attendance = attendanceData.find(row => row.studentId === student.id);
                return {
                  ...student,
                  isPresent: attendance?.isPresent
                };
              });
              setStudents(modifiedData)
            }
          }
        }
      }

      fetchAttendanceData()

    } else {
      const fetchAttendanceData = async () => {
        try {
          const response = await fetch(`/api/getAttendance?id=${params.id}`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
  
          const result = await response.json();
          setAttendanceData(result);
          
        } catch (error: any) {
          setError(error.message);
        }
      };
      
      fetchAttendanceData();
    }
    
    // subscribe to supabase realtime channel to listen for realtime updates
    const channel = supabase.channel('realtime_attendance').on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'attendance'
      }, 
      (payload) => {
        // setStudents([...students, payload.new as StudentProps])
        console.log(payload)
      },
    )

    return () => {
      supabase.removeChannel(channel)
    }

  }, [params.id, searchParams]);



  // FILTER

  const [isOpen, setIsOpen] = useState(false)
  const [isBlock, setIsBlock] = useState(false)
  const timeoutIdRef = useRef<number | null>(null);

  // open & close click handler
  const toggleFilter = () => {
        
    if (timeoutIdRef.current !== null)
        clearTimeout(timeoutIdRef.current)
    
    isOpen ? setIsOpen(false) 
    : setTimeout(() => setIsOpen(true), 10);
    
  };

  const [loading, setLoading] = useState(false)


  const [courses, setCourses] = useState(['AllCourses'])
  const [years, setYears] = useState(['AllYears'])
  const [sections, setSections] = useState(['AllSections'])
  const [sortBy, setSortBy] = useState('lastName')
  const [order, setOrder] = useState('ascending')
  const [displayOption, setDisplayOption] = useState('showAll')

  const allCourses = ['BSCE', 'BSIT', 'BOT','BSHM', 'BSTM', 'BSE','BSBA', 'BSAIS','BAC','BTVTED','BSED','BEED', 'BSN','BSCRIM','BSINFOTECH' ]
  const allYears = [1,2,3,4]
  const allSections = [ 'A', 'B', 'C', 'D', 'E' ]
  const allDisplayOptions = [ 'true', 'false' ]


  
  // TODO: APPLY FILTERS FUNCTIONALITY

  async function applyFilters() {

    console.log('applying')

    setLoading(true)
    
    const studentIDList: Array<number> = students.map(student => student.id)
    const filterCourses = courses.includes('AllCourses') ? allCourses : courses
    const filterYears = years.includes('AllYears') ? allYears : years.map(year => parseInt(year))
    const filterSections = sections.includes('AllSections') ? allSections : sections
    const filterOrder = order === 'ascending'
    const filterSortBy = sortBy
    const filterDisplayOption = displayOption === 'showAll' 
    ? allDisplayOptions
    : displayOption === 'present' ? ['true'] : ['false']
    
    // get students data according to filters
    const { data, error } = await supabase
      .from('student')
      .select('*')
      .in('id', studentIDList)
      .in('course', filterCourses)
      .in('year', filterYears)
      .in('section', filterSections)
      .order(filterSortBy, { ascending: filterOrder })

    error
    ? console.log(error)
    : console.log(data)

    // URL search params
    const queryParams = new URLSearchParams()

    // modify search params
    queryParams.set('courses', filterCourses.toString())
    queryParams.set('years', filterYears.toString())
    queryParams.set('sections', filterSections.toString())
    queryParams.set('order', filterOrder.toString())
    queryParams.set('sortBy', filterSortBy)
    queryParams.set('displayOption', filterDisplayOption.toString())

    // push to the new URL with new params
    router.push(`?${queryParams.toString()}`)

    console.log('done')
    
    setLoading(false)

  }


  // pretty print all filters data
  useEffect(() => {
    const filters = {
        courses, years, sections, sortBy, order, displayOption
    }  
    console.log(JSON.stringify(filters, null, 2))
  }, [courses, years, sections, sortBy, order, displayOption])


  

  // FETCH STUDENTS

  useEffect(() => {

    let studentsIDs: number[] = []

    attendanceData.map((row: Attendance) => {
      studentsIDs.push(row.studentId)
    })
 
    const fetchStudentsData = async () => {
      try {
        const { data, error } = await supabase
          .from('student')
          .select('*')
          .in('id', studentsIDs)
          .order('lastName', { ascending: true })
  
        if (error) {
          throw error;
        }
        
        // add the isPresent to 'students' state variable
        let modifiedData = data.map((student) => {
          const attendance = attendanceData.find(row => row.studentId === student.id);
          return {
            ...student,
            isPresent: attendance?.isPresent
          };
        });

        setStudents(modifiedData)
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchStudentsData()

    const channel = supabase.channel('realtime_students').on(
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
    )

    return () => {
      supabase.removeChannel(channel)
    }

  }, [attendanceData])



  useEffect(() => {
    console.log(students)
  }, [students])




  // CLIENT SIDE SCRIPT
  const [selectedValue, setSelectedValue] = useState<string>('absent');
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
  }




  // TODO: Attendance overall logic and functionality
  return (
    <div className=' overflow-hidden'>
      <PageHeader 
        title={event?.title} 
        subtitle={event?.eventDate ? formatDate(event?.eventDate) : ""}
        returnPath='/'
      />

      {/* SCANNER BUTTON */}
      <button className=' fixed z-[500] top-4 right-[60px]'>
        <LuScanLine onClick={() => router.push(`./5/scanner`)} size={24} />
      </button>

      
      <div className='overflow-hidden pb-40 p-5 pr-0 pt-20'>

        <Filter 
          data={students} 
          buttonClassName='absolute top-4 right-4 !z-[600]'
          // filters data
          courses={courses}
          years={years}
          sections={sections}
          sortBy={sortBy}
          order={order}
          displayOption={displayOption}
          // set functions
          setCourses={setCourses}
          setYears={setYears}
          setSections={setSections}
          setSortBy={setSortBy}
          setOrder={setOrder}
          setDisplayOption={setDisplayOption}
          // submit
          applyFilters={applyFilters}
        /> 
        <SearchBar className='mr-5' />

        {/* TOGGLE OPTIONS */}
        {/* <div className={`mt-6 border-2 w-full ml-auto border-gray-200 rounded-full bg-gray-100 flex flex-row items-center`}>
          <label className={`${styles.radioLabel} ${selectedValue === "present" ? "bg-[#ffffff] shadow-[1px_0_3px_rgba(0,0,0,0.1)]" : "text-gray-400"}`} htmlFor='present'>
          <input
          type="radio" 
          name="radioGroup" 
          id="present"
          value="present"
          checked={selectedValue === "present"}
          onChange={handleChange}
          className='absolute opacity-0'
          />
          <div className='flex items-center w-full h-fit gap-1.5 justify-center'>
          <TbChecklist size={18} />
          <span className=''>Present</span>
          </div>
          </label>
          <label className={`${styles.radioLabel} ${selectedValue === "absent" ? "bg-[#ffffff] shadow-[-1px_0_3px_rgba(0,0,0,0.1)]" : "text-gray-400"}`} htmlFor="absent">
          <input 
          type="radio" 
          name="radioGroup" 
          id="absent" 
          value="absent"
          checked={selectedValue === "absent"}
          onChange={handleChange}
          className='absolute opacity-0' 
          />
          <div className='flex items-center w-full h-fit gap-1.5 justify-center'>
          <FaRegCalendarXmark size={16} />
          <span className=''>Absent</span>
          </div>
          </label>
          </div> */}

        {/* STUDENTS LIST */ }
        <div className={`${styles.studentsList} mt-8`}>
          {students.length !== 0 && students.map((student: StudentProps) => {
            return (
              <StudentCard key={student.id} eventId={event?.id} studentData={student} isChecked={student?.isPresent} pageState={selectedValue} />
            )
          })}
          {students.length === 0 && <span>Loading...</span>}
        </div>
      </div>

      {loading && (
        <div className='bg-black absolute top-0 left-0 bg-opacity-10 w-full h-full z-[1000] grid place-items-center'>
          <l-line-spinner
            size="30"
            stroke="2"
            speed="1" 
            color="black" 
            ></l-line-spinner>
        </div>
      )}
    </div>
  )
}

export default EventPage