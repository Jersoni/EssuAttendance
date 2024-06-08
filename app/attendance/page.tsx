"use client"
import {ReturnButton} from "@/components";
import { useRouter } from 'next/navigation';

const Attendance = () => {

  const router = useRouter()

  return (
    <div className="p-3 pl-2 border-b border-b-black border-opacity-40">
        <div className="flex flex-row items-center">
          <ReturnButton onClick={() => {router.push("/")}} />
          <span className="absolute left-0 text-center w-full text-xl font-semibold">Attendance</span>
        </div>
    </div>
  )
}

export default Attendance