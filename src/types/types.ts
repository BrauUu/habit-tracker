// Base interface com propriedades comuns
interface BaseHabit {
  id: string
  title: string
  done: boolean
  streak: number
  order: number
}

export interface DailyHabit extends BaseHabit {
  type: 'daily'
  daysOfTheWeek: number[]
}

export type Habit = DailyHabit

export interface HabitsList {
  dailyHabits: DailyHabit[]
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
  | { type: 'updateHabit', payload: Partial<Habit>|Habit }
  | { type: 'deleteHabit', payload: Partial<Habit> }
  | { type: 'hideModal' }