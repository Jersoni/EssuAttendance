'use client'
import { PageHeader, Button } from "@/components"
import { StudentProps } from "@/types";
import { useState, useEffect } from "react";
import { downloadImage } from "@/utils/utils";

export default function NewStudentResult({ params }: { params: any }) {

    let id = params.id

    if (id.length > 2) 
        id = id.slice(0,2)+"-"+id.slice(2)

    // FETCH STUDENT
    const [student, setStudent] = useState<StudentProps>()

    const getStudent = async () => {
        try {
          const res = await fetch(`/api/students/student?id=${params.id}`, {
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

    // const fullName = `${student?.lastName}, ${student?.firstName} ${student?.middleName.charAt(0)}.`
    const studentClass = `${student?.course} ${student?.year}${student?.section}`
    // let studentID = student?.id.toString()
    // if (studentID && studentID.length > 2) 
    //     studentID = `${studentID?.slice(0, 2)}-${studentID?.slice(2)}`

    // DOWNLOAD QR CODE
    const [loading, setLoading] = useState(false)
    function downloadQRCode() {
        setLoading(!loading)
        // downloadImage(
        //     `https://api.qrserver.com/v1/create-qr-code/?data=${studentID}`,
        //     `${studentID}_qrcode`,
        //     setLoading
        // )
    }

    return (
        <div>
            <PageHeader title="Result"></PageHeader>

            <div className="flex flex-col items-center px-10 h-[calc(100vh-72px)] bg-gray-100 pb-40 overflow-y-scroll">
                <span className="mt-10 font-semibold text-center">Student Successfully Registered!</span>
                <p className="text-center mt-4 text-sm">Please download and print the provided QR code. This code will serve as the ID of the registered student for checking in at future events.</p>
                <div className="h-fit mt-10 border border-gray-400 bg-white w-full rounded-lg flex flex-col items-center p-8 ">
                    {/* TODO: QR CODE DYNAMIC FUNCTIONALITY */}
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?data=${id}`} alt="qrcode" height={180} width={180} />
                    <div className="mt-5 text-center flex flex-col gap-1">
                        <p className="font-semibold text-xl">{student?.name}</p>
                        <p className="text-sm text-gray-600">{student?.id}</p>
                        <p className="text-sm text-gray-600">{studentClass}</p>
                    </div>
                </div>
                                
                <Button className="mt-8" onClick={downloadQRCode}>Download QR Code</Button>
            </div>
        </div>
    )
}