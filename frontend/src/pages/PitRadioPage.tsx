import { ModuleDashboardTemplate } from "../components/rcc/ModuleDashboardTemplate";
import { pitRadioData } from "../data/rcc-module-demo-data";

export function PitRadioPage() {
  return <ModuleDashboardTemplate data={pitRadioData()} />;
}
