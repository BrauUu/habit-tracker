import { useState, useMemo, useReducer } from 'react'
import { v4 as uuidv4 } from 'uuid';

import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay, type DragEndEvent, type DragStartEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';

import type { DailyHabit } from '../types/types'
import { modalReducer } from '../reducers/modalReducer'

import Whiteboard from '../components/whiteboard'
import { HabitBox, DragOverlayHabitBox } from '../components/boxes/habitbox'
import Title from '../components/title'
import Input from '../components/input'
import Filter from '../components/filter'
import NewDayModal from '../components/modal/new-day';
import Modal from '../components/modal/default';
import DayOfWeekSelector from '../components/day-of-week-selector';

interface DailyHabitsSectionProps {
  dailyHabits: DailyHabit[]
  setDailyHabits: (updater: (dailyHabits: DailyHabit[]) => DailyHabit[]) => void
  onUpdateDailyHabit: (id: string, key: string, value: any) => void
  onDeleteDailyHabit: (id: string) => void
  onAddDailyHabit: (habit: DailyHabit) => void
  onResetDailyHabits: () => void
  pendingHabits: string[]
}

export default function DailyHabitsSection({
  dailyHabits,
  setDailyHabits,
  onUpdateDailyHabit,
  onDeleteDailyHabit,
  onAddDailyHabit,
  onResetDailyHabits,
  pendingHabits,
}: DailyHabitsSectionProps) {

  const [dailyHabitFilter, setDailyHabitFilter] = useState<number | null>(1)
  const [dragHabit, setDragHabit] = useState<DailyHabit | null>(null)
  const [modalState, modalDispatch] = useReducer(modalReducer, { type: null })

  const sensors = useSensors(
    useSensor(PointerSensor, {
       activationConstraint: {
        distance: 15,
        delay: 250,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const habitsListFiltered = useMemo(() => {
    if (dailyHabitFilter === 0) return [...dailyHabits]
    if (dailyHabitFilter === 1) return dailyHabits.filter(habit => checkIfItsTodaysHabit(habit))
    return [...dailyHabits]
  }, [dailyHabitFilter, dailyHabits])


  function checkIfItsTodaysHabit(habit: DailyHabit) {
    const today = new Date().getDay()
    return checkHabitByDay(habit, today)
  }

  function checkHabitByDay(habit: DailyHabit, weekDay: number) {
    if (habit?.daysOfTheWeek)
      return habit.daysOfTheWeek.includes(weekDay)
  }

  function createNewHabit(title: string) {
    const newHabit: DailyHabit = {
      'id': uuidv4(),
      'title': title,
      'done': false,
      'streak': 0,
      'order': dailyHabits.length + 1,
      'daysOfTheWeek': [0, 1, 2, 3, 4, 5, 6],
      'type': 'daily'
    }
    modalDispatch({ type: 'createHabit', payload: newHabit })
  }

  function finishHabitCreation() {
    if (modalState.type === 'createHabit' && modalState.data?.habit?.type == 'daily') {
      onAddDailyHabit(modalState.data.habit)
      modalDispatch({ type: 'hideModal' })
    }
  }

  function cancelHabitCreation() {
    modalDispatch({ type: 'hideModal' })
  }

  return (
    <div className='m-16 flex flex-col gap-1 w-full md:w-1/2 lg:w-1/4 max-h-[calc(100%-8rem)]'>
      <div className='flex flex-row justify-between'>
        <Title value='daily habits' />
        <Filter value={dailyHabitFilter} onChange={setDailyHabitFilter} />
      </div>
      <DndContext
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        sensors={sensors}
        collisionDetection={closestCenter}
      >
        <SortableContext
          items={dailyHabits}
          
        >
          <Whiteboard>
            <Input placeholder='add habit' onSubmit={createNewHabit} submitOnEnter={true}></Input>
            {
              habitsListFiltered.map((habit) => (
                <HabitBox key={habit.id} habit={habit} updateHabit={onUpdateDailyHabit} deleteHabit={onDeleteDailyHabit} onlyVisible={false} />
              ))
            }
          </Whiteboard>
        </SortableContext>
        <DragOverlay>
          {dragHabit &&
            <DragOverlayHabitBox key={dragHabit?.id} habit={dragHabit} />
          }
        </DragOverlay>
      </DndContext>
      {
        pendingHabits.length > 0 &&
        <NewDayModal title='check yesterday habits' onStart={onResetDailyHabits}>
          {dailyHabits.filter(habit => pendingHabits.includes(habit.id))
            .map(habit => (
              <HabitBox key={habit.id} habit={habit} updateHabit={onUpdateDailyHabit} deleteHabit={onDeleteDailyHabit}/>
            ))}
        </NewDayModal>
      }
      {
        modalState.type === 'createHabit' && modalState.data?.habit &&
        <Modal
          title={"create daily habit"}
          onClose={cancelHabitCreation}
          onSave={finishHabitCreation}
        >

          <Input
            value={modalState.data.habit.title}
            placeholder='type your habit'
            onSubmit={(v) => {
              modalDispatch({ type: 'updateHabit', payload: { title: v } })
            }}
            onChange={(v) => modalDispatch({ type: 'updateHabit', payload: { title: v } })}
          />
          <DayOfWeekSelector
            selectedDaysProps={modalState.data.habit.daysOfTheWeek || []}
            onChange={(days) => modalDispatch({ type: 'updateHabit', payload: { daysOfTheWeek: days } })}
          />
        </Modal>
      }
    </div >
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setDailyHabits((dailyHabits) => {
        const oldIndex = dailyHabits.findIndex(h => h.id === active.id);
        const newIndex = dailyHabits.findIndex(h => h.id === over?.id);

        return arrayMove(dailyHabits, oldIndex, newIndex);
      });
    }
  }

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const habit = dailyHabits.find(h => h.id === active.id) ?? null;
    setDragHabit(habit);
  }
}
