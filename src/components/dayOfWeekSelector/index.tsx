import { useState, useEffect } from "react"

type DaySelectorProps = {
    selectedDaysProps?: number[],
    onChange?: (days: number[]) => void
}

const DaysOfWeek = [
    'SUN',
    'MON',
    'TUE',
    'WED',
    'THU',
    'FRI',
    'SAT',
]

export default function DayOfWeekSelector({ selectedDaysProps, onChange }: DaySelectorProps) {

    const [selectedDays, setSelectedDay] = useState<number[]>([...selectedDaysProps || []])

    function getStyleByDay(index: number) {
        if (index === 6) return 'rounded-md rounded-s-none'
        else if (index === 0) return 'border-r rounded-md rounded-e-none'
        return 'border-r'
    }

    function selectDay(id: number) {
        setSelectedDay(prev => {
            if (prev.includes(id)) {
                return prev.filter(d => d !== id)
            } else {
                return [...prev, id]
            }
        })
    }


    useEffect(() => {
        onChange?.(selectedDays)
    }, [selectedDays])

    return (
        <div className="flex flex-row border rounded-lg sm:text-sm">
            {DaysOfWeek.map((day, index) =>
                <button
                    translate="no"
                    key={index}
                    type="button"
                    className={`text-center grow p-2 cursor-pointer transition-colors ${getStyleByDay(index)} ${selectedDays.includes(index) ? 'bg-secondary-100 text-primary-600 ' : 'bg-primary-600 text-secondary-100 hover:bg-primary-700'}`}
                    onClick={() => selectDay(index)}
                >
                    {day}
                </button>)}
        </div>
    )
}