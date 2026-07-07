import { ModuleDashboardTemplate } from "../components/rcc/ModuleDashboardTemplate";
import { autonomousEngineerData } from "../data/rcc-module-demo-data";

export function AutonomousEngineerPage() {
  return <ModuleDashboardTemplate data={autonomousEngineerData()} />;
}
