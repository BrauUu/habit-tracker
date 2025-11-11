import type { Habit } from '../types/habit'
import type { ModalState, ModalAction } from '../types/modal'

export function modalReducer(state: ModalState, action: ModalAction): ModalState {
  switch (action.type) {
    case 'showNewDay':
      return {
        type: 'newDay',
        data: { pendingHabits: action.payload }
      }

    case 'createHabit':
      return {
        type: 'createHabit',
        data: { habit: action.payload }
      }

    case 'updateHabit':
      if (state.type === 'createHabit' && state.data?.habit) {
        return {
          ...state,
          data: {
            habit: { ...state.data.habit, ...action.payload } as Habit
          }
        }
      }
      if (state.type === 'updateHabit' && state.data?.habit) {
        return {
          ...state,
          data: {
            habit: { ...state.data.habit, ...action.payload } as Habit
          }
        }
      }
      return {
        type: 'updateHabit',
        data: {
          habit: { ...action.payload } as Habit
        }
      }

    case 'deleteHabit':
      return {
        type: 'deleteHabit',
        data: {
          habit: { ...action.payload } as Habit
        }
      }
    case 'hideModal':
      return { type: null }

    default:
      return state
  }
}