import { ModuleDashboardTemplate } from "../components/rcc/ModuleDashboardTemplate";
import { rivalRadarData } from "../data/rcc-module-demo-data";

export function RivalRadarPage() {
  return <ModuleDashboardTemplate data={rivalRadarData()} />;
}
