"use client"
import { PageHeader, SearchBar } from '@/components';
import { useState } from 'react';
import styles from './styles.module.css';

const Attendance = () => {

  const [selectedValue, setSelectedValue] = useState<string>('present');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
  }

  return (
    <div>
      <PageHeader title={'Attendance'} returnPath='/' />

      <div className='p-4 mt-3'>
        <h2 className='font-semibold text-lg opacity-90'>Lorem Ipsum - Morning session</h2>
        <p className='opacity-60 mt-1'>June 10, 2024</p>
        <SearchBar className='mt-6' />
      </div>

      <div className='mt-8'>
        <div className='radioButtons'>
          <label className={`inline-block w-1/2 rounded-t-md p-3 text-center ${selectedValue === "present" ? "font-semibold border border-gray-400 border-b-0" : "border-b border-b-gray-500"}`} htmlFor='present'> 
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
          <label className={`inline-block w-1/2 rounded-t-md p-3 text-center ${selectedValue === "absent" ? "font-semibold border border-gray-400 border-b-0" : "border-b border-b-gray-500"}`} htmlFor="absent">
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

        <div className='studentsList'>
          <div className={`${styles.studentContainer}`}>
            <h2 className=''>Caibog, Jerson D.</h2>
            <div className='mt-2'>
              <div className='flex flex-row'>
                <span className={`${styles.info}`}>Student ID</span>
                <span className={`${styles.info} ${styles.description}`}>22-0224</span>
              </div>
              <div className='flex flex-row'>
                <span className={`${styles.info}`}>Course</span>
                <span className={`${styles.info} ${styles.description}`}>BSIT</span>
              </div>
              <div className='flex flex-row'>
                <span className={`${styles.info}`}>Year & Section</span>
                <span className={`${styles.info} ${styles.description}`}>2 - A</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  )
}

export default Attendance