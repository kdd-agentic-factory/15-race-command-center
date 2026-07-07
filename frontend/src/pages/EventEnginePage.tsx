import { ModuleDashboardTemplate } from "../components/rcc/ModuleDashboardTemplate";
import { eventEngineData } from "../data/rcc-circuit-intelligence-data";

export function EventEnginePage() {
  return <ModuleDashboardTemplate data={eventEngineData()} />;
}
