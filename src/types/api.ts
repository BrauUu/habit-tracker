import type { Daily, Incremental, Todo } from "./habit";
import type { User } from "./others";


export type AuthRequest = {
  username: string;
  password: string;
}

export type AuthResponse = {
  user: User,
  token: string
}

export type SynchronizeRequest = {
  dailies: Daily[]
  incrementals: Incremental[]
  todos: Todo[]
}

export type SynchronizeResponse = {
  dailies: Daily[]
  incrementals: Incremental[]
  todos: Todo[]
}

export type DailyRequest = Pick<Daily, 'title' | 'description' | 'daysOfTheWeek'>
export type OrderRequest = {
  oldPosition: number,
  newPosition: number
}
export type IncrementalRequest = Pick<Incremental, 'title' | 'description' | 'resetFrequency'>
export type TodoRequest = Pick<Todo, 'title' | 'description' | 'dueDate'>

export type GetAllDataResponse = {
  dailies: Daily[]
  incrementals: Incremental[]
  todos: Todo[]
  user: User
}
export type OrderResponse = Pick<Daily, 'id' | 'order'>[]
export type NewDayResponse = {
  dailiesUpdates: Partial<Daily[]>
  incrementalsUpdates: Partial<Incremental[]>
  deletedTodos: Partial<Todo[]>
  lastDailyResetDate: Date
}

export type RefreshTokenResponse = {
  token: string
}
