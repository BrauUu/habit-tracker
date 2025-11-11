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

export interface IncrementalHabit extends BaseHabit {
  type: 'incremental'
  positiveCount: number
  negativeCount: number
}

export type Habit = DailyHabit | IncrementalHabit

export interface HabitsList {
  dailyHabits: DailyHabit[]
  incrementalHabits: IncrementalHabit[]
}