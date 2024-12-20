'use client'
import supabase from '@/lib/supabaseClient';
import { AuthProps, EventProps, FormEventProps } from '@/types';
import { formatDate } from '@/utils/utils';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { HiOutlineDotsHorizontal, HiPencil } from "react-icons/hi";
import { HiOutlineCalendar } from "react-icons/hi2";
import { PiClockCountdown, PiGavelLight, PiMapPinArea } from "react-icons/pi";
import { TbTrashFilled } from "react-icons/tb";
import ConfirmationModal from './ConfirmationModal';

// Main
const EventsCard: React.FC<{ 
  auth?: AuthProps
  isHappeningNow?: boolean
  isNavOpen: boolean
  eventData: EventProps 
  isEditFormOpen: boolean
  toggleEditForm: () => void
  setEditFormData: React.Dispatch<React.SetStateAction<FormEventProps | undefined>>
}> = ({ auth, isHappeningNow = false, isNavOpen, eventData, isEditFormOpen, toggleEditForm, setEditFormData }) => {

  function convertTimeTo12HourFormat(timeString: any) {
    const timeParts = timeString.split(':');
    const hours = parseInt(timeParts[0]);
    const minutes = timeParts[1];
    const seconds = timeParts[2];
    
    const timeObject = new Date(0, 0, 0, hours, minutes, seconds);
    
    let formattedHours = timeObject.getHours() % 12 || 12;
    const formattedMinutes = timeObject.getMinutes().toString().padStart(2, '0');
    const period = timeObject.getHours() >= 12 ? 'PM' : 'AM';
    
    return `${formattedHours}:${formattedMinutes} ${period}`;
  }

  const fine = "₱ " + eventData.fineAmount.toFixed(2)
  const login = convertTimeTo12HourFormat(eventData.loginTime)
  const logout = convertTimeTo12HourFormat(eventData.logoutTime)

  // Delete Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const toggleDeleteModal = () => {
    setIsDeleteModalOpen(!isDeleteModalOpen)
  }

  // delete confirm logic
  const onConfirm = async () => {
    try {
      const { data, error } = await supabase
        .from("event")
        .delete()
        .eq("id", eventData.id);
      
      if (error) {
        console.error(`Something went wrong: ${error.message}`);
        // Optionally display a user-friendly error message
        return;
      }
  
      // Handle successful deletion
      console.log("Event deleted successfully:", data);
      // Optionally update the UI, show a success message, or navigate away
    } catch (err) {
      console.error("Unexpected error:", err);
      // Handle unexpected errors (e.g., network issues)
    }
  }

  const modalRef = useRef<HTMLDivElement>(null)
  const openModalBtnRef = useRef<HTMLButtonElement>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  function toggle() {
    setIsModalOpen(!isModalOpen)
  }

  useEffect(() => {
    const handleClick = (e: Event) => {
      if (isModalOpen) {
        if (e.target !== modalRef.current && e.target !==  openModalBtnRef.current) {
          setIsModalOpen(false)
        }
      }
    }

    const handleScroll = (e: Event) => {
      setIsModalOpen(false)
    }

    window.addEventListener('click', handleClick)
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('click', handleClick)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isModalOpen])

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
 
      return params.toString()
    },
    [searchParams]
  )

  const [dayTime, setDayTime] = useState<string>()
  useEffect(() => {
    const time = new Date(`1970-01-01T${eventData.loginTime}`);

    const dayTime = time.getHours() < 12 ? "Morning" : "Afternoon"
    setDayTime(dayTime)
  }, [eventData.loginTime])

  return (
    <div>
      <div className='flex flex-row h-fit border border-gray-00 pointer-events-auto bg-white z-[100] rounded-2xl'>
        <Link href={`/events/${eventData.id}`} className='w-full'>
          <div className="flex flex-col p-5 py-8 min-w-full">
            <div className='flex flex-col gap-2'>
              <span className=" text-sm font-medium ">{eventData.title}</span>
              {/* <span className={`w-fit rounded-full -translate-x-1 text-xs text-gray-600 px-2 border ${dayTime === 'Morning' ? 'border-yellow-100 bg-yellow-100/80' : 'border-orange-100 bg-orange-100/80'}`}>{dayTime}</span> */}
            </div>
            {/* <span className='text-xs font-medium text-gray-400 mt-0.5 '>
              {getTimeOfDay(eventData.loginTime)} session
            </span> */}
            <div className="mt-5 flex flex-col gap-2">
              {/* {isHappeningNow ? (
                <div className='flex flex-row items-center gap-1 w-fit'>
                  <PiClockCountdown className='text-gray-400' />
                  <span className="event__info ml-1">{login}</span>
                  <span className="event__info">-</span>
                  <span className="event__info">{logout}</span>
                </div> 
              ) : (
                <div className='flex flex-row items-center gap-1 w-fit'>
                  <PiClockCountdown className='text-gray-400' />
                  <span className="event__info ml-1">{login}</span>
                </div> 
              )} */}
              <div className='flex flex-row items-center gap-2 w-fit'>
                  <PiClockCountdown className='text-gray-400' />
                  <span className="event__info ml-1">{login}</span>
                  <span className="event__info">-</span>
                  <span className="event__info">{logout}</span>
                </div> 
              <div className='flex flex-row items-center gap-3 w-fit'>
                <PiMapPinArea className='text-gray-400' />
                <span className="event__info">{eventData.location}</span>
              </div>
              {!isHappeningNow && (
                <div className='flex flex-row items-center gap-3 w-fit'>
                  <HiOutlineCalendar className='text-gray-400' />
                  <span className="event__info">{formatDate(eventData.eventDate)} • {dayTime}</span>
                </div>
              )}
              {isHappeningNow && (
                <div className='flex flex-row items-center gap-3 w-fit'>
                  <PiGavelLight className='text-gray-400' />
                  <span className="event__info">₱ {eventData.fineAmount.toFixed(2)}</span>
                </div>
              )}
              {/* <div className='flex flex-row items-center gap-2 w-fit'>
                <TiLocation size={15} className='opacity-40'/>
                <span className="event__info">{formatDate(eventData.eventDate)}</span>
                </div> */}
            </div>
          </div>
        </Link>
        
        

        <div>
            {auth?.role === "admin" && (
              <div className='flex flex-col h-full border-gray-200 relative'>
                {/* button toggle */}
                <button
                  ref={openModalBtnRef}
                  onClick={() => {toggle()}}
                  className={`p-4 pr-5 grid place-items-center
                    ${isNavOpen ? "pointer-events-none" : ""}  
                    `}
                >
                  <HiOutlineDotsHorizontal size={20} className="pointer-events-none ml-auto text-gray-400" />
                </button>

                {/* modal */}
                <div 
                  ref={modalRef}
                  className={`absolute bg-white translate-y-10 translate-x-[-5rem] rounded-lg transition-all overflow-hidden border border-gray-300 z-[400] p-1
                  ${isModalOpen ? "opacity-100" : "opacity-0 pointer-events-none"}  
                  `}
                >
                  {/* edit button */}
                  <button 
                    className='h-full flex flex-row p-2 rounded-md w-28 items-center gap-2 active:bg-gray-100'
                    onClick={(e) => {
                      e.preventDefault()
                      setEditFormData({
                        title: eventData.title,
                        location: eventData.location,
                        loginTime: eventData.loginTime,
                        logoutTime: eventData.logoutTime,
                        fineAmount: eventData.fineAmount.toFixed(2),
                        eventDate: eventData.eventDate,
                      })
                      toggleEditForm()
                      toggle()
                      if (eventData.id) {
                        router.push(pathname + '?' + createQueryString('editEventId', eventData.id.toString()))
                      }
                    }} 
                    >
                    <HiPencil size={18} className='fill-gray-700' />
                    <span className='font-medium text-gray-700 text-sm' >Edit</span>
                  </button>
                  {/* delete button */}
                  <button 
                    className='h-full flex flex-row p-2 rounded-md w-28 items-center gap-2 active:bg-red-100'
                    onClick={(e) => {
                      e.preventDefault()
                      toggleDeleteModal()
                      toggle()
                    }}
                    >
                    <TbTrashFilled size={18} className='fill-red-400' />
                    <span className='font-medium text-red-400 text-sm' >Delete</span>
                  </button>
                </div>
                
                {/* backdrop */}
                {/* <div
                  onClick={() => {toggle()}}
                  className={`bg-black fixed top-0 left-0 right-0 bottom-0 bg-opacity-0 z-[300] ${isModalOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                  ></div> */}

                {/* Delete Modal */}
                <ConfirmationModal
                    title='Confirm deletion'
                    content={`Are you sure you want to delete the selected attendance list? This action cannot be undone.`}
                    isOpen={isDeleteModalOpen}
                    onClose={toggleDeleteModal}
                    onConfirm={onConfirm}
                    confirmBtnLabel='Delete'
                    type='delete'
                    />
              </div>
            )}
        </div>

      </div>
    </div>
  )
}

