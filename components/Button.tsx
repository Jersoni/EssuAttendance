import React from 'react';
import { IoCloseOutline } from "react-icons/io5";

interface ButtonProps {
  children?: React.ReactNode; // Content of the button
  variant?: 'primary' | 'secondary' | 'clear' | 'close'; // Optional variant for different styles
  onClick?: () => void; // Optional function for click event handling
  disabled?: boolean; // Optional prop for disabling the button
  className?: string; // Optional class name for custom styling
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', onClick, disabled, className }) => {
  const buttonClasses = `
    px-4 py-2 rounded-full w-48 h-fit
    ${variant === 'primary' ? 'text-white bg-[#0b754e] active:bg-[#1FAB4F]' : ''}
    ${variant === 'secondary' ? 'bg-white hover:bg-gray-500 !border !border-gray-300' : ''}
    ${variant === 'clear' ? '!w-40 shadow-none' : ''}
    ${variant === 'close' ? '!w-fit !p-4 !h-fit ' : ''}
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