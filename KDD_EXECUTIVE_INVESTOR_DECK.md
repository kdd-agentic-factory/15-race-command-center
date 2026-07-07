# KDD Agentic Factory

## Executive / Investor Deck Master Script

> **Phase**: 18.10A  
> **Artifact**: Executive Deck Design System  
> **Status**: Draft v1  
> **Repo**: `15-race-command-center`  
> **Message**: KDD closes the loop from track data to engineering decisions and optimized components.

---

## Pre-flight

Before using this deck in a live executive or investor demo:

1. Verify RCC on InsForge.
2. Verify Gateway on InsForge.
3. Confirm Research-to-Product Bridge links appear on InsForge.
4. Use Fly as the validated fallback.

Current deployment state:

| Surface | Status |
|---------|--------|
| RCC Fly | Verified |
| Gateway Fly | Verified |
| Smoke HTTP | 14/14 OK |
| RCC InsForge | Pending verification |
| Gateway InsForge | Pending verification |

Validated fallback URLs:

| Product | URL |
|---------|-----|
| KDD Hub | `https://kdd-rjz-ui.fly.dev/` |
| RCC | `https://kdd-rjz-race.fly.dev/` |
| SpecForge | `https://ep3nru4k.insforge.site/` |
| Lightweighting Lab | `https://ep3nru4k.insforge.site/lightweighting-lab/` |

---

## Deck Principles

- One idea per slide.
- Minimal slide text. Speaker notes carry nuance.
- Use screenshots only with callouts.
- Use diagrams to show loops, stack responsibility and product handoff.
- Use red for risk, warnings and race-critical action.
- Use cyan for telemetry, data, AI reasoning and metric emphasis.
- Use violet or steel blue for research and K↔H bridge material.
- Avoid generic SaaS gradients, decorative AI wallpaper and overloaded architecture diagrams.

---

# Slide 1: Cover

## Title

KDD Agentic Factory

## On-slide copy

From Track Data to Engineering Decisions and Optimized Components

KDD closes the loop from track data to engineering decisions and optimized components.

## Speaker notes

KDD addresses a specific motorsport problem. Teams collect telemetry, rider feedback, setup notes, strategy data and design constraints, but those signals still move through separate tools. KDD connects the loop from track signal to engineering action.

## Visual direction

Use a dark race-control opening screen. Place the title on the left and the closed loop diagram on the right. Keep the background near black with a thin telemetry grid, not a decorative gradient.

## Assets needed

- KDD logo or wordmark.
- Composite screenshot: Hub, RCC and SpecForge.
- Closed loop diagram.

## Routes/screenshots to capture

- `https://kdd-rjz-ui.fly.dev/`
- `https://kdd-rjz-race.fly.dev/overview`
- `https://ep3nru4k.insforge.site/`

## Design intent

This slide should feel like a premium race-control opening screen, not an academic title page.

---

# Slide 2: The Problem

## Title

Racing data is abundant. Decisions are fragmented.

## On-slide copy

Telemetry, setup notes, rider feedback, strategy, simulation and design work live in separate systems.

The cost is slow decisions.

## Speaker notes

Modern teams do not lack data. They lack a shared decision context during the race weekend. Trackside engineers, analysts, strategy teams and design teams often interpret separate evidence and hand work across tools.

## Visual direction

Show a fractured workflow with four compact panels: telemetry, pit wall, engineering setup and part design. Connect them with broken lines. Do not use cartoon icons.

## Assets needed

- Telemetry screenshot.
- RCC decision card screenshot.
- Engineering module screenshot.
- SpecForge screenshot.

## Routes/screenshots to capture

- `/track-live`
- `/engineering-control`
- `/parts`
- SpecForge `/dashboard/`

## Design intent

Make fragmentation visible. The audience should feel the handoff cost before hearing the solution.

---

# Slide 3: The Loop

## Title

The closed decision loop

## On-slide copy

Track data → AI reasoning → engineering decision → optimized component → better next session

## Speaker notes

KDD treats the race weekend as a loop. RCC observes the bike and circuit. The Copilot explains evidence. Engineering modules convert the signal into action. SpecForge turns validated needs into optimized design artifacts.

## Visual direction

Use one large loop diagram. Put Track Data at the top, RCC and Copilot on the right, Engineering and SpecForge at the bottom, and Optimized Component feeding back into Track.

