import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, Database, Flag, Gauge, RadioTower, ShieldCheck } from "lucide-react";
import {
  CIRCUIT_OPTIONS,
  DATA_SOURCE_OPTIONS,
  GARAGE_OPTIONS,
  MODE_OPTIONS,
} from "../data/session-launch-data";
import { useRaceSession } from "../hooks/useRaceSession";
import { cn } from "../lib/cn";
import {
  CIRCUIT_READINESS,
  TELEMETRY_STATUSES,
  type CircuitOption,
  type DataSourceOption,
  type GarageOption,
  type ModeOption,
  type RaceSessionContext,
} from "../types/race-session";

const WIZARD_STEPS = ["01 Circuit", "02 Garage", "03 Mode", "04 Data", "05 Launch"] as const;

function readinessClass(readiness: CircuitOption["readiness"]) {
  if (readiness === CIRCUIT_READINESS.READY) return "border-kdd-green/40 text-kdd-green bg-kdd-green-dim";
  if (readiness === CIRCUIT_READINESS.PARTIAL) return "border-kdd-orange/40 text-kdd-orange bg-kdd-orange-dim";
  return "border-kdd-purple/40 text-kdd-purple bg-kdd-purple-dim";
}

function telemetryClass(status: DataSourceOption["telemetryStatus"]) {
  if (status === TELEMETRY_STATUSES.READY) return "border-kdd-cyan/40 text-kdd-cyan bg-kdd-cyan-dim";
  if (status === TELEMETRY_STATUSES.PARTIAL) return "border-kdd-orange/40 text-kdd-orange bg-kdd-orange-dim";
  return "border-kdd-purple/40 text-kdd-purple bg-kdd-purple-dim";
}

function PanelHeader({ kicker, title, copy }: { kicker: string; title: string; copy: string }) {
  return (
    <div className="space-y-2">
      <p className="font-kdd-mono text-xs uppercase tracking-[0.26em] text-kdd-cyan">{kicker}</p>
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <h2 className="text-2xl font-semibold text-kdd-text">{title}</h2>
        <p className="max-w-2xl text-sm leading-6 text-kdd-muted">{copy}</p>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-kdd-md border border-kdd-border bg-kdd-surface p-3">
      <p className="text-[11px] uppercase tracking-[0.18em] text-kdd-dim">{label}</p>
      <p className="mt-1 font-kdd-mono text-sm text-kdd-text tabular-nums">{value}</p>
    </div>
  );
}

