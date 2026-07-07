import { ModuleDashboardTemplate } from "../components/rcc/ModuleDashboardTemplate";
import { electronicsData } from "../data/rcc-module-demo-data";

export function ElectronicsPage() {
  return <ModuleDashboardTemplate data={electronicsData()} />;
}
