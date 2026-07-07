import { ModuleDashboardTemplate } from "../components/rcc/ModuleDashboardTemplate";
import { circuitHistoryData } from "../data/rcc-circuit-intelligence-data";

export function CircuitHistoryPage() {
  return <ModuleDashboardTemplate data={circuitHistoryData()} />;
}
