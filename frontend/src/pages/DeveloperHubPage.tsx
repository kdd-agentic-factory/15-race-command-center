import { ModuleDashboardTemplate } from "../components/rcc/ModuleDashboardTemplate";
import { developerHubData } from "../data/rcc-module-demo-data";

export function DeveloperHubPage() {
  return <ModuleDashboardTemplate data={developerHubData()} />;
}
