'use client'
import { useEffect, useRef } from 'react'
import { PageHeader } from '@/components'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { useState } from 'react'
import { ConfirmationModal } from '@/components'
import {Camera} from "react-camera-pro";
import { CameraType, SetNumberOfCameras } from 'react-camera-pro/dist/components/Camera/types'

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
  
  const camera = useRef<CameraType>(null);
  const [image, setImage] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const takePhoto = () => {
    if (camera.current) {
      const photo = camera.current.takePhoto();
      console.log(photo);
      setImage(photo as string);
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

  return (
    <div className='overflow-auto'>
      <PageHeader title='Scan QR Code' />
      <div>{numberOfCameras}</div>
      <div className='p-5 mb-10 h-[90vh]'>
        {/* <div className='rounded-xl' id='reader'></div> */}
        <div className='bg-gray-200 w-full h-full rounded-lg relative'>
          <Camera 
            ref={camera} 
            numberOfCamerasCallback={i => {setNumberOfCameras(i)}}
            errorMessages={
              {
                noCameraAccessible: 'No camera device accessible. Please connect your camera or try a different browser.',
                permissionDenied: 'Permission denied. Please refresh and give camera permission.',
                switchCamera:
                'It is not possible to switch camera to different one because there is only one video device accessible.',
                canvas: 'Canvas is not supported.'
              }
            }
          />
          <button 
            onClick={takePhoto}
            className='absolute bottom-16 left-1/2 translate-x-[-50%] w-16 h-16 bg-none rounded-full border-4 border-white p-1'>
            <div className='bg-white w-full h-full rounded-full'></div>
          </button>
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