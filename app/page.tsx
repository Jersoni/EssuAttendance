"use client"
import React, { useEffect, useState } from 'react';
import { EventCard } from '@/components';
import { RiStickyNoteAddLine } from "react-icons/ri";
import { Button } from '@/components';

interface Event {
  id: number
  title: string
  location: string
  loginTime: string
  logoutTime: string
  fineAmount: number
  eventDate: string
}

interface ParsedEvent extends Omit<Event, 'eventDate'> {
  eventDate: Date; // Converted to JavaScript Date object
}

// eslint-disable-next-line @next/next/no-async-client-component
const Home: React.FC = () => {


  const [date, setDate] = useState("");

  const handlePost = () => {
    const today = new Date(date)
    const time = today.getTime()
    console.log(time)
  }

  // fetch event data
  const [ongoingEvents, setOngoingEvents] = useState<ParsedEvent[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<ParsedEvent[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/events')

        if(!res.ok) {
          console.log("There is an error fetching the events")
        }

        const events = await res.json()
        const currentDate = new Date()

        const parsedEvents = events.map((event: { eventDate: string | Date; }) => ({
          ...event,
          eventDate: new Date(event.eventDate)
        }));

        const ongoing = parsedEvents.filter((event: { eventDate: string | Date; }) => event.eventDate <= currentDate);
        const upcoming = parsedEvents.filter((event: { eventDate: string | Date; })=> event.eventDate > currentDate);

        // setEvents(parsedEvents);
        setOngoingEvents(ongoing);
        setUpcomingEvents(upcoming);

      } catch (error) {
        console.error(error)
      }
    }
    fetchEvents()
  }, [])

  // newEventButton Click Handler
  const [isOpen, setIsOpen] = useState(false);
  const toggleNewEventForm = () => {
    setIsOpen(!isOpen);
  };


  return (
    <div className={`${isOpen ? "overflow-hidden" : "overflow-y-scroll"} p-4 pt-20 pb-40 flex flex-col h-[100vh] bg-gray-200`}>

      {/* NEW EVENT BUTTON */}
      <Button variant={'fixed-circle'} onClick={toggleNewEventForm}>
        <RiStickyNoteAddLine size={24} color='white' />
      </Button>

      {/* NEW EVENT FORM */}
      <div className={`${isOpen ? "overflow-hidden" : "overflow-y-scroll translate-y-full" } absolute rounded-t-2xl left-0 top-0 mt-[5vh] border border-black h-[95vh] w-full bg-white z-[120] transition-all`}>

        <h1 className='font-semibold text-xl p-5 border-b border-gray-400'>New Attendance Log</h1>
        <Button variant='close' onClick={toggleNewEventForm} className='absolute right-2 top-2'></Button>

        <form action="" className='p-5 pb-80 flex flex-col gap-4 overflow-y-scroll h-[86vh]'>
          <div className='flex flex-col gap-1'>
            <label className='form__label' htmlFor="title">Event Title</label>
            <input autoComplete='off' type="text" name="title" id="title" className={`form__input`} />
          </div>
          <div className='flex flex-col gap-1'>
            <label className='form__label' htmlFor="description">Description</label>
            <input autoComplete='off' type="text" name="description" id="description" className={`form__input`} />
          </div>
          <div className='flex flex-col gap-1'>
            <label className='form__label' htmlFor="venue">Venue</label>
            <input autoComplete='off' type="text" name="venue" id="venue" className={`form__input`} />
          </div>
          <div className='flex flex-col gap-1'>
            <label className='form__label' htmlFor="date">Date</label>
            <input type="date" onChange={(e) => {
                setDate(e.target.value)
              }} name="date" id="date" className={`form__input`} />
          </div>
          <div className='flex flex-row gap-6'>
            <div className='flex flex-col gap-1 w-full'>
              <label className='form__label' htmlFor="login">Login Time</label>
              <input type="time" name="login" id="login" className={`form__input`}/>
            </div>
            <div className='flex flex-col gap-1 w-full'>
              <label className='form__label' htmlFor="logout">Logout Time</label>
              <input type="time" name="logout" id="logout" className={`form__input`}/>
            </div>
          </div>
          <div className='flex flex-col gap-1'>
            <label className='form__label'>Attendees</label>
            <div className='h-10 flex flex-wrap'>
              <div className='flex gap-2 items-center ml-3'>
                <input type="checkbox" name="colleges" id="bsit" className={`form__checkbox`} />
                <label className='form__colleges' htmlFor="bsit">BSIT</label>
              </div>
              <div className='flex gap-2 items-center ml-3'>
                <input type="checkbox" name="colleges" id="bot" className={`form__checkbox`} />
                <label className='form__colleges' htmlFor="bot">BOT</label>
              </div>
              <div className='flex gap-2 items-center ml-3'>
                <input type="checkbox" name="colleges" id="infotech" className={`form__checkbox`} />
                <label className='form__colleges' htmlFor="infotech">BSInfoTech</label>
              </div>
              <div className='flex gap-2 items-center ml-3'>
                <input type="checkbox" name="colleges" id="bse" className={`form__checkbox`} />
                <label className='form__colleges' htmlFor="bse">BSE</label> 
              </div>
              <div className='flex gap-2 items-center ml-3'>
                <input type="checkbox" name="colleges" id="bsed" className={`form__checkbox`} />
                <label className='form__colleges' htmlFor="bsed">BSEd.</label>
              </div>
              <div className='flex gap-2 items-center ml-3'>
                <input type="checkbox" name="colleges" id="bsce" className={`form__checkbox`} />
                <label className='form__colleges' htmlFor="bsce">BSCE</label>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div className={`z-[120] ${isOpen ? "block" : "hidden"} flex gap-3 absolute bottom-0 left-0 p-5 pb-12 border-t border-gray-400 w-full bg-white`}>
        <Button variant='secondary'>Cancel</Button>
        <Button onClick={handlePost}>Post</Button>
      </div>


      {/* BACKDROP */}
      <div className={`z-[110] bottom-0 left-0 absolute h-full w-full bg-black bg-opacity-70 ${isOpen ? "block" : "hidden" }`}></div>



      {/* ON GOING ATTENDANCE BLOCK */}
      <div className="ongoing-attendance mt-6">
        {upcomingEvents.length !== 0 && (
          <div className='flex flex-row gap-2 items-center'>
            <h2 className="text-2xl font-bold">Today</h2>
            <h3 className='text-xl font-bold opacity-40'>06/20/24</h3>
          </div>
        )}
        <div className='mt-6'>
          {ongoingEvents.length !== 0 && ongoingEvents.map(event => (
            <EventCard key={event.id} eventData={event}/>
          ))}
        </div>
      </div>

      {/* UPCOMING EVENTS BLOCK */}
      <div className="upcoming-events mt-12">
        {upcomingEvents.length !== 0 && (
          <h2 className="text-2xl font-bold">Upcoming Events</h2>
        )}
        <div className='mt-6'>
          {upcomingEvents.length !== 0 && upcomingEvents.map(event => (
            <EventCard key={event.id} eventData={event} />
          ))}
        </div>

      </div>
    </div>
  );
}

export default Home