import { ArrowTurnDownLeftIcon } from "@heroicons/react/24/outline"
import { useState } from "react"

interface PlaceholderProps {
    value?: string,
    placeholder: string,
    submitOnEnter?: boolean,
    onSubmit: (value: string) => void,
    onChange?: (value: string) => void
}

export default function Input({ value, placeholder, submitOnEnter = false, onSubmit, onChange }: PlaceholderProps) {

    const [inputValue, setInputValue] = useState(value ?? '')

    function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        if (submitOnEnter && event.key === 'Enter') {
            submit(event.currentTarget.value)
        }
    }

    function submit(value: string) {
        if (value) {
            onSubmit(value)
            setInputValue('')
            onChange?.('')
        }
    }

    return (
        <div className="h-10 flex flex-row relative items-center">
            <input
                value={inputValue}
                type="text"
                className={`
            bg-primary-700 rounded-lg w-full h-full p-2 ${submitOnEnter ? 'pr-8' : ''}
            focus:outline-0
            `}
                onChange={(e) => {
                    setInputValue(e.target.value)
                    onChange?.(e.target.value)
                }}
                placeholder={placeholder}
                onKeyDown={handleKeyDown}
            >
            </input>
            {
                submitOnEnter &&
                <ArrowTurnDownLeftIcon className="h-6 w-6 absolute right-2 text-secondary-100 cursor-pointer" onClick={() => submit(inputValue)} />
            }
        </div>
    )
}