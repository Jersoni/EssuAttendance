import React from 'react';
import { IoCloseOutline } from "react-icons/io5";

interface ButtonProps {
  children?: React.ReactNode; // Content of the button
  variant?: 'primary' | 'secondary' | 'clear' | 'close' | 'small-circle' | 'small-square'; // Optional variant for different styles
  onClick?: (e: any) => void; // Optional function for click event handling
  disabled?: boolean; // Optional prop for disabling the button
  className?: string; // Optional class name for custom styling
  type?: "button" | "submit" | "reset" // button type
  form?: string;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', onClick, disabled, className, type = 'button', form }) => {
  const buttonClasses = `
    rounded-full h-fit text-sm
    ${variant === 'primary' ? 'py-2 px-4 w-56 text-white bg-[#089662] active:bg-[#1FAB4F]' : ''}
    ${variant === 'secondary' ? 'py-2 px-4 w-56 bg-white border border-gray-300' : ''}
    ${variant === 'clear' ? 'px-4 py-2 w-40 shadow-none' : ''}
    ${variant === 'close' ? 'w-fit p-4 !h-fit ' : ''}
    ${variant === 'small-circle' ? 'flex items-center border border-gray-300 rounded-full bg-gray-100 p-2 ml-auto' : ''}
    ${variant === 'small-square' ? 'flex items-center border border-gray-300 rounded-md bg-gray-100 p-2' : ''}
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