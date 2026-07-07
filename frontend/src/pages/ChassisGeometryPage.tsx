import { ModuleDashboardTemplate } from "../components/rcc/ModuleDashboardTemplate";
import { chassisGeometryData } from "../data/rcc-module-demo-data";

export function ChassisGeometryPage() {
  return <ModuleDashboardTemplate data={chassisGeometryData()} />;
}
