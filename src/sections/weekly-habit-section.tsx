import { useState, useReducer } from 'react'
import { v4 as uuidv4 } from 'uuid';

import type { Habit, WeeklyHabit } from '../types/types'
import { modalReducer } from '../reducers/modalReducer'

import Whiteboard from '../components/whiteboard'
import HabitBox from '../components/boxes/habitbox'
import Title from '../components/title'
import Input from '../components/input'
import Modal from '../components/modal/default';
import NewDayModal from '../components/modal/new-day';

interface WeeklyHabitsSectionProps {
  weeklyHabits: WeeklyHabit[]
  onUpdateWeeklyHabit: (id: string, key: string, value: any) => void
  onDeleteWeeklyHabit: (id: string) => void
  onAddWeeklyHabit: (habit: Habit) => void
  onResetWeeklyHabits: () => void
  pendingHabits?: string[]
}

export default function WeeklyHabitsSection({
  weeklyHabits, 
  onUpdateWeeklyHabit, 
  onDeleteWeeklyHabit, 
  onAddWeeklyHabit,
  onResetWeeklyHabits,
  pendingHabits = []
}: WeeklyHabitsSectionProps) {

  const [modalState, modalDispatch] = useReducer(modalReducer, { type: null })

  function createNewHabit(title: string) {
    const newHabit: WeeklyHabit = {
      'id': uuidv4(),
      'title': title,
      'done': false,
      'streak': 0,
      'type': 'weekly'
    }
    modalDispatch({ type: 'createHabit', payload: newHabit })
  }

  function finishHabitCreation() {
    if (modalState.type === 'createHabit' && modalState.data?.habit) {
      onAddWeeklyHabit(modalState.data.habit)
      modalDispatch({ type: 'hideModal' })
    }
  }

  function cancelHabitCreation() {
    modalDispatch({ type: 'hideModal' })
  }

  return (
      <div className='m-16 flex flex-col gap-1 w-full md:w-1/2 lg:w-1/4'>
        <div className='flex flex-row justify-between'>
          <Title value='weekly habits' />
        </div>
        <Whiteboard>
          <Input placeholder='add habit' onSubmit={createNewHabit} submitOnEnter={true}></Input>
          {
            weeklyHabits.map((habit) => (
              <HabitBox key={habit.id} habit={habit} updateHabit={onUpdateWeeklyHabit} deleteHabit={onDeleteWeeklyHabit} onlyVisible={false} />
            ))
          }
        </Whiteboard>
        {
          pendingHabits.length > 0 &&
          <NewDayModal title='check yesterday habits' onStart={onResetWeeklyHabits}>
            {weeklyHabits.filter(habit => pendingHabits.includes(habit.id))
              .map(habit => (
                <HabitBox key={habit.id} habit={habit} updateHabit={onUpdateWeeklyHabit} deleteHabit={onDeleteWeeklyHabit} />
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
          </Modal>
        }
      </div>
    )
}

