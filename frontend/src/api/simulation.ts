import { get, post } from "./client";
import type { SimulationResult } from "../types/simulation";

export const runWhatIf = (payload: {
  baseline_setup_id: string;
  setup_change: Record<string, unknown>;
  circuit_id?: string;
  notes?: string;
}) => post<SimulationResult>("/simulation/what-if", payload);

export const getSimulation = (id: string) => get<SimulationResult>(`/simulation/${id}`);
export const listSimulations = () => get<{ simulations: SimulationResult[] }>("/simulation");
