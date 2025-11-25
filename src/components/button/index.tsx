import type { ButtonType } from "../../types/others"

interface ButtonProps {
    text?: string,
    type: ButtonType
    children?: any,
    style?: string,
    action?: () => void,
}

export default function Button({ text, type, children, style, action}: ButtonProps) {

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

    return (
        <button 
        className={`${getStyleByType(type)} ${style} rounded-sm transition-colors`}
        onClick={(e) => {
            e.stopPropagation()
            if(action)
                action()
        }
        }>
            {children ? children : text}
        </button>
    )
}