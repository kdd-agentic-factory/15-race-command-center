import { ModuleDashboardTemplate } from "../components/rcc/ModuleDashboardTemplate";
import { lapReplayData } from "../data/rcc-circuit-intelligence-data";

export function LapReplayPage() {
  return <ModuleDashboardTemplate data={lapReplayData()} />;
}
