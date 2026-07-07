# RCC Demo Runbook — Pre-Flight Checklist & Reference

> **Use this 15 minutes before every demo.**  
> Check each item, tick the box, and you're ready.

---

## Pre-Demo Checklist

### Browser Setup

- [ ] Use Chrome or Edge (latest version)
- [ ] Full-screen mode (F11) at 1920×1080 or larger
- [ ] Disable all extensions that modify page content (adblockers, dark mode)
- [ ] Clear DNS cache: `ipconfig /flushdns`
- [ ] Pre-open 3 tabs (don't refresh during demo):
  1. `https://kdd-rjz-ui.fly.dev/`
  2. `https://kdd-rjz-race.fly.dev/`
  3. `https://ep3nru4k.insforge.site/`

### Pre-Flight Smoke Test

Run each URL and verify 200 OK + no auth/placeholder:

| Route | Expected | Check |
|-------|----------|-------|
| `https://kdd-rjz-ui.fly.dev/` | 200, Gateway visible | [ ] |
| `https://kdd-rjz-race.fly.dev/` | 200, RCC visible | [ ] |
| `/track-live` | 200, real page | [ ] |
| `/track-evolution` | 200, real page | [ ] |
| `/track-surface` | 200, real page | [ ] |
| `/circuit-history` | 200, real page | [ ] |
| `/engineering-control` | 200, real page | [ ] |
| `/aerodynamics` | 200, real page | [ ] |
| `/brake-thermal` | 200, real page | [ ] |
| `/setup-lab` | 200, real page | [ ] |
| `/oracle-pit-wall` | 200, real page | [ ] |
| `/race-control` | 200, real page | [ ] |
| `/rival-radar` | 200, real page | [ ] |
| `/qualifying-lab` | 200, real page | [ ] |
| `/championship` | 200, real page | [ ] |
| `/copilot` | 200, real page | [ ] |
| `/platform` | 200, real page | [ ] |
| `https://ep3nru4k.insforge.site/` | 200, SpecForge visible | [ ] |

### Route Map — All 34 Implemented Modules

#### Command (11)
| Route | Module | Page |
|-------|--------|------|
| `/overview` | Overview | PlatformOverviewPage |
| `/track-live` | Track-Live | TrackLivePage |
| `/pitwall` | Adaptive Cockpit | CockpitPage |
| `/telemetry` | Live Telemetry | LiveTelemetryPage |
| `/circuit` | Circuit Intelligence | CircuitIntelligencePage |
| `/setup` | Setup Management | SetupManagementPage |
| `/digital-twin` | Digital Twin | DigitalTwinPage |
| `/lap-replay` | Lap Replay | LapReplayPage |
| `/reports` | Session Report | ReportsPage |
| `/copilot` | AI Copilot | AICopilotPage |
| `/autonomous-engineer` | Autonomous Engineer | AutonomousEngineerPage |
| `/settings` | Settings | SettingsPage |
| `/platform` | Platform Console | PlatformPage |

#### Platform Intelligence (12)
| Route | Module | Page |
|-------|--------|------|
| `/edge-hub` | Trackside Edge Hub | TracksideEdgeHubPage |
| `/data-lakehouse` | Data Lakehouse | DataLakehousePage |
| `/developer-hub` | Developer Hub | DeveloperHubPage |
| `/data-trust` | Data Trust | DataTrustPage |
| `/connect-data` | Connect Data | ConnectDataPage |
| `/race-control` | Race Control | RaceControlPage |
| `/pit-radio` | Pit-Radio | PitRadioPage |
| `/team-workspace` | Team Workspace | TeamWorkspacePage |
| `/visualization-os` | Visualization OS | VisualizationOSPage |
| `/human-performance` | Human Performance | HumanPerformancePage |
| `/oracle-pit-wall` | Oracle Pit Wall | OraclePitWallPage |
| `/black-box` | Black Box | BlackBoxPage |

#### Engineering (12)
| Route | Module | Page |
|-------|--------|------|
| `/riding-style` | Riding Style | RidingStylePage |
| `/engineering-control` | Engineering Control | EngineeringControlPage |
| `/electronics` | Electronics | ElectronicsPage |
| `/aerodynamics` | Aerodynamics | AerodynamicsPage |
| `/fuel-energy` | Fuel & Energy | FuelEnergyPage |
| `/chassis-geometry` | Chassis & Geometry | ChassisGeometryPage |
| `/gearing` | Gearing | GearingPage |
| `/setup-lab` | Setup Lab | SetupLabPage |
| `/brake-thermal` | Brake Thermal | BrakeThermalPage |
| `/bike-comparison` | Bike Comparison | BikeComparisonPage |
| `/parts` | Parts Design | PartsDesignPage |
| `/tires` | Tyre / Grip | TireDegradationPage |

#### Track & Competition (9)
| Route | Module | Page |
|-------|--------|------|
| `/track-evolution` | Track Evolution | TrackEvolutionPage |
| `/track-surface` | Track Surface | TrackSurfacePage |
| `/event-engine` | Event Engine | EventEnginePage |
| `/circuit-history` | Circuit History | CircuitHistoryPage |
| `/data-cube` | Data Cube | DataCubePage |
| `/championship` | Championship | ChampionshipPage |
| `/qualifying-lab` | Qualifying Lab | QualifyingLabPage |
| `/rival-radar` | Rival Radar | RivalRadarPage |
| `/strategy` | Race Strategy | RaceStrategyPage |
| `/pre-gp` | Pre-GP | PreGrandPrixPage |
| `/crew-chief` | Crew Chief | CrewChiefBoardPage |
| `/launch` | Session Launch | SessionLaunchPage |

### Demo Flow — Quick Reference

```
Step 1:  KDD Hub         → https://kdd-rjz-ui.fly.dev/
Step 2:  RCC Overview     → /overview (sidebar tour)
Step 3:  Smart Circuits   → /track-live → /track-evolution → /track-surface → /circuit-history
Step 4:  Engineering      → /engineering-control → /aerodynamics → /brake-thermal → /setup-lab
Step 5:  Pit Wall         → /oracle-pit-wall → /race-control → /rival-radar → /championship
Step 6:  AI Copilot       → /copilot
Step 7:  SpecForge        → https://ep3nru4k.insforge.site/
Step 8:  Closing          → recap on any page
```

### Screenshots to Capture

For marketing, pitch decks, or documentation:

| # | Page | Route | Notes |
|---|------|-------|-------|
| 1 | KDD Hub landing | `https://kdd-rjz-ui.fly.dev/` | Full viewport |
| 2 | RCC Overview | `/overview` | Sidebar visible |
| 3 | Track-Live | `/track-live` | Session board + metrics |
| 4 | Track Evolution | `/track-evolution` | Grip/temp panels |
| 5 | Oracle Pit Wall | `/oracle-pit-wall` | Decision card + evidence |
| 6 | Engineering Control | `/engineering-control` | Parameter grid |
| 7 | Aerodynamics | `/aerodynamics` | Aero balance metrics |
| 8 | AI Copilot | `/copilot` | Copilot response |
| 9 | SpecForge studio | `https://ep3nru4k.insforge.site/` | Optimization dashboard |
| 10 | Sidebar full | `/overview` | Scrollable sidebar capture (stitch if needed) |

### Known Issues

| Issue | Workaround | Status |
|-------|-----------|--------|
| RCC chunk size (924 kB JS) | First load may be slow. Pre-warm the tab. | ⚠️ known |
| Fly.io cold start (~2s) | Open all tabs 30s before demo | ⚠️ known |
| SpecForge URL changes | Verify current InsForge deployment URL | ⚠️ check before each demo |
| Auth screen if preview mode drops | Re-deploy with `VITE_RCC_PREVIEW_MODE=true` | 🔧 fixable |
| Copilot API timeout on first query | Cache warm: send a query before demo | ⚠️ known |

### Emergency Fallback Routes

If a specific module fails, swap to its backup:

| Primary | Backup |
|---------|--------|
| `/track-live` | `/track-evolution` |
| `/oracle-pit-wall` | `/race-control` |
| `/engineering-control` | `/electronics` |
| `/copilot` | `/autonomous-engineer` |
| SpecForge | `/parts` (in RCC) |

---

## After Demo

- [ ] Close demo tabs
- [ ] Log any issues encountered in the demo notes
- [ ] Share feedback with the engineering team
- [ ] Update this runbook if routes or URLs change
