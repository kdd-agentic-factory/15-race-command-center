const historyLength = 140;
const telemetry = [];
const prediction = [];
let tick = 0;

const repos = [
  "00 governance",
  "01 orchestrator",
  "02 mcp",
  "03 rag/cag",
  "04 skills",
  "05 docs",
  "06 kdd",
  "07 workflows",
  "08 lab",
  "09 observability",
  "10 docker",
  "11 k8s",
  "12 ci/security",
  "13 ui",
  "14 paper",
  "15 race",
];

const agentEvents = [
  "anomaly_agent detected rear spin drift at T05",
  "log_agent correlated trace span telemetry-session-api",
  "root_cause_agent linked thermal stress to rebound baseline",
  "optimization_agent proposed engine map 2",
  "approval_agent opened crew-chief gate",
];

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function sampleTelemetry() {
  const phaseTick = tick % 110;
  const braking = phaseTick < 36;
  const apex = phaseTick >= 36 && phaseTick < 52;
  const drive = phaseTick >= 52;
  const wave = Math.sin(tick / 7);
  const speed = braking
    ? 246 - phaseTick * 4.1
    : apex
      ? 96 + wave * 4
      : 98 + (phaseTick - 52) * 2.7;
  const tps = braking ? clamp(7 - phaseTick * 0.15, 0, 12) : apex ? 12 + wave * 3 : clamp(18 + (phaseTick - 52) * 1.25, 18, 100);
  const brake = braking ? clamp(12.5 - phaseTick * 0.24, 0, 13) : apex ? 1.2 : 0.2;
  const lean = braking ? 20 + phaseTick * 1.12 : apex ? 62 + wave * 1.5 : clamp(62 - (phaseTick - 52) * 1.05, 8, 62);
  const tire = 103 + Math.min(tick / 28, 18) + Math.max(phaseTick - 58, 0) * 0.035;
  const spin = drive ? clamp((phaseTick - 52) * 0.00145 + Math.sin(tick / 5) * 0.004, 0, 0.091) : 0.004;
  const physicsLoss = clamp(0.014 + spin * 0.16 + Math.abs(wave) * 0.004, 0.01, 0.04);
  const imuDrift = clamp(0.38 + Math.sin(tick / 16) * 0.08 + spin * 1.5, 0.22, 0.7);

  return {
    ts: Date.now(),
    phase: braking ? "braking" : apex ? "apex" : "drive",
    speed,
    tps,
    brake,
    lean,
    tire,
    spin,
    physicsLoss,
    imuDrift,
    predictedSpeed: speed - spin * 80 + Math.sin(tick / 9) * 2,
  };
}

function pushHistory(item) {
  telemetry.push(item);
  prediction.push({ actual: item.speed, predicted: item.predictedSpeed });
  if (telemetry.length > historyLength) telemetry.shift();
  if (prediction.length > historyLength) prediction.shift();
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function updateMetrics(item) {
  setText("clock", new Date().toLocaleTimeString());
  setText("speed", Math.round(item.speed));
  setText("tps", Math.round(item.tps));
  setText("brake", item.brake.toFixed(1));
  setText("lean", Math.round(item.lean));
  setText("tire", item.tire.toFixed(1));
  setText("spin", item.spin.toFixed(3));
  setText("phase", item.phase);
  setText("max-spin", Math.max(...telemetry.map((t) => t.spin)).toFixed(3));
  setText("physics-loss", item.physicsLoss.toFixed(3));
  setText("imu-drift", item.imuDrift.toFixed(2));
  setText("pipeline-latency", `${Math.round(38 + Math.sin(tick / 8) * 7)} ms p95`);

  const risk = clamp(58 + item.spin * 320 + (item.tire - 105) * 1.8, 0, 96);
  setText("tire-risk", `${Math.round(risk)}%`);
  document.getElementById("tire-gauge").style.width = `${risk}%`;
  document.getElementById("tire-status").textContent = risk > 78 ? "warning" : "watch";
  document.getElementById("tire-status").className = `badge ${risk > 78 ? "danger" : "warning"}`;

  for (const phase of ["braking", "apex", "drive"]) {
    document.getElementById(`phase-${phase}`).classList.toggle("active", phase === item.phase);
  }
}

function drawSeries(canvasId, series, fields) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext("2d");
  const rect = canvas.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.max(1, Math.floor(rect.width * ratio));
  canvas.height = Math.max(1, Math.floor(rect.height * ratio));
  ctx.scale(ratio, ratio);
  const width = rect.width;
  const height = rect.height;
  ctx.clearRect(0, 0, width, height);
  ctx.strokeStyle = "#263443";
  ctx.lineWidth = 1;
  for (let i = 0; i < 5; i += 1) {
    const y = 18 + i * ((height - 36) / 4);
    ctx.beginPath();
    ctx.moveTo(12, y);
    ctx.lineTo(width - 12, y);
    ctx.stroke();
  }

  fields.forEach((field) => {
    ctx.strokeStyle = field.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    series.forEach((point, index) => {
      const raw = typeof field.value === "function" ? field.value(point) : point[field.value];
      const normalized = clamp((raw - field.min) / (field.max - field.min), 0, 1);
      const x = 12 + index * ((width - 24) / Math.max(historyLength - 1, 1));
      const y = height - 18 - normalized * (height - 36);
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  });
}

function renderCharts() {
  drawSeries("telemetry-chart", telemetry, [
    { value: "speed", min: 80, max: 260, color: "#42d3e8" },
    { value: "tps", min: 0, max: 100, color: "#49d17c" },
    { value: "brake", min: 0, max: 14, color: "#e8b64a" },
    { value: (p) => p.spin * 1000, min: 0, max: 100, color: "#f05d5e" },
  ]);
  drawSeries("prediction-chart", prediction, [
    { value: "actual", min: 80, max: 260, color: "#42d3e8" },
    { value: "predicted", min: 80, max: 260, color: "#a88cff" },
  ]);
}

function renderStatic() {
  document.getElementById("repo-stack").innerHTML = repos.map((repo) => `<span>${repo}</span>`).join("");
  document.getElementById("agent-log").innerHTML = agentEvents.map((event) => `<li>${event}</li>`).join("");
}

function bindTabs() {
  document.querySelectorAll(".tab").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((tab) => tab.classList.remove("active"));
      document.querySelectorAll(".view").forEach((view) => view.classList.remove("active"));
      button.classList.add("active");
      document.getElementById(`view-${button.dataset.tab}`).classList.add("active");
      renderCharts();
    });
  });
}

function frame() {
  tick += 1;
  const item = sampleTelemetry();
  pushHistory(item);
  updateMetrics(item);
  renderCharts();
}

renderStatic();
bindTabs();
for (let i = 0; i < historyLength; i += 1) frame();
setInterval(frame, 100);
window.addEventListener("resize", renderCharts);
