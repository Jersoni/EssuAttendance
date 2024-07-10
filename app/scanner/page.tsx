'use client'
import { useEffect } from 'react'
import { PageHeader } from '@/components'
import { useRouter } from 'next/navigation'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { useState } from 'react'

const QrScanner = () => {

  const [scanResult, setScanResult] = useState('');
  
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
      scanner.clear();
      setScanResult(result)
    }
  
    function error(err: string): void {
      console.warn(err)
    }
  }, []);

  return (
    <>
      <PageHeader title='Scan QR Code' />
      <div className='p-5'>
        {scanResult 
        ? <div>Result: {scanResult}</div>
        : <div className='rounded-xl' id='reader'></div>
        }
      </div>
    </>
  )
}

export default QrScanner