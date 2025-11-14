import type { resetFrequencyType } from "./others"

interface BaseHabit {
  id: string
  title: string
}

export interface DailyHabit extends BaseHabit {
  type: 'daily'
  done: boolean
  streak: number
  daysOfTheWeek: number[]
}

export interface Todo extends BaseHabit {
  type: 'todo',
  doneDate?: Date
}

export interface IncrementalHabit extends BaseHabit {
  type: 'incremental'
  resetFrequency: resetFrequencyType
  positiveCount: number
  negativeCount: number
}

export type Habit = DailyHabit | IncrementalHabit | Todo

export interface HabitsList {
  dailyHabits: DailyHabit[]
  incrementalHabits: IncrementalHabit[]
  todos: Todo[]
}