import React from 'react';
import { IoCloseOutline } from "react-icons/io5";
import { ButtonProps } from '@/types'

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', onClick, disabled, className, type = 'button', form }) => {
  const buttonClasses = `
    rounded-md h-fit text-sm
    ${variant === 'primary' ? 'py-2 px-8 w-fit text-white bg-[#089662] active:bg-[#1FAB4F]' : ''}
    ${variant === 'secondary' ? 'py-2 px-8 w-fit bg-white border border-gray-300' : ''}
    ${variant === 'clear' ? 'px-4 py-2 w-40 shadow-none' : ''}
    ${variant === 'close' ? 'w-fit p-4 !h-fit ' : ''}
    ${variant === 'small-circle' ? 'flex items-center rounded-full p-2 ml-auto' : ''}
    ${variant === 'small-square' ? 'flex items-center p-2' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
  `;

  return (
    <button type={type} form={form} className={`${buttonClasses} ${className}`} onClick={onClick} disabled={disabled}>
      {children}
      {variant === 'close' && ( <IoCloseOutline size={24}/> )}
    </button>
  );
};

export default Button;