"use client"
import {ReturnButton} from "@/components";
import { useRouter } from 'next/navigation';

const Attendance = () => {

  const router = useRouter()

  return (
    <div className="m-3 ml-2">
        <div className="flex flex-row items-center">
          <ReturnButton onClick={() => {router.push("/")}} />
          <span className="absolute left-0 text-center w-full text-xl font-semibold">Attendance</span>
        </div>
    </div>
  )
}

export default Attendance