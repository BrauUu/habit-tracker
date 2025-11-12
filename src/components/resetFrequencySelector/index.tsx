import type { resetFrequencyType } from "../../types/others"

interface ResetFrequencySelectorProps {
    resetFrequency: resetFrequencyType
    onChange: (resetFrequency: resetFrequencyType) => void
}

export default function ResetFrequencySelector({ resetFrequency, onChange }: ResetFrequencySelectorProps) {

    // Usa a constante importada - totalmente dinâmico e type-safe
    const options : resetFrequencyType[] = ["daily", "weekly"]

    return (
        <div className="flex flex-row border rounded-lg overflow-hidden">
            {options.map(option => (
                <button
                    key={option}
                    type="button"
                    onClick={() => onChange(option)}
                    className={`
                        flex grow p-2 justify-center cursor-pointer transition-colors
                        ${resetFrequency === option 
                            ? 'bg-secondary-100 text-primary-600' 
                            : 'text-secondary-100 hover:bg-primary-700'
                        }
                    `}
                >
                    {option}
                </button>
            ))}
        </div>
    )
}