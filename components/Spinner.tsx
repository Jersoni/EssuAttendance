import React from 'react'

interface SpinnerProps {
    className?: string
    size?: 'loading-sm' | 'loading-xs' | 'loading-lg'
}

const Spinner = ({
    className,
    size
}: SpinnerProps) => {
  return (
    <div role="status" className={className}>
      <span className={`${size} loading loading-spinner text-success`}></span>
    </div>
  )
}

export default Spinner