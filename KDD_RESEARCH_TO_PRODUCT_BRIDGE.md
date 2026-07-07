# Research-to-Product Bridge — Lightweighting Lab Integration

> **Phase**: 18.9  
> **Status**: ✅ Implemented on Fly / ⚠️ InsForge deploy verification pending  
> **Date**: July 2026  
> **Paper**: "Structural optimization principles for edge AI in motorsport telemetry"  
> **DOI**: 10.1038/s41598-026-49736-0

---

## What This Is

The Research-to-Product Bridge connects the **Lightweighting Lab** (SpecForge, Phase 18.8) into the operational workflow of the **Race Command Center** (RCC) and the **KDD Hub** (Gateway 13). It ensures that scientific research is not a separate artifact but is embedded in the engineering decision-making process.

---

## Architecture

```
┌─────────────────────────────────────────────┐
│              SpecForge AI                    │
│  ┌──────────────────────────────────────┐   │
│  │         Lightweighting Lab            │   │
│  │  - Bridge Map                        │   │
│  │  - Metric Formula Cards              │   │
│  │  - Operating Point Card              │   │
│  │  - Pipeline Steps                    │   │
│  └────────────┬─────────────────────────┘   │
└───────────────┼─────────────────────────────┘
                │ Research Bridge Card
                ▼
┌─────────────────────────────────────────────┐
│         Race Command Center (RCC)            │
│  ┌─────────────┐  ┌──────────────────────┐  │
│  │ Engineering  │  │     AI Copilot       │  │
│  │ Modules (7)  │  │ - Lightweighting     │  │
│  │ + Parts      │  │   mission            │  │
│  │ Design (1)   │  │ - K<->H prompts      │  │
│  └─────────────┘  └──────────────────────┘  │
└───────────────┬─────────────────────────────┘
                │ Deep Link
                ▼
┌─────────────────────────────────────────────┐
│         KDD Hub (Gateway 13)                 │
│  - Settings > Pillars > Lightweighting Lab   │
│  - Service health indicator                  │
└─────────────────────────────────────────────┘
```

---

## Integration Points

### 1. Engineering Modules — Research Bridge Card

| Module | Route | Integration |
|--------|-------|-------------|
| Engineering Control | `/engineering-control` | ✅ Via ModuleDashboardTemplate |
| Chassis & Geometry | `/chassis-geometry` | ✅ Via ModuleDashboardTemplate |
| Brake Thermal | `/brake-thermal` | ✅ Via ModuleDashboardTemplate |
| Aerodynamics | `/aerodynamics` | ✅ Via ModuleDashboardTemplate |
| Fuel & Energy | `/fuel-energy` | ✅ Via ModuleDashboardTemplate |
| Setup Lab | `/setup-lab` | ✅ Via ModuleDashboardTemplate |
| Bike Comparison | `/bike-comparison` | ✅ Via ModuleDashboardTemplate |
| Parts Design | `/parts` | ✅ Direct import — wraps `PartsDesignPageView` |

**File**: `frontend/src/components/rcc/ResearchBridgeCard.tsx`  
**Data**: `frontend/src/data/rcc-research-bridge-data.ts`  
**Template**: `frontend/src/components/rcc/ModuleDashboardTemplate.tsx` (conditional render for `ENGINEERING_MODULES_WITH_BRIDGE`)

### 2. AI Copilot — Research Prompts

| Location | Change |
|----------|--------|
| Decision Loop group | New prompt: "Explain how K<->H lightweighting supports this engineering decision using FoSdig and IPW metrics." |
| Mission Builder group | New prompt: "Validate a lightweighting decision: compare physical mass reduction and digital model compression using the K<->H research bridge." |
| Prompt groups | Lightweighting research prompts added to Decision Loop and Mission Builder |

**File**: `frontend/src/data/copilot-data.ts`

### 3. KDD Hub — Deep Link

| Group | Entry | URL |
|-------|-------|-----|
| Pillars | SpecForge — Lightweighting Lab | `https://ep3nru4k.insforge.site/lightweighting-lab/` |

