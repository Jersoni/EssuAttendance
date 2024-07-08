"use client"
import React, { useEffect, useState, useRef } from 'react';
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

  const dateInputRef = useRef(null);

  const handleDateClick = () => {
    if (dateInputRef.current) {
      (dateInputRef.current as HTMLInputElement).focus();
    }
  }

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
    <div className={`${isOpen ? "overflow-hidden" : "overflow-y-scroll"} p-4 pt-20 pb-40 flex flex-col h-[100vh] bg-gray-100`}>

      {/* NEW EVENT BUTTON */}
      <Button variant={'fixed-circle'} className='z-[120]' onClick={toggleNewEventForm}>
        <RiStickyNoteAddLine size={24} color='white' />
      </Button>

      {/* NEW EVENT FORM */}
      <div className={`${isOpen ? "overflow-hidden" : "overflow-y-scroll translate-y-full" } absolute rounded-t-2xl left-0 top-0 mt-[5vh] h-[95vh] w-full bg-white z-[120] transition-all duration-300`}>

        <div className='flex flex-row items-center p-1'>
          <h1 className='font-semibold text-lg p-5 absolute text-center w-full'>New Attendance Log</h1>
          <Button variant='close' className='ml-auto z-[120]' onClick={toggleNewEventForm}></Button>
        </div>

        <form action="" className='p-5 pt-0 flex flex-col gap-4 overflow-y-scroll h-[86vh]'>
          <div className='flex flex-col gap-1'>
            <label className='form__label' htmlFor="title">Title</label>
            <input autoComplete='off' type="text" name="title" id="title" className={`form__input`} />
          </div>
          <div className='flex flex-col gap-1'>
            <label className='form__label' htmlFor="venue">Venue</label>
            <input autoComplete='off' type="text" name="venue" id="venue" className={`form__input`} />
          </div>
          <div className='flex flex-col gap-1'>
            <label className='form__label' htmlFor="date">Date</label>
            <div className={`form__input w-full flex`} onClick={handleDateClick}>
              <input type="date" name="date" ref={dateInputRef} id="date" className='outline-none border bg-white p-0 w-full' />
            </div>
          </div>
          <div className='flex flex-col gap-1 w-fit'>
            <label className='form__label' htmlFor="login">Login Time</label>
            <input type="time" name="login" id="login" className={`form__input`}/>
          </div>
          <div className='flex flex-col gap-1 w-fit'>
            <label className='form__label' htmlFor="logout">Logout Time</label>
            <input type="time" name="logout" id="logout" className={`form__input`}/>
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
      <div className={`${isOpen ? "block" : "hidden" } z-[120] flex gap-3 w-full absolute left-0 bottom-0 p-5 pb-8`}>
        <Button variant='secondary' onClick={toggleNewEventForm}>Cancel</Button>
        <Button variant='primary' onClick={toggleNewEventForm}>Post</Button>
      </div>


      {/* BACKDROP */}
      <div className={`z-[110] bottom-0 left-0 absolute h-full w-full bg-black bg-opacity-70 ${isOpen ? "block" : "hidden" }`}></div>



      {/* ON GOING ATTENDANCE BLOCK */}
      <div className="ongoing-attendance mt-6">
        {upcomingEvents.length !== 0 && (
          <div className='flex flex-row gap-2 items-center'>
            <h2 className="text-xl font-bold">Today</h2>
            <h3 className='text-lg font-bold opacity-40'>06/20/24</h3>
          </div>
        )}
        <div>
          {ongoingEvents.length !== 0 && ongoingEvents.map(event => (
            <EventCard key={event.id} eventData={event}/>
          ))}
        </div>
      </div>

      {/* UPCOMING EVENTS BLOCK */}
      <div className="upcoming-events mt-12">
        {upcomingEvents.length !== 0 && (
          <h2 className="text-xl font-bold">Upcoming</h2>
        )}
        <div>
          {upcomingEvents.length !== 0 && upcomingEvents.map(event => (
            <EventCard key={event.id} eventData={event} />
          ))}
        </div>

      </div>
    </div>
  );
}

export default Home