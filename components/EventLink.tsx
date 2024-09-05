import { EventProps } from "@/types"
import { GoArrowUpRight } from "react-icons/go";
import Link from "next/link";

export default function EventLink({ eventData }: { eventData: EventProps }) {

    const id: number | undefined = eventData.id
    const title: string = eventData.title
    const fine: string = "₱ " + eventData.fineAmount.toFixed(2).toString()

    return (
        <div className='flex items-center'>
            <Link href={`/events/${id}`} className='flex flex-row items-center gap-1 max-w-[70%]'>
                <span className='w-fit whitespace-nowrap overflow-hidden text-ellipsis'>{title}</span>
                <GoArrowUpRight className='min-w-fit' size={16}/> 
            </Link>
            <p className='text-gray-500 ml-auto min-w-fit'>{fine}</p>
        </div>
    )
}