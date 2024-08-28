"use client"
import { Button } from '@/components';
import { useRef, useState } from 'react';
import { IoIosAdd } from "react-icons/io";


// NEW EVENT FORM COMPONENT
const EventForm = () => {

    const dateInputRef = useRef(null);
    const loginTimeInputRef = useRef(null);
    const logoutTimeInputRef = useRef(null);
  
    const handleDateClick = () => {
        if (dateInputRef.current)
            (dateInputRef.current as HTMLInputElement).focus();
    }
  
    const handleLoginTimeClick = () => {
        if (loginTimeInputRef.current)
            (loginTimeInputRef.current as HTMLInputElement).focus();
    }
  
    const handleLogoutTimeClick = () => {
        if (logoutTimeInputRef.current)
            (logoutTimeInputRef.current as HTMLInputElement).focus();
    }
  
    // newEventButton Click Handler
    const [isOpen, setIsOpen] = useState(false);
    const toggleNewEventForm = () => {
        setIsOpen(!isOpen);
    };
  
    function scrollTop() {
      window.scrollTo(0, 0)
    }
  
    return (
      <div>
        {/* NEW EVENT BUTTON */}
        <button onClick={toggleNewEventForm} className='z-[30] fixed top-0 right-1 grid place-items-center h-14 w-14' >
            <IoIosAdd size={34} />
        </button>
  
        {/* NEW EVENT FORM */}
        <div className={`${isOpen ? "!h-full" : "" } h-0 w-full fixed left-0 bottom-0 bg-white z-[120] transition-all duration-300 flex flex-col justify-between`}>
  
          <div className='flex flex-row items-center p-1 bg-white border-b border-gray-300'>
            <h1 className='font-semibold absolute p-3 text-center w-full'>New Attendance Record</h1>
            <Button variant='close' className='ml-auto z-[120] !p-3' onClick={toggleNewEventForm}></Button>
          </div>
  
          <form action="" className='bg-gray-100 p-5 pb-8 pt-8 flex flex-col gap-6 overflow-y-scroll h-full'>
            <div className='flex flex-col gap-1'>
                <label className='form__label' htmlFor="title">Title</label>
                <input autoComplete='off' type="text" name="title" id="title" className={`form__input`} placeholder='e.g Seminar' onBlur={scrollTop} />
            </div>
            <div className='flex flex-col gap-1'>
                <label className='form__label' htmlFor="venue">Venue</label>
                <input autoComplete='off' type="text" name="venue" id="venue" className={`form__input`} placeholder='e.g Covered Court' onBlur={scrollTop} />
            </div>
            <div className='flex flex-col gap-1'>
                <label className='form__label' htmlFor="fine">Fine</label>
                <input autoComplete='off' type="number" name="fine" id="fine" className={`form__input`} placeholder='e.g 25.00' onBlur={scrollTop} />
            </div>
            <div className='flex flex-col gap-1'>
                <label className='form__label' htmlFor="date">Date</label>
                <div className={`form__input !pl-0 w-full flex`} onClick={handleDateClick}>
                <input type="date" name="date" ref={dateInputRef} id="date" className='outline-none pl-[14px] rounded-full p-0 w-full bg-gray-200' />
                </div>
            </div>
            <div className='flex flex-row gap-4 w-full'>
                <div className='flex flex-col gap-1 w-1/2'>
                <label className='form__label' htmlFor="login">Login Time</label>
                <div onClick={handleLoginTimeClick} className='form__input w-full flex items-center !pl-0'>
                    <input ref={loginTimeInputRef} type="time" name="login" id="login" className={`w-full pl-[14px] bg-gray-200 outline-none`}/>
                </div>
                </div>
                <div className='flex flex-col gap-1 w-1/2'>
                <label className='form__label' htmlFor="logout">Logout Time</label>
                <div onClick={handleLogoutTimeClick} className='form__input w-full flex items-center !pl-0'>
                    <input ref={logoutTimeInputRef} type="time" name="logout" id="logout" className={`w-full pl-[14px] bg-gray-200 outline-none`}/>
                </div>
                </div>
            </div>
            {/* <div className='flex flex-col gap-1'>
              <label className='form__label'>Attendees</label>
              <div className='flex flex-wrap mt-1 gap-2 h-fit'>
                <ToggleBox text='All Colleges' />
                <ToggleBox text='BSCE' />
                <ToggleBox text='BS INFO TECH' /> 
                <ToggleBox text='BSIT' />
                <ToggleBox text='BOT' />
                <ToggleBox text='BSHM' />
                <ToggleBox text='BSTM' />
                <ToggleBox text='BSE' />
                <ToggleBox text='BSBA' />
                <ToggleBox text='BSAIS' />
                <ToggleBox text='BAC' />
                <ToggleBox text='BTVTED' />
                <ToggleBox text='BSEd.' />
                <ToggleBox text='BEED' />
                <ToggleBox text='BSN' />
                <ToggleBox text='BSCRIM' />
                <input type="text" placeholder='Other (comma separated)' className={`form__input w-full`} onBlur={scrollTop} />
              </div>
            </div> */}
          </form>
          <div className={` flex gap-3 w-full mt-auto bg-white p-5 pb-7 border-t border-gray-300`}>
            {/* <Button variant='secondary'  onClick={toggleNewEventForm}>Cancel</Button> */}
            <Button variant='primary' className='font-medium rounded-xl w-full text-[15px] py-2.5 px-12 ml-auto' onClick={toggleNewEventForm}>Done</Button>
          </div>
        </div>
  
        {/* BACKDROP */}
        {/* <div className={`z-[110] bottom-0 left-0 absolute h-full w-full bg-black bg-opacity-70 ${isOpen ? "block" : "hidden" }`} onClick={toggleNewEventForm}></div> */}
      </div>
    )
  }

export default EventForm