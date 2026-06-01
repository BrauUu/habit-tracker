import { useState, type MouseEvent, type ReactNode } from "react"
import type { ButtonType } from "../../types/others"

interface ButtonProps {
    text?: string,
    type: ButtonType
    children?: ReactNode,
    style?: string,
    action?: () => void | Promise<void>,
}

export default function Button({ text, type, children, style, action}: ButtonProps) {
    const [isLoading, setIsLoading] = useState(false)
    const content = children ? children : text

    function getStyleByType(type: ButtonType) {
        switch (type){
        case 'primary':
          return 'bg-secondary-100 text-primary-600 hover:bg-secondary-200 px-1.5 py-0.5'
        case 'secondary':
            return 'hover:bg-primary-700 px-1.5 py-0.5'
        case 'other':
            return 'hover:text-secondary-200'
        }
    }

    async function handleClick(e: MouseEvent<HTMLButtonElement>) {
        e.stopPropagation()

        if (isLoading || !action)
            return

        try {
            const result = action()

            if (result instanceof Promise) {
                setIsLoading(true)
                await result
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <button 
        className={`${getStyleByType(type)} ${style} ${isLoading ? 'bg-secondary-200 cursor-default' : ''} relative inline-flex items-center justify-center rounded-sm transition-colors`}
        onClick={handleClick}
        disabled={isLoading}
        aria-busy={isLoading}
        >
            {isLoading ? (
                <span className="invisible">
                    {content}
                </span>
            ) : content}
            {isLoading && <span className="loader button-loader" />}
        </button>
    )
}
