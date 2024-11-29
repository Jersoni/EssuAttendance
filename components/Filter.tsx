"use client"
import { Button } from '@/components';
import { StudentProps } from '@/types';
import React, { useEffect, useState } from 'react';
import { GoChevronDown } from "react-icons/go";
import { RiFilter2Line } from "react-icons/ri";

/* eslint-disable react-hooks/exhaustive-deps */
const Filter = ({
    courses = [], years = [], sections = [], sortBy, order,
    setCourses, setYears, setSections, setSortBy, setOrder, applyFilters, isOpen, setIsOpen,
    program
} : {
    courses?: Array<string>
    years?: Array<string>
    sections?: Array<string>
    sortBy?: string
    order?: string
    setCourses: ([]) => void
    setYears: ([]) => void
    setSections: ([]) => void
    setSortBy: (value: string) => void
    setOrder: (value: string) => void
    applyFilters: () => void
    isOpen?: boolean
    setIsOpen: () => void
    program?: string
}) => {

    function handleCoursesChange(event: React.ChangeEvent<HTMLInputElement>) {
        const {value} = event.target
        if (value === 'AllCourses') { // if target is "All", set to All only
            setCourses(['AllCourses'])
        } else { // if target is not 'all'
            courses?.includes(value) 
            ? setCourses(courses.filter(course => course !== value)) // remove value to array if it is already included
            : setCourses([...courses, value]) // add value to array
        }
    }

    function handleYearsChange(event: React.ChangeEvent<HTMLInputElement>) {
        const {value} = event.target
        if (value === 'AllYears') {
            setYears(['AllYears'])
        } else {
            years.includes(value) ? setYears(years.filter(year => year !== value)) : setYears([...years, value])
        }
    }

    function handleSectionsChange(event: React.ChangeEvent<HTMLInputElement>) {
        const {value} = event.target
        if (value === 'AllSections') {
            setSections(['AllSections'])
        } else {
            sections.includes(value) ? setSections(sections.filter(section => section !== value)) : setSections([...sections, value])
        }
    }

    function handleSortChange(event: React.ChangeEvent<HTMLInputElement>) {
        const {value} = event.target
        setSortBy(value)
        console.log(value)
    }

    function handleOrderChange(event: React.ChangeEvent<HTMLInputElement>) {
        const {value} = event.target
        setOrder(value)
    }
    // courses
    useEffect(() => {
        // removes the 'all' value from the array
        if (courses.includes('AllCourses') && courses.length > 1)
            setCourses(courses.filter(course => course !== 'AllCourses'))

        // returns the 'all' value to the array
        if (courses.length === 0 )
            setCourses(['AllCourses'])
    }, [courses])

    // years
    useEffect(() => {
        if (years.includes('AllYears') && years.length > 1)
            setYears(years.filter(year => year !== 'AllYears'))

        if (years.length === 0 || years.length === 4)
            setYears(['AllYears'])
    }, [years])

    // sections
    useEffect(() => { 
        if (sections.includes('AllSections') && sections.length > 1)
            setSections(sections.filter(section => section !== 'AllSections'))

        if (sections.length === 0 || sections.length === 5)
            setSections(['AllSections'])
    }, [sections]) 

    // SET DEFAULT
    function resetFilters() {
        setCourses(['AllCourses'])
        setYears(['AllYears'])
        setSections(['AllSections'])
        setSortBy('name')
        setOrder('ascending')
    }

    return (
        <div>
            {/* Filter */}
            <div className=''>
                <div className={`bg-gray-50 fixed w-[0vw] h-full right-0 mx-auto duration-300 ease-out transition-all bottom-0 overflow-hidden ${isOpen ? "!w-[85vw] xs:!w-[75vw]" : "" } z-[1500] flex flex-col text-sm border-l border-gray-300`}>
                    <div className='text-lg bg-white border- p-3 pl-5 border-gray-200 flex flex-row items-center'>
                        <h2 className=' font-bold text-emerald-700 text-opacity-80 w-full'>Filters</h2>
                    </div>
                    <div className='max-h-fit p-5 overflow-y-scroll h-full'>
                        {/* FILTER */}
                        <div className='flex flex-col gap-4'>
                            {(program === "ALL") && (
                                <DropDownChecklist options={COURSE} label='COURSE' onChange={handleCoursesChange} filters={courses} />
                            )}
                            <DropDownChecklist options={YEAR} label='YEAR' onChange={handleYearsChange} filters={years}  />
                            <DropDownChecklist options={SECTION} label='SECTION' onChange={handleSectionsChange} filters={sections} />
                        </div>
                        <div className='flex mt-4 flex-row border- border-gray-200 py-3 overflow-hidden h-fit w-full'>
                            <div className='flex-col w-1/2 items-start h-fit'>
                                <span className='font-medium text-xs'>SORT BY</span>
                                <RadioList options={SORTBY_OPTIONS} onChange={handleSortChange} filters={sortBy} />
                            </div>
                            <div className='flex-col w-1/2 items-start h-fit'>
                                <span className='font-medium text-xs'>ORDER</span>
                                <RadioList options={ORDER_OPTIONS} onChange={handleOrderChange} filters={order} />
                            </div>
                        </div>
                        {/* <div className='border-b border-gray-200 py-3 '>
                            <span className='font-medium text-xs'>DISPLAY OPTION</span>
                            <RadioList options={DISPLAY_OPTIONS} onChange={handleDisplayOptionChange} filters={displayOption} />
                        </div> */}
                    </div>
                    <div className='flex flex-row gap-3 left-0 items-center justify-end p-3 pr-5 pb-8 border- border-gray-200 bg-white z-[600] mt-auto'>
                        <Button className=' min-w-24 !bg-gray-200 !border-0 !font-semibold text-gray-600' variant='secondary' onClick={resetFilters} >Reset</Button>
                        <Button className=' min-w-24 !font-semibold' variant='primary' onClick={applyFilters}>Apply</Button>
                    </div>
                </div>
                <div onClick={setIsOpen} className={`bg-black bg-opacity-20 fixed pointer-events-auto z-[1400] top-0 left-0 right-0 bottom-0 transition-all ${isOpen ? "block" : "hidden"}`}></div>
            </div>
        </div>
    )
}

