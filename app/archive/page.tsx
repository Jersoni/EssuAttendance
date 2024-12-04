'use client'
import { ArchiveEventCard } from "@/components";
import supabase from "@/lib/supabaseClient";
import { AuthProps, EventProps } from "@/types";
import { checkAuth } from "@/utils/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";

const Page = () => {
  
  // get user role
  const [ auth, setAuth ] = useState<AuthProps>()
  const authRef = useRef<AuthProps | undefined>(auth);
  const router = useRouter()
  const pathname = usePathname();

  useEffect(() => {
    setAuth(checkAuth(router, pathname));
  }, [router, pathname]);

  const [events, setEvents] = useState<EventProps[]>();

  const getEvents = async () => {
    console.log(1)
    if (authRef.current && authRef.current.org_id) {
      console.log(2)
      const today = new Date().toISOString().split('T')[0];

      try {
        const { data, error } = await supabase
          .from("event")
          .select()
          .eq("org_id", authRef.current.org_id)
          // .lt("eventDate", today)
        
        if (error) {
          console.error(error)
        } else {
          setEvents(data)
        }

      } catch (error) {
        console.log(error)
      }
    }
  }

  useEffect(() => {
    authRef.current = auth; 
  }, [auth]);

  useEffect(() => {
    getEvents()
  }, [auth])

  useEffect(() => {
    const channel = supabase
      .channel("archive")
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "event",
        },
        (payload) => {
          console.log("deleted event: ");
          console.log(payload);

          getEvents()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])
  
  return (
    <div className={`pt-20 overflow-y-scroll min-h-[100vh] pb-40 p-5`}>
      {events && (
        events.length > 0 ? (
          events.map(event => {
            if (new Date(event.eventDate) < new Date()) {
              return (
                <ArchiveEventCard 
                  key={event.id} 
                  data={event} 
                  role={auth?.role}
                />
              );
            }
            return null;
          })
        ) : (
          <div className="text-gray-400 opacity-80 text-center text-sm mt-8">There&apos;s nothing here yet.</div>
        )
      )}

    </div>
  )
}

export default Page