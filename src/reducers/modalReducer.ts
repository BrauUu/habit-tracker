import type { ModalState, ModalAction } from '../types/types'

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
    
    case 'updateHabitModal':
      if (state.type !== 'createHabit' || !state.data?.habit) return state
      return {
        ...state,
        data: {
          habit: { ...state.data.habit, ...action.payload }
        }
      }
    
    case 'hideModal':
      return { type: null }
    
    default:
      return state
  }
}