'use client'
import { PageHeader, Button, EventLink, ConfirmationModal, EditStudentForm } from '@/components'
import { RiEdit2Line } from "react-icons/ri";
import { BiEraser } from "react-icons/bi";
import { useEffect, useState } from 'react';
import { StudentProps, EventProps, AuthProps, Attendance } from '@/types';
import { downloadImage } from '@/utils/utils';
import { useRouter } from 'next/navigation';
import { PiTrashSimpleBold } from "react-icons/pi";
import supabase from '@/lib/supabaseClient';
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { checkAuth } from '@/utils/utils';
import { useAppContext } from '@/context';

const Student = ({ params }: { params: any }) => {

    const router = useRouter()
    const paramsID = params.studentId

    // get user role
    const [ auth, setAuth ] = useState<AuthProps>()
    useEffect(() => {
        setAuth(checkAuth(router))
    }, [router])

    // FETCH STUDENT
    const [student, setStudent] = useState<StudentProps | undefined>(undefined)

    const getStudent = async () => {
        try {
          const res = await fetch(`/api/students/student?id=${paramsID}`, {
            method: "GET"
          })
    
          if (res) {
            const json = await res.json() 
            if(json) {
                setStudent(json)
                // console.log(json)
            }
          }
        } catch (error) {
          console.log(error)
        }
    }
    
    useEffect(() => {
        getStudent()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // FETCH EVENTS
    const [events, setEvents] = useState<EventProps[]>([])

    useEffect(() => {
        const getEvents = async () => {
            try {
              const res = await fetch('/api/events')
              const json = await res.json()
      
              if(!res.ok) {
                console.error('Error fetch events.')
                return
              }
      
              if(!events) {
                console.log('No events Found')
              }
      
              setEvents(json)
              return
      
            } catch (error) {
              console.error(error)
            }
          }

          getEvents()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Download QR Code Script 
    const [loading, setLoading] = useState(false)
    function downloadQRCode() {
        // setLoading(!loading)
        downloadImage(
            `https://api.qrserver.com/v1/create-qr-code/?data=${student?.id}`,
            `${student?.id}_qrcode`,
            setLoading
        )
    }
 
    // Confirm Delete Modal Script
    const [isOpen, setIsOpen] = useState(false)

    function toggleDeleteModal() {
        setIsOpen(!isOpen)
    }

    async function onConfirm() {
        try {
            const res = await fetch(`/api/students/student?id=${paramsID}`, {
                method: "DELETE"
            })
      
            if (res) {
                const json = await res.json() 

                if(json) {
                    console.log(json)
                }
            }
        } catch (error) {
            console.log(error)
        }

        router.back()
    }

    // Course formatting
    let course: string | undefined = student?.course
    if (course === 'BSINFOTECH') {
        course = 'BS INFO TECH'
    }

    // Modal
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false)

    const toggleSettingsModal = () => {
        setIsSettingsModalOpen(!isSettingsModalOpen)
    };

    // Edit form
    const [isEditOpen, setIsEditOpen] = useState(false)
    const toggleEditForm = () => {
        setIsEditOpen(!isEditOpen)
    }

    // realtime
    useEffect(() => {
        const channel = supabase
        .channel('realtime_student')
        .on('postgres_changes', {
            event: 'UPDATE',
            schema: 'public',
            table: 'student'
            }, (payload) => {
            console.log('updated student: ')
            console.log(payload.new)
            setStudent(payload.new as StudentProps)
            // getStudent()
        })
        .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    

    // TODO: FINES FUNCTIONALITY
    const [ attendancesAbsent, setattendancesAbsent ] = useState<Attendance[] | undefined>(undefined)
    const [ eventsAbsent, setEventsAbsent ] = useState<EventProps[]>()
    

    const fetchAttendance = async (student: StudentProps) => {
        try {
            const { data, error } = await supabase
                .from("attendance")
                .select()
                .match({ 
                    studentId: student.id, 
                    isLogoutPresent: false
                });
    
            if (error) {
                console.error("Error fetching fines:", error);
            }
    
            setattendancesAbsent(data as Attendance[])
    
        } catch (err) {
            console.error("Unexpected error:", err);
        }
    }

    // fetch IDs of events where the student is absent
    useEffect(() => {
        if (student) fetchAttendance(student)      
    }, [student])

    const fetchEventsAbsent = async (orgId: number, eventIds: number[]) => {
        try {
            const { data, error } = await supabase
                .from("event")
                .select()
                .eq("org_id", orgId)
                .in("id", eventIds)
    
            if (error) {
                console.error("Error fetching fines:", error);
            }
    
            setEventsAbsent(data as EventProps[])
    
        } catch (err) {
            console.error("Unexpected error:", err);
        }
    }

    useEffect(() => {

        const orgId = JSON.parse(localStorage.getItem("authToken") as string).org_id
        const eventIds = attendancesAbsent?.map(event => event.eventId)

        if (eventIds && orgId > 0) {
            fetchEventsAbsent(orgId, eventIds)
        }
    }, [attendancesAbsent])


    // Calculate Total fines

    const [totalFines, setTotalFines] = useState<number>(0)


    const calculateFines = (
        eventsAbsent: EventProps[] | undefined, 
        attendancesAbsent: Attendance[] | undefined
    ) => {

        // console.log("calculate fines")
        // console.log(attendancesAbsent)

        if (   eventsAbsent !== undefined 
            && attendancesAbsent !== undefined 
            && eventsAbsent.length > 0
            && attendancesAbsent.length > 0
        ) {
            let total = 0
            
            eventsAbsent.forEach(event => {
                attendancesAbsent.forEach(attendance => {
                    if (event.id === attendance.eventId) {
                        if (!attendance.isPaid) {
                            // console.log(attendance)
                            total += event.fineAmount
                        }
                    }
                })
            })
            
            setTotalFines(total)
    
            // console.log("done")
        }
    }

    useEffect(() => {
        calculateFines(eventsAbsent, attendancesAbsent)
    }, [eventsAbsent, attendancesAbsent])

    
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
                // console.log("updated row: ");
                // console.log(payload.new)

                if (student) fetchAttendance(student)
            }
        )
        .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [student])

    return (
        <div className='h-[100vh] bg-gray-100'>

            <div>
                <PageHeader title={`Student Profile`} />

                {auth?.role === "admin" && (
                    <button 
                        onClick={toggleSettingsModal}
                        className='absolute top-2.5 right-4 p-1.5 text-gray-700'
                    >
                            <HiOutlineDotsHorizontal size={20} className="ml-auto text-gray-600" />
                    </button>
                )}
                
                <div>
                    <div 
                        onClick={(e) => {e.preventDefault()}}
                        className={`rounded-lg shadow-md absolute right-3 top-16 bg-white z-[700] border border-gray-300 transition-all opacity-0 duration-300 p-1
                            ${isSettingsModalOpen ? "!opacity-100" : "pointer-events-none"}    
                        `}
                    >
                        <ul>
                            <li className=''>
                                <button
                                    onClick={() => {
                                        toggleEditForm();
                                    }} 
                                    className='border-gray-200 pl-3 pr-8 w-full rounded-lg text-gray-800 font-medium flex flex-row items-center gap-3 active:bg-gray-100'
                                >
                                    <RiEdit2Line size={20} className='fill-gray-700'/>
                                    <span className='py-3 text-sm'>Edit Profile</span>
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
                            <li className=''>
                                <button
                                    onClick={() => {toggleDeleteModal()}} 
                                    className='border-gray-200 pl-3 pr-8 w-full rounded-lg text-gray-800 font-medium flex flex-row items-center gap-3 active:bg-gray-100'
                                >
                                    <PiTrashSimpleBold size={20} className='text-red-400'/>
                                    <span className='py-3 text-sm text-red-400'>Delete Student</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                    <div
                        onClick={toggleSettingsModal} 
                        className={`absolute top-0 left-0 right-0 bottom-0
                            ${isSettingsModalOpen ? "" : "hidden"}
                        `}
                    >
                    </div>
                </div>
            </div>

            <div className="overflow-y-auto pb-40 px-5">
                <div className='flex mt-4 items-center justify-between'>
                    <h2 className='text-sm font-semibold text-[#414855]'>Profile</h2>
                </div>

                {student === undefined ? (
                    <div className='flex flex-col gap-1 mt-3 h-fit p-5 pr-7 w-full border border-gray-200 bg-white shadow-sm rounded-lg text-sm'>
                        <div className='flex flex-row gap-4'>
                            <span className='bg-gray-200 animate-pulse rounded-md h-4 w-12 '></span>
                            <span className='bg-gray-200 animate-pulse rounded-md h-4 w-36 '></span>
                        </div>
                        <div className='flex flex-row gap-4'>
                            <span className='bg-gray-200 animate-pulse rounded-md h-4 w-12 '></span>
                            <span className='bg-gray-200 animate-pulse rounded-md h-4 w-20 '></span>
                        </div>
                        <div className='flex flex-row gap-4'>
                            <span className='bg-gray-200 animate-pulse rounded-md h-4 w-12 '></span>
                            <span className='bg-gray-200 animate-pulse rounded-md h-4 w-28 '></span>
                        </div>
                    </div>
                ) : (
                    <div className='flex flex-col gap-1 mt-3 h-fit p-5 pr-7 w-full border border-gray-200 bg-white shadow-sm rounded-lg text-sm'>
                        <div className='flex flex-row gap-4'>
                            <p className='min-w-14 text-gray-700'>Name</p>
                            <span className='text-gray-600'>{student?.name}</span>
                        </div>
                        <div className='flex flex-row gap-4'>
                            <p className='min-w-14 text-gray-700'>ID No</p>
                            <span className='text-gray-600'>{student?.id}</span>
                        </div>
                        <div className='flex flex-row gap-4'>
                            <p className='min-w-14 text-gray-700'>Class</p>
                            <span className='text-gray-600'>{`${course} ${student?.year}${student?.section}`}</span>
                        </div>
                    </div>
                )}
                
                <div className='flex mt-7 items-center justify-between'>
                    <h2 className='text-sm font-semibold text-[#414855]'>Fines</h2>
                </div>


                {student === undefined ? (
                    <div className='mt-3 h-fit p-5 w-full border border-gray-200 bg-white shadow-sm rounded-lg flex flex-col text-sm'>
                        <div className='flex flex-col gap-2'>
                            <div className='flex flex-row justify-between'>
                                <span className='bg-gray-200 animate-pulse rounded-md h-4 w-32 '></span>
                                <span className='bg-gray-200 animate-pulse rounded-md h-4 w-14 '></span>
                            </div>
                            <div className='flex flex-row justify-between'>
                                <span className='bg-gray-200 animate-pulse rounded-md h-4 w-24 '></span>
                                <span className='bg-gray-200 animate-pulse rounded-md h-4 w-14 '></span>
                            </div>
                            <div className='flex flex-row justify-between'>
                                <span className='bg-gray-200 animate-pulse rounded-md h-4 w-28 '></span>
                                <span className='bg-gray-200 animate-pulse rounded-md h-4 w-14 '></span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className='mt-3 h-fit p-5 w-full border border-gray-200 bg-white shadow-sm rounded-lg flex flex-col text-sm'>
                        <div className='flex flex-col gap-4'>
                            {eventsAbsent?.length !== 0 && eventsAbsent?.map((eventData) => (
                                <EventLink 
                                    key={eventData.id} 
                                    eventData={eventData} 
                                    studentId={student.id}
                                    attendanceData={attendancesAbsent}
                                />
                            ))}
                        </div>

                        <div className='flex pt-5 mt-6 border-t border-gray-300 justify-between'>
                            <p className='text-sm text-gray-500'>TOTAL</p>
                            <p className='text-gray-500'>₱ {totalFines.toFixed(2)}</p>
                        </div>
                    </div>
                )}

                
                {loading && (
                    <div className='h-full w-full bg-black bg-opacity-10 top-0 left-0 fixed grid place-items-center z-[800]'>
=                       <l-line-spinner
                            size="30"
                            stroke="2"
                            speed="1"
                            color="black"
                        ></l-line-spinner>
=                   </div>
                )}
            </div>

            <ConfirmationModal 
                title='Confirm deletion'
                content={`Are you sure you want to delete this student? This action cannot be undone and will also remove the student from all associated attendance lists.`}
                isOpen={isOpen}
                onClose={toggleDeleteModal}
                onConfirm={onConfirm}
                confirmBtnLabel='Delete Student'
                type='delete'
            />

            <EditStudentForm
                isOpen={isEditOpen}
                paramsID={paramsID}
                toggleForm={toggleEditForm}
            />
        </div>
    )
}

export default Student