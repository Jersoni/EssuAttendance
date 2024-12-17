"use client";
import { EditEventForm, EventCard, EventForm } from "@/components";
import { useAppContext } from "@/context";
import supabase from "@/lib/supabaseClient";
import {
  Attendance,
  AuthProps,
  EventProps,
  FormEventProps,
  StudentProps,
} from "@/types";
import { checkAuth, fetchOrganization, getFormattedTime } from "@/utils/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { IoAdd } from "react-icons/io5";

type MetaTag = {
  name: string;
  content: string;
};

// eslint-disable-next-line @next/next/no-async-client-component
const Home: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  // get user role
  // auth verification
  const [auth, setAuth] = useState<AuthProps>();

  useEffect(() => {
    (async () => {
      const token = checkAuth(router, pathname);

      if (token && token.id && token.role) {
        const data = await fetchOrganization(token.id);
        // console.log(data);
        setAuth({
          ...data,
          role: token.role,
        });
      }
    })();
  }, [router, pathname]);

  // fetch program/course handled by the organization
  useEffect(() => {
    let isMounted = true; // Track if the effect is still active

    if (auth?.organization === undefined && auth) {
      const fetchProgram = async () => {
        try {
          const { data, error } = await supabase
            .from("organizations")
            .select("program")
            .eq("id", auth.id)
            .single();

          if (isMounted) {
            if (error) {
              console.error("Error fetching organization data:", error);
            } else if (data) {
              setAuth(
                (prev) =>
                  ({
                    ...prev,
                    program: data.program,
                  } as AuthProps)
              );
            }
          }
        } catch (e) {
          if (isMounted) {
            console.error("Unexpected error:", e);
          }
        }
      };

      fetchProgram();
    }

    // Cleanup function
    return () => {
      isMounted = false; // Mark effect as inactive
    };
  }, [auth]);

  // fetch event data
  const [ongoingEvents, setOngoingEvents] = useState<EventProps[]>();
  const [upcomingEvents, setUpcomingEvents] = useState<EventProps[]>();
  const { orgId, setOrgId } = useAppContext();
  const [isUpdated, setIsUpdated] = useState(false);
  const [newEventId, setNewEventId] = useState(0);

  const fetchEvents = async (newEventId?: number) => {
    // fetch org id
    if (auth?.organization !== undefined) {
      // console.log("Fetching events");
      const { data: org, error: idErr } = await supabase
        .from("organizations")
        .select("id")
        .eq("organization", auth.organization)
        .single();

      if (idErr) {
        console.error(idErr);
      } else {
        setOrgId(org.id);

        // fetch events
        const { data: events, error } = await supabase
          .from("event")
          .select("*")
          .eq("org_id", org.id)
          .order("eventDate", { ascending: true })
          .order("title", { ascending: true })
          .order("loginTime", { ascending: true });

        if (error) {
          console.error(error);
        } else {
          const currentDate = new Date();

          const ongoing = events.filter(
            (event: { eventDate: string | Date }) =>
              new Date(event.eventDate) <= currentDate
          );
          let upcoming = events.filter(
            (event: { eventDate: string | Date }) =>
              new Date(event.eventDate) > currentDate
          );

          setOngoingEvents(ongoing);
          setUpcomingEvents(upcoming);
        }

        // insert students to attendance table
        if (newEventId && newEventId > 0) {
          (async () => {
            try {
              const { data: fetchedStudents, error: studentsError } =
                await supabase
                  .from("student")
                  .select()
                  .eq("course", auth.program);

              if (studentsError) {
                console.error(studentsError);
              } else {
                const studentsData = fetchedStudents as StudentProps[];

                const students = studentsData.map((student) => {
                  return {
                    studentId: student.id,
                    eventId: newEventId,
                  } as Attendance;
                });

                const { data, error } = await supabase
                  .from("attendance")
                  .insert(students);

                if (error) {
                  console.error(error);
                } else {
                  console.log(data);
                }
              }
            } catch (e) {
              console.error(e);
            }
          })();
        }
      }
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [auth]);

  useEffect(() => {
    if (isUpdated || (newEventId && auth !== undefined)) {
      fetchEvents(newEventId);
      setIsUpdated(false);
      setNewEventId(0);
    }
  }, [auth, isUpdated, newEventId]);

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
          console.log("new attendance");
          console.log(payload.new.id);
          setIsUpdated(true);
          setNewEventId(payload.new.id);
        }
      )
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
          setIsUpdated(true);
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
          setIsUpdated(true);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Event form
  const [isOpen, setIsOpen] = useState(false);
  const toggleNewEventForm = () => {
    setIsOpen(!isOpen);
  };

  // Edit form
  const [editFormData, setEditFormData] = useState<FormEventProps>();
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const toggleEditForm = () => {
    setIsEditFormOpen(!isEditFormOpen);
  };

  const searchParams = useSearchParams();
  const [editEventID, setEditEventID] = useState<number>();

  useEffect(() => {
    setEditEventID(Number(searchParams.get("editEventId")));
  }, [searchParams]);

  const { isNavOpen } = useAppContext();
  const date = new Date();

  const formattedTime = getFormattedTime(date);
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "short", // Short weekday, e.g., Mon
    month: "short", // Short month name, e.g., Jan
    day: "numeric", // Day of the month, e.g., 1
  });

  return (
    <div
      className={`px-5 pt-20 pb-40 flex flex-col bg-gray-100 bg- min-h-[100vh] ${
        isOpen ? "overflow-hidden overflow-y-hidden" : "overflow-y-scroll"
      }`}
    >
      <EditEventForm
        isOpen={isEditFormOpen}
        toggleEventForm={toggleEditForm}
        eventID={editEventID}
        editFormData={editFormData}
      />

      {auth?.role === "admin" && (
        <EventForm
          orgId={orgId}
          isOpen={isOpen}
          toggleEventForm={toggleNewEventForm}
        />
      )}

      {/* No events notice */}
      {ongoingEvents?.length === 0 && upcomingEvents?.length === 0 && (
        <div className="border-dashed w-full h-36 border-gray-400 grid place-items-center border rounded-lg">
          {auth?.role === "admin" && (
            <div>
              <h1 className="font-semibold text-center text-md text-gray-800">
                No events
              </h1>
              <p className="text-center text-sm text-gray-400">
                Get started by adding a new event.
              </p>
              <button
                onClick={toggleNewEventForm}
                className="flex flex-row items-center bg-blue-500 p-1.5 px-5 rounded-lg text-sm gap-1 mx-auto mt-3 text-gray-100"
              >
                <IoAdd className="opacity-70" />
                <span className="">New event</span>
              </button>
            </div>
          )}

          {auth?.role === "student" && (
            <div>
              <p className="text-center text-sm text-gray-400">
                There are currently no events scheduled.
              </p>
              <p className="text-center text-sm text-gray-400">
                Stay tuned for updates!
              </p>
            </div>
          )}
        </div>
      )}

      {/* NEW EVENT BUTTON */}
      <button
        onClick={toggleNewEventForm}
        className="z-[500] fixed bottom-4 right-4 grid place-items-center bg-white border border-gray-100 w-16 h-16 shadow-md rounded-full"
      >
        <IoAdd size={26} className="text-blue-500" />
      </button>

      {/* ON GOING ATTENDANCE BLOCK */}
      {ongoingEvents?.length !== 0 && ongoingEvents && (
        <div className="mb-10">
          <div className="px-3 items-center flex flex-row justify-between">
            <span className="font-bold text-lg ">Happening now</span>
            <span className="text-sm text-gray-600">
              {formattedTime} <span className="text-gray-500">•</span>{" "}
              {formattedDate}
            </span>
          </div>
          <div className="ongoing-attendance flex flex-col gap-3 mt-5">
            {ongoingEvents?.map((event) => {
              return (
                <EventCard
                  auth={auth}
                  isHappeningNow={true}
                  isNavOpen={isNavOpen}
                  key={event.id}
                  eventData={event}
                  isEditFormOpen={isEditFormOpen}
                  toggleEditForm={toggleEditForm}
                  setEditFormData={setEditFormData}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* UPCOMING EVENTS BLOCK */}
      {upcomingEvents?.length !== 0 && upcomingEvents && (
        <div>
          <span className="font-bold text-lg ml-3 ">Upcoming events</span>
          <div className="upcoming-attendance flex flex-col gap-3 mt-5">
            {upcomingEvents?.map((event) => {
              if (event) {
                return (
                  <EventCard
                    auth={auth}
                    isNavOpen={isNavOpen}
                    key={event.id}
                    eventData={event}
                    isEditFormOpen={isEditFormOpen}
                    toggleEditForm={toggleEditForm}
                    setEditFormData={setEditFormData}
                  />
                );
              }
            })}
          </div>
        </div>
      )}

      {/* loading state UI */}
      {ongoingEvents === undefined && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col h-fit w-full border border-gray-200 pointer-events-auto bg-white z-[100] rounded-lg p-5">
            <span className="bg-gray-200 animate-pulse rounded-md h-5 w-28 "></span>
            <div className="flex flex-col gap-2 mt-3">
              <span className="bg-gray-100 animate-pulse rounded-md h-4 w-40 "></span>
              <span className="bg-gray-100 animate-pulse rounded-md h-4 w-32 "></span>
              <span className="bg-gray-100 animate-pulse rounded-md h-4 w-36 "></span>
            </div>
          </div>

          <div className="flex flex-col h-fit w-full border border-gray-200 pointer-events-auto bg-white z-[100] rounded-lg p-5">
            <span className="bg-gray-200 animate-pulse rounded-md h-5 w-28 "></span>
            <div className="flex flex-col gap-2 mt-3">
              <span className="bg-gray-100 animate-pulse rounded-md h-4 w-40 "></span>
              <span className="bg-gray-100 animate-pulse rounded-md h-4 w-32 "></span>
              <span className="bg-gray-100 animate-pulse rounded-md h-4 w-36 "></span>
            </div>
          </div>

          <div className="flex flex-col h-fit w-full border border-gray-200 pointer-events-auto bg-white z-[100] rounded-lg p-5">
            <span className="bg-gray-200 animate-pulse rounded-md h-5 w-28 "></span>
            <div className="flex flex-col gap-2 mt-3">
              <span className="bg-gray-100 animate-pulse rounded-md h-4 w-40 "></span>
              <span className="bg-gray-100 animate-pulse rounded-md h-4 w-32 "></span>
              <span className="bg-gray-100 animate-pulse rounded-md h-4 w-36 "></span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
