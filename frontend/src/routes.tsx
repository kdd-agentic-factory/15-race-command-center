import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PlatformOverviewPage } from "./pages/PlatformOverviewPage";
import { LiveTelemetryPage } from "./pages/LiveTelemetryPage";
import { CircuitIntelligencePage } from "./pages/CircuitIntelligencePage";
import { TireDegradationPage } from "./pages/TireDegradationPage";
import { SetupManagementPage } from "./pages/SetupManagementPage";
import { PartsDesignPage } from "./pages/PartsDesignPage";
import { PreGrandPrixPage } from "./pages/PreGrandPrixPage";
import { CrewChiefBoardPage } from "./pages/CrewChiefBoardPage";
import { AICopilotPage } from "./pages/AICopilotPage";
import { RaceStrategyPage } from "./pages/RaceStrategyPage";
import { DigitalTwinPage } from "./pages/DigitalTwinPage";
import { ReportsPage } from "./pages/ReportsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { CockpitPage } from "./pages/CockpitPage";
import { SessionLaunchPage } from "./pages/SessionLaunchPage";

/**
 * Preview routes that must render WITHOUT auth for demo/preview use.
 * Matches exactly the routes exposed by 13-ui-command-center serviceRegistry.
 */
export const PREVIEW_PUBLIC_ROUTES = [
  "launch",
  "pitwall",
  "telemetry",
  "circuit",
  "tires",
  "setup",
  "parts",
  "pre-gp",
  "crew-chief",
  "strategy",
  "copilot",
  "ai-copilot",
  "digital-twin",
  "reports",
] as const;

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <AppShell />,
      children: [
        // Public preview routes — no auth required for demo/preview.
        // Opened from 13 ModuleGateway before 15 has standalone auth.
        { path: "launch", element: <SessionLaunchPage /> },
        { path: "pitwall", element: <CockpitPage /> },
        { path: "telemetry", element: <LiveTelemetryPage /> },
        { path: "circuit", element: <CircuitIntelligencePage /> },
        { path: "tires", element: <TireDegradationPage /> },
        { path: "setup", element: <SetupManagementPage /> },
        { path: "parts", element: <PartsDesignPage /> },
        { path: "pre-gp", element: <PreGrandPrixPage /> },
        { path: "crew-chief", element: <CrewChiefBoardPage /> },
        { path: "strategy", element: <RaceStrategyPage /> },
        { path: "copilot", element: <AICopilotPage /> },
        { path: "ai-copilot", element: <AICopilotPage /> },
        { path: "digital-twin", element: <DigitalTwinPage /> },
        { path: "reports", element: <ReportsPage /> },
        // Protected routes — require auth token
        {
          element: <ProtectedRoute />,
          children: [
            { index: true, element: <PlatformOverviewPage /> },
            { path: "settings", element: <SettingsPage /> },
          ],
        },
        // 404 catch-all
        { path: "*", element: <div className="p-8 text-center font-kdd-mono text-kdd-dim">Page not found</div> },
      ],
    },
  ],
  { basename: "/" }
);
