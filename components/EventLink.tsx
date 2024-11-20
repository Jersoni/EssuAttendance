'use client'
import { Attendance, AuthProps, EventProps } from "@/types"
import { GoArrowUpRight } from "react-icons/go";
import Link from "next/link";
import { checkAuth, formatDate } from "@/utils/utils";
import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa"
import ConfirmationModal from "./ConfirmationModal";
import supabase from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function EventLink({ 
    eventData,
    attendanceData, 
    studentId
}: { 
    eventData: EventProps,
    attendanceData: Attendance[] | undefined, 
    studentId: string 
}) {

    // get user role
    const router = useRouter()
    const [ auth, setAuth ] = useState<AuthProps>()

    useEffect(() => {
        setAuth(checkAuth(router))
    }, [router])

    const fine: string = "₱ " + eventData.fineAmount.toFixed(2).toString()


    const [isChecked, setIsChecked] = useState<boolean | undefined>(undefined)
    const [isOpen, setIsOpen] = useState<boolean>(false)

    useEffect(() => {
        if (attendanceData && attendanceData?.length > 0) {
            attendanceData.forEach(attendance => {
                if (studentId === attendance.studentId) {
                    setIsChecked(attendance.isPaid as boolean)
                }
            })
        }
    }, [attendanceData])

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
                    // console.log(`Successfully updated column 'isPaid' in table 'attendance'`)
                }
            } catch(err) {
                console.error("Something went wrong: " + err)
            }
        }

        updateIsPaid()
    }, [isChecked])

    return (
        <div className='flex flex-row'>
            <div className="flex flex-row items-center gap-3">
                {auth?.role === "admin" && (
                    <div 
                        onClick={toggleDeleteModal}
                        className={` bg-gray-100 bg-opacity-80 border border-gray-300 h-9 min-w-9 rounded-md grid place-items-center`} 
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
                <Link href={`/events/${eventData.id}`} className={`${isChecked ? "opacity-40" : ""} border-gray-300 flex flex-col  w-full`}>
                    <span className={`${isChecked ? "line-through" : ""} w-fit whitespace-nowrap overflow-hidden text-ellipsis`}>{eventData.title}</span>
                    <span className=" text-xs text-gray-400 font-light w-full ">{formatDate(eventData.eventDate)}</span>
                    {/* <GoArrowUpRight className='min-w-fit' size={16}/>  */}
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