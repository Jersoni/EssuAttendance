'use client'
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import Image from "next/image";

interface ComboboxProps {
    label?: string;
    placeholder?: string
    options: Array<string>
    selectedOption?: string
    setSelectedOption: (value: string) => void
    className?: string
}

const Combobox = ({
    label, placeholder, options, selectedOption, setSelectedOption, className
}: ComboboxProps ) => {

    const comboboxContainerRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const clearBtnRef = useRef<HTMLButtonElement>(null)

    const [query, setQuery] = useState<string>("")
    const [open, setOpen] = useState<boolean>(false)

    const [results, setResults] = useState<string[]>()

    useEffect(() => {
        if (selectedOption === "" ) {
            clearAll()
        }
    }, [selectedOption])

    useEffect(() => {
        if (query === "") {
            setResults(options)
        }
    }, [options, query])

    const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value)
        setOpen(true)
    }

    useEffect(() => {
        
        if (options) {
            const filteredOptions: Array<string> = options.filter(option =>
                option.toLowerCase().includes(query.toLowerCase())
            )
            setResults(filteredOptions)
        }
    }, [query])

    useEffect(() => {
        window.addEventListener("click", (e) => {
            if (e.target === comboboxContainerRef.current || e.target === clearBtnRef.current) {
                inputRef.current?.focus()
                setOpen(true)
            } else {
                setOpen(false)
            }
        })
    }, [])

    function clearAll() {
        setQuery("")
        setSelectedOption("")
        setResults(options)
    }

    return (
        <div 
            ref={comboboxContainerRef}
            className={`"combobox-container relative ${className} `}
        >

            <label className="text-sm font-semibold text-gray-700 !mb-2 flex ">{label}</label>

            <div
                className="input-container pointer-events-none bg-gray-100 border border-gray-200 rounded-lg p-2.5 pl-4 focus:border-opacity-80 text-sm w-full flex flex-row items-center "
            >

                {/* <div className="min-h-7 pointer-events-none relative min-w-7 mr-3 rounded-full bg-gray-200">
                    {selectedLogo ? ( 
                        <Image
                        src={selectedLogo} 
                        fill={true}
                        alt={`selected option's logo`}
                        className="rounded-full"
                        />
                    ) : (
                        <></>
                    )}
                </div> */}
            
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={onInputChange}
                    placeholder={placeholder}
                    autoComplete="off"
                    className='bg-transparent pointer-events-none outline-none mr-2 w-full'
                />
                
                
                <button
                    ref={clearBtnRef}
                    type="button"
                    className={`pointer-events-auto ${selectedOption ? "" : "opacity-0 pointer-events-none"} `}
                    onClick={() => {
                        clearAll()
                        inputRef.current?.focus()
                        setOpen(true)
                    }}
                >
                    <MdClose
                        size={18}
                        className="text-gray-700 ml-auto pointer-events-none" 
                    />
                </button>

                <IoChevronDown
                    size={22}
                    className="text-gray-700 ml-3 mr-2 pointer-events-none" 
                />

            </div>
            
            {(results && results.length > 0 && open) && (
                <div
                    className={`z-[2000] dropdown-container p-2 absolute bg-white mt-2 max-h-60 overflow-y-scroll w-full border border-gray-200 rounded-lg shadow-md `}
                >

                    {results?.map((option) => (
                        <div
                            key={option}
                            className="p-2 flex flex-row items-center transition-all active:bg-gray-100 cursor-pointer rounded-md"
                            onClick={() => {
                                setQuery(option)
                                setSelectedOption(option)
                                setOpen(false)
                            }}
                        >
                            {/* <div className="relative h-7 w-7 bg-gray-100 rounded-full">
                                {option.logo && (
                                    <Image 
                                        src={option.logo}
                                        fill={true}
                                        alt={`${option.name} logo`}
                                        className="rounded-full"
                                    />
                                )}
                            </div> */}
                                
                            <span className="name-container text-sm">
                                {option}
                            </span>
                        </div>
                    ))}
                </div>
            )}


        </div>
    )
}

export default Combobox