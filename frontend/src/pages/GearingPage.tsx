import { ModuleDashboardTemplate } from "../components/rcc/ModuleDashboardTemplate";
import { gearingData } from "../data/rcc-module-demo-data";

export function GearingPage() {
  return <ModuleDashboardTemplate data={gearingData()} />;
}
