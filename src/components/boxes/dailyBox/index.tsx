import { CheckIcon, TrashIcon, ForwardIcon } from '@heroicons/react/24/solid'
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import type { Daily } from '../../../types/habit'
import type { ModalAction } from '../../../types/modal'
import type { AxiosResponse } from 'axios';

import Button from '../../button'
import { useState } from 'react';
import { useToast } from '../../../hooks/useToast';

interface HabitBoxProps {
    habit: Daily,
    onlyVisible?: boolean,
    checkDaily?: (id: string, habit: Daily) => Promise<AxiosResponse<Daily> | void> | void
    uncheckDaily?: (id: string, habit: Daily) => Promise<AxiosResponse<Daily> | void> | void
    modalDispatch?: (action: ModalAction) => void
}

interface DragOverlayHabitBoxProps {
    habit: Daily,
}

export function HabitBox({ habit, onlyVisible = true, checkDaily, uncheckDaily, modalDispatch }: HabitBoxProps) {

    const toast = useToast()

    const { id, title, done, daysOfTheWeek, streak } = habit
    const [isHover, setIsHover] = useState<boolean>(false)

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: transition && 'opacity 300ms',
    };

    async function checkHabit() {
        const isChecked = done
        try {
            if (!isChecked) {
                if (checkDaily) {
                    const response = await checkDaily(id, habit)
                    if (response) {
                        if (response.status != 200)
                            throw response.data
                    }
                    toast.habitChecked(habit?.streak)
                }
            }
            else {
                if (uncheckDaily) {
                    const response = await uncheckDaily(id, habit)
                    if (response) {
                        if (response.status != 200)
                            throw response.data
                    }
                }
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error)
            toast.error(errorMessage)
        }
    }

    return (
        <div
            className={`w-full text-lg rounded-lg bg-primary-600 p-2 flex flex-row cursor-pointer items-center gap-2 min-h-20 shrink-0 transition-all
                ${done ? 'opacity-50' : 'opacity-100'}
                `}
            onClick={() => {
                if (modalDispatch)
                    modalDispatch({ type: "updateHabit", payload: { ...habit } })
            }
            }
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            style={style}
        >
            <div
                className={`h-7 w-7 shrink-0 rounded-sm border border-secondary-100 cursor-pointer `}
                onClick={(e) => {
                    e.stopPropagation()
                    checkHabit()
                }}
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
            >
                {
                    (done || isHover) && <CheckIcon />
                }
            </div>
            <div className='flex flex-col grow justify-between min-h-16'>
                <div className=' flex items-start gap-2'>
                    <p className='grow'>
                        {title}
                    </p>
                    {!onlyVisible &&
                        <Button
                            style='h-6 w-6 shrink-0'
                            action={() => {
                                if (modalDispatch)
                                    modalDispatch({ type: 'deleteHabit', payload: { id, title } })
                            }
                            }
                            type='other'
                        >
                            <TrashIcon />
                        </Button>
                    }
                </div>
                <div className='flex justify-end items-center gap-1'>
                    <ForwardIcon className='h-4 w-4' ></ForwardIcon>
                    {streak}
                </div>
            </div>
        </div>
    )
}

export function DragOverlayHabitBox({ habit }: DragOverlayHabitBoxProps) {

    const { title, done, streak } = habit

    return (
        <div
            className={`w-full text-lg rounded-lg  p-2 flex flex-row items-center gap-2 opacity-80 cursor-grabbing min-h-20
            ${done ? 'bg-primary-700 *:opacity-50' : 'bg-primary-600'}
            `}
        >
            <div className='h-7 w-7 shrink-0 rounded-sm border border-secondary-100'>
                {
                    done && <CheckIcon />
                }
            </div>
            <div className='flex flex-col grow justify-between min-h-16'>
                <div className=' flex tems-start gap-2'>
                    <p className='grow'>
                        {title}
                    </p>
                    <Button style='h-6 w-6 shrink-0' type='other'>
                        <TrashIcon />
                    </Button>
                </div>
                <div className='flex justify-end items-center gap-1'>
                    <ForwardIcon className='h-4 w-4' ></ForwardIcon>
                    {streak}
                </div>
            </div>
        </div>
    )
}