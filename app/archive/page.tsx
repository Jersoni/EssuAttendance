'use client'
import { ArchiveEventCard } from "@/components";
import { EventProps } from "@/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";

const Page = () => {

  const todayDate = new Date().toLocaleDateString()
  const [events, setEvents] = useState<EventProps[]>([]);

  useEffect(() => {
    const getEvents = async () => {
      try {
        const result = await fetch('/api/events')
        const json = await result.json()

        console.log(json)
        setEvents(json)
      } catch (error) {
        console.log(error)
      }
    }
    getEvents()
  }, [])
  
  return (
    <div className={`mt-20 overflow-y-scroll pb-40 px-5`}>

      {events.map(event => {
        if (new Date(event.eventDate) < new Date()) {
          return (
            <ArchiveEventCard key={event.id} data={event} />
          )
        }
      })}
      
    </div>
  )
}

export default Page