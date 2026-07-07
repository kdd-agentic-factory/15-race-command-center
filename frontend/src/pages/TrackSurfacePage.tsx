import { ModuleDashboardTemplate } from "../components/rcc/ModuleDashboardTemplate";
import { trackSurfaceData } from "../data/rcc-circuit-intelligence-data";

export function TrackSurfacePage() {
  return <ModuleDashboardTemplate data={trackSurfaceData()} />;
}
