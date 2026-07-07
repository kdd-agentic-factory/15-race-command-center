import { ModuleDashboardTemplate } from "../components/rcc/ModuleDashboardTemplate";
import { dataLakehouseData } from "../data/rcc-module-demo-data";

export function DataLakehousePage() {
  return <ModuleDashboardTemplate data={dataLakehouseData()} />;
}
