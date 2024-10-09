'use client'
import { useEffect, useRef } from 'react'
import { PageHeader } from '@/components'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { useState } from 'react'
import { ConfirmationModal } from '@/components'
import { Camera } from "react-camera-pro";
import { CameraType, SetNumberOfCameras } from 'react-camera-pro/dist/components/Camera/types'
import { MdOutlineFlipCameraAndroid } from "react-icons/md";
import { IoCamera } from "react-icons/io5";
import Tesseract from 'tesseract.js';
import { StudentCard } from '@/components'
import { StudentProps } from '@/types'
import { IoIosCloseCircleOutline } from "react-icons/io";
import { lineSpinner } from "ldrs";
import { usePathname } from 'next/navigation'
import supabase from '@/lib/supabaseClient'

const Scanner = () => {
  lineSpinner.register();
  // Change body styles
  useEffect(() => {
    document.body.style.backgroundColor = 'rgb(243 244 246)';
    return () => {
      document.body.style.backgroundColor = ''; // Reset to default on unmount
    };
  }, []);

  const dummy: StudentProps = {
    id: "22-0224",
    name: "Musk, Elon M., Jr.",
    course: "BS INFO TECH",
    year: 2,
    section: "A",
    isLoginPresent: true,
    isLogoutPresent: false,
  }
              
  const cameraErrorMessages = {
    noCameraAccessible: 'Unable to access the camera. Please enable camera permissions in your settings.',
    permissionDenied: 'Permission denied. Please refresh and give camera permission.',
    switchCamera:
    'It is not possible to switch camera to different one because there is only one video device accessible.',
    canvas: 'Canvas is not supported.'
  }
  const camera = useRef<CameraType>(null);
  const [scanning, setScanning] = useState(false)
  const [numberOfCameras, setNumberOfCameras] = useState<number>()
  const [resultID, setResultID] = useState<string>("00-0000")
  const eventId = usePathname().split('/')[2]
  const [student, setStudent] = useState<StudentProps | null>(null)
  const [scannedText, setScannedText] = useState<string>("");

  // takePhoto
  const takePhoto = (scanning: boolean) => {
    if (camera.current && scanning === true) {
      console.log("scanning")
      const photo = camera.current.takePhoto(); // capture photo
      
      if (typeof photo === 'string') {
        Tesseract.recognize(photo as string, 'eng', {
          logger: (m) => {
            // console.log(m)
          },
        })
        .then(({ data: { text } }) => {
          // find matching ID
          setScannedText(text)
          const matchingID = text.match(/\b\d{2}-\d{4}\b/g);
          if (matchingID) { // if ID is found
            stopScan()
            console.log(`match: ${matchingID}`)
            setResultID(matchingID[0])
          } else {
            console.log(text)
          }
        })
        .catch((err) => {
          console.error(err);
        });
      } else {
        console.log("photo is not a string")
      }
    }
  }

  // get student info when resultID changes
  useEffect(() => {
    const fetchStudent = async () => {
      if (resultID && eventId) {
        const {data, error} = await supabase
          .from("student")
          .select()
          .eq("id", resultID)
          .single()

        if (error) {
          console.error(error)
        } else {
          const {data: attendanceData, error: attendanceError} = await supabase
            .from("attendance")
            .select()
            .match({ eventId: eventId, studentId: resultID })
            .single()

          if (attendanceError) {
            console.error(attendanceError)
          } else {
            const newData = {
              ...data, 
              isLoginPresent: attendanceData?.isLoginPresent,
              isLogoutPresent: attendanceData?.isLogoutPresent
            } as StudentProps

            setStudent(newData)
            console.log(newData)
          }
        }
      } else {
        console.log("no resultID or eventID")
      }
    }

    fetchStudent()
  }, [resultID])

  // get login and logout status of student
  const fetchStatus = async () => {
    const {data, error} = await supabase
      .from("attendance")
      .select()
      .match({ eventId: eventId, studentId: resultID })
      .single()

    if (error) {
      console.error(error)
    } else {
      const newData = {
        ...student, 
        isLoginPresent: data?.isLoginPresent,
        isLogoutPresent: data?.isLogoutPresent
      } as StudentProps

      setStudent(newData)
      console.log(newData)
    }
  }

  useEffect(() => {
    console.log(student)
  }, [student])
  
  // call the function takePhoto every 1000ms
  useEffect(() => {
    const intervalId = setInterval(() => {
      takePhoto(scanning)
    }, 1000);     

    return () => clearInterval(intervalId);
  }, [scanning]);

  // handle click for switch camera
  const switchCamera = () => {
    if (camera.current) {
      const result = camera.current.switchCamera();
      console.log(result);
    } 
  }

  function startScan() {
    setScanning(true)
    console.log("start")
  }

  function stopScan() {
    setScanning(false)
    console.log("end")
  }

  return (
    <div>
      <PageHeader title='Scan ID' className='' />
      <div className='h-[80vh] w-full p-5'>
        <div className='h-[fit] rounded-lg border border-gray-200 overflow-hidden'>
          {/* <div className='rounded-xl' id='reader'></div> */}
          <div className='bg-gray-600 text-sm text-white w-full h-[30vh] overflow-hidden !border-0 relative'>
            <Camera 
              ref={camera} 
              numberOfCamerasCallback={i => {setNumberOfCameras(i)}}
              errorMessages={cameraErrorMessages}
            />
            {scanning
            ? (
              <div>
                <button
                  onClick={stopScan}
                  className='absolute bg-gray-800 text-white bg-opacity-40 p-2.5 px-4 rounded-lg bottom-3 left-3 active:bg-gray-900 active:bg-opacity-50'
                >
                  <span>Stop</span>
                </button>
              </div>
            ) : (
              <div>
                <button
                  onClick={startScan}
                  className='absolute bg-gray-800 text-white bg-opacity-40 p-2.5 px-4 rounded-lg bottom-3 left-3 active:bg-gray-900 active:bg-opacity-50'
                >
                  <span>Scan</span>
                </button>
              </div>
            )}
            <button
              onClick={switchCamera}
              className=' w-10 h-10 ml-auto bg-gray-800 rounded-full bg-opacity-40 grid place-items-center absolute bottom-3 right-3'
            >
              <MdOutlineFlipCameraAndroid size={24} fill={"#ffffff"} />
            </button>
          </div>
      </div>

      <div className='mt-5 bg-white w-full h-fit rounded-lg overflow-hidden border border-gray-200 shadow-sm px-5'>
        {(student !== null && scanning === false) && (
          <div>
            <div className="w-full flex flex-row items-center text-xs text-gray-400 justify-between py-2 border-b border-b-gray-200 bg-white" >
              <span>Student</span>
              <div className="flex flex-row gap-2">
                <span>Login</span>
                <span>Logout</span>
              </div>
            </div>
            <StudentCard 
              eventId={9}
              studentData={student} 
              className='!border-0' 
            />
          </div>
        )}

        {(student === null && scanning === false) && (
          <div className='py-5 flex flex-row items-center gap-1.5'>
            <IoIosCloseCircleOutline size={18} className='fill-gray-500' />
            <span className='text-gray-500 text-sm'>No ID detected.</span>
          </div>
        )}

        {scanning && (
          <div className="flex flex-row items-center gap-3 text-sm text-gray-600 py-5">
            <l-line-spinner
              size="20"
              stroke="2"
              speed="1"
              color="gray"
            ></l-line-spinner>
            <span>Scanning</span>  
          </div>
        )}
      </div>
      <div className='p-5 text-sm'>
        {scannedText}
      </div>
      <div className='mt-5 flex flex-col text-xs'>
        <span className='font-semibold'>Guidelines</span>
        <ul className='list-disc ml-3 mt-1'>
          <li>Ensure the text on the ID is clear and legible.</li>
          <li>You may only use either a <span className='font-semibold'>Library ID</span> or a <span className='font-semibold'>School ID</span> as valid identification.</li>
          <li>If School ID is used, Hold the ID horizontally, with the top edge rotated counterclockwise.</li>
        </ul>
      </div>
      </div>
      {/* <div className='w-full bg-white h-[100vh] p-5'>
          Photo taken:
          <canvas ref={canvasRef} className='w-full rounded-lg'></canvas>
      </div> */}
      {/* <div className='mt-12 w-full items-center flex flex-row'>
        <button 
          onClick={takePhoto}
          className='w-[4.5rem] h-[4.5rem] bg-gray-400 bg-opacity-45 rounded-full p-2 ml-auto absolute left-1/2 translate-x-[-50%]'
        >
          <div className='bg-white w-full h-full rounded-full active:bg-gray-200 grid place-items-center'>
            <IoCamera size={28} className='opacity-20' />
          </div>
        </button>
      </div> */}

        {/* <ConfirmationModal 
          title='Confirm Attendance Update'
          content={description}
          isOpen={isOpen}
          onClose={onClose}
          onConfirm={onConfirm}
          /> */}
    </div>
  )
}

export default Scanner