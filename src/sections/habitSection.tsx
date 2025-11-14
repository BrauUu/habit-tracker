import { useState, useReducer, useMemo, type ReactNode } from 'react'
import { v4 as uuidv4 } from 'uuid';

import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay, type DragEndEvent, type DragStartEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';

import type { DailyHabit, IncrementalHabit, Todo } from '../types/habit'
import type { ModalAction } from '../types/modal'
import { modalReducer } from '../reducers/modalReducer'

import Whiteboard from '../components/whiteboard'
import Title from '../components/title'
import Input from '../components/input'
import Modal from '../components/modal/default';
import { useToast } from '../hooks/useToast';

type Habit = DailyHabit | IncrementalHabit | Todo

interface HabitSectionProps<HabitType extends Habit> {
    title: string
    habits: HabitType[]
    setHabits: (updater: (habits: HabitType[]) => HabitType[]) => void
    onUpdateHabit: (id: string, key: string, value: any) => void
    onDeleteHabit: (id: string) => void
    onAddHabit: (habit: HabitType) => void
    createDefaultHabit: (id: string, title: string) => HabitType
    validateHabit: (habit: HabitType) => boolean
    renderHabitBox: (habit: HabitType, updateHabit: (id: string, key: string, value: any) => void, modalDispatch: React.Dispatch<ModalAction>) => ReactNode
    renderDragOverlay: (habit: HabitType) => ReactNode
    renderModalFields?: (habit: HabitType, modalDispatch: React.Dispatch<ModalAction>) => ReactNode
    headerExtra?: ReactNode
    footerExtra?: ReactNode
    contentExtra?: ReactNode
}

export default function HabitSection<HabitType extends Habit>({
    title,
    habits,
    setHabits,
    onUpdateHabit,
    onDeleteHabit,
    onAddHabit,
    createDefaultHabit,
    validateHabit,
    renderHabitBox,
    renderDragOverlay,
    renderModalFields,
    headerExtra,
    footerExtra,
    contentExtra
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

    const templateHabit = useMemo(() => {
        return createDefaultHabit('___tmp_id___', '')
    }, [createDefaultHabit])

    function createNewHabit(title: string) {
        const newHabit = createDefaultHabit(uuidv4(), title)
        modalDispatch({ type: 'createHabit', payload: newHabit })
    }

    function finishHabitCreation() {
        const habit = modalState.data?.habit as HabitType
        if (!habit) return

        if (modalState.type === 'createHabit') {
            if (!validateHabit(habit)) return
            onAddHabit(habit)
            toast.habitCreated()
            closeModal()
        }
    }

    function cancelHabitCreation() {
        modalDispatch({ type: 'hideModal' })
    }

    function handleSave() {
        const habit = modalState.data?.habit as HabitType
        if (!habit) return

        if (!validateHabit(habit)) return

        Object.entries(habit).forEach(([key, value]) => {
            if (key == 'id' || key == 'type') return
            onUpdateHabit(habit.id, key, value)
        })

        toast.habitUpdated()
        closeModal()
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
                            <Input placeholder={`add ${templateHabit.type}`} onSubmit={createNewHabit} submitOnEnter={true} />
                        </div>
                        {contentExtra}
                        <div className='overflow-y-auto flex flex-col gap-2 '>
                            {habits.map((habit) => renderHabitBox(habit, onUpdateHabit, modalDispatch))}
                        </div>
                    </Whiteboard>
                </SortableContext>
                <DragOverlay>
                    {dragHabit && renderDragOverlay(dragHabit)}
                </DragOverlay>
            </DndContext>

            {footerExtra}

            {modalState.type === 'createHabit' && modalState.data?.habit && (
                <Modal
                    title={`create ${modalState.data?.habit?.type} habit`}
                    onClose={cancelHabitCreation}
                    onSave={finishHabitCreation}
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
                    onSave={handleSave}
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
                    onSave={() => {
                        if (modalState.data?.habit?.id) {
                            onDeleteHabit(modalState.data.habit.id)
                            toast.habitDeleted()
                        }
                        closeModal()
                    }}
                    confirmButtonText="delete"
                >
                    <p>are you sure you want to delete the habit <strong>{modalState.data.habit.title}</strong>?</p>
                </Modal>
            )}
        </div>
    )
}
