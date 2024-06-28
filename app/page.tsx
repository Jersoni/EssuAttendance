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
    <div className="p-4 flex flex-col overflow-y-scroll h-[100vh] pb-40 pt-20 bg-gray-200">



      {/* NEW EVENT BUTTON */}
      <Button variant={'fixed-circle'} onClick={toggleNewEventForm}>
        <RiStickyNoteAddLine size={24} color='white' />
      </Button>

      {/* NEW EVENT FORM */}
      <div className={`${isOpen ? "" : "translate-y-full" } p-5 absolute rounded-t-2xl left-0 bottom-0 h-[95vh] w-full bg-white z-[120] transition-all`}>
        <h1 className='font-semibold text-xl'>New Attendance Log</h1>
        <Button variant='close' onClick={toggleNewEventForm} className='absolute right-2 top-2'></Button>

        <form action="" className='mt-5 flex flex-col gap-4'>
          <div className='flex flex-col gap-2'>
            <label htmlFor="eventTitle">Event Title</label>
            <input type="text" name="eventTitle" id="eventTitle" className={`border border-black`} />
          </div>
          <div className='flex flex-col gap-2'>
            <label htmlFor="eventTitle">Venue</label>
            <input type="text" name="eventTitle" id="eventTitle" className={`border border-black`} />
          </div>
          <div className='flex flex-col gap-2'>
            <label htmlFor="eventTitle">Date</label>
            <input type="date" name="eventTitle" id="eventTitle" className={`border border-black`} />
          </div>
          <div className='flex flex-row gap-6'>
            <div className='flex flex-col gap-2 w-full'>
              <label htmlFor="eventTitle">Login Time</label>
              <input type="time" name="eventTitle" id="eventTitle" className={`border border-black`} />
            </div>
            <div className='flex flex-col gap-2 w-full'>
              <label htmlFor="eventTitle">Logout Time</label>
              <input type="time" name="eventTitle" id="eventTitle" className={`border border-black`} />
            </div>
          </div>
        </form>
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