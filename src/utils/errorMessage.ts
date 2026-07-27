import axios from 'axios'

type ApiErrorBody = {
  message?: string
}

export function getErrorMessage(error: unknown) {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    return error.response?.data?.message || error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'unexpected error'
}
