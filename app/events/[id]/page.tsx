// eslint-disable @next/next/no-async-client-component 
"use client"
import { PageHeader, SearchBar } from '@/components';
import { useEffect, useState } from 'react';
import styles from './styles.module.css';
import StudentDetails from './StudentDetails';


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
    const res = await fetch(`http://localhost:3000/api/events/event?id=${params.id}`, {
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
    const res = await fetch(`http://localhost:3000/api/attendance?id=${params.id}`,{
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
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [])

return (
  <>

    <PageHeader title={'Attendance'} returnPath='/' />

    <div className='max-h-[100vh] overflow-y-auto pb-40 pt-24'>

      <div className='p-4 pb-0 pt-0'>
        <h2 className='font-semibold text-lg opacity-90'>{event?.title}</h2>
        <p className='opacity-60 font-medium'>{event?.eventDate}</p>
        <SearchBar className='mt-6' />
      </div>

      <div className={`mt-8 ${styles.radioGroup}`}>
        <label className={`inline-block w-1/2 rounded-full p-2 font-semibold text-center ${selectedValue === "present" ? "bg-[#ECEDF1]" : "text-gray-500"}`} htmlFor='present'>
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
        <label className={`inline-block w-1/2 rounded-full p-2 font-semibold text-center ${selectedValue === "absent" ? "bg-[#ECEDF1]" : "text-gray-500"}`} htmlFor="absent">
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
          <StudentDetails key={student.id} studentData={student}/>
        ))}
        {students.length === 0 && <span>No student sttended this event.</span>}
      </div>
    </div>
  </>
  
)
}



export default EventPage

