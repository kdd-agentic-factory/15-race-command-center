import { ModuleDashboardTemplate } from "../components/rcc/ModuleDashboardTemplate";
import { connectDataData } from "../data/rcc-module-demo-data";

export function ConnectDataPage() {
  return <ModuleDashboardTemplate data={connectDataData()} />;
}
