"use client"
import { Button } from '@/components';
import supabase from '@/lib/supabaseClient';
import { FormEventProps, FormOperationProps } from '@/types';
import { useEffect, useRef, useState } from 'react';
import { RiStickyNoteAddFill } from "react-icons/ri";
import { MdPostAdd } from "react-icons/md";
import { IoAdd } from "react-icons/io5";

// NEW EVENT FORM COMPONENT
const EventForm: React.FC<{
  isOpen: boolean;
  toggleEventForm: () => void;
  orgId: number
}> = ({
  isOpen, 
  toggleEventForm,
  orgId,
}) => {

  // Frontend
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
  // const [isOpen, setIsOpen] = useState(false);
  // const toggleEventForm = () => {
  //     setIsOpen(!isOpen);
  // };

  function scrollTop() {
    window.scrollTo(0, 0)
  }

  // Backend logic___________________________________________________________________________

  const [formData, setFormData] = useState<FormEventProps>({
    title: "",
    location: "",
    loginTime: "",
    logoutTime: "",
    fineAmount: "",
    eventDate: "",
  })

  // OnChange handler for all input elements
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let {name, value} = e.target
    let updatedValue: string | number = value.charAt(0).toUpperCase() + value.slice(1);

    setFormData({ ...formData, [name]: updatedValue });
  };

  // form submit handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    console.log("handling submit")
    console.log(formData)

    if (orgId !== 0) {

      console.log(orgId)

      const {data, error} =  await supabase
        .from('event')
        .insert([ {...formData, org_id: orgId} ])
  
      if (error) {
        console.error(error);
      } else {
        console.log(data);
      }
    } 

  }
  
  return (
    <div>
      {/* NEW EVENT BUTTON */}
      <button onClick={toggleEventForm} className='z-[500] fixed bottom-4 right-4 grid place-items-center bg-white border border-gray-100 w-16 h-16 shadow-md rounded-full' >
          <IoAdd size={26} className='text-green-700' />
      </button>

      {/* NEW EVENT FORM */}
      <div className={`${isOpen ? "!h-full" : "" } overflow-hidden pointer-events-auto h-0 w-full fixed left-0 bottom-0 bg-white z-[1600] transition-all duration-[400ms] ease-in-out flex flex-col justify-between`}>

        <div className='flex flex-row items-center p-2 bg-white border-b border-gray-300'>
          <h1 className='font-bold absolute p-3 text-emerald-700 w-full'>Create Attendance</h1>
          <Button variant='close' className='bg-gray-100 h-fit w-fit !p-2.5 !rounded-full ml-auto z-[120] text-green-900 mr-1' onClick={toggleEventForm}></Button>
        </div>

        <form id='form' onSubmit={handleSubmit} className='bg-gray-100 p-4 pb-8 pt-8 flex flex-col gap-3 overflow-y-scroll h-full'>
          <div className='flex flex-col gap-1 bg-white border border-gray-300 rounded-lg p-3'>
              <label className='form__label' htmlFor="title">Title</label>
              <input onChange={handleChange} autoComplete='off' type="text" name="title" id="title" value={formData?.title} className={`form__input`} placeholder='e.g Seminar (Morning)' onBlur={scrollTop} />
          </div>
          <div className='flex flex-col gap-1 bg-white border border-gray-300 rounded-lg p-3'>
              <label className='form__label' htmlFor="location">Venue</label>
              <input onChange={handleChange} value={formData?.location} autoComplete='off' type="text" name="location" id="location" className={`form__input`} placeholder='e.g Covered Court' onBlur={scrollTop} />
          </div>
          <div className='flex flex-col gap-1 bg-white border border-gray-300 rounded-lg p-3'>
              <label className='form__label' htmlFor="fineAmount">Fine</label>
              <input onChange={handleChange} value={formData?.fineAmount} autoComplete='off' type="number" name="fineAmount" id="fineAmount" className={`form__input`} placeholder='e.g 25.00' onBlur={scrollTop} />
          </div>
          <div className='flex flex-col gap-1 bg-white border border-gray-300 rounded-lg p-3'>
              <label className='form__label' htmlFor="eventDate">Date</label>
              <div className={`form__input !pl-0 w-full flex`} onClick={handleDateClick}>
              <input onChange={handleChange} value={formData?.eventDate} type="date" name="eventDate" ref={dateInputRef} id="eventDate" className='outline-none pl-[14px] rounded-full p-0 w-full bg-gray-100' />
              </div>
          </div>
          <div className='flex flex-row gap-4 w-full bg-white border border-gray-300 rounded-lg p-3'>
              <div className='flex flex-col gap-1 w-1/2'>
              <label className='form__label' htmlFor="loginTime">Login Time</label>
              <div onClick={handleLoginTimeClick} className='form__input w-full flex items-center !pl-0'>
                  <input onChange={handleChange} value={formData.loginTime} ref={loginTimeInputRef} type="time" name="loginTime" id="loginTime" className={`w-full pl-[14px] bg-gray-100 outline-none`}/>
              </div>
              </div>
              <div className='flex flex-col gap-1 w-1/2'>
              <label className='form__label' htmlFor="logoutTime">Logout Time</label> 
              <div onClick={handleLogoutTimeClick} className='form__input w-full flex items-center !pl-0'>
                  <input onChange={handleChange} value={formData.logoutTime} ref={logoutTimeInputRef} type="time" name="logoutTime" id="logoutTime" className={`w-full pl-[14px] bg-gray-100 outline-none`}/>
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
        <div className={` flex gap-3 w-full mt-auto p-3 pr-5 pb-7 border-gray-300 bg-white border-t`}>
          {/* <Button variant='secondary'  onClick={toggleEventForm}>Cancel</Button> */}
          <Button 
            variant='primary' 
            type='submit'
            form='form'
            className='font-bold py-2.5 bg-emerald-500 !rounded-full w-full text-sm px-12 ml-auto'
            onClick={toggleEventForm}>Create attendance</Button>
        </div>
      </div>

      {/* BACKDROP */}
      {/* <div className={`z-[110] bottom-0 left-0 absolute h-full w-full bg-black bg-opacity-70 ${isOpen ? "block" : "hidden" }`} onClick={toggleEventForm}></div> */}
    </div>
  )
}

export default EventForm