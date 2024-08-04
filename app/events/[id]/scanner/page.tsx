'use client'
import { useEffect } from 'react'
import { PageHeader } from '@/components'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { useState } from 'react'
import { ConfirmationModal } from '@/components'

const QrScanner = () => {

  const [scanResult, setScanResult] = useState('');
  const [isOpen, setIsOpen] = useState(false) // modal

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 5,
    }, false);

    scanner.render(success, error);

    function success(result: string): void {
      // scanner.clear();
      setScanResult(result)
      setIsOpen(!isOpen)
    }

    function error(err: string): void {
      console.warn(err)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const studentID = scanResult
  const firstName = `Jerson`
  const lastName = `Caibog`
  const description = `Please confirm the attendance update: Mark ${firstName} ${lastName} as present.`

  const onClose = () => {
    setScanResult('')
    setIsOpen(!isOpen)
  }

  const onConfirm = () => {
    setScanResult('')
    setIsOpen(!isOpen)
  }

  return (
    <>
      <PageHeader title='Scan QR Code' />
      <div className='p-5'>
        <div className='rounded-xl' id='reader'></div>
        <ConfirmationModal 
          title='Confirm Attendance Update'
          content={description}
          isOpen={isOpen}
          onClose={onClose}
          onConfirm={onConfirm}
        />
      </div>
    </>
  )
}

export default QrScanner