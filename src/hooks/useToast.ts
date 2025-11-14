import toast from 'react-hot-toast'
import { dailyHabitTemplates, incrementalHabitTemplates, todoTemplates } from '../constants/messageTemplates'

export function useToast() {

  return {
    success: (message: string) => toast.success(message),
    error: (message: string) => toast.error(message),

    habitCreated: () => toast.success('habit created with success'),
    habitUpdated: () => toast.success('habit updated with success'),
    habitDeleted: () => toast.success('habit deleted with success'),
    habitChecked: (streak: number) => {
      const { message, icon } = dailyHabitTemplates[Math.floor(Math.random() * dailyHabitTemplates.length)]
      const newMessage = message.replace('{streak}', String(streak + 1)).trim()
      toast(newMessage, { icon: icon })
    },
    habitCountIncreased: (count: number) => {
      const { message, icon } = incrementalHabitTemplates.increase[Math.floor(Math.random() * incrementalHabitTemplates.increase.length)]
      const newMessage = message.replace('{count}', String(count)).trim()
      toast(newMessage, { icon: icon })
    },
    habitCountDecreased: (count: number) => {
      const { message, icon } = incrementalHabitTemplates.decrease[Math.floor(Math.random() * incrementalHabitTemplates.decrease.length)]
      const newMessage = message.replace('{count}', String(count)).trim()
      toast(newMessage, { icon: icon })
    },
    todoChecked: () => {
      const { message, icon } = todoTemplates[Math.floor(Math.random() * todoTemplates.length)]
      toast(message, { icon: icon })
    },
    validationError: (field: string) => toast.error(`habit ${field} is required`),
  }
}
