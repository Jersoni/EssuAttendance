'use client'
import { bouncy } from 'ldrs'

export default function Loading() {

    bouncy.register()

    return (
        <div className='h-full w-full top-0 left-0 fixed grid place-items-center z-[1000]'>
            <div className='h-28 w-28 bg-white rounded-lg grid place-items-center'>
                <l-bouncy
                    size="26"
                    speed="1.75" 
                    color="black" 
                ></l-bouncy>
            </div>
        </div>
    )
}