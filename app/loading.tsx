// 'use client'
import { Spinner } from "@/components"

export default function Loading() {
    return (
        <div className='fixed bg-white top-0 left-0 right-0 bottom-0 grid place-items-center z-[1000]'>
          <Spinner />
        </div>
    )
}