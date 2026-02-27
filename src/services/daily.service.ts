import type { OrderResponse, DailyRequest, OrderRequest } from "../types/api";
import type { Daily } from "../types/habit";
import { api } from "./api";

const basePath = '/daily'

export async function createDaily(data: DailyRequest) {
    return api.post<Daily>(`${basePath}/`, data)
}

export async function getPendingDailies() {
    return api.get<string[]>(`${basePath}/pendingHabits`)
}

export async function orderDaily(dailyId: string, data: OrderRequest) {
    return api.post<OrderResponse>(`${basePath}/${dailyId}/order`, data)
}

export async function checkDaily(dailyId: string) {
    return api.post(`${basePath}/${dailyId}/check`)
}

export async function uncheckDaily(dailyId: string) {
    return api.post(`${basePath}/${dailyId}/uncheck`)
}

export async function getDaily(dailyId: string) {
    return api.get<Daily>(`${basePath}/${dailyId}`)
}

export async function updateDaily(dailyId: string, data: DailyRequest) {
    return api.put<Daily>(`${basePath}/${dailyId}`, data)
}

export async function deleteDaily(dailyId: string) {
    return api.delete(`${basePath}/${dailyId}`)
}