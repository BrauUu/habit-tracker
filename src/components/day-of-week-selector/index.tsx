import { useState, useEffect } from "react"

type DaySelectorProps = {
  selectedDaysProps: number[],
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

    const [selectedDays, setSelectedDay] = useState<number[]>([...selectedDaysProps])

    function getStyleByDay(index: number) {
        if (index === 6) return 'rounded-md rounded-s-none'
        else if(index === 0) return 'border-r rounded-md rounded-e-none'
        return 'border-r'
    }

    function selectDay(event: React.MouseEvent<HTMLDivElement>) {
        const id = Number(event.currentTarget.dataset.id)
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
        <div className="flex flex-row border rounded-lg">
            {DaysOfWeek.map((day, index) =>
                <div
                    className={`text-center grow p-2 cursor-pointer ${getStyleByDay(index)} ${selectedDays.includes(index) ? 'bg-secondary text-primary-500' : 'bg-primary-500 text-secondary'}`}
                    onClick={selectDay}
                    key={index}
                    data-id={index}
                >
                    {day}
                </div>)}
        </div>
    )
}