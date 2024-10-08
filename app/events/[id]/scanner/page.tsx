'use client'
import { useEffect, useRef } from 'react'
import { PageHeader } from '@/components'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { useState } from 'react'
import { ConfirmationModal } from '@/components'
import {Camera} from "react-camera-pro";
import { CameraType, SetNumberOfCameras } from 'react-camera-pro/dist/components/Camera/types'
import { MdOutlineFlipCameraAndroid } from "react-icons/md";

interface CameraRef {
  takePhoto: () => Promise<string>; // Assuming takePhoto returns a Promise that resolves to a string (image URL)
}

const QrScanner = () => {

  
  // useEffect(() => {
    //   const scanner = new Html5QrcodeScanner('reader', {
      //     qrbox: {
        //       width: 250,
        //       height: 250,
        //     },
        //     fps: 5,
        //   }, false);
        
        //   scanner.render(success, error);
        
        //   function success(result: string): void {
          //     // scanner.clear();
          //     setScanResult(result)
          //     setIsOpen(!isOpen)
          //   }
          
          //   function error(err: string): void {
            //     console.warn(err)
            //   }
            // // eslint-disable-next-line react-hooks/exhaustive-deps
            // }, []);
            
            // const studentID = scanResult
            // const firstName = `Jerson`
            // const lastName = `Caibog`
            // const description = `Please confirm the attendance update: Mark ${firstName} ${lastName} as present.`
            
            // const onClose = () => {
              //   setScanResult('')
              //   setIsOpen(!isOpen)
              // }
              
              // const onConfirm = () => {
                //   setScanResult('')
                //   setIsOpen(!isOpen)
                // }
                
  const [scanResult, setScanResult] = useState('');
  const [isOpen, setIsOpen] = useState(false) // modal
  const [numberOfCameras, setNumberOfCameras] = useState<number>()

  const cameraErrorMessages = {
    noCameraAccessible: 'No camera device accessible. Please connect your camera or try a different browser.',
    permissionDenied: 'Permission denied. Please refresh and give camera permission.',
    switchCamera:
    'It is not possible to switch camera to different one because there is only one video device accessible.',
    canvas: 'Canvas is not supported.'
  }
  
  const camera = useRef<CameraType>(null);
  const [image, setImage] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const takePhoto = () => {
    if (camera.current) {
      const photo = camera.current.takePhoto();
      // console.log(photo);
      setImage(photo as string);
    }
  }

  const switchCamera = () => {
    if (camera.current) {
      const result = camera.current.switchCamera();
      console.log(result);
    } 
  }

  // display the image on the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');

      const img = new Image();
      img.src = image;
  
      img.onload = () => {
        // Set canvas dimensions to match the image
        canvas.width = img.width;
        canvas.height = img.height;
  
        // Draw the image on the canvas
        context?.drawImage(img, 0, 0);
      };
  
      // Cleanup function to prevent memory leaks
      return () => {
        context?.clearRect(0, 0, canvas.width, canvas.height);
      };
    }

  }, [image])

  useEffect(() => {
    const intervalId = setInterval(() => {
      takePhoto()
      console.log("photo taken")
    }, 1000); 

    return () => clearInterval(intervalId);
  }, [image]);

  return (
    <div className='overflow-auto bg-black'>
      <PageHeader title='Scan ID' className='!bg-opacity-0 fixed top-0 !border-0' />
      <div className='h-[100vh] w-full'>
        <div className='mb-10 h-[fit]'>
          {/* <div className='rounded-xl' id='reader'></div> */}
          <div className='bg-white w-full h-[500px] overflow-hidden relative'>
            <Camera 
              ref={camera} 
              numberOfCamerasCallback={i => {setNumberOfCameras(i)}}
              errorMessages={cameraErrorMessages}
            />
          </div>
          <div className='mt-12 w-full items-center flex flex-row'>
            <button 
              onClick={takePhoto}
              className='w-[4.5rem] h-[4.5rem] bg-gray-200 bg-opacity-45 rounded-full p-2 ml-auto absolute left-1/2 translate-x-[-50%]'
            >
              <div className='bg-white w-full h-full rounded-full active:bg-gray-200'></div>
            </button>
            <button 
              onClick={switchCamera}
              className=' w-12 h-12 ml-auto mr-5 bg-gray-500 rounded-full bg-opacity-45 grid place-items-center'
            >
              <MdOutlineFlipCameraAndroid size={30} fill={"#ffffff"} />
            </button>
          </div>
      </div>

        {/* <ConfirmationModal 
          title='Confirm Attendance Update'
          content={description}
          isOpen={isOpen}
          onClose={onClose}
          onConfirm={onConfirm}
          /> */}
      </div>
      <div className='w-full bg-gray-500 h-[100vh] p-5'>
          <canvas ref={canvasRef} className='w-full rounded-lg'></canvas>
      </div>
    </div>
  )
}

export default QrScanner