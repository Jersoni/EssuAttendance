"use client"
import React, { useRef, useState, useEffect } from 'react'
import { LuListFilter } from "react-icons/lu";
import { IoIosArrowForward } from "react-icons/io";
import { Button } from '@/components';
import { BiFilterAlt } from "react-icons/bi";

interface filterButtonProps {
    className?: string;
}

const Filter: React.FC<filterButtonProps> = ({className}) => {

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
            <Button variant='small-circle' className={className} onClick={toggleFilter}>
                <LuListFilter size={24} />
            </Button>
            
            {/* Filter */}
            <div>
                <div className={`bg-gray-100 absolute h-[500px] w-full left-0 right-0 mx-auto transition-all duration-200 bottom-0 ${isBlock ? "" : "hidden"} ${isOpen ? "" : "translate-y-full" } z-[140] rounded-t-3xl flex flex-col justify-between text-sm`}>
                    <div className='p-5 pb-0'>
                        <h2 className='text-lg font-semibold text-center'>Filter</h2>
                        <Button variant='close' onClick={toggleFilter} className='absolute right-2 top-2'></Button>
                        <div className='flex flex-col rounded-2xl mt-4 overflow-hidden'>
                            <div className='filter__card'>
                                <span>Course</span>
                                <span className='filter__selected-total'>5</span>
                                <IoIosArrowForward size={15}/>
                            </div>
                            <div className='filter__card'>
                                <span>Year</span>
                                <span className='filter__selected-total'>All</span>
                                <IoIosArrowForward size={15}/>
                            </div>
                            <div className='filter__card'>
                                <span>Section</span>
                                <span className='filter__selected-total'>All</span>
                                <IoIosArrowForward size={15}/>
                            </div>
                        </div>
                        <div className='flex flex-row rounded-2xl mt-4 overflow-hidden bg-white h-fit w-full p-4 pb-8'>
                            <div className='flex-col w-1/2 items-start h-fit'>
                                <span className='font-medium text-gray-700'>SORT BY</span>
                                <FilterOptions options={SORTBY_OPTIONS} /> 
                            </div>
                            <div className='flex-col w-1/2 items-start h-fit'>
                                <span className='font-medium text-gray-700'>ORDER</span>
                                <FilterOptions options={ORDER_OPTIONS} />
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


// COMPONENT

interface SelectedOptions {
    options: Array<OptionsProps>;
}

interface OptionsProps {
    value: string;
    label: string;
    name: string;
}

const SORTBY_OPTIONS: OptionsProps[] = [
    { value: 'surname', label: 'Surname', name: 'sortby' },
    { value: 'id', label: 'Student ID', name: 'sortby' },
];

const ORDER_OPTIONS: OptionsProps[] = [
    { value: 'ascending', label: 'Ascending', name: 'order' },
    { value: 'descending', label: 'Descending', name: 'order' },
];

const FilterOptions: React.FC<SelectedOptions> = ({ options }) => {
    
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
                <div className='flex items-center' key={option.value} onClick={() => {console.log(option.value)}}>

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
                            && <div className='h-[15px] w-[15px] rounded-full bg-gray-700 relative'></div>}
                    </div>

                    <label htmlFor={option.value} className='opacity-90 absolute pl-7 z-[130]'>
                        {option.label}
                    </label>
                </div>
            ))}
        </div>
    )
}

export default Filter  