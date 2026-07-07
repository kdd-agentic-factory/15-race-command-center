import { ModuleDashboardTemplate } from "../components/rcc/ModuleDashboardTemplate";
import { ridingStyleData } from "../data/rcc-module-demo-data";

export function RidingStylePage() {
  return <ModuleDashboardTemplate data={ridingStyleData()} />;
}
