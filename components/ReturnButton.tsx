"use client"
import React from 'react'
import { IoChevronBack } from "react-icons/io5";

interface ButtonProps {
    onClick?: () => void; // click handler function
    className?: string; // Optional CSS class name for styling
}

const ReturnButton: React.FC<ButtonProps> = ({ onClick, className }) => {
    return (
        <button type="button" className={`z-30 grid place-items-center h-12 w-12 mr-2 rounded-full active:bg-gray-300 ${className}`} onClick={onClick}>
            <IoChevronBack size={24} />
        </button>
    )
}

export default ReturnButton