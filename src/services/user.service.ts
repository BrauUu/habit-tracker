import type { AuthRequest, AuthResponse, GetAllDataResponse, NewDayResponse, SynchronizeRequest, SynchronizeResponse, RefreshTokenResponse } from "../types/api";
import { api } from "./api";

export function login(data: AuthRequest) {
    return api.post<AuthResponse>('/login', data)
}

export function synchronizeHabits(data: SynchronizeRequest) {
    return api.post<SynchronizeResponse>('/user/synchronizeHabits', data)
}

export function register(data: AuthRequest) {
    return api.post<AuthResponse>('/register', data)
}

export function startNewDay() {
    return api.post<NewDayResponse>('/user/newDay')
}

export function getAllDataFromUser() {
    return api.get<GetAllDataResponse>('/user')
}

export function refreshToken() {
    return api.post<RefreshTokenResponse>('/user/refreshToken')
}

export function deleteUser() {
    return api.delete('/user')
}