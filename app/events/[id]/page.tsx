// eslint-disable @next/next/no-async-client-component 
"use client"
import { PageHeader, SearchBar, StudentCard, Button, Filter } from '@/components';
import { EventProps, StudentProps, Attendance } from '@/types';
import { useEffect, useState } from 'react';
import styles from './styles.module.css';
import { TbChecklist } from "react-icons/tb";
import { FaRegCalendarXmark } from "react-icons/fa6";
import { useRouter } from 'next/navigation';
import { LuScanLine } from "react-icons/lu";
import { formatDate } from '@/utils/utils';
import supabase from '@/lib/supabaseClient';

const EventPage: React.FC = ({ params }: any) => {

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
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      
      try {
        const response = await fetch(`/api/getAttendance?id=${params.id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        setAttendanceData(result);
        console.log(result)
        
      } catch (error: any) {
        setError(error.message);
      }
    };
    
    fetchAttendanceData();
  }, [params.id]);


  // FETCH STUDENTS
  const [students, setStudents] = useState<StudentProps[]>([])
  
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
          .order('id', { ascending: true })
  
        if (error) {
          throw error;
        }

        let modifiedData

        // Modify the data before setting the state
        modifiedData = (data || []).map((student) => {
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
  }, [attendanceData])



  // CLIENT SIDE SCRIPT
  const router = useRouter()
  const [selectedValue, setSelectedValue] = useState<string>('present');
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
  }

  // HTML
  return (
    <div className='min-h-screen max-h-screen'>
      <PageHeader 
        title={event?.title} 
        subtitle={event?.eventDate ? formatDate(event?.eventDate) : ""}
      />

      {/* SCANNER BUTTON */}
      <Button variant='small-circle' className='absolute top-4 right-[70px]'>
        <LuScanLine onClick={() => router.push('./scanner')} size={24} />
      </Button>

      <Filter className='absolute right-5 top-4' />
      
      <div className='max-h-[100vh] overflow-y-auto pb-40 p-5 pt-3'>

        <SearchBar />

        {/* TOGGLE OPTIONS */}
        <div className={`mt-4 border-2 w-full ml-auto border-gray-200 rounded-full bg-gray-100 flex flex-row items-center`}>
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
        </div>

        {/* STUDENTS LIST */ }
        <div className={`${styles.studentsList} mt-8`}>
          {students.length !== 0 && students.map(student => {
            return (
              <StudentCard key={student.id} eventId={event?.id} studentData={student} isChecked={student.isPresent} pageState={selectedValue} />
            )
          })}
          {students.length === 0 && <span>Theres nothing here yet.</span>}
        </div>
      </div>
    </div>
  )
}

export default EventPage

