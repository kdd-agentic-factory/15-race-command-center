import { ModuleDashboardTemplate } from "../components/rcc/ModuleDashboardTemplate";
import { qualifyingLabData } from "../data/rcc-module-demo-data";

export function QualifyingLabPage() {
  return <ModuleDashboardTemplate data={qualifyingLabData()} />;
}
