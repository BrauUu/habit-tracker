import { CheckIcon, TrashIcon, ForwardIcon } from '@heroicons/react/24/solid'
import type { Habit } from '../../../types/types'
import Modal from '../../modal/default'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import Input from '../../input'
import DayOfWeekSelector from '../../day-of-week-selector'
import Button from '../../button'

interface HabitBoxProps {
    habit: Habit,
    onlyVisible?: boolean,
    updateHabit: (id: string, key: string, value: any) => void,
    deleteHabit: (id: string) => void
}

export default function HabitBox({ habit, updateHabit, deleteHabit, onlyVisible = true }: HabitBoxProps) {

    const { id, title, done, daysOfTheWeek, streak } = habit
    const [showModal, setShowModal] = useState(false)

    const [draft, setDraft] = useState<Habit | null>(null)

    function onUpdateHabit(key: string, value: any) {
        updateHabit(id, key, value)
    }

    function updateHabitTitle(newTitle: any) {
        onUpdateHabit('title', newTitle)
    }

    function updateHabitDays(newTitle: any) {
        onUpdateHabit('daysOfTheWeek', newTitle)
    }

    function openModal() {
        setDraft({ ...habit })
        setShowModal(true)
    }

    function closeModal() {
        setShowModal(false)
        setDraft(null)
    }

    function handleSave() {
        if (!draft) { closeModal(); return }
        if (draft.title !== title) updateHabitTitle(draft.title)
        updateHabitDays(draft.daysOfTheWeek)
        closeModal()
    }

    return (
        <div
            className={`w-full text-lg rounded-lg bg-primary-500 p-2 flex flex-row cursor-pointer items-center gap-2
                ${done ? 'opacity-50' : ''}
                `}
            onClick={() => {
                if (!onlyVisible) {
                    openModal()
                }
            }}
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
                        <Button style='h-6 w-6' action={() => deleteHabit(id)} type='other'>
                            <TrashIcon />
                        </Button>
                    }
                </div>
                <div className='flex justify-end items-center gap-1'>
                    <ForwardIcon className='h-4 w-4' ></ForwardIcon>
                    {streak}
                </div>
            </div>
            {showModal && (
                createPortal(
                    <Modal
                        title={"edit habit"}
                        onClose={closeModal}
                        onSave={handleSave}
                    >
                        <Input
                            value={draft?.title}
                            placeholder='type your habit'
                            onSubmit={(v) => {
                                setDraft(d => d ? { ...d, 'title': v } : d)
                                handleSave()
                            }}
                            onChange={(v) => setDraft(d => d ? { ...d, 'title': v } : d)}
                        />
                        <DayOfWeekSelector
                            selectedDaysProps={draft?.daysOfTheWeek ?? []}
                            onChange={(days) => setDraft(d => d ? { ...d, 'daysOfTheWeek': days } : d)}
                        />
                    </Modal>
                    , document.body)
            )
            }
        </div>
    )
}