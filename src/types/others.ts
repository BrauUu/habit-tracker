export interface User {
    id: string
    username: string
    password: string
    passwordConfirmation?: string
    lastDailyResetDate: Date | null
}

export type ButtonType = 'primary' | 'secondary' | 'other';

export type resetFrequencyType = 'daily' | 'weekly'