import { ModuleDashboardTemplate } from "../components/rcc/ModuleDashboardTemplate";
import { trackEvolutionData } from "../data/rcc-circuit-intelligence-data";

export function TrackEvolutionPage() {
  return <ModuleDashboardTemplate data={trackEvolutionData()} />;
}
