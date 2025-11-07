import { CheckIcon, TrashIcon, ForwardIcon } from '@heroicons/react/24/solid'
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useReducer } from 'react'
import { createPortal } from 'react-dom'

import type { Habit } from '../../../types/types'
import { modalReducer } from '../../../reducers/modalReducer'

import Modal from '../../modal/default'
import Input from '../../input'
import DayOfWeekSelector from '../../day-of-week-selector'
import Button from '../../button'

interface HabitBoxProps {
    habit: Habit,
    onlyVisible?: boolean,
    updateHabit: (id: string, key: string, value: any) => void,
    deleteHabit: (id: string) => void
}

interface DragOverlayHabitBoxProps {
    habit: Habit,
}

export function HabitBox({ habit, updateHabit, deleteHabit, onlyVisible = true }: HabitBoxProps) {

    const { id, title, done, daysOfTheWeek, streak } = habit

    const [modalState, modalDispatch] = useReducer(modalReducer, { type: null })

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


    function onUpdateHabit(key: string, value: any) {
        updateHabit(id, key, value)
    }

    function updateHabitTitle(newTitle: string) {
        onUpdateHabit('title', newTitle)
    }

    function updateHabitDays(newDays: number[]) {
        onUpdateHabit('daysOfTheWeek', newDays)
    }

    function openModal() {
        modalDispatch({ type: "updateHabit", payload: { daysOfTheWeek: daysOfTheWeek, title: title } })
    }

    function closeModal() {
        modalDispatch({ type: "hideModal" })
    }

    function handleSave() {
        if (modalState.data?.habit?.title) {
            updateHabitTitle(modalState.data.habit.title)
        }
        if (modalState.data?.habit?.daysOfTheWeek) {
            updateHabitDays(modalState.data.habit.daysOfTheWeek)
        }
        closeModal()
    }

    function onDeleteHabit() {
        deleteHabit(id)
    }

    return (
        <div
            className={`w-full text-lg rounded-lg bg-primary-500 p-2 flex flex-row cursor-pointer items-center gap-2
                ${done ? 'opacity-50' : ''}
                `}
            onClick={() => !onlyVisible ? openModal() : undefined}
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            style={style}
        >
            <div className='h-7 w-7 shrink-0 rounded-sm border border-secondary cursor-pointer' onClick={(e) => {
                e.stopPropagation()
                onUpdateHabit("streak", !done ? streak + 1 : streak - 1)
                onUpdateHabit("done", !done)
            }}>
                {
                    done && <CheckIcon />
                }
            </div>
            <div className='flex flex-col grow'>
                <div className=' flex items-center justify-between gap-2'>
                    <p className='grow'>
                        {title}
                    </p>
                    {!onlyVisible &&
                        <Button style='h-6 w-6' action={() => modalDispatch({ type: 'deleteHabit' })} type='other'>
                            <TrashIcon />
                        </Button>
                    }
                </div>
                <div className='flex justify-end items-center gap-1'>
                    <ForwardIcon className='h-4 w-4' ></ForwardIcon>
                    {streak}
                </div>
            </div>
            {modalState.type === 'updateHabit' && modalState.data?.habit && (
                createPortal(
                    <Modal
                        title={"edit habit"}
                        onClose={closeModal}
                        onSave={handleSave}
                    >
                        <Input
                            value={modalState.data.habit.title}
                            placeholder='type your habit'
                            onSubmit={(v) => {
                                modalDispatch({ type: 'updateHabit', payload: { title: v } })
                                handleSave()
                            }}
                            onChange={(v) => modalDispatch({ type: 'updateHabit', payload: { title: v } })}
                        />
                        <DayOfWeekSelector
                            selectedDaysProps={modalState.data.habit.daysOfTheWeek ?? []}
                            onChange={(days) => modalDispatch({ type: 'updateHabit', payload: { daysOfTheWeek: days } })}
                        />
                    </Modal>
                    , document.body)
            )
            }
            {
                modalState.type === 'deleteHabit' &&
                createPortal(
                    <Modal
                        title={"delete habit"}
                        onClose={closeModal}
                        onSave={onDeleteHabit}
                        confirmButtonText={"delete"}
                    >
                        <p>are you sure you want to delete the habit <strong>{title}</strong> ?</p>
                    </Modal>
                    , document.body)
            }
        </div>
    )
}

export function DragOverlayHabitBox({ habit }: DragOverlayHabitBoxProps) {

    const { title, done, streak } = habit

    return (
        <div className={`w-full text-lg rounded-lg bg-primary-500 p-2 flex flex-row cursor-pointer items-center gap-2 opacity-80`}>
            <div className='h-7 w-7 shrink-0 rounded-sm border border-secondary cursor-pointer'>
                {
                    done && <CheckIcon />
                }
            </div>
            <div className='flex flex-col grow'>
                <div className=' flex items-center justify-between gap-2'>
                    <p className='grow'>
                        {title}
                    </p>
                    <Button style='h-6 w-6' type='other'>
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