## Assets needed

- Loop diagram.
- Small route labels for each node.
- One metric strip under the loop.

## Routes/screenshots to capture

- `/overview`
- `/copilot`
- `/engineering-control`
- SpecForge `/projects/new/`

## Design intent

Make the closed loop impossible to miss. The audience should understand in five seconds that KDD connects data, reasoning, engineering and design.

---

# Slide 4: KDD Hub

## Title

KDD Hub: one gateway for the ecosystem

## On-slide copy

- Service registry
- Product navigation
- Operational health
- Executive control surface

## Speaker notes

The Hub gives teams one entry point. It routes operators into RCC, exposes SpecForge, shows service health and gives leadership a clear view of the platform surface.

## Visual direction

Use a left narrative column with four short labels. Place a cropped Gateway screenshot on the right, framed like a command-center monitor. Add one callout on Settings → Pillars.

## Assets needed

- Gateway landing screenshot.
- Settings page screenshot.
- Pillars group callout with Lightweighting Lab link.

## Routes/screenshots to capture

- Gateway `/`
- Gateway Settings → Pillars

## Design intent

Show the Hub as ecosystem control, not a website homepage.

---

# Slide 5: Race Command Center

## Title

Race Command Center: PitWall OS

## On-slide copy

RCC turns race-weekend data into operational decisions.

Evidence. Risk. Confidence. Recommendation. Next action.

## Speaker notes

RCC is not another telemetry dashboard. Dashboards display numbers. RCC structures decisions. Each module shows evidence, confidence, risk and the action an engineer can validate.

## Visual direction

Show a large RCC screenshot with three callouts: Decision, Evidence and Risk/Confidence. Keep copy sparse. Use red only on action or risk callout.

## Assets needed

- RCC overview screenshot.
- Oracle Pit Wall screenshot.
- Decision card close crop.

## Routes/screenshots to capture

- `/overview`
- `/oracle-pit-wall`
- `/engineering-control`

## Design intent

Show RCC as an operational decision system, not as a dashboard.

---

# Slide 6: Smart Circuits

## Title

Smart Circuits: the circuit as a living surface

## On-slide copy

Grip evolves. Temperature moves. Rubber builds. Wind changes braking and exit behavior.

## Speaker notes

The same setup decision means something different at Mugello, Aragón or Jerez. Smart Circuits gives RCC circuit-aware context so recommendations account for track surface, history, grip evolution and sector behavior.

## Visual direction

Use a circuit map or track-live screenshot as the main visual. Place a compact metric strip for grip, temperature, wind and sector risk.

## Assets needed

- Track Live screenshot.
- Track Evolution screenshot.
- Track Surface screenshot.
- Circuit History screenshot.

## Routes/screenshots to capture

- `/track-live`
- `/track-evolution`
- `/track-surface`
- `/circuit-history`

## Design intent

Make the circuit feel operational. The audience should see that track context changes the recommendation.

---

# Slide 7: Engineering Intelligence

## Title

Engineering Intelligence: from signal to setup action

## On-slide copy

Setup. Aero. Chassis. Brake thermal. Fuel and energy. Electronics. Parts design.

## Speaker notes

This layer gives engineers structured decisions. KDD does not replace engineering judgment. It gives the engineer evidence, tradeoffs and a measurable action path.

## Visual direction

Use a 2x3 module matrix with one large active panel. Include the Research Bridge Card as a callout, not as a footer.

## Assets needed

- Engineering Control screenshot.
- Aerodynamics screenshot.
- Brake Thermal screenshot.
- Chassis Geometry screenshot.
- Research Bridge Card close crop.

## Routes/screenshots to capture

- `/engineering-control`
- `/aerodynamics`
- `/brake-thermal`
- `/chassis-geometry`
- `/fuel-energy`
- `/setup-lab`
- `/parts`

## Design intent

Show engineering modules as decision surfaces with evidence, not static monitoring pages.

---

# Slide 8: AI Copilot

## Title

AI Copilot: explanation and mission generation

## On-slide copy

The Copilot explains why a recommendation exists, what evidence supports it and what mission the team should run next.

## Speaker notes

The Copilot works from RCC context. It does not answer generic questions. It explains the current recommendation, cites supporting evidence and proposes a validation mission.

## Visual direction

