'use client'
import supabase from '@/lib/supabaseClient';
import { EventProps } from '@/types';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { IoIosArrowForward } from "react-icons/io";
import { PiTrashSimpleBold } from "react-icons/pi";
import { RiEdit2Line } from "react-icons/ri";
import ConfirmationModal from './ConfirmationModal';
import { TbDotsVertical } from "react-icons/tb";
import EventForm from './EventForm';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

// Main
const EventsCard: React.FC<{ 
  eventData: EventProps 
  isEditFormOpen: boolean
  toggleEditForm: () => void
}> = ({ eventData, isEditFormOpen, toggleEditForm }) => {

  const [isAdmin, setIsAdmin] = useState(false)
  
  useEffect(() => {
    setIsAdmin(true) // set to admin as of the moment
  }, [setIsAdmin])

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

  const [isModalOpen, setIsModalOpen] = useState(false)
  function toggle() {
    setIsModalOpen(!isModalOpen)
  }
  
  // Event form
  const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false);
  const toggleUpdateEventForm = () => {
    setIsUpdateFormOpen(!isUpdateFormOpen);
  };

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

  return (
    <div className='flex flex-row h-fit rounded-xl mt-4 border border-gray-200 shadow-sm bg-white overflow-hidden z-[100]'>

      <Link href={`/events/${eventData.id}`} className='w-full'>
        <div className="flex flex-col p-5 pt-4 min-w-full">
          <div className='flex flex-row items-center justify-between relative '>
            <span className="event__title ">{eventData.title}</span>
          </div>
          {/* <span className='text-xs font-medium mt-2 text-gray-500'>Attendees</span>
          <div className='text-xs flex flex-wrap gap-1 mt-2'>
          <span className="event__class">BSBA</span>
          <span className="event__class">BSIT</span>
          <span className="event__class">BOT</span>
          <span className="event__class">BS Info Tech</span>
          <span className="event__class">BSEd.</span>
          <span className="event__class">BSE</span>
          <span className="event__class">BSCE</span>
          </div> */}
          <div className="mt-2 flex flex-col">
            <div className='flex flex-row items-center gap-2 w-fit'>
              {/* <TiLocation size={15} className='opacity-40'/> */}
              <span className="event__info">{eventData.location}</span>
            </div>
            <div className='flex flex-row items-center gap-3 w-fit'>
              {/* <FaClock size={11} className='ml-[2px] opacity-40 translate-y-[1px]' /> */}
              <div>
                <span className="event__info">{login}</span>
                <span className="event__info mx-1">-</span>
                <span className="event__info">{logout}</span>
              </div>
            </div> 
            <div className=' flex flex-row items-center gap-3 mt-1 w-fit'>
              {/* <FaMoneyBillWave size={13} className='ml-[1px] opacity-40 translate-y-[-1px]' /> */}
              <span className="event__info">{fine}</span> 
            </div>
          </div>
        </div>
      </Link>

      {/* Edit and Delete Buttons */}
      <div className=' '>
        {isAdmin ? (
          <div className='flex flex-col h-full p-3 border-gray-200 relative'>

            {/* button toggle */}
            <button
              onClick={() => {toggle()}}
              className={`p-2 rounded-full`}
            >
              <TbDotsVertical size={20} />
            </button>

            {/* modal */}
            <div className={`absolute bg-white border translate-x-[-7rem] rounded-lg transition-all overflow-hidden shadow-sm
              ${isModalOpen ? "opacity-100" : "opacity-0 pointer-events-none"}  
            `}>
              {/* edit button */}
              <button 
                className='h-full flex flex-row p-3 w-28 items-center gap-2 active:bg-gray-200'
                onClick={(e) => {
                  e.preventDefault()
                  toggleEditForm()
                  if (eventData.id) {
                    router.push(pathname + '?' + createQueryString('editEventId', eventData.id.toString()))
                  }
                }} 
              >
                <RiEdit2Line size={18} className='fill-gray-700' />
                <span className='font-medium text-gray-700 text-sm' >Edit</span>
              </button>
              {/* delete button */}
              <button 
                className='h-full flex flex-row p-3 w-28 items-center gap-2 active:bg-red-100'
                onClick={(e) => {
                  e.preventDefault()
                  toggleDeleteModal()
                }}
              >
                <PiTrashSimpleBold size={18} className='fill-gray-700' />
                <span className='font-medium text-gray-700 text-sm' >Delete</span>
              </button>
            </div>

        
            {/* Delete Modal */}
            <ConfirmationModal
                title='Delete?'
                content={`Are you sure you want to delete this attendance?`}
                isOpen={isDeleteModalOpen}
                onClose={toggleDeleteModal}
                onConfirm={onConfirm}
                confirmBtnLabel='Delete'
                type='delete'
            />
          </div>
        ) : (
          <IoIosArrowForward size={20} className='opacity-70'/>
        )}
      </div>
    </div>
  )
}

export default EventsCard