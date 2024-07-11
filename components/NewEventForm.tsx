"use client"
import React, { useState, useRef } from 'react';
import { RiStickyNoteAddLine } from "react-icons/ri";
import { Button, ToggleBox } from '@/components';
import { FiPlus } from "react-icons/fi";

const NewEventForm = () => {

    const dateInputRef = useRef(null);
    const loginTimeInputRef = useRef(null);
    const logoutTimeInputRef = useRef(null);

    const handleDateClick = () => {
        if (dateInputRef.current)
            (dateInputRef.current as HTMLInputElement).focus();
    }

    const handleLoginTimeClick = () => {
        if (loginTimeInputRef.current)
            (loginTimeInputRef.current as HTMLInputElement).focus();
    }

    const handleLogoutTimeClick = () => {
        if (logoutTimeInputRef.current)
            (logoutTimeInputRef.current as HTMLInputElement).focus();
    }

    // newEventButton Click Handler
    const [isOpen, setIsOpen] = useState(false);
    const toggleNewEventForm = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div>
            {/* NEW EVENT BUTTON */}
            <Button variant={'small-circle'} className='z-[60] absolute top-4 right-5' onClick={toggleNewEventForm}>
                <FiPlus size={24} />
            </Button>

            {/* NEW EVENT FORM */}
            <div className={`${isOpen ? "" : "translate-y-full" } overflow-y-scroll absolute rounded-t-2xl left-0 top-0 mt-[5vh] h-[95vh] w-full bg-white z-[120] transition-all duration-300`}>

                <div className='flex flex-row items-center p-1'>
                <h1 className='font-semibold text-lg p-5 absolute text-center w-full'>New Attendance Log</h1>
                <Button variant='close' className='ml-auto z-[120]' onClick={toggleNewEventForm}></Button>
                </div>

                <form action="" className='p-5 pt-0 flex flex-col gap-4 overflow-y-scroll h-[80vh] pb-[8rem]'>
                    <div className='flex flex-col gap-1'>
                        <label className='form__label' htmlFor="title">Title</label>
                        <input autoComplete='off' type="text" name="title" id="title" className={`form__input`} placeholder='e.g Seminar' />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <label className='form__label' htmlFor="venue">Venue</label>
                        <input autoComplete='off' type="text" name="venue" id="venue" className={`form__input`} placeholder='e.g Covered Court' />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <label className='form__label' htmlFor="fine">Fine</label>
                        <input autoComplete='off' type="number" name="fine" id="fine" className={`form__input`} placeholder='e.g 25.00' />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <label className='form__label' htmlFor="date">Date</label>
                        <div className={`form__input !pl-0 w-full flex`} onClick={handleDateClick}>
                        <input type="date" name="date" ref={dateInputRef} id="date" className='outline-none pl-[14px] rounded-full bg-white p-0 w-full' />
                        </div>
                    </div>
                    <div className='flex flex-row gap-4 w-full'>
                        <div className='flex flex-col gap-1 w-1/2'>
                        <label className='form__label' htmlFor="login">Login Time</label>
                        <div onClick={handleLoginTimeClick} className='form__input w-full flex items-center !pl-0'>
                            <input ref={loginTimeInputRef} type="time" name="login" id="login" className={`w-full pl-[14px] bg-white outline-none`}/>
                        </div>
                        </div>
                        <div className='flex flex-col gap-1 w-1/2'>
                        <label className='form__label' htmlFor="logout">Logout Time</label>
                        <div onClick={handleLogoutTimeClick} className='form__input w-full flex items-center !pl-0'>
                            <input ref={logoutTimeInputRef} type="time" name="logout" id="logout" className={`w-full pl-[14px] bg-white outline-none`}/>
                        </div>
                        </div>
                    </div>
                    <div className='flex flex-col gap-1'>
                        <label className='form__label'>Attendees</label>
                        <div className='flex flex-wrap mt-1 gap-2 h-fit'>
                            <ToggleBox text='All Colleges' />
                            <ToggleBox text='BSCE' />
                            <ToggleBox text='BS INFO TECH' /> 
                            <ToggleBox text='BSIT' />
                            <ToggleBox text='BOT' />
                            <ToggleBox text='BSHM' />
                            <ToggleBox text='BSTM' />
                            <ToggleBox text='BSE' />
                            <ToggleBox text='BSBA' />
                            <ToggleBox text='BSAIS' />
                            <ToggleBox text='BAC' />
                            <ToggleBox text='BTVTED' />
                            <ToggleBox text='BSEd.' />
                            <ToggleBox text='BEED' />
                            <input type="text" placeholder='Other (comma separated)' className={`form__input w-full`}/>
                        </div>
                    </div>
                </form>
            </div>
            <div className={`${isOpen ? "block" : "hidden" } z-[120] flex gap-3 w-full absolute left-0 bottom-0 p-5 pb-8 bg-white`}>
                <Button variant='secondary' onClick={toggleNewEventForm}>Cancel</Button>
                <Button variant='primary' onClick={toggleNewEventForm}>Post</Button>
            </div>

            {/* BACKDROP */}
            <div className={`z-[110] bottom-0 left-0 absolute h-full w-full bg-black bg-opacity-70 ${isOpen ? "block" : "hidden" }`}></div>
        </div>
    )
}

export default NewEventForm