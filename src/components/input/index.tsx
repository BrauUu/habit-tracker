import { ArrowTurnDownLeftIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"
import { useState } from "react"

interface PlaceholderProps {
    value?: string,
    placeholder: string,
    submitOnEnter?: boolean,
    type?: React.InputHTMLAttributes<HTMLInputElement>['type'],
    onSubmit: (value: string) => void,
    onChange?: (value: string) => void,
    style?: string
}

export default function Input({ value, placeholder, submitOnEnter = false, type = 'text', onSubmit, onChange, style }: PlaceholderProps) {

    const [inputValue, setInputValue] = useState(value ?? '')
    const [currentType, setCurrentType] = useState(type)

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

    function getCurrentEyeIcon() {
        return currentType == 'text' ? <EyeIcon className="h-6 w-6" /> : <EyeSlashIcon className="h-6 w-6" />
    }

    function changeCurrentInputType() {
        if (currentType == 'password')
            setCurrentType('text')
        else
            setCurrentType('password')
    }

    return (
        <div className="h-10 flex flex-row relative items-center">
            <input
                value={inputValue}
                type={currentType}
                className={` ${style} 
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
            {
                type == 'password' && <div className="absolute right-2 text-secondary-100 cursor-pointer" onClick={changeCurrentInputType}>{getCurrentEyeIcon()}</div>
            }
        </div>
    )
}