# RCC Executive Demo Story — KDD Ecosystem Walkthrough

> **Version**: 1.1  
> **Date**: July 2026  
> **Audience**: Executives, partners, technical leads  
> **Duration**: ~25 minutes  
> **Format**: Live browser walkthrough across KDD Hub, Race Command Center, and SpecForge AI

---

## Demo Objective

Demonstrate how KDD closes the loop from **real-time track data → race decision → engineering action → optimized component**, across three integrated platforms:

| Platform | Role |
|----------|------|
| **KDD Hub (13 Gateway)** | Command gateway & service registry |
| **Race Command Center (15)** | Operational intelligence & decision support |
| **SpecForge AI (18)** | Design automation & part optimization |

---

## Target Audience

- Engineering directors / team principals
- Technical partners & investors
- Senior developers evaluating the platform
- Product managers scoping commercialization

---

## Required URLs

| Service | URL | Status |
|---------|-----|--------|
| KDD Hub | `https://kdd-rjz-ui.fly.dev/` | ✅ verified |
| RCC | `https://kdd-rjz-race.fly.dev/` | ✅ verified |
| SpecForge AI | `https://ep3nru4k.insforge.site/` | ✅ verified |
| Lightweighting Lab | `https://ep3nru4k.insforge.site/lightweighting-lab/` | ✅ verified |

---

## Demo Prerequisites

- [ ] Laptop with Chrome/Edge (latest) — full screen, 1920×1080 minimum
- [ ] All 4 tabs pre-loaded (Hub, RCC, SpecForge, Lightweighting Lab) to avoid loading delays
- [ ] RCC preview mode enabled (no auth required — VITE_RCC_PREVIEW_MODE=true)
- [ ] Stable internet connection (no VPN that interferes with Fly.io/InsForge)
- [ ] Presenter notes printed or on second monitor
- [ ] Run `DEMO_RUNBOOK.md` pre-flight checklist 15 min before demo

---

## 9-Step Walkthrough

---

### Step 1: Opening — KDD Hub

**URL**: `https://kdd-rjz-ui.fly.dev/`

**Talk Track**:

> "KDD Hub is the command gateway for the entire racing intelligence ecosystem. It connects three pillars — operational intelligence in the Race Command Center, engineering decisions, and design optimization."

**What to Show**:

1. Gateway landing page — platform overview and service health
2. Three pillars navigation: Race Command Center, SpecForge AI, Platform Services
3. Service status indicators (all green in demo mode)
4. Quick-launch to RCC

**Expected Outcome**: The audience understands this is a unified platform, not a collection of disconnected tools.

**Fallback**: If Hub is down, skip directly to RCC (it works independently) and mention "the gateway routes through our mesh — individual services remain operational."

---

### Step 2: Race Command Center — Module Landscape

**URL**: `https://kdd-rjz-race.fly.dev/overview`

**Talk Track**:

> "The Race Command Center turns telemetry, circuit context, and engineering knowledge into operational decisions. It covers the full race weekend lifecycle — from pre-GP preparation through post-session analysis."

**What to Show**:

1. Sidebar navigation — scroll through all four sections:
   - **Command** (Overview, Track-Live, Adaptive Cockpit, Telemetry, Circuit Intelligence, Setup, Digital Twin, Session Report, AI Copilot, Autonomous Engineer, Settings)
   - **Platform Intelligence** (Edge Hub, Data Lakehouse, Developer Hub, Data Trust, Connect Data, Race Control, Pit-Radio, Team Workspace, Visualization OS, Human Performance, Oracle Pit Wall, Black Box)
   - **Engineering** (Riding Style, Engineering Control, Electronics, Aerodynamics, Fuel & Energy, Chassis & Geometry, Gearing, Setup Lab, Brake Thermal, Bike Comparison, Parts Design, Tyre/Grip)
   - **Track & Competition** (Track Evolution, Track Surface, Event Engine, Circuit History, Data Cube, Championship, Qualifying Lab, Rival Radar, Race Strategy, Pre-GP, Crew Chief, Session Launch)
2. Click any module to show the dashboard template
3. Note the **Preview** badge — all demo content is mock but structurally complete

**Expected Outcome**: The audience grasps the breadth of the platform. Emphasize this is a single codebase, not 34 separate tools.

**Fallback**: If RCC is slow, open a few pre-selected modules only (Track-Live, Oracle Pit Wall, Copilot) and explain the sidebar architecture references the rest.

---

### Step 3: Smart Circuits — The Track as a Living Surface

**Route**: `/track-live`

**Talk Track**:

> "The system understands the circuit as a changing surface, not a static map. It tracks grip evolution, temperature windows, surface condition, and history — all in real time."

**What to Show**:

1. **`/track-live`** — Live session board: active sectors, current grip, wind/temp, rider delta to optimal
2. **`/track-evolution`** — Grip delta by stint, rubber-in trend line, track temp evolution, ideal operating window
3. **`/track-surface`** — Surface condition map: patches, bumps, dirty zones, corner-by-corner risk
4. **`/circuit-history`** — Historical references: past winning strategies, typical degradation curves, weather patterns, overtaking zones

