import { useState } from "react";
import {
  askBlueprintDesignBrief,
  type BlueprintPartContext,
} from "../api/copilot";
import { type PartStatus, type RiskLevel } from "../types/part";

const LIFECYCLE: PartStatus[] = [
  "concept",
  "designed",
  "simulated",
  "approved_for_manufacturing",
  "manufactured",
  "mounted",
  "tested",
];

const parts: BlueprintPartContext[] = [
  {
    part_id: "part-brake-jerez",
    name: "Brake Duct Jerez V1",
    part_type: "Cooling",
    target_circuit_id: "Jerez",
    status: "designed",
    risk_level: "low",
    expected_impact: "Stable brake pressure and reduced fade risk in long braking zones.",
    material: "PA12_CF",
    estimated_weight_g: 142,
    problem_statement: "Front brake overheating under repeated heavy braking at T1 and T5.",
    technical_hypothesis: "Increased airflow through modified duct reduces brake temperature by 15°C.",
    manufacturing_method: "SLS nylon",
  },
  {
    part_id: "part-tire-duct",
    name: "Rear Tire Cooling Duct",
    part_type: "Thermal Management",
    target_circuit_id: "Jerez",
    status: "simulated",
    risk_level: "medium",
    expected_impact: "Reduce rear carcass temperature drift in long drive phases.",
    material: "Carbon fiber composite",
    estimated_weight_g: 85,
    problem_statement: "Rear carcass temperature drift in long drive phases causes spin.",
    technical_hypothesis: "Directed airflow reduces carcass temperature accumulation.",
    manufacturing_method: "Composite layup",
  },
  {
    part_id: "part-deflector-mugello",
    name: "Low-Drag Side Deflector",
    part_type: "Aerodynamic",
    target_circuit_id: "Mugello",
    status: "concept",
    risk_level: "high",
    expected_impact: "Improve high-speed stability with minimal drag penalty.",
    material: "TBD",
    estimated_weight_g: undefined,
    problem_statement: "High-speed instability on Mugello straight causes rider confidence loss.",
    technical_hypothesis: "Shaped deflector reduces drag while adding lateral stability.",
    manufacturing_method: "TBD",
  },
];

const riskClass: Record<RiskLevel, string> = {
  low: "badge-ok",
  medium: "badge-warn",
  high: "badge-danger",
  critical: "badge-danger",
};

export type BlueprintDesignState =
  | { status: "idle" }
  | { status: "pending" }
  | { status: "success"; answer: string }
  | { status: "error"; message: string };

export type PartsDesignPageViewProps = {
  parts: BlueprintPartContext[];
  selectedPart: BlueprintPartContext;
  onSelectPart: (part: BlueprintPartContext) => void;
  blueprintState: BlueprintDesignState;
  onGenerateBlueprint: () => void | Promise<void>;
};

function formatWeight(estimatedWeightG?: number) {
  return typeof estimatedWeightG === "number" ? `${estimatedWeightG}g` : "TBD";
}

function formatStatusLabel(status: PartStatus) {
  return status.replace(/_/g, " ");
}

