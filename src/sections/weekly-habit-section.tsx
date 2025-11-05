// import { useState, useMemo, useReducer } from 'react'
// import { v4 as uuidv4 } from 'uuid';

// import type { Habit } from '../types/types'
// import { modalReducer } from '../reducers/modalReducer'

// import Whiteboard from '../components/whiteboard'
// import HabitBox from '../components/boxes/habitbox'
// import Title from '../components/title'
// import Input from '../components/input'
// import Filter from '../components/filter'
// import Modal from '../components/modal/default';
// import DayOfWeekSelector from '../components/day-of-week-selector';

// interface WeeklyHabitsSectionProps {
//   weeklyHabits: Habit[]
//   onUpdateWeeklyHabit: (id: string, key: string, value: any) => void
//   onDeleteWeeklyHabit: (id: string) => void
//   onAddWeeklyHabit: (habit: Habit) => void
//   pendingHabits?: string[]
//   onClearPending?: () => void
// }

// export default function WeeklyHabitsSection({
//   weeklyHabits, 
//   onUpdateWeeklyHabit, 
//   onDeleteWeeklyHabit, 
//   onAddWeeklyHabit,
//   pendingHabits = [],
//   onClearPending
// }: WeeklyHabitsSectionProps) {

//   const [weeklyHabitFilter, setWeeklyHabitFilter] = useState<number | null>(1)
//   const [modalState, modalDispatch] = useReducer(modalReducer, { type: null })

//   const habitsListFiltered = useMemo(() => {
//     if (weeklyHabitFilter === 0) return [...weeklyHabits]
//     if (weeklyHabitFilter === 1) return weeklyHabits.filter(habit => checkIfItsTodaysHabit(habit))
//     return [...weeklyHabits]
//   }, [weeklyHabitFilter, weeklyHabits])

//   function checkIfItsTodaysHabit(habit: Habit) {
//     const today = new Date().getDay()
//     return checkHabitByDay(habit, today)
//   }

//   function checkHabitByDay(habit: Habit, weekDay: number) {
//     return habit.daysOfTheWeek.includes(weekDay)
//   }

//   function createNewHabit(title: string) {
//     const newHabit: Habit = {
//       'id': uuidv4(),
//       'title': title,
//       'done': false,
//       'streak': 0,
//       'type': 'weekly'
//     }
//     modalDispatch({ type: 'createHabit', payload: newHabit })
//   }

//   function finishHabitCreation() {
//     if (modalState.type === 'createHabit' && modalState.data?.habit) {
//       onAddWeeklyHabit(modalState.data.habit)
//       modalDispatch({ type: 'hideModal' })
//     }
//   }

//   function cancelHabitCreation() {
//     modalDispatch({ type: 'hideModal' })
//   }

