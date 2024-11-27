"use client"
import { Button } from '@/components';
import supabase from '@/lib/supabaseClient';
import { EventProps, FormEventProps, FormOperationProps } from '@/types';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { IoIosAdd } from "react-icons/io";  
import { Spinner } from '@/components';

// NEW EVENT FORM COMPONENT
const EditEventForm: React.FC<{
  isOpen: boolean;
  toggleEventForm: () => void;
  eventID?: number
  editFormData: FormEventProps | undefined
}> = ({
  isOpen = false, 
  toggleEventForm,
  eventID,
  editFormData,
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


  const [loading, setLoading] = useState<boolean>(false)
  const [formData, setFormData] = useState<FormEventProps>({
    title: "",


    location: "",
    loginTime: "",
    logoutTime: "",
    fineAmount: "",
    eventDate: "",
  })

  useEffect(() => {
    if(editFormData !== undefined) {
      setFormData(editFormData)

      console.log(editFormData)
    }
  }, [editFormData])

  // useEffect(() => {
  //   if (data && operation === "update") {
  //     const date = new Date(data.eventDate.toString())
  //     const formattedDate = date.toISOString().slice(0, 10);
      
  //     setFormData({
  //       ...data,
  //       eventDate: formattedDate,
  //     })
  //   }
  // }, [data])

  // OnChange handler for all input elements
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let {name, value} = e.target
    let updatedValue: string | number = value.charAt(0).toUpperCase() + value.slice(1);

    setFormData({ ...formData, [name]: updatedValue });
  };

  // form submit handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    console.log("handling submit")
    console.log(formData)

    const {data, error} =  await supabase.from('event')
      .update([ {...formData} ])
      .eq("id", eventID)

    if (error) {
      // Handle error
      console.error(error);
      setLoading(false)
    } else {
      // Handle success
      console.log(data);
      setLoading(false)
    }
  }

  const router = useRouter()

  // open and close transition
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const main = bodyRef.current
    if (main) {
      if (isOpen) {
        document.body.style.overflow = "hidden"
        main.style.display = "grid"
        setTimeout(() => {
          main.style.opacity = "1"
        }, 0)
      } else {
        main.style.opacity = "0"
        setTimeout(() => {
          main.style.display = "none"
          document.body.style.overflow = "auto"
        }, 300)
      }
    }
  }, [isOpen])
  
  return (
    <div 
      ref={bodyRef}
      className={`fixed hidden top-0 bottom-0 right-0 left-0 transition-all duration-300 bg-black/30 backdrop-blur-sm z-[2000] place-items-center`}
    >
      {/* EDIT EVENT FORM */}
      <div className={`overflow-hidden pointer-events-auto h-fit max-h-[40rem] w-[90vw] bg-white z-[1400] transition-all duration-[400ms] ease-in-out flex flex-col justify-between rounded-3xl`}>

        <div className='flex flex-row items-center p-2 bg-white border- border-gray-300'>
          <h1 className='font-semibold absolute p-3 text-emerald-600 w-full'>Edit attendance</h1>
          <Button variant='close' className='bg-gray-10 h-fit w-fit !p-2.5 !rounded-full ml-auto z-[120] text-green-700' onClick={() => {
            toggleEventForm()
          }}></Button>
        </div>

        <form id='editForm' 
          method='post' 
          onSubmit={handleSubmit} 
          className={` transition-all duration-300 bg-gray-10 bg-white p-5 flex flex-col gap-5 overflow-y-scroll h-full`}
        >
          <div className='flex flex-col gap-1 bg-whit borde border-gray-300 rounded-2xl'>
              <label className='form__label' htmlFor="title">Title</label>
              <input required onChange={handleChange} autoComplete='off' type="text" name="title" id="title" value={formData?.title} className={`form__input`} onBlur={scrollTop} />
          </div>
          <div className='flex flex-col gap-1 bg-whit borde border-gray-300 rounded-2xl'>
              <label className='form__label' htmlFor="location">Venue</label>
              <input required onChange={handleChange} value={formData?.location} autoComplete='off' type="text" name="location" id="location" className={`form__input`} onBlur={scrollTop} />
          </div>
          <div className='flex flex-col gap-1 bg-whit borde border-gray-300 rounded-2xl'>
              <label className='form__label' htmlFor="fineAmount">Fine</label>
              <input required onChange={handleChange} value={formData?.fineAmount} autoComplete='off' type="number" name="fineAmount" id="fineAmount" className={`form__input`} onBlur={scrollTop} />
          </div>
          <div className='flex flex-col gap-1 bg-whit borde border-gray-300 rounded-2xl'>
              <label className='form__label' htmlFor="eventDate">Date</label>
              <div className={`form__input !pl-0 w-full flex`} onClick={handleDateClick}>
              <input required onChange={handleChange} value={formData?.eventDate} type="date" name="eventDate" ref={dateInputRef} id="eventDate" className='outline-none pl-[14px] rounded-full p-0 w-full bg-gray-100' />
              </div>
          </div>
          <div className='flex flex-row gap-4 w-full bg-whit borde border-gray-300 rounded-2xl'>
              <div className='flex flex-col gap-1 w-1/2'>
              <label className='form__label' htmlFor="loginTime">Login Time</label>
              <div onClick={handleLoginTimeClick} className='form__input w-full flex items-center !pl-0'>
                  <input required onChange={handleChange} value={formData.loginTime} ref={loginTimeInputRef} type="time" name="loginTime" id="loginTime" className={`w-full pl-[14px] bg-gray-100 outline-none`}/>
              </div>
              </div>
              <div className='flex flex-col gap-1 w-1/2'>
              <label className='form__label' htmlFor="logoutTime">Logout Time</label> 
              <div onClick={handleLogoutTimeClick} className='form__input w-full flex items-center !pl-0'>
                  <input required onChange={handleChange} value={formData.logoutTime} ref={logoutTimeInputRef} type="time" name="logoutTime" id="logoutTime" className={`w-full pl-[14px] bg-gray-100 outline-none`}/>
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
          <div className={` lex gap-3 w-full mt-4 border-gray-300`}>
            {/* <Button variant='secondary'  onClick={toggleEventForm}>Cancel</Button> */}
            <Button 
              variant='primary' 
              type='submit'
              form='editForm'
              className='bg-emerald-500 min-w-40 grid place-items-center text-sm py-2.5 font-semibold !rounded-full ml-auto'
              onClick={toggleEventForm}>
                {loading ? (
                  <Spinner size='1' color='white' className='translate-y-[3px]' />
                ) : (
                  "Save"
                )}
              </Button>
          </div>
        </form>
      </div>

      {/* BACKDROP */}
      {/* <div className={`z-[110] bottom-0 left-0 absolute h-full w-full bg-black bg-opacity-70 ${isOpen ? "block" : "hidden" }`} onClick={toggleEventForm}></div> */}
    </div>
  )
}

export default EditEventForm