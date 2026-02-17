import type { resetFrequencyType } from "./others"

interface BaseHabit {
  id: string
  title: string
  description?: string
  user_id?: string
}

export interface Daily extends BaseHabit {
  done: boolean
  streak: number
  days_of_the_week?: number[]
}

export interface Todo extends BaseHabit {
  done_date: Date | null,
  due_date: Date | null
}

export interface Incremental extends BaseHabit {
  reset_frequency: resetFrequencyType
  positive_count: number
  negative_count: number
}

export type Habit = Daily | Incremental | Todo

export interface HabitsList {
  dailyHabits: Daily[]
  incrementalHabits: Incremental[]
  todos: Todo[]
}