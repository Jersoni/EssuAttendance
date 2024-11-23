'use client'
import { EventProps } from '@/types';
import Link from 'next/link';
import { FaTrash } from "react-icons/fa";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { IoIosArrowForward } from "react-icons/io";
import ConfirmationModal from './ConfirmationModal';
import { useState } from 'react';
import supabase from '@/lib/supabaseClient';

const ArchiveEventCard = ({
  data,
  role,
} : {
  data: EventProps
  role?: string
}) => {

  const [ loading, setLoading ] = useState(false)

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);

  const toggleDeleteModal = () => {
    setDeleteModalOpen(!isDeleteModalOpen);
  }

  const toggleConfirmationModal = () => {
    setConfirmationModalOpen(!isConfirmationModalOpen);
  };

  const handleDelete = async () => {
    setLoading(true)
    try {
      const { data: result, error } = await supabase
        .from("event") 
        .delete()
        .eq("id", data.id)
        .select()
  
      if (error) {
        console.error(error)
        setLoading(false)
      } else {
        console.log(result)
        setLoading(false)
        toggleConfirmationModal()
      }
    } catch(e) {
      console.error(e);
      setLoading(false)
    }
  }

  return (
    <div className='flex flex-row border-b border-gray-300 relative'>
      <Link href={`/events/${data.id}`} className="w-full h-fit py-3 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-medium">{data.title}</span>
            <span className="text-xs text-gray-400 font-light mt-1">{data.eventDate}</span>
          </div>
          {role !== "admin" && (
            <IoIosArrowForward className="opacity-40 mr-3"/>
          )}
      </Link>
      {role === "admin" && (
        <button
          onClick={toggleDeleteModal}
          className='p-2 grid place-items-center z-[1000]'
        >
          <HiOutlineDotsHorizontal 
            size={20} 
            className='text-gray-400' 
          />
        </button>
      )}

      {/* backdrop */}
      {isDeleteModalOpen && (
        <div 
          className='fixed top-0 left-0 right-0 bottom-0' 
          onClick={toggleDeleteModal}
        ></div>
      )}
      
      {/* delete modal */}
      {isDeleteModalOpen && (
        <div className='bg-white border rounded-lg p-1 border-gray-300 absolute right-0 translate-y-[3rem] shadow-sm z-[1500] overflow-hidden'>
          <button 
            className='flex flex-row items-center justify-center gap-2 text-red-400 p-2 active:bg-gray-100 rounded-md w-full pr-6 pl-4'
            onClick={() => {
              toggleDeleteModal()
              toggleConfirmationModal()
            }}
          >
            <FaTrash />
            Delete
          </button>
        </div>
      )}


      <ConfirmationModal 
        isOpen={isConfirmationModalOpen} 
        title="Confirm deletion"
        content={
          <div className="text-sm">Are you sure you want to delete the selected event? This action cannot be undone and will remove all associated data.</div>
        }
        onClose={toggleConfirmationModal}
        onConfirm={handleDelete} 
        className={"!bg-opacity-20"}
        type='delete'
      />
    </div>
  )
}


export default ArchiveEventCard