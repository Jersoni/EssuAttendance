export interface StudentProps {
    id: number
    firstName: string
    lastName: string
    suffix: string
    middleName: string
    course: string
    year: number
    section: string
}

export interface EventProps {
    id: number
    title: string
    location: string
    loginTime: string
    logoutTime: string
    fineAmount: number
    eventDate: string
    classes?: string
}

export interface headerProps {
    title?: string; // header title
    subtitle?: string // text under title
    children?: React.ReactNode;
}

export interface ButtonProps {
    children?: React.ReactNode; // Content of the button
    variant?: 'primary' | 'secondary' | 'clear' | 'close' | 'small-circle' | 'small-square'; // Optional variant for different styles
    onClick?: (e: any) => void; // Optional function for click event handling
    disabled?: boolean; // Optional prop for disabling the button
    className?: string; // Optional class name for custom styling
    type?: "button" | "submit" | "reset" // button type
    form?: string;
  }