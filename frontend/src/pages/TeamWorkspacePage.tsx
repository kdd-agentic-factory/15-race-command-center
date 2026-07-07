import { ModuleDashboardTemplate } from "../components/rcc/ModuleDashboardTemplate";
import { teamWorkspaceData } from "../data/rcc-module-demo-data";

export function TeamWorkspacePage() {
  return <ModuleDashboardTemplate data={teamWorkspaceData()} />;
}
