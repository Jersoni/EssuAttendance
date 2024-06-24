"use client"
import { PageHeader, SearchBar } from '@/components';
import { useState } from 'react';
import styles from './styles.module.css';

const Attendance = () => {

  const jerson = 1

  const [selectedValue, setSelectedValue] = useState<string>('present');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
  }

  return (
    <>
      <PageHeader title={'Attendance'} returnPath='/' />

      <div className='max-h-[100vh] overflow-y-auto pb-40 pt-24'>

        <div className='p-4 pb-0 pt-0'>
          <h2 className='font-semibold text-lg opacity-90'>Lorem Ipsum - Morning session</h2>
          <p className='opacity-60 font-medium'>June 10, 2024</p>
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

          <div className={`${styles.studentContainer}`}>
            <h2 className=''>Caibog, Jerson D.</h2>
            <div className={`${styles.infoContainer}`}>
              <span className={`${styles.info}`}>22-0224</span>
              <div className='min-h-[2px] min-w-[2px] bg-black opacity-40 rounded-full m-2'></div>
              <span className={`${styles.info}`}>BSIT 2-A</span>
            </div>
          </div>

          <div className={`${styles.studentContainer}`}>
            <h2 className=''>Ranido, Christian Rhey O.</h2>
            <div className={`${styles.infoContainer}`}>
              <span className={`${styles.info}`}>22-0224</span>
              <div className='min-h-[2px] min-w-[2px] bg-black opacity-40 rounded-full m-2'></div>
              <span className={`${styles.info}`}>BSIT 2-A</span>
            </div>
          </div>

          <div className={`${styles.studentContainer}`}>
            <h2 className=''>Suson, Jinky B.</h2>
            <div className={`${styles.infoContainer}`}>
              <span className={`${styles.info}`}>22-0224</span>
              <div className='min-h-[2px] min-w-[2px] bg-black opacity-40 rounded-full m-2'></div>
              <span className={`${styles.info}`}>BSIT 2-A</span>
            </div>
          </div>

          <div className={`${styles.studentContainer}`}>
            <h2 className=''>Caibog, Jerson D.</h2>
            <div className={`${styles.infoContainer}`}>
              <span className={`${styles.info}`}>22-0224</span>
              <div className='min-h-[2px] min-w-[2px] bg-black opacity-40 rounded-full m-2'></div>
              <span className={`${styles.info}`}>BSIT 2-A</span>
            </div>
          </div>

          <div className={`${styles.studentContainer}`}>
            <h2 className=''>Caibog, Jerson D.</h2>
            <div className={`${styles.infoContainer}`}>
              <span className={`${styles.info}`}>22-0224</span>
              <div className='min-h-[2px] min-w-[2px] bg-black opacity-40 rounded-full m-2'></div>
              <span className={`${styles.info}`}>BSIT 2-A</span>
            </div>
          </div>

          <div className={`${styles.studentContainer}`}>
            <h2 className=''>Caibog, Jerson D.</h2>
            <div className={`${styles.infoContainer}`}>
              <span className={`${styles.info}`}>22-0224</span>
              <div className='min-h-[2px] min-w-[2px] bg-black opacity-40 rounded-full m-2'></div>
              <span className={`${styles.info}`}>BSIT 2-A</span>
            </div>
          </div>

          <div className={`${styles.studentContainer}`}>
            <h2 className=''>Caibog, Jerson D.</h2>
            <div className={`${styles.infoContainer}`}>
              <span className={`${styles.info}`}>22-0224</span>
              <div className='min-h-[2px] min-w-[2px] bg-black opacity-40 rounded-full m-2'></div>
              <span className={`${styles.info}`}>BSIT 2-A</span>
            </div>
          </div>

          <div className={`${styles.studentContainer}`}>
            <h2 className=''>Caibog, Jerson D.</h2>
            <div className={`${styles.infoContainer}`}>
              <span className={`${styles.info}`}>22-0224</span>
              <div className='min-h-[2px] min-w-[2px] bg-black opacity-40 rounded-full m-2'></div>
              <span className={`${styles.info}`}>BSIT 2-A</span>
            </div>
          </div>

          <div className={`${styles.studentContainer}`}>
            <h2 className=''>Caibog, Jerson D.</h2>
            <div className={`${styles.infoContainer}`}>
              <span className={`${styles.info}`}>22-0224</span>
              <div className='min-h-[2px] min-w-[2px] bg-black opacity-40 rounded-full m-2'></div>
              <span className={`${styles.info}`}>BSIT 2-A</span>
            </div>
          </div>

          <div className={`${styles.studentContainer}`}>
            <h2 className=''>Caibog, Jerson D.</h2>
            <div className={`${styles.infoContainer}`}>
              <span className={`${styles.info}`}>22-0224</span>
              <div className='min-h-[2px] min-w-[2px] bg-black opacity-40 rounded-full m-2'></div>
              <span className={`${styles.info}`}>BSIT 2-A</span>
            </div>
          </div>

          <div className={`${styles.studentContainer}`}>
            <h2 className=''>Caibog, Jerson D.</h2>
            <div className={`${styles.infoContainer}`}>
              <span className={`${styles.info}`}>22-0224</span>
              <div className='min-h-[2px] min-w-[2px] bg-black opacity-40 rounded-full m-2'></div>
              <span className={`${styles.info}`}>BSIT 2-A</span>
            </div>
          </div>

        </div>
        
      </div>
    </>
    
  )
}

export default Attendance
