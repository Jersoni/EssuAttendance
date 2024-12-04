'use client'
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import Image from "next/image";
import { UniversityOptionsProps } from "@/types";

interface ComboboxProps {
    placeholder?: string
    options?: Array<{logo: string, name: string}>
    selectedOption?: string
    setSelectedOption: (value: string) => void
    // open?: boolean,
    // setOpen: (value: boolean) => void
}

const Combobox = ({
    placeholder, options, selectedOption, setSelectedOption
}: ComboboxProps ) => {

    const comboboxContainerRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const clearBtnRef = useRef<HTMLButtonElement>(null)

    const [selectedLogo, setSelectedLogo] = useState<string>()
    const [query, setQuery] = useState<string>("")
    const [open, setOpen] = useState<boolean>(false)

    const [results, setResults] = useState<UniversityOptionsProps[]>()

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
            const filteredOptions: Array<UniversityOptionsProps> = options.filter(option =>
                option.name.toLowerCase().includes(query.toLowerCase())
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
        setSelectedLogo("")
        setSelectedOption("")
        setResults(options)
    }

    return (
        <div 
            ref={comboboxContainerRef}
            className="combobox-container relative "
        >
            <div
                className="input-container pointer-events-none bg-gray-100 border border-gray-200 rounded-lg p-2.5 focus:border-opacity-80 text-sm w-full flex flex-row items-center "
            >

                <div className="min-h-7 pointer-events-none relative min-w-7 mr-3 rounded-full bg-gray-200">
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
                </div>
                
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={onInputChange}
                    placeholder={placeholder}
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
                    className={`z-[2000] dropdown-container p-1.5 absolute bg-white mt-2 max-h-60 overflow-y-scroll w-full border border-gray-200 rounded-lg shadow-md `}
                >

                    {results?.map((option) => (
                        <div
                            key={option.name}
                            className="p-1 flex flex-row items-center transition-all active:bg-gray-200 cursor-pointer rounded-md"
                            onClick={() => {
                                setSelectedLogo(option.logo)
                                setQuery(option.name)
                                setSelectedOption(option.name)
                                setOpen(false)
                            }}
                        >
                            <div className="relative h-7 w-7 bg-gray-100 rounded-full">
                                {option.logo && (
                                    <Image 
                                        src={option.logo}
                                        fill={true}
                                        alt={`${option.name} logo`}
                                        className="rounded-full"
                                    />
                                )}
                            </div>
                                
                            <span className="name-container ml-3 text-sm">
                                {option.name}
                            </span>
                        </div>
                    ))}
                </div>
            )}


        </div>
    )
}

export default Combobox