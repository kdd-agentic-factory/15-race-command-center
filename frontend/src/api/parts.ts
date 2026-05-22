import { get, post, patch } from "./client";
import type { CircuitSpecificPart } from "../types/part";

export const listParts = () => get<{ parts: CircuitSpecificPart[] }>("/parts");
export const getPart = (id: string) => get<CircuitSpecificPart>(`/parts/${id}`);
export const createPart = (body: Partial<CircuitSpecificPart>) => post<CircuitSpecificPart>("/parts", body);
export const updatePartStatus = (id: string, status: string) => patch(`/parts/${id}/status`, { status });
export const simulatePart = (id: string, payload: object) => post(`/parts/${id}/simulate`, payload);
