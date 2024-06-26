// eslint-disable @next/next/no-async-client-component 
"use client"
import { PageHeader, SearchBar, StudentCard } from '@/components';
import { useEffect, useState } from 'react';
import styles from './styles.module.css';
import { Suspense } from 'react';

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
    
    <div className='max-h-[100vh] overflow-y-auto pb-40 pt-20 p-4'>

      <SearchBar />

      <div className={`mt-6`}>
        <label className={`inline-block w-1/2 rounded-full p-1 font-semibold text-center ${selectedValue === "present" ? "bg-[#ECEDF1]" : "text-gray-500"}`} htmlFor='present'>
          <input 
            type="radio" 
            name="radioGroup" 
            id="present"
            value="present"
            checked={selectedValue === "present"}
            onChange={handleChange}
            className='absolute opacity-0' 
          />
          Present
        </label>
        <label className={`inline-block w-1/2 rounded-full p-1 font-semibold text-center ${selectedValue === "absent" ? "bg-[#ECEDF1]" : "text-gray-500"}`} htmlFor="absent">
          <input 
            type="radio" 
            name="radioGroup" 
            id="absent" 
            value="absent"
            checked={selectedValue === "absent"}
            onChange={handleChange}
            className='absolute opacity-0' 
          />
          Absent
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

