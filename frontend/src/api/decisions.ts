import { get, post } from "./client";
import type { CrewChiefDecision } from "../types/decision";

export const listDecisions = () => get<{ decisions: CrewChiefDecision[] }>("/decisions");
export const approveDecision = (id: string, approvedBy: string) =>
  post(`/decisions/${id}/approve`, { approved_by: approvedBy });
export const rejectDecision = (id: string, reason: string) =>
  post(`/decisions/${id}/reject`, { reason });
export const requestSimulation = (id: string) =>
  post(`/decisions/${id}/request-simulation`, {});