Show the Copilot interface with prompt chips and evidence panel. Highlight one lightweighting prompt. Use cyan for AI reasoning and amber for pending validation.

## Assets needed

- Copilot interface screenshot.
- Prompt group close crop.
- Evidence panel close crop.

## Routes/screenshots to capture

- `/copilot`

## Design intent

Position Copilot as the reasoning layer inside the workflow, not as a chatbot bolted onto the product.

---

# Slide 9: SpecForge AI

## Title

SpecForge AI: from decision to optimized design

## On-slide copy

When evidence points to a physical improvement, SpecForge turns the decision into a design artifact.

## Speaker notes

SpecForge connects the pit wall to design. If the engineering decision calls for mass reduction, stiffness change or thermal improvement, SpecForge carries the need into design and part optimization.

## Visual direction

Use a handoff composition: RCC decision on the left, SpecForge optimization studio on the right. Connect them with one clean arrow labeled Design Handoff.

## Assets needed

- SpecForge landing screenshot.
- Optimization studio screenshot.
- RCC Parts Design screenshot.

## Routes/screenshots to capture

- SpecForge `/`
- SpecForge `/dashboard/`
- SpecForge `/projects/new/`
- RCC `/parts`

## Design intent

Make SpecForge feel like the design execution layer for validated engineering needs.

---

# Slide 10: Lightweighting Lab

## Title

Lightweighting Lab: research-to-product bridge

## On-slide copy

K↔H connects structural optimization and digital compression.

Physical side: BESO / topology optimization  
Digital side: GPTQ / AWQ / INT4  
Operational metrics: FoSdig / IPW

## Speaker notes

The paper gives KDD a scientific bridge. On the physical side, BESO and topology optimization reduce unnecessary structure. On the digital side, GPTQ, AWQ and INT4 reduce model weight. FoSdig and IPW make those tradeoffs usable inside engineering workflows.

## Visual direction

Build a split diagram. Left side: physical mass reduction. Right side: digital model compression. Center: K↔H bridge. Place FoSdig and IPW as operational metrics under the bridge.

## Assets needed

- Lightweighting Lab screenshot.
- Bridge Map screenshot.
- Metric Formula Cards screenshot.
- Operating Point Card screenshot.

## Routes/screenshots to capture

- SpecForge `/lightweighting-lab/`

## Design intent

Make the paper feel like product capability. The K↔H bridge should read as a simple operational model: physical mass reduction on one side, digital model compression on the other.

---

# Slide 11: Architecture

## Title

Architecture: connected products, clear responsibilities

## On-slide copy

13: KDD Hub  
15: Race Command Center  
16: Intelligence and orchestration  
24: Governance and data trust  
03/18: Product and SpecForge layer

## Speaker notes

KDD is an ecosystem with separated responsibilities. The Hub controls access and navigation. RCC handles race operations. Intelligence services reason over data. Governance tracks trust. SpecForge handles design optimization.

## Visual direction

Use an architecture stack, not an infrastructure map. Show each product layer as a clean horizontal band with one responsibility and one URL or route example.

## Assets needed

- Architecture stack diagram.
- Route labels.
- Small product thumbnails.

## Routes/screenshots to capture

- Gateway `/`
- RCC `/overview`
- RCC `/data-trust`
- SpecForge `/`

## Design intent

Show clear responsibilities, not infrastructure complexity.

---

# Slide 12: Demo Flow

## Title

Live demo: follow the loop

## On-slide copy

1. KDD Hub
2. RCC overview
3. Smart Circuits
4. Engineering Intelligence
5. Oracle Pit Wall
6. AI Copilot
7. SpecForge AI
8. Lightweighting Lab
9. Closing loop

## Speaker notes

The demo follows the loop. We start at the Hub, move into RCC, show circuit context, open engineering modules, explain a recommendation with Copilot, then move into SpecForge and Lightweighting Lab.

## Visual direction

Use a route checklist with a thin progress rail. Put fallback badges beside routes that have Fly verified.

## Assets needed

- Demo route checklist.
- `RCC_EXECUTIVE_DEMO_STORY.md` references.
- `DEMO_RUNBOOK.md` references.

## Routes/screenshots to capture

- All routes listed in the asset capture checklist.

## Design intent

Make the demo feel controlled. Investors should see a rehearsed product journey, not a loose tour.

---

# Slide 13: Why Now

## Title

Why now: edge AI meets motorsport constraints

