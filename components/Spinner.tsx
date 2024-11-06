import React from 'react'

interface SpinnerProps {
    className?: string
    size?: string
    color?: string
}

const Spinner = ({
    className,
    size = '2',
    color = '#059669'
}: SpinnerProps) => {
  return (
    <div role="status" className={className}>
      <span className={`!w-[${size}rem] bg-[${color}] loading loading-spinner `}></span>
    </div>
  )
}

export default Spinner