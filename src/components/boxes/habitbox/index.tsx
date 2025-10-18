import { CheckIcon, TrashIcon } from '@heroicons/react/24/solid'
import type { Habit } from '../../../types'

interface HabitBoxProps {
    habit: Habit
    updateHabit: (id: string, key: string, value: any) => void,
    deleteHabit: (id: string) => void
}

export default function HabitBox({ habit, updateHabit, deleteHabit } : HabitBoxProps) {

    const { id, description, done } = habit

    function onUpdateHabit(key: string, value: any) {
        updateHabit(id, key, value)
    }

    return (
        <div 
            className={`w-full text-lg rounded-lg bg-primary-500 p-2 flex items-center justify-between gap-2
                ${done ? 'opacity-50' : ''}
                `}
        >
            <div className='h-6 w-6 shrink-0 rounded-sm border border-secondary cursor-pointer' onClick={() => onUpdateHabit("done", !done)}>
                {
                    done ? <CheckIcon/> : <></>
                }
            </div>
            <p className='grow'>
                {description}
            </p>
            <button className='h-6 w-6 cursor-pointer' onClick={() => deleteHabit(id)}>
                <TrashIcon/>
            </button>
        </div>
    )
}