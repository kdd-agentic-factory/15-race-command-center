import { ModuleDashboardTemplate } from "../components/rcc/ModuleDashboardTemplate";
import { dataCubeData } from "../data/rcc-circuit-intelligence-data";

export function DataCubePage() {
  return <ModuleDashboardTemplate data={dataCubeData()} />;
}
