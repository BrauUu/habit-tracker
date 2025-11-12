import { useState, useEffect } from "react"

interface PlaceholderProps {
    value?: string,
    placeholder: string,
    submitOnEnter?: boolean,
    onSubmit: (value: string) => void,
    onChange?: (value: string) => void
}

export default function Input({value, placeholder, submitOnEnter = false, onSubmit, onChange}: PlaceholderProps) {

    const [inputValue, setInputValue] = useState(value ?? '')

    function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>){
        if (submitOnEnter && event.key === 'Enter') {
            onSubmit(event.currentTarget.value)
            setInputValue('')
            onChange?.('')
        }
    }

    return (
        <input
            value={inputValue}
            type="text"
            className={`
            bg-primary-700 rounded-lg w-full h-10 p-2
            focus:outline-0
            `}
            onChange={(e) => {
                setInputValue(e.target.value)
                onChange?.(e.target.value)
            }}
            placeholder={placeholder}
            onKeyDown={handleKeyDown}
        />
    )
}