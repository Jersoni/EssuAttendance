'use client'
import { Attendance, AuthProps, EventProps } from "@/types"
import { GoArrowUpRight } from "react-icons/go";
import Link from "next/link";
import { checkAuth, formatDate } from "@/utils/utils";
import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa"
import ConfirmationModal from "./ConfirmationModal";
import supabase from "@/lib/supabaseClient";
import { usePathname, useRouter } from "next/navigation";

export default function EventLink({ 
    eventData,
    attendanceData, 
    studentId
}: { 
    eventData: EventProps,
    attendanceData: Attendance[] | undefined, 
    studentId: string 
}) {

    useEffect(() => {
        console.log("____")
        console.log(attendanceData)
        console.log(eventData)
    }, [attendanceData, eventData])


    // get user role
    const router = useRouter()
    const pathname = usePathname()
    const [ auth, setAuth ] = useState<AuthProps>()

    useEffect(() => {
        setAuth(checkAuth(router, pathname))
    }, [router, pathname])

    const fine: string = "₱ " + eventData.fineAmount.toFixed(2).toString()


    const [isChecked, setIsChecked] = useState<boolean | undefined>(undefined)
    const [isOpen, setIsOpen] = useState<boolean>(false)

    useEffect(() => {
        console.log("setIsChecked")
        if (attendanceData && attendanceData?.length > 0 && eventData) {
            attendanceData.forEach(attendance => {
                if (eventData.id === attendance.eventId) {
                    setIsChecked(attendance.isPaid as boolean)
                }
            })
        }
    }, [attendanceData, eventData])

    const toggleDeleteModal = () => {
        setIsOpen(!isOpen)
    }

    const onConfirm = () => {
        setIsChecked(!isChecked)
        toggleDeleteModal()
    }
    
    // mark as paid in the database
    useEffect(() => {
        const updateIsPaid = async () => {
            console.log("updateIsPaid()")
            try {
                const { data, error } = await supabase
                    .from("attendance")
                    .update({isPaid: isChecked})
                    .match({
                        eventId: eventData.id,
                        studentId: studentId
                    })

                if (error) {
                    console.error("Error updating isPaid:" + error)
                } else {
                    console.log(`Successfully updated column 'isPaid' in table 'attendance'`)
                }
            } catch(err) {
                console.error("Something went wrong: " + err)
            }
        }

        if (isChecked !== undefined) updateIsPaid()
    }, [isChecked])

    const [dayTime, setDayTime] = useState<string>()
    useEffect(() => {
        const time = new Date(`1970-01-01T${eventData.loginTime}`);
        console.log(time)
        const dayTime = time.getHours() < 12 ? "Morning" : "Afternoon"
        setDayTime(dayTime)
    }, [eventData.loginTime])

    return (
        <div className='flex flex-row gap-4'>
            <div className="flex flex-row items-center gap-3 w-full">
                {auth?.role === "admin" && (
                    <div 
                        onClick={toggleDeleteModal}
                        className={` bg-gray-200 bg-opacity-80 borde border-gray-300 h-9 min-w-9 rounded-md grid place-items-center`}
                    >
                        {isChecked === true && <FaCheck className={"text-gray-600"} size={18} />}
                        {isChecked !== undefined && (
                            <input  
                                type="checkbox"
                                checked={isChecked} 
                                className={`hidden`}
                                readOnly
                            />
                        )}
                    </div>
                )}
                <Link href={`/events/${eventData.id}`} className={`${isChecked ? "opacity-40" : ""} border-gray-300 flex flex-col max-w-full borde`}>
                    <div className={` max-w-full whitespace-nowrap overflow-hidden text-ellipsis flex flex-row items-center gap-3`}>
                        <div className={`${isChecked ? "line-through" : ""} w-56 overflow-hidden text-nowrap text-ellipsis `}>
                            {eventData.title}
                        </div>
                    </div>
                    <span className=" text-xs text-gray-400 font-light w-full">{formatDate(eventData.eventDate)}</span>
                    {/* <GoArrowUpRight className='min-w-fit' size={16}/>  */}
                    <span 
                        className={`w-fit rounded-full -translate-x-1 text-xs mt-1.5 text-gray-600 px-2 border ${dayTime === 'Morning' ? 'border-yellow-100 bg-yellow-100/80' : 'border-orange-100 bg-orange-100/80'}`}
                    >
                        {dayTime}
                    </span>
                </Link>
            </div>
            <p className={`${isChecked ? "line-through opacity-40" : ""} text-gray-500 ml-auto min-w-fit pt-1`}>{fine}</p>

            <ConfirmationModal
                title={`${isChecked
                    ? "Mark as unpaid"
                    : "Mark as paid"
                }`}
                content={`${isChecked
                    ? "This action confirms that the student's fine has not been paid for the selected event."
                    : "This action confirms that the student's fine has been paid for the selected event."    
                }`}
                isOpen={isOpen}
                onClose={toggleDeleteModal}
                onConfirm={onConfirm}
                confirmBtnLabel='Confirm'
            />
        </div>
    )
}