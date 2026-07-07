import { ModuleDashboardTemplate } from "../components/rcc/ModuleDashboardTemplate";
import { engineeringControlData } from "../data/rcc-module-demo-data";

export function EngineeringControlPage() {
  return <ModuleDashboardTemplate data={engineeringControlData()} />;
}
