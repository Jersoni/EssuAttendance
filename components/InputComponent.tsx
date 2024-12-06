interface InputComponentProps {
    label: string
    description?: string
    type: string
    placeholder?: string
    value?: string
    name?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const InputComponent = ({
    label, description, type, placeholder, value, onChange, name
}: InputComponentProps ) => {
    return (
        <div className="flex flex-col">
            <label 
                className="text-sm font-semibold text-gray-700" 
                htmlFor={name}
            >{label}</label>
            <p className="text-[13px] text-gray-400 font-normal">{description}</p>
            <input 
                type={type}
                placeholder={placeholder}
                value={value}
                name={name}
                onChange={onChange}
                autoComplete="off"
                className="input-container mt-2 bg-gray-100 border border-gray-200 rounded-lg p-3 focus:border-opacity-80 text-sm w-full flex flex-row items-center outline-none"
            />
        </div>
    )
}

export default InputComponent
