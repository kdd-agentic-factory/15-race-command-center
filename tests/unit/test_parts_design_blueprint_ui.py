import json
import subprocess
import tempfile
from pathlib import Path


ROOT = Path(r"C:\Users\rjuarcad\Desktop\kdd-agentic-factory\15-race-command-center")
FRONTEND = ROOT / "frontend"


def _run_node(script: str) -> dict:
    completed = subprocess.run(
        ["node", "-e", script],
        cwd=str(FRONTEND),
        check=True,
        capture_output=True,
        text=True,
    )
    return json.loads(completed.stdout.strip())


def test_blueprint_design_request_payload_uses_selected_part_context():
    with tempfile.TemporaryDirectory() as tmpdir:
        bundle = Path(tmpdir) / "copilot.cjs"
        script = f"""
const path = require('path');
const esbuild = require('esbuild');
esbuild.buildSync({{
  entryPoints: [path.resolve('src/api/copilot.ts')],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  outfile: {json.dumps(str(bundle))},
  logLevel: 'silent',
}});
const {{ buildBlueprintDesignRequest }} = require({json.dumps(str(bundle))});
const request = buildBlueprintDesignRequest({{
  part_id: 'part-brake-jerez',
  name: 'Brake Duct Jerez V1',
  part_type: 'Cooling',
  target_circuit_id: 'Jerez',
  problem_statement: 'Front brake overheating under repeated heavy braking at T1 and T5.',
  technical_hypothesis: 'Increased airflow through modified duct reduces brake temperature by 15°C.',
  expected_impact: 'Stable brake pressure and reduced fade risk in long braking zones.',
  material: 'PA12_CF',
  estimated_weight_g: 142,
  manufacturing_method: 'SLS nylon',
  risk_level: 'low',
  status: 'designed',
}});
const alternate = buildBlueprintDesignRequest({{
  part_id: 'part-deflector-mugello',
  name: 'Low-Drag Side Deflector',
  part_type: 'Aerodynamic',
  target_circuit_id: 'Mugello',
  problem_statement: 'High-speed instability on Mugello straight causes rider confidence loss.',
  technical_hypothesis: 'Shaped deflector reduces drag while adding lateral stability.',
  expected_impact: 'Improve high-speed stability with minimal drag penalty.',
  material: 'TBD',
  estimated_weight_g: undefined,
  manufacturing_method: 'TBD',
  risk_level: 'high',
  status: 'concept',
}});
process.stdout.write(JSON.stringify({{ request, alternate }}));
"""
        payloads = _run_node(script)

    request = payloads["request"]
    alternate = payloads["alternate"]

    assert "Blueprint.am" in request["question"]
    assert request["context"]["source"] == "parts_design_page"
    assert request["context"]["intent"] == "blueprint_design_brief"
    assert request["context"]["part_context"]["part_id"] == "part-brake-jerez"
    assert request["context"]["part_context"]["manufacturing_method"] == "SLS nylon"
    assert alternate["context"]["part_context"]["part_id"] == "part-deflector-mugello"
    assert alternate["context"]["part_context"].get("estimated_weight_g") is None


