export interface Habit {
  id: string
  title: string
  done: boolean
  streak: number
  daysOfTheWeek: number[]
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
  | { type: 'deleteHabit' }
  | { type: 'hideModal' }