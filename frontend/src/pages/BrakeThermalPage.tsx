import { ModuleDashboardTemplate } from "../components/rcc/ModuleDashboardTemplate";
import { brakeThermalData } from "../data/rcc-module-demo-data";

export function BrakeThermalPage() {
  return <ModuleDashboardTemplate data={brakeThermalData()} />;
}
