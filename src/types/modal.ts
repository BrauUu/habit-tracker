import type { Habit } from './habit'
import type { User } from './others';

export type ModalType = 'newDay' | 'createHabit' | 'updateHabit' | 'deleteHabit' | 'login' | 'register' | null;

export interface ModalState {
  type: ModalType
  data?: any
}

export type ModalAction =
  | { type: 'showNewDay', payload: string[] }
  | { type: 'createHabit', payload: Habit }
  | { type: 'updateHabit', payload: Partial<Habit> | Habit }
  | { type: 'deleteHabit', payload: Partial<Habit> }
  | { type: 'login'}
  | { type: 'register'}
  | { type: 'updateUser', payload: Partial<User>}
  | { type: 'hideModal' }