export interface StudentProps {
    id: number
    firstName: string
    lastName: string
    suffix: string
    middleName: string
    course: string
    year: number
    section: string
    isPresent?: boolean
}

export interface EventProps {
    id: number | undefined
    title: string
    location: string
    loginTime: string
    logoutTime: string
    fineAmount: number
    eventDate: string
}

export interface FormEventProps {
    title: string
    location: string
    loginTime: string
    logoutTime: string
    fineAmount: number
    eventDate: string
}

export interface headerProps {
    title?: string; // header title
    subtitle?: string // text under title
    children?: React.ReactNode;
    returnPath?: string
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

export interface FormOperationProps {
    operation?: 'insert' | 'update';
}

export interface Attendance {
    id: number;
    eventId: number;
    isPresent: boolean;
    studentId: number;
}   

export interface ConfirmationModalProps {
    isOpen?: boolean;
    onClose?: () => void;
    onConfirm?: () => void;
    title?: string;
    content?: string;
    confirmBtnLabel?: string;
    confirmBtnVariant?: "primary" | "secondary" | "clear" | "close" | "small-circle" | "small-square";
    type?: 'default' | 'delete';
}

export interface FilterProps {
    course?: {
        allCourses: boolean;
        bsce: boolean;
        bsinfotech: boolean;
        bsit: boolean;
        bot: boolean;
        bstm: boolean;
        bse: boolean;
        bsba: boolean;
        bsais: boolean;
        bac: boolean;
        btvted: boolean;
        bsed: boolean;
        beed: boolean;
        bsn: boolean;
        bscrim: boolean;
    };
    year?: {
        allyears: boolean;
        year1: boolean;
        year2: boolean;
        year3: boolean;
        year4: boolean;
    };
    section?: {
        allSections: boolean;
        a: boolean;
        b: boolean;
        c: boolean;
        d: boolean;
        e: boolean;
    };
    sortby?: 'surname' | 'studentID';
    order?: 'ascending' | 'descending';
    displayOption?: 'showAll' | 'presentOnly' | 'absentOnly';
}