## On-slide copy

Motorsport needs AI under latency, power, weight, trust and traceability constraints.

## Speaker notes

Generic cloud AI demos do not solve trackside decisions. Motorsport needs low latency, explainability, edge deployment and engineering traceability. The Lightweighting Lab matters because it links physical and digital constraints.

## Visual direction

Use one metric strip and one constraint diagram. Do not use a generic AI chip illustration.

## Assets needed

- Operating point metric strip.
- Edge AI constraint diagram.
- Lightweighting Lab Operating Point Card.

## Routes/screenshots to capture

- SpecForge `/lightweighting-lab/`
- RCC `/trackside-edge-hub` if available in the current route set.

## Design intent

Make the timing argument technical: edge AI, telemetry pressure and race constraints now converge.

---

# Slide 14: Roadmap

## Title

Roadmap: preview to production

## On-slide copy

Now: preview modules, Fly deployment, research bridge  
Next: InsForge verification, executive deck, polished demo  
Then: live telemetry, production auth, governance, pilot team  
Later: commercial race operations platform

## Speaker notes

The functional loop exists. The next work packages are packaging, verification and production hardening. That means InsForge verification, live data, auth, governance, richer SpecForge handoff and pilot deployment.

## Visual direction

Use a horizontal roadmap with four stages. Keep each stage to one line and one proof point.

## Assets needed

- Roadmap timeline.
- Deployment status badges.
- Pilot milestone placeholder.

## Routes/screenshots to capture

- Gateway Settings.
- RCC Settings or Platform route.
- InsForge routes after verification.

## Design intent

Show credible sequencing. Avoid pretending preview work is production, and make the path to production concrete.

---

# Slide 15: Closing

## Title

The decision loop is now closed

## On-slide copy

KDD connects track data, AI reasoning, engineering decisions and optimized components.

## Speaker notes

This is the central claim. KDD closes the loop from track data to engineering decisions and optimized components. The system moves the team from observation to action.

## Visual direction

Return to the loop diagram from Slide 3. Add product proof labels: Hub, RCC, Copilot, Engineering, SpecForge, Lightweighting Lab.

## Assets needed

- Final ecosystem visual.
- URL list.
- Composite screenshot.

## Routes/screenshots to capture

- Gateway `/`
- RCC `/overview`
- SpecForge `/lightweighting-lab/`

## Design intent

Close with system clarity, not a slogan. The viewer should leave with the loop in memory.

---

## Asset Capture Checklist

### Gateway

- Landing page: `https://kdd-rjz-ui.fly.dev/`
- Settings → Pillars
- Lightweighting Lab link in Pillars

### RCC

- `/`
- `/overview`
- `/track-live`
- `/track-evolution`
- `/track-surface`
- `/engineering-control`
- `/aerodynamics`
- `/brake-thermal`
- `/chassis-geometry`
- `/fuel-energy`
- `/setup-lab`
- `/parts`
- `/copilot`
- `/oracle-pit-wall`

### SpecForge

- `/`
- `/dashboard/`
- `/projects/new/`
- `/lightweighting-lab/`

### Required close crops

- RCC Decision Card.
- RCC Evidence List.
- RCC Risk/Confidence bar.
- Research Bridge Card.
- Copilot prompt group.
- Lightweighting Lab Bridge Map.
- Lightweighting Lab Metric Formula Cards.
- Lightweighting Lab Operating Point Card.

---

## Visual Style Guide

### Mood

KDD should feel like:

- MotoGP pit wall.
- Aerospace control room.
- Engineering decision system.
- Premium AI product.
- Research-backed technical platform.

KDD should not feel like:

- Generic SaaS dashboard.
- Crypto deck.
- Overdesigned startup pitch.
- Decorative AI wallpaper.
- Academic lecture deck.

### Color System

Use the RCC tokens as the deck source of truth:

| Role | Token / Value | Usage |
|------|---------------|-------|
| Background | `#0B0D12` / `#090d12` | Slide canvas |
| Surface | `#111318`, `#181C24` | Screenshot frames, panels |
| Raised surface | `#1A1F2E` | Active cards |
| Border | `rgba(255,255,255,0.10)` | Thin technical lines |
| Primary text | `#E6EAF4` | Headlines and main copy |
| Secondary text | `#8B92A8` | Notes and supporting labels |
| Dim text | `#5A6180` | Metadata only |
| Signal red | `#E03737` | Risk, warnings, race-critical action |
| Data cyan | `#00B7FF` | Telemetry, AI reasoning, metrics |
| Research violet | `#8B5CF6` / `#A855F7` | K↔H, Lightweighting Lab |
| Amber | `#F59E0B` | Pending validation |
| Green | `#22C55E` | Verified status |

