import type { resetFrequencyType } from "./others"

interface BaseHabit {
  id: string
  title: string
  description?: string
  createdAt: Date
  userId: string
}

export interface Daily extends BaseHabit {
  done: boolean
  streak: number
  daysOfTheWeek?: number[]
}

export interface Todo extends BaseHabit {
  doneDate?: Date,
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