import { PlusIcon, MinusIcon, TrashIcon } from '@heroicons/react/24/solid'
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import type { IncrementalHabit } from '../../../types/habit'
import type { ModalAction } from '../../../types/modal'

import Button from '../../button'
interface IncrementalHabitBoxProps {
    habit: IncrementalHabit,
    onlyVisible?: boolean,
    updateHabit: (id: string, key: string, value: any) => void,
    modalDispatch?: (action: ModalAction) => void
}

interface DragOverlayIncrementalHabitBoxProps {
    habit: IncrementalHabit,
}

export function IncrementalHabitBox({ habit, onlyVisible = true, updateHabit, modalDispatch }: IncrementalHabitBoxProps) {

    const { id, title, resetFrequency, positiveCount, negativeCount, type } = habit

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
    // const percentage = positiveCount + negativeCount > 0 
    //     ? Math.round((positiveCount / (positiveCount + negativeCount)) * 100) 
    //     : 0;

    return (
        <div
            className={`w-full text-lg rounded-lg bg-primary-600 p-2 flex flex-row cursor-pointer items-center gap-2`}
            onClick={() => {
                if (modalDispatch)
                    modalDispatch({ type: "updateHabit", payload: { id, title, resetFrequency, type } })
            }}
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            style={style}
        >
            <div className='flex flex-col gap-1 shrink-0'>
                <button
                    className='h-7 w-7 rounded-sm flex bg-emerald-400 items-center justify-center transition-colors'
                    onClick={(e) => {
                        e.stopPropagation()
                        updateHabit(id, "positiveCount", positiveCount + 1)
                    }}
                >
                    <PlusIcon className='h-5 w-5' />
                </button>
                <button
                    className='h-7 w-7 rounded-sm flex bg-ruby-500 items-center justify-center transition-colors'
                    onClick={(e) => {
                        e.stopPropagation()
                        updateHabit(id, "negativeCount", negativeCount + 1)
                    }}
                >
                    <MinusIcon className='h-5 w-5' />
                </button>
            </div>

            <div className='flex flex-col grow gap-1'>
                <div className='flex items-start gap-2'>
                    <p className='grow'>
                        {title}
                    </p>
                    {!onlyVisible &&
                        <Button
                            style='h-6 w-6 shrink-0'
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
                        <span className='text-emerald-400'>+{positiveCount}</span>
                        <span className='text-secondary/50'>/</span>
                        <span className='text-ruby-500'>-{negativeCount}</span>
                    </div>
                    <span className='text-secondary/50'>•</span>
                    <span className={`font-bold ${total >= 0 ? 'text-emerald-400' : 'text-ruby-500'}`}>
                        {total >= 0 ? '+' : ''}{total}
                    </span>
                </div>
            </div>
        </div>
    )
}

export function DragOverlayIncrementalHabitBox({ habit }: DragOverlayIncrementalHabitBoxProps) {

    const { title, positiveCount, negativeCount } = habit
    const total = positiveCount - negativeCount;
    // const percentage = positiveCount + negativeCount > 0 
    //     ? Math.round((positiveCount / (positiveCount + negativeCount)) * 100) 
    //     : 0;

    return (
        <div className={`w-full text-lg rounded-lg bg-primary-600 p-2 flex flex-row items-center gap-2 opacity-80 cursor-grabbing`}>
            <div className='flex flex-col gap-1 shrink-0'>
                <div className='h-7 w-7 rounded-sm flex bg-emerald-400 items-center justify-center'>
                    <PlusIcon className='h-5 w-5' />
                </div>
                <div className='h-7 w-7 rounded-sm flex bg-ruby-500 items-center justify-center'>
                    <MinusIcon className='h-5 w-5' />
                </div>
            </div>

            <div className='flex flex-col grow gap-1'>
                <div className='flex items-start gap-2'>
                    <p className='grow'>
                        {title}
                    </p>
                    <Button style='h-6 w-6 shrink-0' type='other'>
                        <TrashIcon />
                    </Button>
                </div>

                 <div className='flex items-center gap-2 text-sm'>
                    <div className='flex items-center gap-1'>
                        <span className='text-emerald-400'>+{positiveCount}</span>
                        <span className='text-secondary/50'>/</span>
                        <span className='text-ruby-500'>-{negativeCount}</span>
                    </div>
                    <span className='text-secondary/50'>•</span>
                    <span className={`font-bold ${total >= 0 ? 'text-emerald-400' : 'text-ruby-500'}`}>
                        {total >= 0 ? '+' : ''}{total}
                    </span>
                </div>
            </div>
        </div>
    )
}