Red must never act as decoration. It marks risk or action.

### Typography

Use:

- `Barlow Condensed` for large headings.
- `Rajdhani` or `Inter` for readable slide copy.
- `JetBrains Mono` for routes, metrics, timestamps and system labels.
- Tabular numerals for metrics.

Avoid:

- Long paragraphs on slides.
- Small dense academic text.
- Decorative fonts.
- Multiple unrelated type families.

### Layout Principles

Each slide should have one dominant idea.

Preferred layouts:

- One strong headline plus one diagram.
- Three-card comparison when categories matter.
- Left narrative, right screenshot.
- Closed loop diagram.
- Architecture stack.
- Metric strip.
- Route checklist.

Avoid:

- More than six bullets per slide.
- Raw screenshots without annotation.
- Cluttered architecture diagrams.
- Text-heavy scientific explanation.
- Nested card grids.

### Screenshot Treatment

All screenshots should be:

- Cropped tightly.
- Annotated with one to three callouts.
- Placed inside a dark device or monitor frame.
- Used with a short reason why the screen matters.

Do not show raw browser chrome unless the URL itself matters.

### Diagram Style

Use:

- Thin lines.
- Rounded rectangles with 8 to 12 px radius.
- Small labels.
- Clear arrow direction.
- Minimal icons.

Core diagram:

```text
Track Data → RCC → Copilot → Engineering Modules → SpecForge AI → Optimized Component → Track
```

### Investor Framing

Every technical slide must answer one of:

- What problem does this solve?
- Why is this hard?
- What makes KDD different?
- Why now?
- How does this become product value?
- What is the next commercial step?

---

## Slide Production Notes

- Build in 16:9.
- Prefer 1920x1080 screenshots.
- Use one screenshot per slide unless comparing states.
- Add route labels in JetBrains Mono.
- Use metric strips for quantitative proof.
- Keep speaker notes separate from slide copy.
- Do not place paragraphs over screenshots.
- Do not use generic startup gradient backgrounds.
- Do not use decorative noise textures.
- Keep arrows and lines consistent across the deck.

Suggested slide zones:

```text
Top: slide title and route label
Center: diagram or screenshot
Bottom: proof metric or short takeaway
```

---

## Figma / PowerPoint Export Notes

### Figma

- Create shared color styles from the RCC token table.
- Create text styles: Display, Slide Title, Body, Caption, Route Mono, Metric.
- Create components: Screenshot Frame, Metric Strip, Callout Label, Status Badge, Route Tag.
- Keep diagrams as editable vector layers.

### PowerPoint

- Use a dark master slide with fixed footer and route label area.
- Create master layouts for: Cover, Screenshot + Callouts, Loop Diagram, Architecture Stack, Roadmap, Closing.
- Embed fonts if licensing allows; otherwise use Aptos Narrow for headings, Aptos for body and Consolas for monospace fallback.
- Export a PDF for investor distribution.

---

## Demo Fallback Notes

| Risk | Fallback |
|------|----------|
| RCC InsForge pending | Use `https://kdd-rjz-race.fly.dev/` |
| Gateway InsForge pending | Use `https://kdd-rjz-ui.fly.dev/` |
| Lightweighting Lab Unicode check misses `K↔H` | Accept `K <-> H`, `K-H`, `K to H`, stiffness matrix / Hessian references |
| SpecForge slow load | Use Lightweighting Lab direct URL first |
| Copilot latency | Use screenshot and speaker notes for the reasoning layer |
| Any RCC module fails | Use another engineering module with the same Research Bridge Card pattern |

---

## Phase 18.10B Handoff

Next phase: Asset Capture & Visual Direction.

Do not write more narrative in 18.10B. Capture screens, crop assets, define compositions and prepare the deck for Figma or PowerPoint production.

Recommended outputs:

- `/docs/deck-assets/` screenshot set.
- Asset manifest with slide mapping.
- Figma frame plan or PowerPoint master plan.
- Visual QA checklist.
