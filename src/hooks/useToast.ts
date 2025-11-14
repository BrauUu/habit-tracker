import toast from 'react-hot-toast'

export function useToast() {
  return {
    success: (message: string) => toast.success(message),
    error: (message: string) => toast.error(message),
    
    habitCreated: () => toast.success('habit created with success'),
    habitUpdated: () => toast.success('habit updated with success'),
    habitDeleted: () => toast.success('habit deleted with success'),

    validationError: (field: string) => toast.error(`habit ${field} is required`),
  }
}
