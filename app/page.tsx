"use client"
import React, { useEffect, useState, useRef } from 'react';
import { EventCard, EventForm } from '@/components';
import { EventProps } from '@/types';

interface ParsedEvent extends Omit<EventProps, 'eventDate'> {
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

  return (
    <div className={` overflow-y-scroll p-4 pb-40 flex flex-col h-[90vh] bg-gray-100`}>
        
      <EventForm /> {/* Scroll to bottom to see component */}

      {/* ON GOING ATTENDANCE BLOCK */}
      {ongoingEvents.length !== 0 && (
        <div className="ongoing-attendance mt-1">
          <h2 className="text-md font-semibold text-gray-700">Today</h2>
          <div className='mt-6'>
            {ongoingEvents.map(event => (
              <EventCard key={event.id} eventData={event}/>
            ))}
          </div>
        </div>
      )}

      {/* UPCOMING EVENTS BLOCK */} 
      {upcomingEvents.length !== 0 && (
        <div className="upcoming-events mt-8 pt-3 border-t border-gray-200">
          <h2 className="text-md font-semibold text-gray-700">Upcoming</h2>
          <div className='mt-6'>
            {upcomingEvents.map(event => (
              <EventCard key={event.id} eventData={event} />
            ))}
          </div>
        </div>  
      )}

      
    </div>
  );
}

export default Home