import { ModuleDashboardTemplate } from "../components/rcc/ModuleDashboardTemplate";
import { aerodynamicsData } from "../data/rcc-module-demo-data";

export function AerodynamicsPage() {
  return <ModuleDashboardTemplate data={aerodynamicsData()} />;
}