export function SessionLaunchPage() {
  const navigate = useNavigate();
  const { setSession } = useRaceSession();
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedCircuitId, setSelectedCircuitId] = useState(CIRCUIT_OPTIONS[0].id);
  const [selectedGarageId, setSelectedGarageId] = useState(GARAGE_OPTIONS[0].id);
  const [selectedModeId, setSelectedModeId] = useState(MODE_OPTIONS[0].id);
  const [selectedDataSourceId, setSelectedDataSourceId] = useState(DATA_SOURCE_OPTIONS[2].id);

  const selectedCircuit = CIRCUIT_OPTIONS.find((circuit) => circuit.id === selectedCircuitId) ?? CIRCUIT_OPTIONS[0];
  const selectedGarage = GARAGE_OPTIONS.find((garage) => garage.id === selectedGarageId) ?? GARAGE_OPTIONS[0];
  const selectedMode = MODE_OPTIONS.find((mode) => mode.id === selectedModeId) ?? MODE_OPTIONS[0];
  const selectedDataSource =
    DATA_SOURCE_OPTIONS.find((source) => source.id === selectedDataSourceId) ?? DATA_SOURCE_OPTIONS[2];

  function buildSessionContext(): RaceSessionContext {
    return {
      circuitId: selectedCircuit.id,
      circuitName: selectedCircuit.name,
      circuitConfidence: selectedCircuit.confidence,
      riderId: selectedGarage.id,
      riderName: selectedGarage.riderName,
      bikeId: selectedGarage.bikeId,
      bikeName: selectedGarage.bikeName,
      mode: selectedMode.id,
      dataSource: selectedDataSource.id,
      telemetryStatus: selectedDataSource.telemetryStatus,
      activeModules: selectedMode.activeModules,
    };
  }

  function handleLaunch() {
    setSession(buildSessionContext());
    navigate("/pitwall");
  }

  const canGoBack = stepIndex > 0;
  const isLaunchStep = stepIndex === WIZARD_STEPS.length - 1;

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <section className="rounded-kdd-xl border border-kdd-border bg-kdd-card p-5 md:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="font-kdd-mono text-xs uppercase tracking-[0.3em] text-kdd-purple">Mission Control</p>
            <h1 className="mt-2 text-3xl font-semibold text-kdd-text">Session Launch Flow</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-kdd-muted">
              Establish the operating context before PitWall or Copilot come online. This keeps the preview UI honest:
              circuit, garage, mode and data readiness are explicit before any decision surface opens.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:min-w-[420px]">
            <Metric label="Circuit" value={`${selectedCircuit.confidence}%`} />
            <Metric label="Telemetry" value={selectedDataSource.telemetryStatus.toUpperCase()} />
            <Metric label="Modules" value={String(selectedMode.activeModules.length).padStart(2, "0")} />
            <Metric label="Mode" value={selectedMode.label} />
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[280px_1fr]">
        <aside className="rounded-kdd-xl border border-kdd-border bg-kdd-card p-4">
          <nav className="flex flex-col gap-2" aria-label="Session launch steps">
            {WIZARD_STEPS.map((step, index) => (
              <button
                key={step}
                type="button"
                onClick={() => setStepIndex(index)}
                className={cn(
                  "flex min-h-[44px] items-center justify-between rounded-kdd-md border px-3 py-2 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kdd-cyan",
                  index === stepIndex
                    ? "border-kdd-cyan/40 bg-kdd-cyan-dim text-kdd-text"
                    : "border-kdd-border bg-kdd-surface text-kdd-muted hover:border-kdd-border-bright hover:text-kdd-text"
                )}
              >
                <span className="font-kdd-mono tabular-nums">{step}</span>
                {index < stepIndex ? <CheckCircle2 className="h-4 w-4 text-kdd-green" aria-hidden="true" /> : null}
              </button>
            ))}
          </nav>
        </aside>

        <section className="rounded-kdd-xl border border-kdd-border bg-kdd-card p-5 md:p-6">
          {stepIndex === 0 ? (
            <div className="space-y-6">
              <PanelHeader
                kicker="Circuit gate"
                title="Choose circuit intelligence"
                copy="Select the track model that will anchor confidence, sector logic and telemetry readiness for the session."
              />
              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                {CIRCUIT_OPTIONS.map((circuit) => (
                  <button
                    key={circuit.id}
                    type="button"
                    onClick={() => setSelectedCircuitId(circuit.id)}
                    className={cn(
                      "min-h-[44px] rounded-kdd-lg border bg-kdd-surface p-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kdd-cyan",
                      circuit.id === selectedCircuitId
                        ? "border-kdd-cyan/50"
                        : "border-kdd-border hover:border-kdd-border-bright"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-kdd-text">{circuit.name}</h3>
                        <p className="text-sm text-kdd-muted">{circuit.country}</p>
                      </div>
                      <span className={cn("rounded-kdd-pill border px-2 py-1 font-kdd-mono text-xs", readinessClass(circuit.readiness))}>
                        {circuit.readiness}
                      </span>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <Metric label="Confidence" value={`${circuit.confidence}%`} />
                      <Metric label="Sectors" value={circuit.sectors} />
                      <Metric label="Corners" value={circuit.corners} />
                      <Metric label="Elevation" value={circuit.elevation} />
                    </div>
                    <p className="mt-4 text-sm leading-6 text-kdd-muted">{circuit.intelligenceSummary}</p>
                    <p className="mt-3 font-kdd-mono text-xs text-kdd-cyan">{circuit.telemetryReadiness}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {stepIndex === 1 ? (
            <div className="space-y-6">
              <PanelHeader
                kicker="Garage gate"
                title="Confirm rider, bike and operating envelope"
                copy="The garage gate keeps setup baseline, tyre profile and risk posture visible before decisions are launched."
              />
              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                {GARAGE_OPTIONS.map((garage) => (
                  <button
                    key={garage.id}
                    type="button"
                    onClick={() => setSelectedGarageId(garage.id)}
                    className={cn(
                      "min-h-[44px] rounded-kdd-lg border bg-kdd-surface p-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kdd-cyan",
                      garage.id === selectedGarageId
                        ? "border-kdd-cyan/50"
                        : "border-kdd-border hover:border-kdd-border-bright"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Gauge className="h-5 w-5 text-kdd-cyan" aria-hidden="true" />
                      <div>
                        <h3 className="text-lg font-semibold text-kdd-text">{garage.riderName}</h3>
                        <p className="text-sm text-kdd-muted">{garage.bikeName}</p>
                      </div>
                    </div>
                    <div className="mt-4 grid gap-2">
                      <Metric label="Setup baseline" value={garage.setupBaseline} />
                      <Metric label="Tyre profile" value={garage.tyreProfile} />
                      <Metric label="Risk profile" value={garage.riskProfile} />
                      <Metric label="Garage readiness" value={garage.garageReadiness} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {stepIndex === 2 ? (
            <div className="space-y-6">
              <PanelHeader
                kicker="Session mode"
                title="Select decision mode"
                copy="Mode determines which PitWall modules wake up first and what kind of reasoning is allowed."
              />
              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                {MODE_OPTIONS.map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setSelectedModeId(mode.id)}
                    className={cn(
                      "min-h-[44px] rounded-kdd-lg border bg-kdd-surface p-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kdd-purple",
                      mode.id === selectedModeId ? "border-kdd-purple/50" : "border-kdd-border hover:border-kdd-border-bright"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="h-5 w-5 text-kdd-purple" aria-hidden="true" />
                      <h3 className="text-lg font-semibold text-kdd-text">{mode.label}</h3>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-kdd-muted">{mode.reasoning}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {mode.activeModules.map((module) => (
                        <span key={module} className="rounded-kdd-pill border border-kdd-purple/30 bg-kdd-purple-dim px-2 py-1 font-kdd-mono text-xs text-kdd-purple">
                          {module}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {stepIndex === 3 ? (
            <div className="space-y-6">
              <PanelHeader
                kicker="Data source"
                title="Bind telemetry or choose graceful degradation"
                copy="Preview continuity matters: if live data is unavailable, the launch context records the fallback explicitly."
              />
              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                {DATA_SOURCE_OPTIONS.map((source) => (
                  <button
                    key={source.id}
                    type="button"
                    onClick={() => setSelectedDataSourceId(source.id)}
                    className={cn(
                      "min-h-[44px] rounded-kdd-lg border bg-kdd-surface p-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kdd-cyan",
                      source.id === selectedDataSourceId ? "border-kdd-cyan/50" : "border-kdd-border hover:border-kdd-border-bright"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {source.id === "live" ? (
                          <RadioTower className="h-5 w-5 text-kdd-cyan" aria-hidden="true" />
                        ) : (
                          <Database className="h-5 w-5 text-kdd-cyan" aria-hidden="true" />
                        )}
                        <h3 className="text-lg font-semibold text-kdd-text">{source.label}</h3>
                      </div>
                      <span className={cn("rounded-kdd-pill border px-2 py-1 font-kdd-mono text-xs", telemetryClass(source.telemetryStatus))}>
                        {source.telemetryStatus.toUpperCase()}
                      </span>
                    </div>
                    <p className="mt-4 font-kdd-mono text-xs leading-5 text-kdd-cyan">{source.channelStatus}</p>
                    <p className="mt-3 text-sm leading-6 text-kdd-muted">{source.degradationCopy}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {stepIndex === 4 ? (
            <div className="space-y-6">
              <PanelHeader
                kicker="Launch brief"
                title="Review operating context"
                copy="This is the session contract stored for preview continuity before routing to the Digital Pit-Wall."
              />
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                <Metric label="Circuit" value={selectedCircuit.name} />
                <Metric label="Rider" value={selectedGarage.riderName} />
                <Metric label="Bike" value={selectedGarage.bikeName} />
                <Metric label="Mode" value={selectedMode.label} />
                <Metric label="Data source" value={selectedDataSource.label} />
                <Metric label="Telemetry status" value={selectedDataSource.telemetryStatus.toUpperCase()} />
                <Metric label="Circuit confidence" value={`${selectedCircuit.confidence}%`} />
                <Metric label="Readiness" value={selectedCircuit.readiness} />
                <Metric label="Active modules" value={String(selectedMode.activeModules.length).padStart(2, "0")} />
              </div>
              <div className="rounded-kdd-lg border border-kdd-purple/30 bg-kdd-purple-dim p-4">
                <p className="font-kdd-mono text-xs uppercase tracking-[0.22em] text-kdd-purple">Active modules</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedMode.activeModules.map((module) => (
                    <span key={module} className="rounded-kdd-pill border border-kdd-purple/30 bg-kdd-surface px-2 py-1 font-kdd-mono text-xs text-kdd-text">
                      {module}
                    </span>
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={handleLaunch}
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-kdd-md bg-kdd-accent px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-kdd-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kdd-accent"
              >
                <Flag className="h-4 w-4" aria-hidden="true" />
                Launch Digital Pit-Wall
              </button>
            </div>
          ) : null}

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-kdd-border pt-5 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => setStepIndex((current) => Math.max(0, current - 1))}
              disabled={!canGoBack}
              className="min-h-[44px] rounded-kdd-md border border-kdd-border px-4 py-2 text-sm text-kdd-muted transition-colors hover:border-kdd-border-bright hover:text-kdd-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kdd-cyan disabled:cursor-not-allowed disabled:opacity-40"
            >
              Back
            </button>
            {!isLaunchStep ? (
              <button
                type="button"
                onClick={() => setStepIndex((current) => Math.min(WIZARD_STEPS.length - 1, current + 1))}
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-kdd-md border border-kdd-cyan/40 bg-kdd-cyan-dim px-4 py-2 text-sm font-semibold text-kdd-cyan transition-colors hover:border-kdd-cyan focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kdd-cyan"
              >
                Continue
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}
