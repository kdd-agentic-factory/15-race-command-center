import { ModuleDashboardTemplate } from "../components/rcc/ModuleDashboardTemplate";
import { trackLiveData } from "../data/rcc-circuit-intelligence-data";

export function TrackLivePage() {
  return <ModuleDashboardTemplate data={trackLiveData()} />;
}
