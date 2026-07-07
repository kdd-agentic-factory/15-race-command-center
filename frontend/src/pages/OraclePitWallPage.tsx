import { ModuleDashboardTemplate } from "../components/rcc/ModuleDashboardTemplate";
import { oraclePitWallData } from "../data/rcc-module-demo-data";

export function OraclePitWallPage() {
  return <ModuleDashboardTemplate data={oraclePitWallData()} />;
}
