import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ModulePlaceholderPage } from "./components/ModulePlaceholderPage";
import { RouteErrorFallback } from "./components/RouteErrorFallback";
import { RACE_MODULES } from "./config/raceCommandModules";

// ─── Real page imports ───
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

// ─── Route map: module-id → component ───
// Implemented modules get their real page; everything else falls through to ModulePlaceholderPage.
const PAGE_BY_ID: Record<string, React.ComponentType> = {
  overview:        PlatformOverviewPage,
  "track-live":    ModulePlaceholderPage,
  cockpit:         CockpitPage,
  telemetry:       LiveTelemetryPage,
  circuit:         CircuitIntelligencePage,
  setup:           SetupManagementPage,
  "digital-twin":  DigitalTwinPage,
  "lap-replay":    ModulePlaceholderPage,
  "session-report": ReportsPage,
  copilot:         AICopilotPage,
  platform:        ModulePlaceholderPage,
  "autonomous-engineer": ModulePlaceholderPage,
  settings:        SettingsPage,
  "edge-hub":      ModulePlaceholderPage,
  "data-lakehouse": ModulePlaceholderPage,
  "developer-hub": ModulePlaceholderPage,
  "data-trust":    ModulePlaceholderPage,
  "connect-data":  ModulePlaceholderPage,
  "race-control":  ModulePlaceholderPage,
  "pit-radio":     ModulePlaceholderPage,
  "team-workspace": ModulePlaceholderPage,
  "visualization-os": ModulePlaceholderPage,
  "human-performance": ModulePlaceholderPage,
  "oracle-pit-wall": ModulePlaceholderPage,
  "black-box":     ModulePlaceholderPage,
  "riding-style":  ModulePlaceholderPage,
  "engineering-control": ModulePlaceholderPage,
  electronics:     ModulePlaceholderPage,
  aerodynamics:    ModulePlaceholderPage,
  "fuel-energy":   ModulePlaceholderPage,
  "chassis-geometry": ModulePlaceholderPage,
  gearing:         ModulePlaceholderPage,
  "setup-lab":     ModulePlaceholderPage,
  "brake-thermal": ModulePlaceholderPage,
  "bike-comparison": ModulePlaceholderPage,
  parts:           PartsDesignPage,
  tires:           TireDegradationPage,
  "track-evolution": ModulePlaceholderPage,
  "track-surface": ModulePlaceholderPage,
  "event-engine":  ModulePlaceholderPage,
  "circuit-history": ModulePlaceholderPage,
  "data-cube":     ModulePlaceholderPage,
  championship:    ModulePlaceholderPage,
  "qualifying-lab": ModulePlaceholderPage,
  "rival-radar":   ModulePlaceholderPage,
  strategy:        RaceStrategyPage,
  "pre-gp":        PreGrandPrixPage,
  "crew-chief":    CrewChiefBoardPage,
  "session-launch": SessionLaunchPage,
  "ai-copilot":    AICopilotPage,
};

/**
 * Routes exposed as public preview by 13-ui-command-center serviceRegistry.
 * These render WITHOUT auth — matched against RACE_MODULES[].id.
 */
const PUBLIC_ROUTES = new Set([
  "cockpit",      // /pitwall
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
  "session-report",   // /reports
  "session-launch",   // /launch
  "overview",
]);

/**
 * Wraps a route component with:
 * 1. RouteErrorFallback for render-crash safety
 * 2. ModulePlaceholderPage fallback for unimplemented modules
 */
function routeElement(moduleId: string, Component: React.ComponentType): React.ReactElement {
  const FallbackComponent = Component;
  return (
    <RouteErrorFallback moduleName={moduleId}>
      <FallbackComponent />
    </RouteErrorFallback>
  );
}

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <AppShell />,
      children: [
        // ─── Public preview routes (no auth) ───
        ...RACE_MODULES
          .filter((m) => PUBLIC_ROUTES.has(m.id))
          .map((m) => {
            const Component = PAGE_BY_ID[m.id] ?? ModulePlaceholderPage;
            return { path: m.route.replace("/", ""), element: routeElement(m.id, Component) };
          }),

        // ─── Protected routes (auth required) ───
        {
          element: <ProtectedRoute />,
          children: [
            { index: true, element: routeElement("overview", PlatformOverviewPage) },
            ...RACE_MODULES
              .filter((m) => !PUBLIC_ROUTES.has(m.id))
              .map((m) => {
                const Component = PAGE_BY_ID[m.id] ?? ModulePlaceholderPage;
                return { path: m.route.replace("/", ""), element: routeElement(m.id, Component) };
              }),
          ],
        },

        // 404 catch-all — always visible
        { path: "*", element: (
          <RouteErrorFallback moduleName="404">
            <div className="flex min-h-[60vh] items-center justify-center p-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-kdd-text">Page not found</h2>
                <p className="mt-2 text-sm text-kdd-dim">No module registered for this route</p>
                <a href="/overview" className="mt-4 inline-flex items-center gap-2 rounded-kdd-md bg-kdd-accent px-4 py-2 text-sm font-medium text-white hover:bg-kdd-accent-hover">
                  Return to Overview
                </a>
              </div>
            </div>
          </RouteErrorFallback>
        )},
      ],
    },
  ],
  { basename: "/" }
);
