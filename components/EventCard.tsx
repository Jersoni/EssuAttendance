'use client'
import Link from 'next/link'
import { TiLocation } from "react-icons/ti";
import { FaClock } from "react-icons/fa6";
import { IoIosArrowForward } from "react-icons/io";
import { FaMoneyBillWave } from "react-icons/fa";
import { RiEdit2Line } from "react-icons/ri";
import { useEffect, useState } from 'react';
import { PiTrashSimpleBold } from "react-icons/pi";
import { Button } from '@/components';

interface Event {
    id: number
    title: string
    location: string
    loginTime: string
    logoutTime: string
    fineAmount: number
    eventDate: string
    classes?: string
}

interface ParsedEvent extends Omit<Event, 'eventDate'> {
    eventDate: Date; // Converted to JavaScript Date object
}

// Main
const EventsCard: React.FC<{ eventData: ParsedEvent }> = ({ eventData }) => {

  const [isAdmin, setIsAdmin] = useState(false)
  
  useEffect(() => {
    setIsAdmin(true) // set to admin as of the moment
  }, [setIsAdmin])

  return (
    <Link href={`/events/${eventData.id}`}>
      <div className="flex flex-col bg-white h-fit rounded-xl mt-4 p-5">
        <div className='flex flex-row items-center justify-between'>
          <span className="event__title">{eventData.title}</span>
          <div>
            {isAdmin ? (
              <EventCardActions /> // scroll to bottom to see component
            ) : (
              <IoIosArrowForward size={20} className='opacity-70'/>
            )}
          </div>
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
        <div className="mt-3 flex flex-col">
          <div className='flex flex-row items-center gap-2 w-fit'>
            <TiLocation size={17} className='opacity-60'/>
            <span className="event__info">{eventData.location}</span>
          </div>
          <div className='flex flex-row items-center gap-3 w-fit'>
            <FaClock size={12} className='ml-[2px] opacity-60 translate-y-[1px]' />
            <div>
              <span className="event__info">{eventData.loginTime}</span>
              <span className="event__info mx-1">-</span>
              <span className="event__info">{eventData.logoutTime}</span>
            </div>
          </div>
          <div className=' flex flex-row items-center gap-3 mt-1 w-fit'>
            <FaMoneyBillWave size={15} className='ml-[1px] opacity-60 translate-y-[-1px]' />
            <span className="event__info">P25.00</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

// EDIT and DELETE Buttons Component
const EventCardActions = () => (
  <div className='flex gap-2'>
    
    <Button 
      variant='small-square' onClick={(e) => {e.preventDefault()}} >
      <RiEdit2Line size={20} className='fill-gray-700' />
    </Button>
      
    <Button 
      variant='small-square' onClick={(e) => {e.preventDefault()}} >
      <PiTrashSimpleBold size={20} className='fill-gray-700' />
    </Button>
      
  </div>
)

export default EventsCard