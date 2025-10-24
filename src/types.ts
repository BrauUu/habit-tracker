export interface Habit {
  id: string,
  title: string,
  done: boolean,
  streak: number,
  daysOfTheWeek: number[]
}

export type ButtonType = 'primary' | 'other';