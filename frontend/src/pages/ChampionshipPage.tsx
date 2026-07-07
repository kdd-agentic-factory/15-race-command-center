import { ModuleDashboardTemplate } from "../components/rcc/ModuleDashboardTemplate";
import { championshipData } from "../data/rcc-circuit-intelligence-data";

export function ChampionshipPage() {
  return <ModuleDashboardTemplate data={championshipData()} />;
}
