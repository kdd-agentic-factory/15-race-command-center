import { ModuleDashboardTemplate } from "../components/rcc/ModuleDashboardTemplate";
import { raceControlData } from "../data/rcc-module-demo-data";

export function RaceControlPage() {
  return <ModuleDashboardTemplate data={raceControlData()} />;
}
