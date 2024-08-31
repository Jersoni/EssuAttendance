'use client'
import supabase from '@/lib/supabaseClient';
import { EventProps } from '@/types';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { IoIosArrowForward } from "react-icons/io";
import { PiTrashSimpleBold } from "react-icons/pi";
import { RiEdit2Line } from "react-icons/ri";
import ConfirmationModal from './ConfirmationModal';

interface ParsedEvent extends Omit<EventProps, 'eventDate'> {
  eventDate: Date; // Converted to JavaScript Date object
}

// Main
const EventsCard: React.FC<{ eventData: ParsedEvent }> = ({ eventData }) => {

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
  const [isModalOpen, setIsModalOpen] = useState(false)

  const toggleDeleteModal = () => {
    setIsModalOpen(!isModalOpen)
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

  return (
    <div className='flex flex-row h-fit rounded-xl mt-4 border border-gray-200 shadow-sm bg-white overflow-hidden'>
      <Link href={`/events/5`} className='w-full'>
        <div className="flex flex-col p-5 min-w-full">
          <div className='flex flex-row items-center justify-between relative '>
            <span className="event__title text-gray-700 ">{eventData.title}</span>
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
          <div className='flex flex-col h-full border-l border-gray-200'>
            <button 
              className='h-full p-4 border-b border-gray-200 active:bg-gray-200'
              onClick={(e) => {
                e.preventDefault()
                
              }} 
            >
              <RiEdit2Line size={23} className='fill-gray-700' />
            </button>
              
            <button 
              className='h-full p-4 active:bg-red-100'
              onClick={(e) => {
                e.preventDefault()
                toggleDeleteModal()
              }}
            >
              <PiTrashSimpleBold size={23} className='fill-gray-700' />
            </button>
        
            {/* Delete Modal */}
            <ConfirmationModal 
                title='Delete Attendance Record'
                content={`Are you sure you want to delete this record? This action cannot be undone.`}
                isOpen={isModalOpen}
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