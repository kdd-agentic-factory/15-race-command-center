import { ModuleDashboardTemplate } from "../components/rcc/ModuleDashboardTemplate";
import { setupLabData } from "../data/rcc-module-demo-data";

export function SetupLabPage() {
  return <ModuleDashboardTemplate data={setupLabData()} />;
}
