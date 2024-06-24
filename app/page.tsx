"use client"
import React, { useEffect, useState } from 'react';
import EventsList from './EventsList';

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

  // const [events, setEvents] = useState<ParsedEvent[]>([]);
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
    <div className="home">
      <div className="p-4 flex flex-col overflow-y-scroll h-[100vh] pb-40 pt-20">

        {/* ON GOING ATTENDANCE BLOCK */}
        <div className="ongoing-attendance mt-5">

          {ongoingEvents.length !== 0 && <h2 className="text-xl font-semibold">Ongoing Attendance</h2>}
          {ongoingEvents.length !== 0 && ongoingEvents.map(event => (
                <EventsList key={event.id} eventData={event}/>
              ))}

        </div>

        {/* UPCOMING EVENTS BLOCK */}
        <div className="upcoming-events mt-16">

          {upcomingEvents.length !== 0 && <h2 className="text-xl font-semibold">Upcoming Events</h2>}
          {upcomingEvents.length !== 0 && upcomingEvents.map(event => (
                <EventsList key={event.id} eventData={event} />
              ))}

        </div>
      </div>
    </div>
  );
}

export default Home