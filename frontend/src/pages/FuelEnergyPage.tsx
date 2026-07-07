import { ModuleDashboardTemplate } from "../components/rcc/ModuleDashboardTemplate";
import { fuelEnergyData } from "../data/rcc-module-demo-data";

export function FuelEnergyPage() {
  return <ModuleDashboardTemplate data={fuelEnergyData()} />;
}
