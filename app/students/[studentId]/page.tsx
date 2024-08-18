'use client'
import { PageHeader, Button, EventLink, ConfirmationModal } from '@/components'
import { RiEdit2Line } from "react-icons/ri";
import { BiEraser } from "react-icons/bi";
import { useEffect, useState } from 'react';
import { StudentProps, EventProps } from '@/types';
import { downloadImage } from '@/utils/utils';
import { useRouter } from 'next/navigation';
import { bouncy } from 'ldrs'

const Student = ({ params }: { params: any }) => {

    bouncy.register()

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

    const fullName = `${student?.lastName}, ${student?.firstName} ${student?.middleName.charAt(0)}.`
    const studentClass = `${student?.course} ${student?.year}${student?.section}`
    let studentID = student?.id.toString()
    if (studentID && studentID.length > 2) {
        studentID =`${studentID?.slice(0, 2)}-${studentID?.slice(2)}`
    }

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
            `https://api.qrserver.com/v1/create-qr-code/?data=${studentID}`,
            `${studentID}_qrcode`,
            setLoading
        )
    }
 
    // Confirm Delete Modal Script
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)

    function toggleModal() {
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

    return (
        <div className='h-[100vh] bg-gray-100'>

            <PageHeader title={`Student Profile`} />
            <div className="max-h-[100vh] overflow-y-auto pb-40 px-5">
                <div className='flex mt-7 items-center justify-between'>
                    <h2 className='text-sm font-semibold text-[#414855]'>PROFILE</h2>
                    <Button variant='small-square'>
                        <RiEdit2Line size={20} className='fill-gray-700'/>
                    </Button>
                </div>
                <div className='flex flex-col gap-1 mt-3 h-fit p-5 pr-7 w-full bg-white rounded-lg text-sm'>
                    <div className='flex flex-row gap-4'>
                        <p className='min-w-14 text-gray-500'>Name</p>
                        <span>{fullName}</span>
                    </div>
                    <div className='flex flex-row gap-4'>
                        <p className='min-w-14 text-gray-500'>ID No</p>
                        <span>{studentID}</span>
                    </div>
                    <div className='flex flex-row gap-4'>
                        <p className='min-w-14 text-gray-500'>Class</p>
                        <span>{studentClass}</span>
                    </div>
                </div>
                <div className='flex mt-7 items-center justify-between'>
                    <h2 className='text-sm font-semibold text-[#414855]'>ACCUMULATED FINES</h2>
                    <Button variant='small-square'>
                        <BiEraser size={20} className='fill-gray-700'/>
                    </Button>
                </div>
                <div className='mt-3 h-fit p-5 w-full bg-white rounded-lg flex flex-col text-sm'>

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
                <div className='flex flex-col items-end mt-5 gap-2'>
                    <Button variant='secondary' onClick={downloadQRCode} >Download QR Code</Button>
                    <Button variant='secondary' onClick={toggleModal} >Delete Student</Button>
                </div>
                
                {loading && (
                    <div className='h-full w-full bg-black bg-opacity-60 top-0 left-0 fixed grid place-items-center'>
                        <div className='h-40 w-40 bg-white rounded-lg grid place-items-center'>
                            <l-bouncy
                                size="30"
                                speed="1.75" 
                                color="black" 
                            ></l-bouncy>
                        </div>
                    </div>
                )}
            </div>

            <ConfirmationModal 
                title='Delete Student'
                content={'Are you sure you want to delete this student from the database?'}
                isOpen={isOpen}
                onClose={toggleModal}
                onConfirm={onConfirm}
                confirmBtnLabel='Delete'
                type='delete'
            />
        </div>
    )
}

export default Student