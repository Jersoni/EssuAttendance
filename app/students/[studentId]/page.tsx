"use client";
import {
  ConfirmationModal,
  EditStudentForm,
  EventLink,
  PageHeader,
} from "@/components";
import supabase from "@/lib/supabaseClient";
import { Attendance, AuthProps, EventProps, StudentProps } from "@/types";
import { checkAuth, downloadImage } from "@/utils/utils";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { HiPencil } from "react-icons/hi";
import { TbTrashFilled } from "react-icons/tb";

const Student = ({ params }: { params: any }) => {
  const router = useRouter();
  const pathname = usePathname();
  const paramsID = params.studentId;

  // get user role
  const [auth, setAuth] = useState<AuthProps>();
  useEffect(() => {
    setAuth(checkAuth(router, pathname));
  }, [router, pathname]);

  // FETCH STUDENT
  const [student, setStudent] = useState<StudentProps | undefined>(undefined);

  const getStudent = async () => {
    try {
      const res = await fetch(`/api/students/student?id=${paramsID}`, {
        method: "GET",
      });

      if (res) {
        const json = await res.json();
        if (json) {
          setStudent(json);
          // console.log(json)
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getStudent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // FETCH EVENTS
  const [events, setEvents] = useState<EventProps[]>([]);

  useEffect(() => {
    const getEvents = async () => {
      try {
        const res = await fetch("/api/events");
        const json = await res.json();

        if (!res.ok) {
          console.error("Error fetch events.");
          return;
        }

        if (!events) {
          console.log("No events Found");
        }

        setEvents(json);
        return;
      } catch (error) {
        console.error(error);
      }
    };

    getEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Download QR Code Script
  const [loading, setLoading] = useState(false);
  function downloadQRCode() {
    // setLoading(!loading)
    downloadImage(
      `https://api.qrserver.com/v1/create-qr-code/?data=${student?.id}`,
      `${student?.id}_qrcode`,
      setLoading
    );
  }

  // Confirm Delete Modal Script
  const [isOpen, setIsOpen] = useState(false);

  function toggleDeleteModal() {
    setIsOpen(!isOpen);
  }

  async function onConfirm() {
    try {
      const res = await fetch(`/api/students/student?id=${paramsID}`, {
        method: "DELETE",
      });

      if (res) {
        const json = await res.json();

        if (json) {
          console.log(json);
        }
      }
    } catch (error) {
      console.log(error);
    }

    router.back();
  }

  // Course formatting
  let course: string | undefined = student?.course;
  if (course === "BSINFOTECH") {
    course = "BS INFO TECH";
  }

  // Modal
  const [isSettingsModalOpen, setIsSettingsModalOpen] =
    useState<boolean>(false);

  const toggleSettingsModal = () => {
    setIsSettingsModalOpen(!isSettingsModalOpen);
  };

  // Edit form
  const [isEditOpen, setIsEditOpen] = useState(false);
  const toggleEditForm = () => {
    setIsEditOpen(!isEditOpen);
  };

  // realtime
  useEffect(() => {
    const channel = supabase
      .channel("realtime_student")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "student",
        },
        (payload) => {
          console.log("updated student: ");
          console.log(payload.new);
          setStudent(payload.new as StudentProps);
          // getStudent()
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // TODO: FINES FUNCTIONALITY
  const [attendancesAbsent, setAttendancesAbsent] = useState<
    Attendance[] | undefined
  >(undefined);
  const [eventsAbsent, setEventsAbsent] = useState<EventProps[]>();
  const [isUpdated, setIsUpdated] = useState(false);

  useEffect(() => {
    if (isUpdated && student) {
      fetchAttendance(student)
      setIsUpdated(false)
    }
  }, [isUpdated, student]);

  const fetchAttendance = async (student: StudentProps) => {
    try {
      const { data, error } = await supabase
        .from("attendance")
        .select()
        .match({
          studentId: student.id,
          isLogoutPresent: false,
        });

      if (error) {
        console.error("Error fetching fines:", error);
      } else {
        setAttendancesAbsent(data as Attendance[]);
      }

    } catch (err) {
      console.error("Unexpected error:", err);
    }
    setIsUpdated(false);
  };

  // fetch IDs of events where the student is absent
  useEffect(() => {
    if (student) fetchAttendance(student);
    console.log("1");
  }, [student]);

  const fetchEventsAbsent = async (orgId: number, eventIds: number[]) => {
    const today = new Date().toISOString().split("T")[0];

    try {
      const { data, error } = await supabase
        .from("event")
        .select()
        .eq("org_id", orgId)
        .gt("fineAmount", 0)
        .in("id", eventIds)
        .lte("eventDate", today);

      if (error) {
        console.error("Error fetching fines:", error);
      }

      setEventsAbsent(data as EventProps[]);
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  useEffect(() => {
    const orgId = JSON.parse(
      localStorage.getItem("authToken") as string
    ).org_id;
    const eventIds = attendancesAbsent?.map((event) => event.eventId);

    if (eventIds && orgId > 0) {
      fetchEventsAbsent(orgId, eventIds);
    }
  }, [attendancesAbsent]);

  // Calculate Total fines
  const [totalFines, setTotalFines] = useState<number>(0);
  useEffect(() => {
    const calculateFines = (
      eventsAbsent: EventProps[] | undefined,
      attendancesAbsent: Attendance[] | undefined
    ) => {
      // console.log("calculate fines")
      // console.log(attendancesAbsent)
  
      if (
        eventsAbsent !== undefined &&
        attendancesAbsent !== undefined &&
        eventsAbsent.length > 0 &&
        attendancesAbsent.length > 0
      ) {
        let total = 0;
  
        eventsAbsent.forEach((event) => {
          attendancesAbsent.forEach((attendance) => {
            if (event.id === attendance.eventId) {
              if (!attendance.isPaid) {
                // console.log(attendance)
                total += event.fineAmount;
              }
            }
          });
        });
  
        setTotalFines(total);
  
        // console.log("done")
      }
    };

    calculateFines(eventsAbsent, attendancesAbsent);
  }, [eventsAbsent, attendancesAbsent]);

  const toggleUpdated = () => {
    console.log("hi")
    setIsUpdated(true);
    console.log("hello")
  };

  // TODO: FINES
  // realtime
  useEffect(() => {
    const channel = supabase
      .channel("realtime_events_A")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "attendance",
        },
        (payload) => {
          console.log("set updated");
          toggleUpdated();
          console.log(isUpdated);
          console.log("updated row: ");
          console.log(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="h-[100vh] bg-gradient-to-b from-gray-100 via-gray-100 to-gray-300">
      <div>
        <PageHeader
          title={` `}
          buttonClassName="text-white mt-5"
          className="!bg-emerald-600 !border-0"
        />

        {auth?.role === "admin" && (
          <button
            onClick={toggleSettingsModal}
            className="absolute top-2.5 right-4 p-1.5 z-[800]"
          >
            <HiOutlineDotsHorizontal size={20} className="ml-auto text-white" />
          </button>
        )}

        <div>
          <div
            onClick={(e) => {
              e.preventDefault();
            }}
            className={`rounded-lg shadow-md absolute right-3 top-12 bg-white z-[700] borde border-gray-300 transition-all opacity-0 duration-300 p-1
                ${
                  isSettingsModalOpen
                    ? "!opacity-100"
                    : "pointer-events-none"
                }    
            `}
          >
            <ul>
              <li className="">
                <button
                  onClick={() => {
                    toggleEditForm();
                  }}
                  className="border-gray-200 pl-3 pr-8 w-full rounded-lg text-gray-800 font-medium flex flex-row items-center gap-3 active:bg-gray-100"
                >
                  <HiPencil size={20} className="fill-gray-700" />
                  <span className="py-3 text-sm">Edit Profile</span>
                </button>
              </li>
              {/* <li className=''>
                                <button
                                    onClick={() => {}} 
                                    className='border-gray-200 pl-3 pr-8 w-full rounded-lg text-gray-800 font-medium flex flex-row items-center gap-3 active:bg-gray-100'
                                >
                                    <BiEraser size={20} className='fill-gray-700'/>
                                    <span className='py-3 text-sm'>Erase Fines</span>
                                </button>
                            </li> */}
              {/* <li className=''>
                                <button
                                    onClick={() => {downloadQRCode()}} 
                                    className='border-gray-200 pl-3 pr-8 w-full rounded-lg text-gray-800 font-medium flex flex-row items-center gap-3 active:bg-gray-100'
                                >
                                    <HiDownload size={20} className='fill-gray-700'/>
                                    <span className='py-3 text-sm'>Download QR Code</span>
                                </button>
                            </li> */}
              <li className="">
                <button
                  onClick={() => {
                    toggleDeleteModal();
                  }}
                  className="border-gray-200 pl-3 pr-8 w-full rounded-lg text-gray-800 font-medium flex flex-row items-center gap-3 active:bg-gray-100"
                >
                  <TbTrashFilled size={20} className="text-red-400" />
                  <span className="py-3 text-sm text-red-400">
                    Delete Student
                  </span>
                </button>
              </li>
            </ul>
          </div>
          <div
            onClick={toggleSettingsModal}
            className={`absolute top-0 left-0 right-0 bottom-0 z-[600]
                            ${isSettingsModalOpen ? "" : "hidden"}
                        `}
          ></div>
        </div>
      </div>

      {student === undefined ? (
        <div className="flex flex-col gap-1 h-fit px-12 pt-5 pb-20 pr-7 w-full shadow-sm rounded-br-x rounded-bl-x text-sm bg-emerald-600 absolute top-0 left-0  ">
          <div className="flex flex-row gap-4">
            <span className="bg-gray-300 animate-pulse rounded-md h-4 w-36 "></span>
          </div>
          <div className="flex flex-row gap-4">
            <span className="bg-gray-200 animate-pulse rounded-md h-4 w-20 "></span>
          </div>
          <div className="flex flex-row gap-4">
            <span className="bg-gray-200 animate-pulse rounded-md h-4 w-28 "></span>
          </div>
        </div>
      ) : (
        <div className="flex flex-row gap-3 h-fit px-12 pt-5 pb-20 pr-7 w-full bg-emerald-600 absolute top-0 left-0 shadow-sm rounded-br-x rounded-bl-x text-sm">
          <div className="mt-0.5"></div>
          <div className="flex flex-col">
            <span className="text-white font-medium text-base">
              {student?.name}
            </span>
            <span className="text-emerald-100 text-xs">{student?.id}</span>
            <span className="text-emerald-100 text-xs">{`${course} ${student?.year}${student?.section}`}</span>
          </div>
        </div>
      )}

      <div className="overflow-y-auto pb-40 px-5 z-2000 absolute top-0 left-0 right-0 pt-20">
        {student === undefined ? (
          <div className="mt-3 h-fit p-5 w-full border border-gray-200 bg-white shadow-sm rounded-lg flex flex-col text-sm">
            <div className="flex flex-col gap-2">
              <div className="flex flex-row justify-between">
                <span className="bg-gray-200 animate-pulse rounded-md h-4 w-32 "></span>
                <span className="bg-gray-200 animate-pulse rounded-md h-4 w-14 "></span>
              </div>
              <div className="flex flex-row justify-between">
                <span className="bg-gray-200 animate-pulse rounded-md h-4 w-24 "></span>
                <span className="bg-gray-200 animate-pulse rounded-md h-4 w-14 "></span>
              </div>
              <div className="flex flex-row justify-between">
                <span className="bg-gray-200 animate-pulse rounded-md h-4 w-28 "></span>
                <span className="bg-gray-200 animate-pulse rounded-md h-4 w-14 "></span>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-3 h-fit p-5 w-full border border-gray-200 bg-white shadow-sm rounded-lg flex flex-col text-sm">
            <h2 className="text-base font-semibold text-gray-800 ">Fines</h2>
            <div className="flex flex-col gap-4 mt-6">
              {eventsAbsent?.length !== 0 ? (
                eventsAbsent?.map((eventData) => (
                  <EventLink
                    key={eventData.id}
                    eventData={eventData}
                    studentId={student.id}
                    attendanceData={attendancesAbsent}
                  />
                ))
              ) : (
                <span className="text-gray-400">
                  No outstanding fines for this student.
                </span>
              )}
            </div>

            {eventsAbsent?.length !== 0 && (
              <div className="flex pt-5 mt-6 border-t border-gray-300 justify-between">
                <p className="text-sm text-gray-500">TOTAL</p>
                <p className="text-gray-500">₱ {totalFines.toFixed(2)}</p>
              </div>
            )}
          </div>
        )}

        {loading && (
          <div className="h-full w-full bg-black bg-opacity-10 top-0 left-0 fixed grid place-items-center z-[800]">
            ={" "}
            <l-line-spinner
              size="30"
              stroke="2"
              speed="1"
              color="black"
            ></l-line-spinner>
            ={" "}
          </div>
        )}
      </div>

      <ConfirmationModal
        title="Confirm deletion"
        content={`Are you sure you want to delete this student? This action cannot be undone and will also remove the student from all associated attendance lists.`}
        isOpen={isOpen}
        onClose={toggleDeleteModal}
        onConfirm={onConfirm}
        confirmBtnLabel="Delete Student"
        type="delete"
      />

      <EditStudentForm
        isOpen={isEditOpen}
        paramsID={paramsID}
        toggleForm={toggleEditForm}
      />
    </div>
  );
};

export default Student;
