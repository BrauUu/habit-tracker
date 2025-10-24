import type { ButtonType } from "../../types"

interface ButtonProps {
    text?: string,
    type: ButtonType
    children?: any,
    style?: string,
    action: () => void,
}

export default function Button({ text, type, children, style, action}: ButtonProps) {

    function getStyleByType(type: ButtonType) {
        switch (type){
        case 'primary':
          return 'px-1.5 py-0.5 rounded-sm bg-secondary text-primary-500'
        case 'other':
            return ''
        }
    }

    return (
        <button 
        className={`${getStyleByType(type)} ${style}`}
        onClick={(e) => {
            e.stopPropagation()
            action()
        }
        }>
            {children ? children : text}
        </button>
    )
}