"use client"
import React, { useEffect, useState, useRef } from 'react';
import { EventCard, NewEventForm } from '@/components';
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
    <div className={` overflow-y-scroll p-4 pt-20 pb-40 flex flex-col h-[100vh] bg-gray-100`}>
        
      <NewEventForm /> {/* Scroll to bottom to see component */}

      {/* ON GOING ATTENDANCE BLOCK */}
      <div className="ongoing-attendance mt-6">
        {upcomingEvents.length !== 0 && (
          <div className='flex flex-row gap-2 items-center justify-center'>
            <h2 className="text-md font-bold text-gray-700">TODAY</h2>
            <h3 className='text-md font-bold text-gray-400'>06/20/24</h3>
          </div>
        )}
        <div className='mt-8'>
          {ongoingEvents.length !== 0 && ongoingEvents.map(event => (
            <EventCard key={event.id} eventData={event}/>
          ))}
        </div>
      </div>

      {/* UPCOMING EVENTS BLOCK */}
      <div className="upcoming-events mt-12">
        {upcomingEvents.length !== 0 && (
          <h2 className="text-md font-bold text-gray-700 text-center">UPCOMING</h2>
        )}
        <div className='mt-8'>
          {upcomingEvents.length !== 0 && upcomingEvents.map(event => (
            <EventCard key={event.id} eventData={event} />
          ))}
        </div>

      </div>
    </div>
  );
}

export default Home