import type { TodoRequest } from "../types/api";
import type { Todo } from "../types/habit";
import { api } from "./api";

const basePath = '/todo'

export async function createTodo(data: TodoRequest) {
    return api.post<Todo>(`${basePath}/`, data)
}

export async function checkTodo(todoId: string) {
    return api.post(`${basePath}/${todoId}/check`)
}

export async function uncheckTodo(todoId: string) {
    return api.post(`${basePath}/${todoId}/uncheck`)
}

export async function getTodo(todoId: string) {
    return api.get<Todo>(`${basePath}/${todoId}`)
}

export async function updateTodo(todoId: string, data: TodoRequest) {
    return api.put<Todo>(`${basePath}/${todoId}`, data)
}

export async function deleteTodo(todoId: string) {
    return api.delete(`${basePath}/${todoId}`)
}