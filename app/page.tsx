"use client";
import { EventCard, EventForm } from "@/components";
import supabase from "@/lib/supabaseClient";
import { EventProps } from "@/types";
import React, { useEffect, useState } from "react";

interface ParsedEvent extends Omit<EventProps, "eventDate"> {
  eventDate: Date; // Converted to JavaScript Date object
}

// eslint-disable-next-line @next/next/no-async-client-component
const Home: React.FC = () => {
  // fetch event data
  const [ongoingEvents, setOngoingEvents] = useState<ParsedEvent[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<ParsedEvent[]>([]);

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
      setOngoingEvents(ongoing);
      setUpcomingEvents(upcoming);
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

  return (
    <div
      className={`p-4 pb-60 flex flex-col bg-gray-100 h-[100vh] !overflow-y-scroll ${
        isOpen ? "overflow-hidden" : "overflow-y-scrol"
      }
    `}
    >
      <EventForm
        operation={"insert"}
        isOpen={isOpen}
        toggleNewEventForm={toggleNewEventForm}
      />

      {/* TODO: Only display events for this day and upcoming */}

      {/* ON GOING ATTENDANCE BLOCK */}
      {ongoingEvents.length !== 0 && (
        <div className="ongoing-attendance mt-16">
          <h2 className="text-sm font-semibold text-gray-400">Today</h2>

          <div className="mt-6">
            {ongoingEvents.map((event) => (
              <EventCard key={event.id} eventData={event} />
            ))}
          </div>
        </div>
      )}

      {/* UPCOMING EVENTS BLOCK */}
      {upcomingEvents.length !== 0 && (
        <div className="upcoming-events !mt-10 pt-6 border-t border-gray-200">
          <h2 className="text-sm font-semibold text-gray-400">Upcoming</h2>
          <div className="mt-6">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} eventData={event} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
