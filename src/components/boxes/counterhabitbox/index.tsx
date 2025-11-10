import { PlusIcon, MinusIcon, TrashIcon } from '@heroicons/react/24/solid'
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import type { CounterHabit, ModalAction } from '../../../types/types'

import Button from '../../button'

interface CounterHabitBoxProps {
    habit: CounterHabit,
    onlyVisible?: boolean,
    updateHabit: (id: string, key: string, value: any) => void,
    modalDispatch?: (action: ModalAction) => void
}

interface DragOverlayCounterHabitBoxProps {
    habit: CounterHabit,
}

export function CounterHabitBox({ habit, onlyVisible = true, updateHabit, modalDispatch }: CounterHabitBoxProps) {

    const { id, title, positiveCount, negativeCount } = habit

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const total = positiveCount - negativeCount;
    const percentage = positiveCount + negativeCount > 0 
        ? Math.round((positiveCount / (positiveCount + negativeCount)) * 100) 
        : 0;

    return (
        <div
            className={`w-full text-lg rounded-lg bg-primary-500 p-2 flex flex-row cursor-grab active:cursor-grabbing items-center gap-2`}
            onClick={() => {
                if (modalDispatch)
                    modalDispatch({ type: "updateHabit", payload: { id, title } })
            }}
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            style={style}
        >
            <div className='flex flex-col gap-1 shrink-0'>
                <button 
                    className='h-7 w-7 rounded-sm bg-green-600 hover:bg-green-700 flex items-center justify-center transition-colors' 
                    onClick={(e) => {
                        e.stopPropagation()
                        updateHabit(id, "positiveCount", positiveCount + 1)
                    }}
                >
                    <PlusIcon className='h-5 w-5' />
                </button>
                <button 
                    className='h-7 w-7 rounded-sm bg-red-600 hover:bg-red-700 flex items-center justify-center transition-colors' 
                    onClick={(e) => {
                        e.stopPropagation()
                        updateHabit(id, "negativeCount", negativeCount + 1)
                    }}
                >
                    <MinusIcon className='h-5 w-5' />
                </button>
            </div>
            
            <div className='flex flex-col grow gap-1'>
                <div className='flex items-center justify-between gap-2'>
                    <p className='grow'>
                        {title}
                    </p>
                    {!onlyVisible &&
                        <Button
                            style='h-6 w-6'
                            action={() => {
                                if (modalDispatch)
                                    modalDispatch({ type: 'deleteHabit', payload: { id, title } })
                            }}
                            type='other'
                        >
                            <TrashIcon />
                        </Button>
                    }
                </div>
                
                <div className='flex items-center gap-2 text-sm'>
                    <div className='flex items-center gap-1'>
                        <span className='text-green-400'>+{positiveCount}</span>
                        <span className='text-secondary/50'>/</span>
                        <span className='text-red-400'>-{negativeCount}</span>
                    </div>
                    <span className='text-secondary/50'>•</span>
                    <span className={`font-bold ${total >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {total >= 0 ? '+' : ''}{total}
                    </span>
                    <span className='text-secondary/50'>•</span>
                    <span className='text-secondary/70'>{percentage}%</span>
                </div>
            </div>
        </div>
    )
}

export function DragOverlayCounterHabitBox({ habit }: DragOverlayCounterHabitBoxProps) {

    const { title, positiveCount, negativeCount } = habit
    const total = positiveCount - negativeCount;
    const percentage = positiveCount + negativeCount > 0 
        ? Math.round((positiveCount / (positiveCount + negativeCount)) * 100) 
        : 0;

    return (
        <div className={`w-full text-lg rounded-lg bg-primary-500 p-2 flex flex-row items-center gap-2 opacity-80 cursor-grabbing`}>
            <div className='flex flex-col gap-1 shrink-0'>
                <div className='h-7 w-7 rounded-sm bg-green-600 flex items-center justify-center'>
                    <PlusIcon className='h-5 w-5' />
                </div>
                <div className='h-7 w-7 rounded-sm bg-red-600 flex items-center justify-center'>
                    <MinusIcon className='h-5 w-5' />
                </div>
            </div>
            
            <div className='flex flex-col grow gap-1'>
                <div className='flex items-center justify-between gap-2'>
                    <p className='grow'>
                        {title}
                    </p>
                    <Button style='h-6 w-6' type='other'>
                        <TrashIcon />
                    </Button>
                </div>
                
                <div className='flex items-center gap-2 text-sm'>
                    <div className='flex items-center gap-1'>
                        <span className='text-green-400'>+{positiveCount}</span>
                        <span className='text-secondary/50'>/</span>
                        <span className='text-red-400'>-{negativeCount}</span>
                    </div>
                    <span className='text-secondary/50'>•</span>
                    <span className={`font-bold ${total >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {total >= 0 ? '+' : ''}{total}
                    </span>
                    <span className='text-secondary/50'>•</span>
                    <span className='text-secondary/70'>{percentage}%</span>
                </div>
            </div>
        </div>
    )
}