**Key Detail**: Highlight that Track Evolution uses the Mugello dataset — corner names (Scarperia, San Donato, Arrabbiata) are real, and grip baselines reflect actual MotoGP values.

**Expected Outcome**: The audience sees the platform has circuit-specific intelligence, not generic metrics.

**Fallback**: If any single module fails, Tab-complete to another — all four follow the same dashboard template.

---

### Step 4: Engineering Layer — Evidence-Driven Setup

**Route**: `/engineering-control`

**Talk Track**:

> "Every setup decision in the Engineering layer is connected to evidence, risk, and expected lap-time impact. Engineers don't guess — they validate."

**What to Show**:

1. **`/engineering-control`** — Real-time parameter control: active maps, traction control, engine braking, torque curves
2. **`/electronics`** — ECU systems: wiring diagnostics, sensor health, calibration status
3. **`/aerodynamics`** — Aero balance: drag coefficient, downforce distribution, yaw sensitivity
4. **`/fuel-energy`** — Consumption model: fuel map, energy recovery, stint range prediction
5. **`/chassis-geometry`** — Geometry config: rake, trail, wheelbase, swingarm pivot, ride height
6. **`/brake-thermal`** — Brake temperature window: disc temp by corner, wear model, cooling duct efficiency
7. **`/setup-lab`** — Experiment matrix: active experiments, delta to baseline, confidence intervals

**Key Detail**: Each module has a **Decision** card with a specific recommendation (urgency, confidence, impact) and **Next Actions** — it's not a dashboard, it's a decision support system.

**Expected Outcome**: The audience understands that engineering decisions are structured, quantified, and actionable.

**Fallback**: Pick 3 modules (Engineering Control, Aerodynamics, Brake Thermal) and explain the pattern applies to all 12 engineering modules.

---

### Step 5: Strategic Intelligence — The Pit Wall

**Route**: `/oracle-pit-wall`

**Talk Track**:

> "The pit wall does not just observe — it recommends what to do next. Strategic intelligence modules combine real-time data, historical patterns, and scenario analysis."

**What to Show**:

1. **`/oracle-pit-wall`** — Predictive insights: tyre degradation forecast, pit window optimizer, overtaking probability
2. **`/race-control`** — Race direction: flag status, track limits monitoring, incident log, steward decisions
3. **`/rival-radar`** — Competitor benchmarking: sector deltas, setup comparison, rider behavior patterns
4. **`/qualifying-lab`** — Qualifying run planner: tire allocation, track evolution timing, gap analysis to Q2/Q1 cutoff
5. **`/championship`** — Season context: points scenarios, rival pressure index, risk/reward table, strategic recommendations

**Key Detail**: The **Oracle Pit Wall** module is the crown jewel — it synthesizes data from Engineering, Track, and Competition into a single actionable recommendation.

**Expected Outcome**: The audience sees that strategic decisions are backed by quantitative scenario analysis, not gut feeling.

**Fallback**: Lead with Oracle Pit Wall and Race Control — they carry the narrative. Mention the other 3 as "additional strategic modules."

---

### Step 6: AI Copilot — The Reasoning Layer

**Route**: `/copilot`

**Talk Track**:

> "The Copilot is the reasoning layer of the platform. It explains every decision, surfaces evidence, and proposes the next mission. It's governance-aware — every answer includes source, confidence, and fallback."

**What to Show**:

1. Copilot interface — question input and AI-generated response
2. Evidence panel — sources cited (sensor data, historical race data, model outputs)
3. Suggested mission — actionable next step linked to a specific module
4. Governance pipeline — confidence score, model version, trace ID

**Key Detail**: The Copilot is not a chatbot — it's a decision engine that routes to operational modules. Its recommendations are executable (e.g., "Open Setup Lab with these parameters").

**Expected Outcome**: The audience sees AI as an integrated reasoning layer, not a standalone toy.

**Fallback**: If the Copilot API has latency, show the existing page content and explain the architecture. The Copilot can be demonstrated from recorded answers.

---

### Step 7: SpecForge AI — From Decision to Design

**URL**: `https://ep3nru4k.insforge.site/`

**Talk Track**:

> "When the race evidence points to a physical improvement, SpecForge turns the decision into a design artifact. It closes the loop from track data → CAD."

**What to Show**:

1. SpecForge landing — project list and creation flow
2. Design & Part Optimization Studio — create a new optimization project
3. Dashboard view — optimization parameters, constraints, goals
4. Documentation generator — auto-generated engineering report
5. Integration back to RCC — how a part designed in SpecForge appears in Parts Design module

**Key Detail**: SpecForge is not a separate tool — it's connected to the RCC evidence pipeline. A setup recommendation from Engineering Control can become a SpecForge optimization project in one click. The Lightweighting Lab (Step 7B) is the research bridge feeding scientific validation into these design decisions.

**Expected Outcome**: The audience understands the end-to-end loop: on-track data → decision → engineered component.

**Fallback**: SpecForge is an independent deployment. If it's unavailable, show screenshots or navigate to the Parts Design module in RCC to explain the integration point.

