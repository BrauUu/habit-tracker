import { useEffect, useState, useRef } from "react";
import { DayPicker } from "react-day-picker";
import { CalendarIcon } from "@heroicons/react/24/solid";
import "react-day-picker/style.css";

interface DatePickerProps {
    date: Date | null,
    placeholder?: string
    onChange: (date: Date | null) => void
}

export default function DatePicker({ date, placeholder, onChange }: DatePickerProps) {

    const [selectedDate, setSelectedDate] = useState<Date | null>(date);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        onChange?.(selectedDate)
    }, [selectedDate])

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsDatePickerOpen(false)
            }
        }

        if (isDatePickerOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isDatePickerOpen])

    const handleDateSelect = (date: Date | undefined) => {
        setSelectedDate(date || null)
        setIsDatePickerOpen(false)
    }

    return (
        <div className="w-full relative" ref={containerRef}>
            <button
                type="button"
                className="bg-primary-700 rounded-lg w-full h-10 px-3 py-2 flex items-center justify-between gap-2 outline-none"
                onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
            >
                <span className={selectedDate ? 'text-secondary-100' : 'text-secondary-100/50'}>
                    {selectedDate ? new Date(selectedDate).toLocaleDateString() : placeholder}
                </span>
                <CalendarIcon className="h-5 w-5 text-secondary-100" />
            </button>
            
            {isDatePickerOpen && (
                <div className="absolute z-50 pt-2 pb-36 lg:py-2">
                    <DayPicker
                        required
                        animate
                        mode="single"
                        selected={selectedDate || undefined}
                        onSelect={handleDateSelect}
                        className="p-3 bg-primary-800 rounded-lg"
                    />
                </div>
            )}
        </div>
    );
}