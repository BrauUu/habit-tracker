import { useState, useReducer, type ReactNode } from 'react'
import { v4 as uuidv4 } from 'uuid';

import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay, type DragEndEvent, type DragStartEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';

import type { Habit } from '../types/habit'
import type { ModalAction } from '../types/modal'
import { modalReducer } from '../reducers/modalReducer'

import Whiteboard from '../components/whiteboard'
import Title from '../components/title'
import Input from '../components/input'
import Modal from '../components/modal/default';
import { useToast } from '../hooks/useToast';
import type { AxiosResponse } from 'axios';


interface HabitSectionProps<HabitType extends Habit> {
    title: string
    habits: HabitType[]
    setHabits: (updater: (habits: HabitType[]) => HabitType[]) => void
    onUpdateHabit: (id: string, habit: HabitType) => Promise<AxiosResponse<HabitType> | void>
    onUpdateHabitState: (id: string, habit: HabitType) => void
    onDeleteHabit: (id: string) => Promise<AxiosResponse | void>
    onAddHabit: (habit: HabitType) => Promise<AxiosResponse<HabitType> | void>
    createDefaultHabit: (id: string, title: string) => Partial<HabitType>
    validateHabit: (habit: HabitType) => boolean
    renderHabitBox: (habit: HabitType, updateHabit: (id: string, habit: HabitType) => Promise<AxiosResponse<HabitType> | void> | void, modalDispatch: React.Dispatch<ModalAction>) => ReactNode
    renderDragOverlay: (habit: HabitType) => ReactNode
    renderModalFields?: (habit: HabitType, modalDispatch: React.Dispatch<ModalAction>) => ReactNode
    withoutContent: { icon: React.ComponentType<React.SVGProps<SVGSVGElement>>, title: string, text: string }
    headerExtra?: ReactNode
    footerExtra?: ReactNode
    contentExtra?: ReactNode
}

export default function HabitSection<HabitType extends Habit>({
    title,
    habits,
    setHabits,
    onUpdateHabit,
    onUpdateHabitState,
    onDeleteHabit,
    onAddHabit,
    createDefaultHabit,
    validateHabit,
    renderHabitBox,
    renderDragOverlay,
    renderModalFields,
    headerExtra,
    footerExtra,
    contentExtra,
    withoutContent
}: HabitSectionProps<HabitType>) {

    const toast = useToast()

    const [dragHabit, setDragHabit] = useState<HabitType | null>(null)
    const [modalState, modalDispatch] = useReducer(modalReducer, { type: null })

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 15,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function createNewHabit(title: string) {
        const newHabit = createDefaultHabit(uuidv4(), title)
        modalDispatch({ type: 'createHabit', payload: newHabit as HabitType })
    }

    async function finishHabitCreation() {
        const habit = modalState.data?.habit as HabitType
        if (!habit) return

        if (modalState.type === 'createHabit') {
            if (!validateHabit(habit)) return

            try {
                const response = await onAddHabit(habit)

                if (response) {
                    if (response.status != 201)
                        throw response.data
                }

                toast.habitCreated()
                closeModal()

            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error)
                toast.error(errorMessage)
            }
        }
    }

    async function deleteHabit() {
        const id = modalState.data?.habit?.id

        try {
            const response = await onDeleteHabit(id)

            if (response) {
                if (response.status != 200)
                    throw new Error()
            }

            toast.habitDeleted()
            closeModal()

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error)
            toast.error(errorMessage)
        }
    }

    function cancelHabitCreation() {
        modalDispatch({ type: 'hideModal' })
    }

    async function handleUpdate() {
        const habit = modalState.data?.habit as HabitType
        if (!habit) return

        if (!validateHabit(habit)) return

        try {
            const response = await onUpdateHabit(habit.id, habit)

            if (response) {
                if (response.status != 200)
                    throw new Error()
            }

            toast.habitUpdated()
            closeModal()

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error)
            toast.error(errorMessage)
        }
    }

    function closeModal() {
        modalDispatch({ type: "hideModal" })
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (active.id !== over?.id) {
            setHabits((habits) => {
                const oldIndex = habits.findIndex(h => h.id === active.id);
                const newIndex = habits.findIndex(h => h.id === over?.id);
                return arrayMove(habits, oldIndex, newIndex);
            });
        }

        setDragHabit(null);
        document.body.classList.remove('dragging');
    }

    function handleDragStart(event: DragStartEvent) {
        const { active } = event;
        const habit = habits.find(h => h.id === active.id) ?? null;
        setDragHabit(habit);
        document.body.classList.add('dragging');
    }

    return (
        <div className='flex flex-col gap-1 w-full h-full'>
            <div className='flex flex-row justify-between'>
                <Title value={title} />
                {headerExtra}
            </div>
            <DndContext
                onDragEnd={handleDragEnd}
                onDragStart={handleDragStart}
                sensors={sensors}
                collisionDetection={closestCenter}
            >
                <SortableContext
                    items={habits.map(h => h.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <Whiteboard>
                        <div>
                            <Input placeholder={`add ${title}`} onSubmit={createNewHabit} submitOnEnter={true} />
                        </div>
                        {habits.length ?
                            <>
                                {contentExtra}
                                <div className='overflow-y-auto flex flex-col gap-2' translate="no">
                                    {habits.map((habit) => renderHabitBox(habit, onUpdateHabitState, modalDispatch))}
                                </div>
                            </>
                            :
                            <div className='flex flex-1 justify-center items-center text-center flex-col text-secondary-300 px-5'>
                                <withoutContent.icon className='h-8 w-8' />
                                <p className='text-sm font-semibold mt-2'>{withoutContent.title}</p>
                                <p className='text-xs'>{withoutContent.text}</p>
                            </div>
                        }
                    </Whiteboard>
                </SortableContext>
                <DragOverlay>
                    {dragHabit && renderDragOverlay(dragHabit)}
                </DragOverlay>
            </DndContext>

            {footerExtra}

            {modalState.type === 'createHabit' && modalState.data?.habit && (
                <Modal
                    title={`create ${title} habit`}
                    onClose={cancelHabitCreation}
                    onConfirm={finishHabitCreation}
                >
                    <Input
                        value={modalState.data.habit.title}
                        placeholder='type your habit'
                        onSubmit={(v) => modalDispatch({ type: 'updateHabit', payload: { title: v } })}
                        onChange={(v) => modalDispatch({ type: 'updateHabit', payload: { title: v } })}
                    />
                    {renderModalFields?.(modalState.data.habit as HabitType, modalDispatch)}
                </Modal>
            )}

            {modalState.type === 'updateHabit' && modalState.data?.habit && (
                <Modal
                    title={`edit habit`}
                    onClose={closeModal}
                    onConfirm={handleUpdate}
                >
                    <Input
                        value={modalState.data.habit.title}
                        placeholder='type your habit'
                        onSubmit={(v) => modalDispatch({ type: 'updateHabit', payload: { title: v } })}
                        onChange={(v) => modalDispatch({ type: 'updateHabit', payload: { title: v } })}
                    />
                    {renderModalFields?.(modalState.data.habit as HabitType, modalDispatch)}
                </Modal>
            )}

            {modalState.type === 'deleteHabit' && modalState.data?.habit && (
                <Modal
                    title="delete habit"
                    onClose={closeModal}
                    onConfirm={deleteHabit}
                    confirmButtonText="delete"
                >
                    <p>are you sure you want to delete <strong>{modalState.data.habit.title}</strong>?</p>
                </Modal>
            )}
        </div>
    )
}