// COMPONENT DROPDOWN CHECKLIST

interface HTMLInputListProps {
    value: string;
    label: string;
    name: string;
}

interface HTMLInputList {
    options: Array<HTMLInputListProps>;
    label?: string;
    onChange: (e: any) => void;
    filters?: Array<string> | string;
}

// DATA
const COURSE: HTMLInputListProps[] = [
    {value: 'AllCourses', label: 'All', name: 'course'},
    {value: 'BSCE', label: 'BSCE', name: 'course'},
    {value: 'BSIT', label: 'BSIT', name: 'course'},
    {value: 'BOT', label: 'BOT', name: 'course'},
    {value: 'BSHM', label: 'BSHM', name: 'course'},
    {value: 'BSTM', label: 'BSTM', name: 'course'},
    {value: 'BSE', label: 'BSE', name: 'course'},
    {value: 'BSBA', label: 'BSBA', name: 'course'},
    {value: 'BSAIS', label: 'BSAIS', name: 'course'},
    {value: 'BAC', label: 'BAC', name: 'course'},
    {value: 'BTVTED', label: 'BTVTED', name: 'course'},
    {value: 'BSED', label: 'BSEd.', name: 'course'},
    {value: 'BEED', label: 'BEED', name: 'course'},
    {value: 'BSN', label: 'BSN', name: 'course'},
    {value: 'BSCRIM', label: 'BSCRIM', name: 'course'},
    {value: 'BSINFOTECH', label: 'BS INFO TECH', name: 'course'},
]

const YEAR: HTMLInputListProps[] = [
    {value: 'AllYears', label: 'All', name: 'year'},
    {value: '1', label: '1', name: 'year'},
    {value: '2', label: '2', name: 'year'},
    {value: '3', label: '3', name: 'year'},
    {value: '4', label: '4', name: 'year'},
]  