export default EventsCard

// {isAdmin ? (
//   <div className='flex flex-col h-full p-3 border-gray-200 relative'>

//     {/* button toggle */}
//     <button
//       onClick={() => {toggle()}}
//       className={`p-2 rounded-full`}
//     >
//       <TbDotsVertical size={20} />
//     </button>

//     {/* modal */}
//     <div className={`absolute bg-white border translate-x-[-7.5rem] rounded-lg transition-all overflow-hidden shadow-sm z-[1300] p-1
//       ${isModalOpen ? "opacity-100" : "opacity-0 pointer-events-none"}  
//       `}>
//       {/* edit button */}
//       <button 
//         className='h-full flex flex-row p-3 w-28 items-center gap-2 active:bg-gray-200'
//         onClick={(e) => {
//           e.preventDefault()
//           toggleEditForm()
//           toggle()
//           if (eventData.id) {
//             router.push(pathname + '?' + createQueryString('editEventId', eventData.id.toString()))
//           }
//         }} 
//       >
//         <RiEdit2Line size={18} className='fill-gray-700' />
//         <span className='font-medium text-gray-700 text-sm' >Edit</span>
//       </button>
//       {/* delete button */}
//       <button 
//         className='h-full flex flex-row p-3 w-28 items-center gap-2 active:bg-red-100'
//         onClick={(e) => {
//           e.preventDefault()
//           toggleDeleteModal()
//           toggle()
//         }}
//       >
//         <PiTrashSimpleBold size={18} className='fill-gray-700' />
//         <span className='font-medium text-gray-700 text-sm' >Delete</span>
//       </button>
//     </div>
//     {/* backdrop */}
//     <div
//       onClick={() => {toggle()}}
//       className={`bg-black fixed top-0 left-0 right-0 bottom-0 bg-opacity-5 z-[1200] ${isModalOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
//     ></div>

//     {/* Delete Modal */}
//     <ConfirmationModal
//         title='Delete?'
//         content={`Are you sure you want to delete this attendance?`}
//         isOpen={isDeleteModalOpen}
//         onClose={toggleDeleteModal}
//         onConfirm={onConfirm}
//         confirmBtnLabel='Delete'
//         type='delete'
//     />
//   </div>
// ) : (
//   <IoIosArrowForward size={20} className='opacity-70'/>
// )}