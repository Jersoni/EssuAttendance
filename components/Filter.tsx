"use client"
import React, { useRef, useState, useEffect } from 'react'
import { LuListFilter } from "react-icons/lu";
import { GoChevronDown } from "react-icons/go";
import { Button } from '@/components';
import { FiFilter } from "react-icons/fi";


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

    return (
        <div>
            <button className={buttonClassName} onClick={toggleFilter}>
                <FiFilter size={24} />
            </button>
            
            {/* Filter */}
            <div className=''>
                <div className={`bg-gray-100 absolute h-fit w-full left-0 right-0 mx-auto transition-all duration-200 bottom-0 ${isBlock ? "" : "hidden"} ${isOpen ? "" : "translate-y-full" } z-[140] rounded-t-3xl flex flex-col justify-between text-sm`}>
                    <h2 className='p-5 text-lg font-semibold text-center'>Filter</h2>
                    <div className='px-5 pb-0 overflow-y-scroll min-h-full'>
                        {/* X BUTTON */}
                        <Button variant='close' onClick={toggleFilter} className='absolute right-2 top-2'></Button>

                        {/* FILTER */}
                        <div className='flex flex-col gap-4'>
                            <DropDownChecklist options={COURSE} label='COURSE' />
                            <DropDownChecklist options={YEAR} label='YEAR' />
                            <DropDownChecklist options={SECTION} label='SECTION' />
                        </div>
                        <div className='flex flex-row rounded-2xl mt-4 overflow-hidden bg-white h-fit w-full p-4 pb-8'>
                            <div className='flex-col w-1/2 items-start h-fit'>
                                <span className='font-medium text-gray-700'>SORT BY</span>
                                <RadioList options={SORTBY_OPTIONS} /> 
                            </div>
                            <div className='flex-col w-1/2 items-start h-fit'>
                                <span className='font-medium text-gray-700'>ORDER</span>
                                <RadioList options={ORDER_OPTIONS} />
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-row gap-3 left-0 w-full items-center p-5 pb-12'>
                        <Button variant='secondary' onClick={toggleFilter} >Clear all</Button>
                        <Button variant='primary' onClick={toggleFilter}>Apply</Button>
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

const DropDownChecklist: React.FC<HTMLInputList> = ({ options, label }) => {

    const [isOpen, setIsOpen] = useState(false)

    const handleCLick = () => {
        setIsOpen(!isOpen)
    }

    const firstOptionsValue = options[0].value
    const [checked, setChecked] = useState<string[]>([firstOptionsValue]);

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target

        if(value !== firstOptionsValue) {
            if (!checked.includes(value)) {
                // add value to array
                let removedAll = checked.filter(item => item !== firstOptionsValue)
                setChecked([...removedAll, value]);
            }
            else {
                // remove value from array
                setChecked(checked.filter(item => item !== value))
            } 
        } else {
            // set array to ALL only
            setChecked([firstOptionsValue])
        }
        
    };

    useEffect(() => {
        if (checked.length === 0) {
            setChecked([firstOptionsValue])
        }
    }, [checked, firstOptionsValue]);

    return (
        <>
        <div className='filter__card relative' onClick={() => {!isOpen && handleCLick()}}>
            <span className='flex justify-between w-full items-center mr-auto font-medium text-gray-800'>
                {label}
                <div className='flex items-center gap-3'>
                    <span>{checked[0] === firstOptionsValue ? "All" : checked.length}</span>
                    <GoChevronDown />
                </div>
            </span>
            {/* MODAL */}
            <div className={`${isOpen ? "" : "hidden"} ${label === 'SECTION' && 'translate-y-[-90px]'} p-5 mt-4 absolute bg-white z-[180] rounded-2xl w-full top-8`}>
                <div className='flex flex-col overflow-y-scroll max-h-44'>
                    {options.map((option) => (
                        <div className='flex py-[7px] border-b items-center' key={option.value}>
                            <input
                                type="checkbox" 
                                id={option.value} 
                                name={option.name}
                                value={option.value} 
                                className={`relative appearance-none min-h-5 min-w-5 bg-white border border-gray-800 rounded-full checked:before:content-[''] checked:before:absolute checked:before:h-[15px] checked:before:w-[15px] checked:before:bg-gray-700 checked:before:rounded-full checked:before:translate-y-[1.5px] checked:before:translate-x-[1.5px] `}
                                checked={checked.includes(option.value)}
                                onChange={handleCheckboxChange}
                            />
                            <label htmlFor={option.value} className='w-full pl-2'>{option.label}</label>
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

const RadioList: React.FC<HTMLInputList> = ({ options }) => {
    
    const [isSelected, setIsSelected] = useState<string>('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsSelected(e.target.value);
    }

    // set the default or initial option (first option)
    useEffect(() => {
        options.map((option, index) => {
            index === 0 && setIsSelected(option.value)
        })
    }, [options])
    
    return (
        <div className='flex flex-col mt-4 pl-1 gap-2'>
            {options.map((option, index) => (
                <div className='flex items-center' key={option.value}>

                    {/* Hidden Radio Button */}
                    <input
                        type="radio" 
                        name={option.name}
                        value={option.value} 
                        id={option.value} 
                        onChange={handleChange} 
                        className='hidden'
                        defaultChecked={index === 0} // Check the first option by default
                    />

                    {/* Customized Radio Button */}
                    <div className='border border-black h-5 w-5 rounded-full flex items-center justify-center'>
                        {isSelected === option.value
                            && <div className='h-[15px] w-[15px] rounded-full bg-gray-700 relative'></div>
                        }
                    </div>

                    <label htmlFor={option.value} className='opacity-90 pl-2 z-[130]'>
                        {option.label}
                    </label>
                </div>
            ))}
        </div>
    )
}

export default Filter  