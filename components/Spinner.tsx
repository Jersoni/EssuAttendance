// Spinner component leveraging daisyUI for loading spinner styles
// daisyUI tailwind library is used for consistent loading spinner styling
// Documentation: https://daisyui.com/components/loading/

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
      {/**
       * The span element displays the loading spinner.
       * Accessibility: 'role="status"' communicates loading state to screen readers.
       */}
      <span 
        className={`loading loading-spinner `}
        style={{
          width: `${size}rem`,
          height: `${size}rem`,
          backgroundColor: color,
        }}
      ></span>
    </div>
  )
}

export default Spinner