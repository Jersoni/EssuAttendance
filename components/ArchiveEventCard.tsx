import { EventProps } from '@/types';
import Link from 'next/link';
import { IoIosArrowForward } from "react-icons/io";

const ArchiveEventCard = ({data} : {data: EventProps}) => {
  return (
    <Link href={`/events/${data.id}`} className="w-full h-fit py-3 border-b flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-sm font-medium">{data.title}</span>
          <span className="text-[13px] opacity-50">{data.eventDate}</span>
        </div>
        <IoIosArrowForward className="opacity-40 mr-3"/>
    </Link>
  )
}

export default ArchiveEventCard