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

export interface CounterHabit extends BaseHabit {
  type: 'counter'
  positiveCount: number
  negativeCount: number
}

export type Habit = DailyHabit | CounterHabit

export interface HabitsList {
  dailyHabits: DailyHabit[]
  counterHabits: CounterHabit[]
}

export type ButtonType = 'primary' | 'other';

export type ModalType = 'newDay' | 'createHabit' | 'updateHabit' | 'deleteHabit' | null;

export interface ModalState {
  type: ModalType
  data?: {
    pendingHabits?: string[]
    habit?: Habit
  }
}

export type ModalAction =
  | { type: 'showNewDay', payload: string[] }
  | { type: 'createHabit', payload: Habit }
  | { type: 'updateHabit', payload: Partial<Habit> | Habit }
  | { type: 'deleteHabit', payload: Partial<Habit> }
  | { type: 'hideModal' }