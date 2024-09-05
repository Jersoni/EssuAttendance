"use client"
import { Button } from '@/components';
import { useParams, usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { FaCheck } from "react-icons/fa";
import { GoChevronDown } from "react-icons/go";
import { RiFilter2Line } from "react-icons/ri";

interface filterButtonProps {
    buttonClassName?: string;
}

// TODO: FILTER FUNCTIONALITY
const Filter: React.FC<filterButtonProps> = ({buttonClassName}) => {

    const [isOpen, setIsOpen] = useState(false)
    const [isBlock, setIsBlock] = useState(false)
    const timeoutIdRef = useRef<number | null>(null);

        
    // open & close click handler
    const toggleFilter = () => {
        
        if (timeoutIdRef.current !== null)
            clearTimeout(timeoutIdRef.current)
        
        isBlock ? timeoutIdRef.current = window.setTimeout(() => { setIsBlock(false) }, 200)
        : setIsBlock(true);
        
        isOpen ? setIsOpen(false) 
        : setTimeout(() => setIsOpen(true), 10);
        
    };
    
    useEffect(() => {
        // Clean up timeout on component unmount
        return () => {
            if (timeoutIdRef.current !== null) {
                clearTimeout(timeoutIdRef.current);
            }
        };
    }, []);
    
    // FORM INPUT VALUES

    const [courses, setCourses] = useState(['AllCourses'])
    const [years, setYears] = useState(['AllYears'])
    const [sections, setSections] = useState(['AllSections'])
    const [sortBy, setSortBy] = useState('surname')
    const [order, setOrder] = useState('ascending')
    const [displayOption, setDisplayOption] = useState('showAll')

    function handleCoursesChange(event: React.ChangeEvent<HTMLInputElement>) {
        const {value} = event.target
        if (value === 'AllCourses') { // if target is "All", set to All only
            setCourses(['AllCourses'])
        } else { // if target is not 'all'
            courses.includes(value) 
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
    }

    function handleOrderChange(event: React.ChangeEvent<HTMLInputElement>) {
        const {value} = event.target
        setOrder(value)
    }

    function handleDisplayOptionChange(event: React.ChangeEvent<HTMLInputElement>) {
        const {value} = event.target
        setDisplayOption(value)
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
        setSortBy('surname')
        setOrder('ascending')
        setDisplayOption('showAll')
    }

    // TODO: 
    // HANDLE SUBMIT
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = new URLSearchParams()
    const routeParams = useParams()

    function applyFilters() {
        courses.forEach(course => {searchParams.append('c', course)})
        years.forEach(year => searchParams.append('y', year))
        sections.forEach(section => searchParams.append('s', section))
        searchParams.append('sb', sortBy)
        searchParams.append('o', order)
        searchParams.append('d', displayOption)

        // console.log(searchParams.getAll('c'))
        searchParams.forEach((key, value) => {
            console.log(key)
            console.log(value)
        })


        router.push(`/events/${routeParams.id}?${searchParams.toString()}`)
        
    }

    // just pretty prints all filters data
    useEffect(() => {
        const filters = {
            courses, years, sections, sortBy, order, displayOption
        }  
        console.log(JSON.stringify(filters, null, 2))
    }, [courses, years, sections, sortBy, order, displayOption])

    return (
        <div>
            <button className={buttonClassName} onClick={toggleFilter}>
                <RiFilter2Line size={24} />
            </button>
            
            {/* Filter */}
            <div className=''>
                <div className={`bg-gray-100 absolute h-fit w-full left-0 right-0 mx-auto transition-all duration-200 bottom-0 ${isBlock ? "" : "hidden"} ${isOpen ? "" : "translate-y-full" } z-[140] rounded-t-2xl flex flex-col justify-between text-sm`}>
                    <h2 className='p-5 text-lg font-semibold text-center'>Filter</h2>
                        <div className='px-5 pb-0 overflow-y-scroll min-h-full'>
                            {/* X BUTTON */}
                            <Button variant='close' onClick={toggleFilter} className='absolute right-2 top-2'></Button>

                            {/* FILTER */}
                            <div className='flex flex-col gap-4'>
                                <DropDownChecklist options={COURSE} label='COURSE' onChange={handleCoursesChange} filters={courses} />
                                <DropDownChecklist options={YEAR} label='YEAR' onChange={handleYearsChange} filters={years}  />
                                <DropDownChecklist options={SECTION} label='SECTION' onChange={handleSectionsChange} filters={sections} />
                            </div>
                            <div className='flex flex-row rounded-2xl mt-4 overflow-hidden bg-white h-fit w-full p-4 pb-6'>
                                <div className='flex-col w-1/2 items-start h-fit'>
                                    <span className='font-medium text-gray-700'>SORT BY</span>
                                    <RadioList options={SORTBY_OPTIONS} onChange={handleSortChange} filters={sortBy} /> 
                                </div>
                                <div className='flex-col w-1/2 items-start h-fit'>
                                    <span className='font-medium text-gray-700'>ORDER</span>
                                    <RadioList options={ORDER_OPTIONS} onChange={handleOrderChange} filters={order} />
                                </div>
                            </div>
                            <div className='bg-white rounded-2xl p-4 pb-6 mt-4'>
                                <span className='font-medium text-gray-700'>DISPLAY OPTION</span>
                                <RadioList options={DISPLAY_OPTIONS} onChange={handleDisplayOptionChange} filters={displayOption} />
                            </div>
                        </div>
                    <div className='flex flex-row gap-3 left-0 w-full items-center p-5 pb-12'>
                        <Button variant='secondary' onClick={resetFilters} >Reset</Button>
                        <Button variant='primary' onClick={applyFilters}>Apply</Button>
                    </div>
                </div>
                <div onClick={toggleFilter} className={`bg-black bg-opacity-70 h-full w-full absolute top-0 left-0 z-[100] transition-all ${isOpen ? "block" : "hidden"}`}></div>
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
    filters: Array<string> | string;
}

// DATA
const COURSE: HTMLInputListProps[] = [
    {value: 'AllCourses', label: 'Select All', name: 'course'},
    {value: 'BSCE', label: 'BSCE', name: 'course'},
    {value: 'BSINFOTECH', label: 'BS INFO TECH', name: 'course'},
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
]

const YEAR: HTMLInputListProps[] = [
    {value: 'AllYears', label: 'Select All', name: 'year'},
    {value: '1', label: '1', name: 'year'},
    {value: '2', label: '2', name: 'year'},
    {value: '3', label: '3', name: 'year'},
    {value: '4', label: '4', name: 'year'},
]  

const SECTION: HTMLInputListProps[] = [
    {value: 'AllSections', label: 'Select All', name: 'section'},
    {value: 'A', label: 'A', name: 'section'},
    {value: 'B', label: 'B', name: 'section'},
    {value: 'C', label: 'C', name: 'section'},
    {value: 'D', label: 'D', name: 'section'},
    {value: 'E', label: 'E', name: 'section'},
]

const DropDownChecklist = ({options, label, onChange, filters}: HTMLInputList) => {

    const [isOpen, setIsOpen] = useState(false)

    const handleCLick = () => {
        setIsOpen(!isOpen)
    }

    return (
        <>
        <div className='filter__card relative' onClick={() => {!isOpen && handleCLick()}}>
            {/* OPTION BOX CARD  */}
            <span className='flex justify-between w-full items-center mr-auto font-medium text-gray-800'>
                {label}
                <div className='flex items-center gap-3'>
                    <span className='text-gray-400'>
                        {filters.includes('AllCourses') || filters.includes('AllYears') || filters.includes('AllSections') ? "All" : filters.length}
                    </span>
                    <GoChevronDown className='opacity-90' />
                </div>
            </span>
            {/* MODAL */}
            <div className={`${isOpen ? "" : "hidden"} p-5 mt-4 absolute bg-white z-[180] rounded-2xl w-full top-8`}>
                <div className='flex flex-col overflow-y-scroll max-h-44'>
                    {options.map((option) => (
                        <div className='flex py-[5px] items-center relative' key={option.value}>
                            {filters.includes(option.value) 
                                ? <div className='min-h-6 min-w-6 rounded-lg bg-emerald-600 grid place-items-center'>
                                    <FaCheck className='fill-white'/>
                                </div>
                                // : <MdCheckBoxOutlineBlank size={34} className='fill-gray-500' /> 
                                : <div className='bg-gray-200 min-h-6 min-w-6 rounded-lg'></div>
                            }
                            <input
                                type="checkbox" 
                                id={option.value} 
                                name={option.name}
                                value={option.value}
                                className={` min-h-6 min-w-6 bg-gray absolute appearance-none `}
                                // className={`relative min-h-5 min-w-5 bg-white border border-gray-800 rounded-full checked:before:content-[''] checked:before:absolute checked:before:h-[15px] checked:before:w-[15px] checked:before:bg-gray-700 checked:before:rounded-full checked:before:translate-y-[1.5px] checked:before:translate-x-[1.5px] `}
                                defaultChecked={option.value === 'AllCourses' || option.value === 'AllYear' || option.value === 'AllSections'}
                                onChange={onChange}
                                checked={filters.includes(option.value)}
                            />
                            <label htmlFor={option.value} className='w-full pl-3'>{option.label}</label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        {/* Hidden backdrop */}
        <div onClick={handleCLick} className={`${isOpen ? "block" : "hidden"} rounded-t-3xl opacity-20 z-[140] absolute h-full w-full top-0 left-0 bg-black`}></div>
        </>
    )
}


// COMPONENT RADIOLIST

const SORTBY_OPTIONS: HTMLInputListProps[] = [
    { value: 'surname', label: 'Surname', name: 'sortby' },
    { value: 'id', label: 'Student ID', name: 'sortby' },
];

const ORDER_OPTIONS: HTMLInputListProps[] = [
    { value: 'ascending', label: 'Ascending', name: 'order' },
    { value: 'descending', label: 'Descending', name: 'order' },
];

const DISPLAY_OPTIONS: HTMLInputListProps[] = [
    { value: 'showAll', label: 'Show all', name: 'display' },
    { value: 'presentOnly', label: 'Present students only', name: 'display' },
    { value: 'absentOnly', label: 'Absent students only', name: 'display' },
];

const RadioList: React.FC<HTMLInputList> = ({ options, filters, onChange }) => {
    return (
        <div className='flex flex-col mt-4 pl-1 gap-2'>
            {options.map((option, index) => (
                <div className='flex items-center relative' key={option.value}>

                    {filters === option.value
                        ? <div className='min-h-6 min-w-6 bg-gray-200 border-2 border-emerald-700 rounded-full grid place-items-center'>
                            <div className='bg-emerald-700 h-4 w-4 rounded-full'></div>
                          </div>
                        : <div className='min-h-6 min-w-6 bg-gray-200 rounded-full'></div>
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

                    <label htmlFor={option.value} className='opacity-90 pl-2 z-[130]'>
                        {option.label}
                    </label>
                </div>
            ))}
        </div>
    )
}

export default Filter  