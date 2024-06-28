// eslint-disable @next/next/no-async-client-component 
"use client"
import { PageHeader, SearchBar, StudentCard } from '@/components';
import { useEffect, useState } from 'react';
import styles from './styles.module.css';
import { TbChecklist } from "react-icons/tb";
import { FaRegCalendarXmark } from "react-icons/fa6";

interface Event {
  id: number
  title: string
  location: string
  loginTime: string
  logoutTime: string
  fineAmount: number
  eventDate: string
}

interface Student {
  id: number
  firstName: string
  lastName: string
  college: string
  yearLevel: number
  section: string
}

const EventPage: React.FC = ({ params }: any) => {

  const [selectedValue, setSelectedValue] = useState<string>('present');
  const [event, setEvent] = useState<Event>()
  const [students, setStudents] = useState<Student[]>([])


  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
  }

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


const getAttendees = async () => {
  try {
    const res = await fetch(`/api/attendance?id=${params.id}`,{
      method: "GET"
    })
  
    if(res) {
      const json = await res.json() 
      console.log(json)
      if(json) setStudents(json)  
    }

  } catch (error) {
    console.log(error)
  }
}
  
// eslint-disable-next-line react-hooks/rules-of-hooks
useEffect(() => {
  getEvent()
  getAttendees()
}, [])

return (
  <>
    <PageHeader title={event?.title} returnPath='/' />
    
    <div className='max-h-[100vh] overflow-y-auto pb-40 pt-16 p-5'>

      <SearchBar />

      {/* TOGGLE OPTIONS */}
      <div className={`mt-5 border-2 w-56 ml-auto border-gray-200 rounded-full bg-gray-100 flex flex-row items-center`}>
        <label className={`${styles.radioLabel} ${selectedValue === "present" ? "bg-[#ffffff] shadow-[3px_0_6px_rgba(0,0,0,0.1)]" : "text-gray-400"}`} htmlFor='present'>
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
        <label className={`${styles.radioLabel} ${selectedValue === "absent" ? "bg-[#ffffff] shadow-[-3px_0_6px_rgba(0,0,0,0.1)]" : "text-gray-400"}`} htmlFor="absent">
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

      {/* STUDENTS LIST */}

      <div className={`${styles.studentsList} mt-8`}>
        {students.length !== 0 && students.map(student => (
          <StudentCard key={student.id} studentData={student}/>
        ))}
        {students.length === 0 && <span>No student sttended this event.</span>}
      </div>
    </div>
  </>
  
)
}

export default EventPage

