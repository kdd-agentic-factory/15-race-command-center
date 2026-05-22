import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { PlatformOverviewPage } from "./pages/PlatformOverviewPage";
import { LiveTelemetryPage } from "./pages/LiveTelemetryPage";
import { CircuitIntelligencePage } from "./pages/CircuitIntelligencePage";
import { TireDegradationPage } from "./pages/TireDegradationPage";
import { SetupManagementPage } from "./pages/SetupManagementPage";
import { PartsDesignPage } from "./pages/PartsDesignPage";
import { PreGrandPrixPage } from "./pages/PreGrandPrixPage";
import { CrewChiefBoardPage } from "./pages/CrewChiefBoardPage";
import { CopilotPage } from "./pages/CopilotPage";
import { DigitalTwinPage } from "./pages/DigitalTwinPage";
import { ReportsPage } from "./pages/ReportsPage";
import { SettingsPage } from "./pages/SettingsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <PlatformOverviewPage /> },
      { path: "telemetry", element: <LiveTelemetryPage /> },
      { path: "circuit", element: <CircuitIntelligencePage /> },
      { path: "tires", element: <TireDegradationPage /> },
      { path: "setup", element: <SetupManagementPage /> },
      { path: "parts", element: <PartsDesignPage /> },
      { path: "pre-gp", element: <PreGrandPrixPage /> },
      { path: "crew-chief", element: <CrewChiefBoardPage /> },
      { path: "copilot", element: <CopilotPage /> },
      { path: "digital-twin", element: <DigitalTwinPage /> },
      { path: "reports", element: <ReportsPage /> },
      { path: "settings", element: <SettingsPage /> },
    ],
  },
]);
