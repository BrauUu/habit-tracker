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

export type DailyRequest = Pick<Daily, 'title' | 'description' | 'days_of_the_week'>
export type IncrementalRequest = Pick<Incremental, 'title' | 'description' | 'reset_frequency'>
export type TodoRequest = Pick<Todo, 'title' | 'description' | 'due_date'>

export type GetAllDataResponse = {
  dailies: Daily[]
  incrementals: Incremental[]
  todos: Todo[]
  user: User
}

export type NewDayResponse = {
  dailiesUpdates: Partial<Daily[]>
  incrementalsUpdates: Partial<Incremental[]>
  deletedTodos: Partial<Todo[]>
}
