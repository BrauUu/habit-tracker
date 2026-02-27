import type { resetFrequencyType } from "./others"

interface BaseHabit {
  id: string
  title: string
  description?: string
  userId?: string
  order: number
}

export interface Daily extends BaseHabit {
  done: boolean
  streak: number
  daysOfTheWeek?: number[]
}

export interface Todo extends BaseHabit {
  doneDate: Date | null,
  dueDate: Date | null
}

export interface Incremental extends BaseHabit {
  resetFrequency: resetFrequencyType
  positiveCount: number
  negativeCount: number
}

export type Habit = Daily | Incremental | Todo

export interface HabitsList {
  dailyHabits: Daily[]
  incrementalHabits: Incremental[]
  todos: Todo[]
}