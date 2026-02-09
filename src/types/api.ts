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

export type DailyRequest = Pick<Daily, 'title' | 'description' | 'daysOfTheWeek'>
export type IncrementalRequest = Pick<Incremental, 'title' | 'description' | 'resetFrequency'>
export type TodoRequest = Pick<Todo, 'title' | 'description' | 'dueDate'>

export type GetAllDataResponse = {
  dailies: Daily[]
  incrementals: Incremental[]
  todos: Todo[]
}
