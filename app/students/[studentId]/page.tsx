'use client'
import { PageHeader, Button, EventLink, ConfirmationModal, EditStudentForm } from '@/components'
import { RiEdit2Line } from "react-icons/ri";
import { BiEraser } from "react-icons/bi";
import { useEffect, useRef, useState } from 'react';
import { StudentProps, EventProps } from '@/types';
import { downloadImage } from '@/utils/utils';
import { useRouter } from 'next/navigation';
import { TbDotsCircleHorizontal } from "react-icons/tb";
import { HiDownload } from "react-icons/hi";
import { PiTrashSimpleBold } from "react-icons/pi";
import { lineSpinner } from "ldrs";
import supabase from '@/lib/supabaseClient';

const Student = ({ params }: { params: any }) => {
    lineSpinner.register();

    const paramsID = params.studentId

    // FETCH STUDENT
    const [student, setStudent] = useState<StudentProps>()

    const getStudent = async () => {
        try {
          const res = await fetch(`/api/students/student?id=${paramsID}`, {
            method: "GET"
          })
    
          if (res) {
            const json = await res.json() 
            if(json) {
                setStudent(json)
                console.log(json)
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

    // Calculate Total fines
    let totalFines: number = 0
    events.forEach(event => {
        totalFines += event.fineAmount
    })

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
    const router = useRouter()
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

    // TODO: EDIT STUDENT
    return (
        <div className='h-[100vh] bg-gray-100'>

            <div>
                <PageHeader title={`Student Profile`} />
                <button 
                    onClick={toggleSettingsModal}
                    className='absolute top-2.5 right-4 p-1.5 text-gray-700'
                >
                        <TbDotsCircleHorizontal size={24} />
                </button>
                
                <div>
                    <div 
                        onClick={(e) => {e.preventDefault()}}
                        className={`rounded-xl shadow-md absolute right-3 top-16 bg-white z-[700] border border-gray-300 transition-all opacity-0 duration-300 p-1
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
                            <li className=''>
                                <button
                                    onClick={() => {}} 
                                    className='border-gray-200 pl-3 pr-8 w-full rounded-lg text-gray-800 font-medium flex flex-row items-center gap-3 active:bg-gray-100'
                                >
                                    <BiEraser size={20} className='fill-gray-700'/>
                                    <span className='py-3 text-sm'>Erase Fines</span>
                                </button>
                            </li>
                            <li className=''>
                                <button
                                    onClick={() => {downloadQRCode()}} 
                                    className='border-gray-200 pl-3 pr-8 w-full rounded-lg text-gray-800 font-medium flex flex-row items-center gap-3 active:bg-gray-100'
                                >
                                    <HiDownload size={20} className='fill-gray-700'/>
                                    <span className='py-3 text-sm'>Download QR Code</span>
                                </button>
                            </li>
                            <li className=''>
                                <button
                                    onClick={() => {toggleDeleteModal()}} 
                                    className='border-gray-200 pl-3 pr-8 w-full rounded-lg text-gray-800 font-medium flex flex-row items-center gap-3 active:bg-gray-100'
                                >
                                    <PiTrashSimpleBold size={20} className='fill-gray-700'/>
                                    <span className='py-3 text-sm'>Delete Student</span>
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
                <div className='flex flex-col gap-1 mt-3 h-fit p-5 pr-7 w-full border border-gray-200 bg-white shadow-sm rounded-xl text-sm'>
                    <div className='flex flex-row gap-4'>
                        <p className='min-w-14 text-gray-500 font-semibold'>Name</p>
                        <span>{student?.name}</span>
                    </div>
                    <div className='flex flex-row gap-4'>
                        <p className='min-w-14 text-gray-500 font-semibold'>ID No</p>
                        <span>{student?.id}</span>
                    </div>
                    <div className='flex flex-row gap-4'>
                        <p className='min-w-14 text-gray-500 font-semibold'>Class</p>
                        <span>{`${course} ${student?.year}${student?.section}`}</span>
                    </div>
                </div>

                {/* TODO: FINES FUNCTIONALITY */}
                <div className='flex mt-7 items-center justify-between'>
                    <h2 className='text-sm font-semibold text-[#414855]'>Fines</h2>
                </div>
                <div className='mt-3 h-fit p-5 w-full border border-gray-200 bg-white shadow-sm rounded-xl flex flex-col text-sm'>

                    <div className='flex flex-col gap-2'>
                        {events.length !== 0 && events.map(eventData => (
                            <EventLink key={eventData.id} eventData={eventData} />
                        ))}
                    </div>

                    <div className='flex pt-5 mt-10 border-t border-gray-300 justify-between'>
                        <p className='text-sm text-gray-500'>TOTAL</p>
                        <p className='text-gray-500'>₱ {totalFines.toFixed(2)}</p>
                    </div>
                </div>
                {/* <div className='flex flex-row mt-5 gap-2 float-right'>
                    <Button variant='secondary' onClick={downloadQRCode} >Download QR Code</Button>
                    <Button variant='secondary' onClick={toggleDeleteModal} >Delete Student</Button>
                </div> */}
                
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
                title='Delete?'
                content={`Are you sure you want to delete this student's data? This action will also remove them from all associated attendance lists.`}
                isOpen={isOpen}
                onClose={toggleDeleteModal}
                onConfirm={onConfirm}
                confirmBtnLabel='Delete'
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