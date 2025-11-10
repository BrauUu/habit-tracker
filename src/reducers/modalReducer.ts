import type { ModalState, ModalAction, Habit } from '../types/types'

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
            habit: { ...state.data.habit, ...action.payload }
          }
        }
      }
      if (state.type === 'updateHabit' && state.data?.habit) {
        return {
          ...state,
          data: {
            habit: { ...state.data.habit, ...action.payload }
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