def test_parts_design_view_exposes_blueprint_cta_and_state_messages():
    with tempfile.TemporaryDirectory() as tmpdir:
        bundle = Path(tmpdir) / "parts-design.cjs"
        script = f"""
const path = require('path');
const esbuild = require('esbuild');
esbuild.buildSync({{
  entryPoints: [path.resolve('src/pages/PartsDesignPage.tsx')],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  outfile: {json.dumps(str(bundle))},
  logLevel: 'silent',
}});
const {{ PartsDesignPageView }} = require({json.dumps(str(bundle))});

const selectedPart = {{
  part_id: 'part-brake-jerez',
  name: 'Brake Duct Jerez V1',
  part_type: 'Cooling',
  target_circuit_id: 'Jerez',
  problem_statement: 'Front brake overheating under repeated heavy braking at T1 and T5.',
  technical_hypothesis: 'Increased airflow through modified duct reduces brake temperature by 15°C.',
  expected_impact: 'Stable brake pressure and reduced fade risk in long braking zones.',
  material: 'PA12_CF',
  estimated_weight_g: 142,
  manufacturing_method: 'SLS nylon',
  risk_level: 'low',
  status: 'designed',
}};
const parts = [selectedPart, {{
  part_id: 'part-deflector-mugello',
  name: 'Low-Drag Side Deflector',
  part_type: 'Aerodynamic',
  target_circuit_id: 'Mugello',
  problem_statement: 'High-speed instability on Mugello straight causes rider confidence loss.',
  technical_hypothesis: 'Shaped deflector reduces drag while adding lateral stability.',
  expected_impact: 'Improve high-speed stability with minimal drag penalty.',
  material: 'TBD',
  estimated_weight_g: undefined,
  manufacturing_method: 'TBD',
  risk_level: 'high',
  status: 'concept',
}}];

function flatten(node) {{
  if (node == null || node === false) return '';
  if (Array.isArray(node)) return node.map(flatten).join('');
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (typeof node === 'object') return flatten(node.props && node.props.children);
  return '';
}}

function findButtons(node, acc = []) {{
  if (node == null || node === false) return acc;
  if (Array.isArray(node)) {{
    node.forEach((child) => findButtons(child, acc));
    return acc;
  }}
  if (typeof node === 'object') {{
    if (node.type === 'button') acc.push(node);
    findButtons(node.props && node.props.children, acc);
  }}
  return acc;
}}

const noop = () => {{}};
const callback = () => {{}};
const idleTree = PartsDesignPageView({{
  parts,
  selectedPart,
  onSelectPart: noop,
  blueprintState: {{ status: 'idle' }},
  onGenerateBlueprint: callback,
}});
const pendingTree = PartsDesignPageView({{
  parts,
  selectedPart,
  onSelectPart: noop,
  blueprintState: {{ status: 'pending' }},
  onGenerateBlueprint: callback,
}});
const successTree = PartsDesignPageView({{
  parts,
  selectedPart,
  onSelectPart: noop,
  blueprintState: {{ status: 'success', answer: 'Blueprint brief ready: refine duct exit and add thermal scan evidence.' }},
  onGenerateBlueprint: callback,
}});
const errorTree = PartsDesignPageView({{
  parts,
  selectedPart,
  onSelectPart: noop,
  blueprintState: {{ status: 'error', message: 'Copilot unavailable' }},
  onGenerateBlueprint: callback,
}});

const idleButtons = findButtons(idleTree);
const blueprintButton = idleButtons.find((button) => flatten(button.props.children).includes('Generate Blueprint design'));

process.stdout.write(JSON.stringify({{
  idleText: flatten(idleTree),
  idleButtonLabel: flatten(blueprintButton.props.children),
  idleButtonDisabled: !!blueprintButton.props.disabled,
  idleButtonWiresCallback: blueprintButton.props.onClick === callback,
  pendingText: flatten(pendingTree),
  pendingButtonLabel: flatten(findButtons(pendingTree).find((button) => flatten(button.props.children).includes('Generating Blueprint design'))?.props.children),
  pendingButtonDisabled: !!findButtons(pendingTree).find((button) => flatten(button.props.children).includes('Generating Blueprint design')).props.disabled,
  successText: flatten(successTree),
  errorText: flatten(errorTree),
}}));
"""
        render = _run_node(script)

    assert "Generate Blueprint design" in render["idleText"]
    assert "Request Simulation" in render["idleText"]
    assert render["idleButtonLabel"] == "Generate Blueprint design"
    assert render["idleButtonDisabled"] is False
    assert render["idleButtonWiresCallback"] is True
    assert "Generating Blueprint design..." in render["pendingText"]
    assert render["pendingButtonDisabled"] is True
    assert "Blueprint design brief ready" in render["successText"]
    assert "refine duct exit" in render["successText"]
    assert "Blueprint generation failed" in render["errorText"]
    assert "Copilot unavailable" in render["errorText"]
