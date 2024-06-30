import React from 'react';
import { IoCloseOutline } from "react-icons/io5";

interface ButtonProps {
  children?: React.ReactNode; // Content of the button
  variant?: 'primary' | 'secondary' | 'clear' | 'close' | 'fixed-circle'; // Optional variant for different styles
  onClick?: () => void; // Optional function for click event handling
  disabled?: boolean; // Optional prop for disabling the button
  className?: string; // Optional class name for custom styling
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', onClick, disabled, className }) => {
  const buttonClasses = `
    rounded-full h-fit
    ${variant === 'primary' ? 'py-2 px-4 w-48 text-white bg-[#089662] active:bg-[#1FAB4F]' : ''}
    ${variant === 'secondary' ? 'py-2 px-4 w-48 bg-white hover:bg-gray-500 !border !border-gray-300' : ''}
    ${variant === 'clear' ? 'px-4 py-2 w-40 shadow-none' : ''}
    ${variant === 'close' ? 'w-fit p-4 !h-fit ' : ''}
    ${variant === 'fixed-circle' ? 'fixed bottom-5 right-5 flex flex-row items-center rounded-full shadow-lg bg-[#089662] p-5 ml-auto' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
  `;

  return (
    <button type="button" className={`${buttonClasses} ${className}`} onClick={onClick} disabled={disabled}>
      {children}
      {variant === 'close' && ( <IoCloseOutline size={24}/> )}
    </button>
  );
};

export default Button;