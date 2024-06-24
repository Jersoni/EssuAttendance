import Link from 'next/link'
import React from 'react'


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
    eventDate: Date; //Converted to JavaScript Date object
  }


const EventsList: React.FC<{ eventData: ParsedEvent }> = ({ eventData }) => {

  
  return (
    <Link href={`/events/${eventData.id}`}>
      <div className="border border-[#d0d0d0] bg-gray-100 h-fit rounded-md mt-5 p-3">
        <span className="event__title">{eventData.title}</span>
        <div className="mt-2">
          <div>
            <span className="event__label">Venue</span>
            <span className="event__info">{eventData.location}</span>
          </div>
          <div>
            <span className="event__label">Login time</span>
            <span className="event__info">{eventData.loginTime}</span>
          </div>
          <div>
            <span className="event__label">Logout time</span>
            <span className="event__info">{eventData.logoutTime}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default EventsList
