"use client";
import { EventCard, EventForm, EditEventForm } from "@/components";
import supabase from "@/lib/supabaseClient";
import { EventProps, FormEventProps } from "@/types";
import React, { useCallback, useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useAppContext } from "@/context";

// eslint-disable-next-line @next/next/no-async-client-component
const Home: React.FC = () => {

  const router = useRouter()

  // fetch event data
  const [events, setEvents] = useState<EventProps[]>([])
  const [ongoingEvents, setOngoingEvents] = useState<EventProps[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<EventProps[]>([]);

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/events");

      if (!res.ok) {
        console.log("There is an error fetching the events");
      }

      const events = await res.json();
      const currentDate = new Date();

      const parsedEvents = events.map(
        (event: { eventDate: string | Date }) => ({
          ...event,
          eventDate: new Date(event.eventDate),
        })
      );

      const ongoing = parsedEvents.filter(
        (event: { eventDate: string | Date }) => event.eventDate <= currentDate
      );
      const upcoming = parsedEvents.filter(
        (event: { eventDate: string | Date }) => event.eventDate > currentDate
      );

      // setEvents(parsedEvents);
      setEvents(events)
      setOngoingEvents(ongoing);
      setUpcomingEvents(upcoming);
      console.log(events)
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("realtime_events_A")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "event",
        },
        (payload) => {
          console.log("new attendance log");
          console.log(payload.new);
          fetchEvents();
        }
      )
      // TODO: REALTIME CHANGES FOR UPDATES
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "event",
        },
        (payload) => {
          console.log("updated attendance log: ");
          console.log(payload);
          fetchEvents();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "event",
        },
        (payload) => {
          console.log("deleted attendance log id: ");
          console.log(payload.old);
          fetchEvents();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  });

  // Event form
  const [isOpen, setIsOpen] = useState(false);
  const toggleNewEventForm = () => {
    setIsOpen(!isOpen);
  };

  // Edit form
  const [editFormData, setEditFormData] = useState<FormEventProps>()
  const [isEditFormOpen, setIsEditFormOpen] = useState(false)
  const toggleEditForm = () => {
    setIsEditFormOpen(!isEditFormOpen);
  };

  const searchParams = useSearchParams()
  const [editEventID, setEditEventID] = useState<number>()

  useEffect(() => {
    setEditEventID(Number(searchParams.get("editEventId")))
  }, [searchParams])

  useEffect(() => {
    if (searchParams.get("editEventId")) {
      setIsEditFormOpen(true)
    }
  }, [searchParams])

  const {isNavOpen} = useAppContext()

  return (
    <div
      className={`px-3 pt-20 pb-60 flex flex-col bg-gray-100 min-h-[100vh] ${isOpen ? "overflow-hidden overflow-y-hidden" : "overflow-y-scroll"}`}
    >
      {/* New event form */}
      <EventForm
        isOpen={isOpen}
        toggleEventForm={toggleNewEventForm}

      />

      {/* Edit event form */}
      <EditEventForm 
        isOpen={isEditFormOpen}
        toggleEventForm={toggleEditForm}
        eventID={editEventID}
        editFormData={editFormData}
      />


      {/* ON GOING ATTENDANCE BLOCK */}
      {ongoingEvents.length !== 0 && (
        <>
          <span className="font-semibold text-gray-400 text-xs ">Happening now</span>
          <div className="ongoing-attendance flex flex-col gap-3 mt-5">
            {ongoingEvents.map((event) => (
              <EventCard
                isHappeningNow={true}
                isNavOpen={isNavOpen}
                key={event.id} 
                eventData={event}
                isEditFormOpen={isEditFormOpen}
                toggleEditForm={toggleEditForm}
                setEditFormData={setEditFormData} 
              />
            ))}
          </div>
        </>
      )}

      {/* UPCOMING EVENTS BLOCK */}
      {upcomingEvents.length !== 0 && (
        <div className="!mt-10">
          <span className="font-semibold text-gray-400 text-xs ">Upcoming events</span>
          <div className="upcoming-attendance flex flex-col gap-3 mt-5">
            {upcomingEvents.map((event) => (
              <EventCard 
                isNavOpen={isNavOpen}
                key={event.id} 
                eventData={event}
                isEditFormOpen={isEditFormOpen}
                toggleEditForm={toggleEditForm}  
                setEditFormData={setEditFormData} 
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
