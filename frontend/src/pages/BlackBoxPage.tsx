import { ModuleDashboardTemplate } from "../components/rcc/ModuleDashboardTemplate";
import { blackBoxData } from "../data/rcc-module-demo-data";

export function BlackBoxPage() {
  return <ModuleDashboardTemplate data={blackBoxData()} />;
}
