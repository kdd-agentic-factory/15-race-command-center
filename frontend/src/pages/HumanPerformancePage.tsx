import { ModuleDashboardTemplate } from "../components/rcc/ModuleDashboardTemplate";
import { humanPerformanceData } from "../data/rcc-module-demo-data";

export function HumanPerformancePage() {
  return <ModuleDashboardTemplate data={humanPerformanceData()} />;
}
