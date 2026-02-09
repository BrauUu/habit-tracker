import type { AuthRequest, AuthResponse, GetAllDataResponse } from "../types/api";
import { api } from "./api";

export async function login(data: AuthRequest) {
    return api.post<AuthResponse>('/login', data)
}

export async function register(data: AuthRequest) {
    return api.post<AuthResponse>('/register', data)
}

export async function getAllDataFromUser() {
    return api.get<GetAllDataResponse>('/user')
}

export async function deleteUser() {
    return api.delete('/user')
}