import { useState } from "react"

interface TextareaProps {
    value?: string,
    placeholder: string,
    onChange?: (value: string) => void,
    style?: string
}

export default function Input({ value, placeholder, onChange, style }: TextareaProps) {

    const [inputValue, setInputValue] = useState(value ?? '')

    return (
        <div className="h-24 flex flex-row relative items-center">
            <textarea
                value={inputValue}
                className={`${style} bg-primary-700 rounded-lg w-full h-full p-2 focus:outline-0 resize-none`}
                onChange={(e) => {
                    setInputValue(e.target.value)
                    onChange?.(e.target.value)
                }}
                placeholder={placeholder}
                maxLength={500}
            >
            </textarea>
        </div>
    )
}
