import { ModuleDashboardTemplate } from "../components/rcc/ModuleDashboardTemplate";
import { platformData } from "../data/rcc-circuit-intelligence-data";

export function PlatformPage() {
  return <ModuleDashboardTemplate data={platformData()} />;
}