export function PartsDesignPageView({
  parts,
  selectedPart,
  onSelectPart,
  blueprintState,
  onGenerateBlueprint,
}: PartsDesignPageViewProps) {
  const isGenerating = blueprintState.status === "pending";

  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow">Circuit-Specific Parts</p>
        <h1 className="mt-2 text-3xl font-semibold">Parts design & validation</h1>
        <p className="mt-2 max-w-3xl text-zinc-400">
          Manage circuit-specific components from concept to simulation, approval, manufacturing,
          mounting and post-session validation.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        {parts.map((part) => (
          <button
            key={part.part_id}
            type="button"
            onClick={() => onSelectPart(part)}
            className={`rounded-2xl border p-5 text-left transition-colors ${
              selectedPart.part_id === part.part_id
                ? "border-red-600 bg-red-950/20"
                : "border-zinc-800 bg-zinc-900/60 hover:border-zinc-700"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold">{part.name}</h2>
                <p className="mt-0.5 text-xs text-zinc-500">{part.part_type}</p>
              </div>
              <span className="badge-neutral shrink-0">{part.status}</span>
            </div>
            <p className="mt-3 text-xs text-zinc-500">Target: {part.target_circuit_id}</p>
            <p className="mt-2 text-sm text-zinc-300 line-clamp-2">{part.expected_impact}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className={riskClass[part.risk_level]}>risk: {part.risk_level}</span>
              <span className="text-xs text-zinc-600">{part.material}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="panel space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold">{selectedPart.name}</h2>
            <p className="mt-0.5 text-sm text-zinc-500">
              {selectedPart.part_type} · {selectedPart.target_circuit_id}
            </p>
          </div>
          <div className="flex gap-2">
            <span className={riskClass[selectedPart.risk_level]}>risk: {selectedPart.risk_level}</span>
            <span className="badge-neutral">{selectedPart.status}</span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Problem</p>
            <p className="mt-1 text-sm text-zinc-300">{selectedPart.problem_statement}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              Technical Hypothesis
            </p>
            <p className="mt-1 text-sm text-zinc-300">{selectedPart.technical_hypothesis}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Expected Impact</p>
            <p className="mt-1 text-sm text-zinc-300">{selectedPart.expected_impact}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              Material / Weight
            </p>
            <p className="mt-1 text-sm text-zinc-300">
              {selectedPart.material} · {formatWeight(selectedPart.estimated_weight_g)}
            </p>
            <p className="mt-1 text-xs uppercase tracking-wide text-zinc-600">
              Manufacturing: {selectedPart.manufacturing_method}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onGenerateBlueprint}
            disabled={isGenerating}
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-red-950 disabled:text-red-300"
          >
            {isGenerating ? "Generating Blueprint design..." : "Generate Blueprint design"}
          </button>
          <button
            type="button"
            className="rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:text-white"
          >
            Request Simulation
          </button>
          <button
            type="button"
            className="rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:text-white"
          >
            Advance Status
          </button>
          <button
            type="button"
            className="rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:text-white"
          >
            View Evidence
          </button>
        </div>

        {blueprintState.status === "pending" && (
          <p role="status" className="text-sm text-zinc-400">
            Generating Blueprint design brief...
          </p>
        )}

        {blueprintState.status === "success" && (
          <div role="status" className="rounded-xl border border-emerald-900 bg-emerald-950/20 p-4 text-sm text-emerald-200">
            <p className="font-medium">Blueprint design brief ready</p>
            <p className="mt-2 text-emerald-100">{blueprintState.answer}</p>
          </div>
        )}

        {blueprintState.status === "error" && (
          <div role="alert" className="rounded-xl border border-red-900 bg-red-950/20 p-4 text-sm text-red-200">
            Blueprint generation failed: {blueprintState.message}
          </div>
        )}
      </div>

      <div className="panel">
        <h2 className="mb-4 text-sm font-semibold text-zinc-400">Part Lifecycle</h2>
        <div className="flex flex-wrap gap-1.5">
          {LIFECYCLE.map((step, index) => {
            const activeIndex = LIFECYCLE.indexOf(selectedPart.status);
            const isPast = index < activeIndex;
            const isCurrent = index === activeIndex;
            return (
              <div
                key={step}
                className={`min-w-[90px] flex-1 rounded-lg border px-2 py-2 text-center text-xs capitalize transition-colors ${
                  isCurrent
                    ? "border-red-600 bg-red-950/30 font-semibold text-red-300"
                    : isPast
                      ? "border-zinc-700 bg-zinc-900 text-zinc-400"
                      : "border-zinc-800 bg-zinc-950 text-zinc-600"
                }`}
              >
                {formatStatusLabel(step)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function PartsDesignPage() {
  const [selectedPart, setSelectedPart] = useState<BlueprintPartContext>(parts[0]);
  const [blueprintState, setBlueprintState] = useState<BlueprintDesignState>({ status: "idle" });

  const handleGenerateBlueprint = async () => {
    setBlueprintState({ status: "pending" });
    try {
      const response = await askBlueprintDesignBrief(selectedPart);
      setBlueprintState({ status: "success", answer: response.answer });
    } catch (error) {
      setBlueprintState({
        status: "error",
        message: error instanceof Error ? error.message : "Blueprint generation failed",
      });
    }
  };

  return (
    <PartsDesignPageView
      parts={parts}
      selectedPart={selectedPart}
      onSelectPart={(part) => {
        setSelectedPart(part);
        setBlueprintState({ status: "idle" });
      }}
      blueprintState={blueprintState}
      onGenerateBlueprint={handleGenerateBlueprint}
    />
  );
}
