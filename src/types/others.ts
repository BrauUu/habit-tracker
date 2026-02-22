export interface User {
    id: string
    username: string
    password: string
    password_confirmation?: string
    last_daily_reset_date: Date | null
    last_weekly_reset_date: Date | null
}

export type ButtonType = 'primary' | 'secondary' | 'other';

export type resetFrequencyType = 'daily' | 'weekly'