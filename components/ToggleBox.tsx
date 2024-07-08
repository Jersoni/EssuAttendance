'use client'
import React, { useState } from 'react'

interface ToggleBoxProps {
    text: string
}

const ToggleBox:React.FC<ToggleBoxProps> = ({text}) => {

    const [isChecked, setIsChecked] = useState(false)

    const handleClick = () => {
        setIsChecked(!isChecked)
    }

    return (
        <div className='flex'>
            <input type="checkbox" name="colleges" id="bsit" className={`form__checkbox`} />
            <label onClick={handleClick} className={`form__colleges ${isChecked ? "bg-gray-200 !border-gray-400" : "bg-white"}`} htmlFor="bsit">{text}</label>
        </div>
    )
}

export default ToggleBox