import { ModuleDashboardTemplate } from "../components/rcc/ModuleDashboardTemplate";
import { edgeHubData } from "../data/rcc-module-demo-data";

export function TracksideEdgeHubPage() {
  return <ModuleDashboardTemplate data={edgeHubData()} />;
}