const SECTION: HTMLInputListProps[] = [
    {value: 'AllSections', label: 'All', name: 'section'},
    {value: 'A', label: 'A', name: 'section'},
    {value: 'B', label: 'B', name: 'section'},
    {value: 'C', label: 'C', name: 'section'},
    {value: 'D', label: 'D', name: 'section'},
    // {value: 'E', label: 'E', name: 'section'},
]

const DropDownChecklist = ({options, label, onChange, filters}: HTMLInputList) => {

    const [isOpen, setIsOpen] = useState(false)

    const handleCLick = () => {
        setIsOpen(!isOpen)
        // console.log(filters)
    }


    return (
        <div className='relative' onClick={() => {!isOpen && handleCLick()}}>
            {/* OPTION BOX CARD  */}
            <span className='flex justify-between w-full py-3 items-center mr-auto text-gray-800 text-xs font-semibold'>
                <span onClick={handleCLick}>{label}</span>
                {/* <div 
                    className='flex items-center gap-3 py-3 pl-5 ' 
                    onClick={handleCLick}
                >
                    <span className='text-gray-400'>
                        {filters.includes('AllCourses') || filters.includes('AllYears') || filters.includes('AllSections') ? "All" : filters.length}
                    </span>
                    <GoChevronDown className='opacity-90' />
                </div> */}
            </span>
            {/* MODAL */}
            <div className={`!transition-all w-full h-fit pb-3 border- border-gray-200 overflow-hidden
                ${isOpen && label === 'COURSE' ? "" : ""}
                ${isOpen && (label === 'YEAR' || label === 'SECTION') ? "" : ""}  
            `}>
                <div className='flex flex-row gap-2 flex-wrap h-fit'>
                    {options.map((option) => (
                        <div 
                            key={option.value}
                            className={`${filters?.includes(option.value)
                                ? '!bg-emerald-600 text-white font-light'
                                : ''
                            } flex items-center relative bg-gray-100 rounded-full px-4 py-2`} 
                        >
                            <input
                                type="checkbox" 
                                id={option.value} 
                                name={option.name}
                                value={option.value}
                                className={` min-h-6 min-w-6 hidden `}
                                onChange={onChange}
                                checked={filters?.includes(option.value)}
                            />
                            <label htmlFor={option.value} className='w-full text-xs'>{option.label}</label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}


// COMPONENT RADIOLIST

const SORTBY_OPTIONS: HTMLInputListProps[] = [
    { value: 'name', label: 'Surname', name: 'sortby' },
    { value: 'id', label: 'Student ID', name: 'sortby' },
];

const ORDER_OPTIONS: HTMLInputListProps[] = [
    { value: 'ascending', label: 'Ascending', name: 'order' },
    { value: 'descending', label: 'Descending', name: 'order' },
];

const RadioList: React.FC<HTMLInputList> = ({ options, filters, onChange }) => {
    return (
        <div className='flex flex-col mt-2 pl-1 gap-1'>
            {options.map((option, index) => (
                <div className='flex items-center relative py-1' key={option.value}>
                    {filters === option.value
                        ? <div className='min-h-5 min-w-5 bg-gray-20 border border-emerald-600 rounded-full grid place-items-center'>
                            <div className='bg-emerald-600 h-3.5 w-3.5 rounded-full'></div>
                          </div>
                        : <div className='min-h-5 min-w-5 border border-gray-300 bg-gray-20 rounded-full'></div>
                    }

                    {/* Hidden Radio Button */}
                    <input
                        type="radio" 
                        name={option.name}
                        value={option.value} 
                        id={option.value} 
                        onChange={onChange} 
                        checked={filters === option.value}
                        className='h-6 w-6 absolute hidden'
                    />

                    {/* Customized Radio Button */}

                    <label htmlFor={option.value} className='opacity-90 pl-2 text-sm z-[130]'>
                        {option.label}
                    </label>
                </div>
            ))}
        </div>
    )
}

export default Filter  