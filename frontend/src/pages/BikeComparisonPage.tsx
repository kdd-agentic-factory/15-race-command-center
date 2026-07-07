import { ModuleDashboardTemplate } from "../components/rcc/ModuleDashboardTemplate";
import { bikeComparisonData } from "../data/rcc-module-demo-data";

export function BikeComparisonPage() {
  return <ModuleDashboardTemplate data={bikeComparisonData()} />;
}
