import { ModuleDashboardTemplate } from "../components/rcc/ModuleDashboardTemplate";
import { dataTrustData } from "../data/rcc-module-demo-data";

export function DataTrustPage() {
  return <ModuleDashboardTemplate data={dataTrustData()} />;
}
