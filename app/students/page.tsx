'use client'
import { Navbar, SearchBar } from "@/components";
import styles from './styles.module.css';
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import { useState } from "react";

const Page = () => {

  const [toggleFilter, setToggleFilter] = useState(false);



  return (
    <>
      <Navbar title="Students" />
      <div className="max-h-[100vh] overflow-y-auto pt-28 pb-40">

        <div className="px-3 flex flex-row">
          <SearchBar />
          <button className="flex flex-row rounded-md p-3 items-center ml-3 shadow">
            <HiOutlineAdjustmentsHorizontal size={24} />
            <span className="ml-2">Filter</span>
          </button>
        </div>

        <div className={` ${styles.studentsList} mt-8 `}> 
          
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

          <div className={`${styles.studentContainer}`}>
            <h2 className=''>Ranido, Christian Rhey O.</h2>
            <div className='mt-2'>
              <div className='flex flex-row'>
                <span className={`${styles.info}`}>Student ID</span>
                <span className={`${styles.info} ${styles.description}`}>22-1234</span>
              </div>
              <div className='flex flex-row'>
                <span className={`${styles.info}`}>Course</span>
                <span className={`${styles.info} ${styles.description}`}>BSIT</span>
              </div>
              <div className='flex flex-row'>
                <span className={`${styles.info}`}>Year & Section</span>
                <span className={`${styles.info} ${styles.description}`}>2 - B</span>
              </div>
            </div>
          </div>

          <div className={`${styles.studentContainer}`}>
            <h2 className=''>Ranido, Christian Rhey O.</h2>
            <div className='mt-2'>
              <div className='flex flex-row'>
                <span className={`${styles.info}`}>Student ID</span>
                <span className={`${styles.info} ${styles.description}`}>22-1234</span>
              </div>
              <div className='flex flex-row'>
                <span className={`${styles.info}`}>Course</span>
                <span className={`${styles.info} ${styles.description}`}>BSIT</span>
              </div>
              <div className='flex flex-row'>
                <span className={`${styles.info}`}>Year & Section</span>
                <span className={`${styles.info} ${styles.description}`}>2 - B</span>
              </div>
            </div>
          </div>

          <div className={`${styles.studentContainer}`}>
            <h2 className=''>Ranido, Christian Rhey O.</h2>
            <div className='mt-2'>
              <div className='flex flex-row'>
                <span className={`${styles.info}`}>Student ID</span>
                <span className={`${styles.info} ${styles.description}`}>22-1234</span>
              </div>
              <div className='flex flex-row'>
                <span className={`${styles.info}`}>Course</span>
                <span className={`${styles.info} ${styles.description}`}>BSIT</span>
              </div>
              <div className='flex flex-row'>
                <span className={`${styles.info}`}>Year & Section</span>
                <span className={`${styles.info} ${styles.description}`}>2 - B</span>
              </div>
            </div>
          </div>

          <div className={`${styles.studentContainer}`}>
            <h2 className=''>Ranido, Christian Rhey O.</h2>
            <div className='mt-2'>
              <div className='flex flex-row'>
                <span className={`${styles.info}`}>Student ID</span>
                <span className={`${styles.info} ${styles.description}`}>22-1234</span>
              </div>
              <div className='flex flex-row'>
                <span className={`${styles.info}`}>Course</span>
                <span className={`${styles.info} ${styles.description}`}>BSIT</span>
              </div>
              <div className='flex flex-row'>
                <span className={`${styles.info}`}>Year & Section</span>
                <span className={`${styles.info} ${styles.description}`}>2 - B</span>
              </div>
            </div>
          </div>

          <div className={`${styles.studentContainer}`}>
            <h2 className=''>Ranido, Christian Rhey O.</h2>
            <div className='mt-2'>
              <div className='flex flex-row'>
                <span className={`${styles.info}`}>Student ID</span>
                <span className={`${styles.info} ${styles.description}`}>22-1234</span>
              </div>
              <div className='flex flex-row'>
                <span className={`${styles.info}`}>Course</span>
                <span className={`${styles.info} ${styles.description}`}>BSIT</span>
              </div>
              <div className='flex flex-row'>
                <span className={`${styles.info}`}>Year & Section</span>
                <span className={`${styles.info} ${styles.description}`}>2 - B</span>
              </div>
            </div>
          </div>

          <div className={`${styles.studentContainer}`}>
            <h2 className=''>Ranido, Christian Rhey O.</h2>
            <div className='mt-2'>
              <div className='flex flex-row'>
                <span className={`${styles.info}`}>Student ID</span>
                <span className={`${styles.info} ${styles.description}`}>22-1234</span>
              </div>
              <div className='flex flex-row'>
                <span className={`${styles.info}`}>Course</span>
                <span className={`${styles.info} ${styles.description}`}>BSIT</span>
              </div>
              <div className='flex flex-row'>
                <span className={`${styles.info}`}>Year & Section</span>
                <span className={`${styles.info} ${styles.description}`}>2 - B</span>
              </div>
            </div>
          </div>

          <div className={`${styles.studentContainer}`}>
            <h2 className=''>Ranido, Christian Rhey O.</h2>
            <div className='mt-2'>
              <div className='flex flex-row'>
                <span className={`${styles.info}`}>Student ID</span>
                <span className={`${styles.info} ${styles.description}`}>22-1234</span>
              </div>
              <div className='flex flex-row'>
                <span className={`${styles.info}`}>Course</span>
                <span className={`${styles.info} ${styles.description}`}>BSIT</span>
              </div>
              <div className='flex flex-row'>
                <span className={`${styles.info}`}>Year & Section</span>
                <span className={`${styles.info} ${styles.description}`}>2 - B</span>
              </div>
            </div>
          </div>

          <div className={`${styles.studentContainer}`}>
            <h2 className=''>Ranido, Christian Rhey O.</h2>
            <div className='mt-2'>
              <div className='flex flex-row'>
                <span className={`${styles.info}`}>Student ID</span>
                <span className={`${styles.info} ${styles.description}`}>22-1234</span>
              </div>
              <div className='flex flex-row'>
                <span className={`${styles.info}`}>Course</span>
                <span className={`${styles.info} ${styles.description}`}>BSIT</span>
              </div>
              <div className='flex flex-row'>
                <span className={`${styles.info}`}>Year & Section</span>
                <span className={`${styles.info} ${styles.description}`}>2 - B</span>
              </div>
            </div>
          </div>

          <div className={`${styles.studentContainer}`}>
            <h2 className=''>Ranido, Christian Rhey O.</h2>
            <div className='mt-2'>
              <div className='flex flex-row'>
                <span className={`${styles.info}`}>Student ID</span>
                <span className={`${styles.info} ${styles.description}`}>22-1234</span>
              </div>
              <div className='flex flex-row'>
                <span className={`${styles.info}`}>Course</span>
                <span className={`${styles.info} ${styles.description}`}>BSIT</span>
              </div>
              <div className='flex flex-row'>
                <span className={`${styles.info}`}>Year & Section</span>
                <span className={`${styles.info} ${styles.description}`}>2 - B</span>
              </div>
            </div>
          </div>

          <div className={`${styles.studentContainer}`}>
            <h2 className=''>Ranido, Christian Rhey O.</h2>
            <div className='mt-2'>
              <div className='flex flex-row'>
                <span className={`${styles.info}`}>Student ID</span>
                <span className={`${styles.info} ${styles.description}`}>22-1234</span>
              </div>
              <div className='flex flex-row'>
                <span className={`${styles.info}`}>Course</span>
                <span className={`${styles.info} ${styles.description}`}>BSIT</span>
              </div>
              <div className='flex flex-row'>
                <span className={`${styles.info}`}>Year & Section</span>
                <span className={`${styles.info} ${styles.description}`}>2 - B</span>
              </div>
            </div>
          </div>

          <div className={`${styles.studentContainer}`}>
            <h2 className=''>Ranido, Christian Rhey O.</h2>
            <div className='mt-2'>
              <div className='flex flex-row'>
                <span className={`${styles.info}`}>Student ID</span>
                <span className={`${styles.info} ${styles.description}`}>22-1234</span>
              </div>
              <div className='flex flex-row'>
                <span className={`${styles.info}`}>Course</span>
                <span className={`${styles.info} ${styles.description}`}>BSIT</span>
              </div>
              <div className='flex flex-row'>
                <span className={`${styles.info}`}>Year & Section</span>
                <span className={`${styles.info} ${styles.description}`}>2 - B</span>
              </div>
            </div>
          </div>

          <div className={`${styles.studentContainer}`}>
            <h2 className=''>Ranido, Christian Rhey O.</h2>
            <div className='mt-2'>
              <div className='flex flex-row'>
                <span className={`${styles.info}`}>Student ID</span>
                <span className={`${styles.info} ${styles.description}`}>22-1234</span>
              </div>
              <div className='flex flex-row'>
                <span className={`${styles.info}`}>Course</span>
                <span className={`${styles.info} ${styles.description}`}>BSIT</span>
              </div>
              <div className='flex flex-row'>
                <span className={`${styles.info}`}>Year & Section</span>
                <span className={`${styles.info} ${styles.description}`}>2 - B</span>
              </div>
            </div>
          </div>

          <div className={`${styles.studentContainer}`}>
            <h2 className=''>Ranido, Christian Rhey O.</h2>
            <div className='mt-2'>
              <div className='flex flex-row'>
                <span className={`${styles.info}`}>Student ID</span>
                <span className={`${styles.info} ${styles.description}`}>22-1234</span>
              </div>
              <div className='flex flex-row'>
                <span className={`${styles.info}`}>Course</span>
                <span className={`${styles.info} ${styles.description}`}>BSIT</span>
              </div>
              <div className='flex flex-row'>
                <span className={`${styles.info}`}>Year & Section</span>
                <span className={`${styles.info} ${styles.description}`}>2 - B</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

export default Page