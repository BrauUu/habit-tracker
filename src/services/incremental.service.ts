import type { IncrementalRequest, OrderRequest, OrderResponse } from "../types/api";
import type { Incremental } from "../types/habit";
import { api } from "./api";

const basePath = '/incremental'

export async function createIncremental(data: IncrementalRequest) {
    return api.post<Incremental>(`${basePath}/`, data)
}

export async function orderIncremental(incrementalId: string, data: OrderRequest) {
    return api.post<OrderResponse>(`${basePath}/${incrementalId}/order`, data)
}

export async function increaseIncremental(incrementalId: string) {
    return api.post(`${basePath}/${incrementalId}/increase`)
}

export async function decreaseIncremental(incrementalId: string) {
    return api.post(`${basePath}/${incrementalId}/decrease`)
}

export async function getIncremental(incrementalId: string) {
    return api.get<Incremental>(`${basePath}/${incrementalId}`)
}

export async function updateIncremental(incrementalId: string, data: IncrementalRequest) {
    return api.put<Incremental>(`${basePath}/${incrementalId}`, data)
}

export async function deleteIncremental(incrementalId: string) {
    return api.delete(`${basePath}/${incrementalId}`)
}