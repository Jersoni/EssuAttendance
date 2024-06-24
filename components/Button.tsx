import React from 'react';

interface ButtonProps {
  children: React.ReactNode; // Content of the button
  variant?: 'primary' | 'secondary' | 'clear'; // Optional variant for different styles
  onClick?: () => void; // Optional function for click event handling
  disabled?: boolean; // Optional prop for disabling the button
  className?: string; // Optional class name for custom styling
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', onClick, disabled, className }) => {
  const buttonClasses = `
    px-4 py-2 rounded-full w-48 shadow-md h-fit
    ${variant === 'primary' ? 'text-white bg-[#118638] active:bg-[#1FAB4F]' : ''}
    ${variant === 'secondary' ? 'bg-white hover:bg-gray-500' : ''}
    ${variant === 'clear' ? '!w-40 shadow-none' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
  `;

  return (
    <button type="button" className={`${buttonClasses} ${className}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;