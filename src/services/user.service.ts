import type { AuthRequest, AuthResponse, GetAllDataResponse, NewDayResponse } from "../types/api";
import { api } from "./api";

export function login(data: AuthRequest) {
    return api.post<AuthResponse>('/login', data)
}

export function register(data: AuthRequest) {
    return api.post<AuthResponse>('/register', data)
}

export function startNewDay() {
    return api.get<NewDayResponse>('/user/newDay')
}

export function getAllDataFromUser() {
    return api.get<GetAllDataResponse>('/user')
}

export function deleteUser() {
    return api.delete('/user')
}