---

### Step 7B: Research-to-Product Bridge — The Lightweighting Lab

**URL**: `https://ep3nru4k.insforge.site/lightweighting-lab/`

**Talk Track**:

> "Every engineering decision in RCC is grounded in research. The Lightweighting Lab translates structural optimization and edge-AI compression science into the operational metrics our engineers use — mass targets, confidence intervals, feasibility scores. It's not a dashboard of papers — it's a live bridge from science to the pit wall."

**What to Show**:

1. **Lightweighting Lab landing** — Research-backed optimization overview: paper citation (Scientific Reports 2026), structural (K↔H, BESO) and digital (GPTQ/AWQ, INT4) optimization concepts
2. **Bridge Map** — How research concepts map to engineering modules in RCC (material reduction → Parts Design, compression → Edge Hub, sensitivity → Setup decisions)
3. **Metric Formula Cards** — BESO sensitivity, GPTQ compression ratio, FoSdig (factor of safety digital), IPW (intelligence-per-watt) — the exact metrics that appear in RCC engineering modules
4. **Operating Point Card** — 32B INT4 example: 61→18 GB, 26→69.9 tok/s, 295→165 W — showing the practical impact of digital lightweighting
5. **(Optional) Return to SpecForge** — Open the Design Studio to show how a lightweighted component flows into CAD optimization
6. **Return to RCC** — Navigate back to any Engineering module and point out the **Research Bridge Card** at the top: "See — the K↔H formula for that upright decision is right here."

**Key Detail**: This is NOT a research paper viewer — it's a decision bridge. Every concept on this page feeds a real-time metric inside RCC engineering modules. Engineers don't leave their workflow to read a paper; the research is already inside their decision card.

**Expected Outcome**: The audience understands that KDD is scientifically grounded. Research is not a separate activity — it's embedded in the engineering workflow.

**Fallback**: If the Lightweighting Lab is unavailable, show the Research Bridge Card inside any RCC Engineering module (it links there) and explain the architecture.

---

### Step 8: Closing — The Loop

**Talk Track**:

> "KDD closes the loop: **track data → race decision → engineering action → optimized component**. Every layer feeds the next. The Copilot reasons. The Pit Wall decides. Engineering validates. SpecForge builds. And the next session starts with a better bike."

**What to Show**:

1. No new route — stay on SpecForge or RCC Overview
2. Recap the journey with a visual diagram (mental or physical):
   ```
   Track → Copilot → Pit Wall → Engineering → SpecForge → Track
   ```
3. Final message slide / summary

**Key Detail**: Emphasize the **integration**, not the individual features. The differentiator is that these aren't separate products — they're a single intelligence loop.

**Expected Outcome**: The audience leaves with a clear mental model of the KDD value proposition.

---

## Demo Narrative Summary

| Step | Theme | Key Routes | Time |
|------|-------|-----------|------|
| 1 | KDD Hub | Gateway landing | 2 min |
| 2 | RCC Landscape | Sidebar + any module | 3 min |
| 3 | Smart Circuits | `/track-live`, `/track-evolution`, `/track-surface`, `/circuit-history` | 4 min |
| 4 | Engineering | `/engineering-control`, aerodynamics, brake-thermal, setup-lab | 4 min |
| 5 | Pit Wall | `/oracle-pit-wall`, `/race-control`, `/rival-radar`, `/championship` | 3 min |
| 6 | AI Copilot | `/copilot` | 2 min |
| 7 | SpecForge | SpecForge landing + studio | 3 min |
| 7B | Research Bridge | Lightweighting Lab + RCC Research Bridge Card | 3 min |
| 8 | Closing | Recap | 1 min |
| | **Total** | | **~25 min** |

---

## Known Issues & Fallbacks

| Issue | Fallback |
|-------|----------|
| Any RCC module returns 404 | All 34 modules are mapped — if one fails, it's a deployment glitch. Open another module from the same section and continue. |
| Auth screen appears | Preview mode may have dropped. Check `VITE_RCC_PREVIEW_MODE=true` in Docker build args. If blocked, explain "auth is disabled for demo — in production this integrates with SSO." |
| SpecForge AI down | Skip to Step 8. Explain the integration architecture from the Parts Design module in RCC. |
| Lightweighting Lab down | Skip Step 7B. Show the Research Bridge Card inside any RCC Engineering module instead — the link is built into the workflow. |
| Copilot API timeout | Copilot response may take 5-10s on first query. If it fails, show the page architecture and explain the pipeline with a pre-recorded answer. |
| Slow page transitions | All RCC pages are client-side rendered React SPA — transitions are instant after initial load. Pre-warm tabs before demo. |
| Fly.io cold start | Fly.io may have cold start latency (~2s) if idle. Open all 4 tabs 30s before demo starts. |

---

## Post-Demo

- [ ] Collect audience questions — note which sections generated the most interest
- [ ] Share demo URLs for self-guided exploration
- [ ] Offer a follow-up technical deep-dive for engineering audiences
- [ ] Distribute this document as a leave-behind
