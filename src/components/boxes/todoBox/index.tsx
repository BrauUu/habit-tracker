import { CheckIcon, ClockIcon, TrashIcon } from '@heroicons/react/24/solid'
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import type { Todo } from '../../../types/habit'
import type { ModalAction } from '../../../types/modal'
import type { AxiosResponse } from 'axios';

import Button from '../../button'
import { useState } from 'react';
import { useToast } from '../../../hooks/useToast';
interface TodoBoxProps {
    todo: Todo,
    checkTodo?: (id: string, habit: Todo) => Promise<AxiosResponse<Todo> | void> | void
    uncheckTodo?: (id: string, habit: Todo) => Promise<AxiosResponse<Todo> | void> | void
    modalDispatch?: (action: ModalAction) => void
}

interface DragOverlayTodoBoxProps {
    todo: Todo,
}

function isDueDateExpired(dueDate: Date) {
    const today = new Date()
    today.setHours(3, 0, 0, 0)
    return today.getTime() > dueDate.getTime()
}

export function TodoBox({ todo, checkTodo, uncheckTodo, modalDispatch }: TodoBoxProps) {

    const toast = useToast()

    const { id, title, doneDate, dueDate } = todo
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

    async function onCheck() {
        try {
            if (!doneDate) {
                if (checkTodo) {
                    const response = await checkTodo(id, todo)
                    if (response) {
                        if (response.status != 200)
                            throw response.data
                    }
                    toast.todoChecked()
                }
            }
            else {
                if (uncheckTodo) {
                    const response = await uncheckTodo(id, todo)
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
            className={`w-full text-lg rounded-lg bg-primary-600 p-2 flex flex-row cursor-pointer items-center gap-2 min-h-20 shrink-0
                ${doneDate ? 'opacity-50' : 'opacity-100'}
                `}
            onClick={() => {
                if (modalDispatch)
                    modalDispatch({ type: "updateHabit", payload: { ...todo } })
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
                    onCheck()
                }}
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
            >
                {
                    (doneDate || isHover) && <CheckIcon />
                }
            </div>
            <div className='flex flex-col grow min-h-16 justify-between'>
                <div className='flex items-start gap-2 min-w-0'>
                    <p className='grow break-words min-w-0'>
                        {title}
                    </p>
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
                </div>

                {
                    dueDate ?

                        <span className={`flex justify-end flex-row items-center gap-1 text-sm ${isDueDateExpired(new Date(dueDate)) ? 'text-ruby-500' : ''}`}><ClockIcon className='h-4' />{new Date(dueDate).toLocaleDateString()}</span>
                        :
                        undefined
                }

            </div>
        </div>
    )
}

export function DragOverlayTodoBox({ todo }: DragOverlayTodoBoxProps) {

    const { title, doneDate, dueDate } = todo

    return (
        <div
            className={`w-full text-lg rounded-lg p-2 flex flex-row items-center gap-2 opacity-80 cursor-grabbing min-h-20 shrink-0
            ${doneDate ? 'bg-primary-700 *:opacity-50' : 'bg-primary-600'}
            `}
        >
            <div className='h-7 w-7 shrink-0 rounded-sm border border-secondary-100'>
                {
                    doneDate && <CheckIcon />
                }
            </div>
            <div className='flex flex-col grow justify-start min-w-0'>
                <div className='flex items-start gap-2 min-w-0'>
                    <p className='grow break-words min-w-0'>
                        {title}
                    </p>
                    <Button style='h-6 w-6 shrink-0' type='other'>
                        <TrashIcon />
                    </Button>
                </div>
                <div className='flex justify-end items-center gap-1'>
                    {
                        dueDate ?
                            <span className={`flex justify-end flex-row items-center gap-1 text-sm ${isDueDateExpired(new Date(dueDate)) ? 'text-ruby-500' : ''}`}><ClockIcon className='h-4' />{new Date(dueDate).toLocaleDateString()}</span>
                            :
                            undefined
                    }
                </div>
            </div>
        </div>
    )
}