**File**: `13-ui-command-center/src/pages/SettingsPage.tsx`

### 4. Demo Story

| Document | Update |
|----------|--------|
| `RCC_EXECUTIVE_DEMO_STORY.md` | New Step 7B (Research-to-Product Bridge), 8→9 steps, updated narrative table, Known Issues |
| `DEMO_RUNBOOK.md` | 4th tab, Lightweighting Lab smoke test, flow quick-ref updated, screenshot, fallback |

---

## Data Flow

```
Lightweighting Lab (research artifacts)
        │
        ▼
rcc-research-bridge-data.ts (constants: URL, concepts, evidence, CTA)
        │
        ▼
ResearchBridgeCard.tsx (UI component — amber card with CTA link)
        │
        ├──► ModuleDashboardTemplate.tsx (7 engineering modules)
        └──► PartsDesignPage.tsx (custom page, direct wrap)
```

---

## Key Metrics Linked

| Metric | Lab Concept | RCC Engineering Application |
|--------|-------------|----------------------------|
| BESO sensitivity | Structural element removal priority | Decision confidence in Engineering Control |
| GPTQ/AWQ compression | 4-bit quantized model size (61→18 GB) | Edge Hub model deployment decisions |
| FoSdig | Factor-of-safety digital | Risk assessment in decision cards |
| IPW | Intelligence-per-watt (26→69.9 tok/s/W) | Edge compute feasibility |
| INT4 operating point | 295→165 W power reduction | Thermal/power budget in Brake Thermal |

---

## Files Changed

### Race Command Center (15)
| File | Change |
|------|--------|
| `frontend/src/data/rcc-research-bridge-data.ts` | **NEW** — Shared data constants |
| `frontend/src/components/rcc/ResearchBridgeCard.tsx` | **NEW** — Amber research card component |
| `frontend/src/components/rcc/ModuleDashboardTemplate.tsx` | Import + conditional render for engineering modules |
| `frontend/src/pages/PartsDesignPage.tsx` | Import + wrap in div with ResearchBridgeCard |
| `frontend/src/data/copilot-data.ts` | 2 new lightweighting prompts added |
| `RCC_EXECUTIVE_DEMO_STORY.md` | Step 7B, 9 steps, updated tables |
| `DEMO_RUNBOOK.md` | 4 tabs, Lightweighting Lab smoke/fallback |
| `KDD_RESEARCH_TO_PRODUCT_BRIDGE.md` | **NEW** — This document |

### KDD Hub (13)
| File | Change |
|------|--------|
| `src/pages/SettingsPage.tsx` | New Pillars entry for Lightweighting Lab |

---

## Verification

- [x] 8 engineering modules show Research Bridge Card
- [x] Card links to `https://ep3nru4k.insforge.site/lightweighting-lab/`
- [x] Copilot shows lightweighting prompts in Decision Loop + Mission Builder
- [x] Gateway 13 Settings > Pillars shows Lightweighting Lab
- [x] Lightweighting Lab URL returns 200
- [x] RCC builds with no errors
- [x] Gateway 13 builds with no errors
- [x] RCC Fly deploy verified
- [x] Gateway 13 Fly deploy verified
- [x] HTTP smoke test passed: 14/14
- [ ] RCC InsForge deploy verification pending
- [ ] Gateway 13 InsForge deploy verification pending

---

## Closure Note

Phase 18.9 is closed functionally and on Fly deployments. The only remaining closure item is InsForge deployment verification for RCC and Gateway 13 once the InsForge CLI is available in the environment.

Pending InsForge checks:

### RCC / 15

Validate the InsForge deployment routes:

- `/engineering-control`
- `/brake-thermal`
- `/setup-lab`
- `/chassis-geometry`
- `/parts`
- `/copilot`

### Gateway / 13

Validate:

- Settings → Pillars → SpecForge → Lightweighting Lab

Unicode note: the `K↔H` content check can accept equivalent variants such as `K <-> H`, `K-H`, `K to H`, or references to stiffness matrix / Hessian mapping.
