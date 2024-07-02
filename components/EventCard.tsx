import Link from 'next/link'
import { MdOutlineLocationOn } from "react-icons/md";
import { TbLogin2 } from "react-icons/tb";
import { TbLogout2 } from "react-icons/tb";

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

const EventsCard: React.FC<{ eventData: ParsedEvent }> = ({ eventData }) => {

  return (
    <Link href={`/events/${eventData.id}`}>
      <div className="bg-white shadow-md h-fit rounded-2xl mt-4 p-4">
        <span className="event__title">{eventData.title}</span>
        <div className='text-xs flex flex-wrap gap-1 mt-2'>
          <span className="event__class">BSBA</span>
          <span className="event__class">BSIT</span>
          <span className="event__class">BOT</span>
          <span className="event__class">BS Info Tech</span>
          <span className="event__class">BSEd.</span>
          <span className="event__class">BSE</span>
          <span className="event__class">BSCE</span>
        </div>
        <div className="mt-4">
          <div className='flex flex-row items-center gap-2'>
            <MdOutlineLocationOn size={16} className='opacity-80'/>
            <span className="event__info">{eventData.location}</span>
          </div>
          <div className='flex flex-row items-center gap-2'>
            <TbLogin2 size={16} className='opacity-80' />
            <span className="event__info">{eventData.loginTime}</span>
          </div>
          <div className='flex flex-row items-center gap-2'>
            <TbLogout2 size={16} className='opacity-80'/>
            <span className="event__info">{eventData.logoutTime}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default EventsCard