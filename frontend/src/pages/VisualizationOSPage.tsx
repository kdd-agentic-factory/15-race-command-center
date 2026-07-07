import { ModuleDashboardTemplate } from "../components/rcc/ModuleDashboardTemplate";
import { visualizationOSData } from "../data/rcc-module-demo-data";

export function VisualizationOSPage() {
  return <ModuleDashboardTemplate data={visualizationOSData()} />;
}
