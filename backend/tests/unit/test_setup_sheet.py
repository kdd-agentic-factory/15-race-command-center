"""Tests for the digital setup-sheet importer — Spec §8."""

from __future__ import annotations

import io
from pathlib import Path

import pytest
from openpyxl import Workbook

from race_command_center.importers.setup_sheet import parse_setup_sheet


def _build_sheet() -> Workbook:
    wb = Workbook()
    ws = wb.active
    ws.append(["CATEGORÍA", "PARÁMETRO", "SETTING 1", "SETTING 2", "SETTING 3"])
    ws.append(["GENERAL", "Circuito / Fecha", "Aspar", "Aspar", ""])
    ws.append(["", "Tiempo de Vuelta", "1:42.3", "1:41.9", ""])
    ws.append(["FORK (HORQUILLA)", "Muelles (Springs)", "6.5", "7.0", ""])
    ws.append(["", "Compresión (Comp)", "5", "6", ""])
    ws.append(["SHOCK (AMORTIGUADOR)", "Muelle (Spring)", "64", "66", ""])
    return wb


@pytest.fixture()
def sheet_file(tmp_path: Path) -> Path:
    p = tmp_path / "Mejora.xlsx"
    _build_sheet().save(p)
    return p


def test_parse_categories_and_settings(sheet_file: Path):
    d = parse_setup_sheet(sheet_file)
    assert d["setting_labels"] == ["SETTING 1", "SETTING 2", "SETTING 3"]
    assert d["category_count"] == 3
    assert d["parameter_count"] == 5
    names = [c["name"] for c in d["categories"]]
    assert names == ["GENERAL", "FORK (HORQUILLA)", "SHOCK (AMORTIGUADOR)"]
    fork = next(c for c in d["categories"] if c["name"].startswith("FORK"))
    springs = next(p for p in fork["parameters"] if p["parameter"].startswith("Muelles"))
    assert springs["settings"]["SETTING 1"] == "6.5"
    assert springs["settings"]["SETTING 2"] == "7.0"


def test_rejects_sheet_without_header(tmp_path: Path):
    wb = Workbook()
    wb.active.append(["foo", "bar"])
    p = tmp_path / "bad.xlsx"
    wb.save(p)
    with pytest.raises(ValueError):
        parse_setup_sheet(p)


def test_import_endpoint(sheet_file: Path):
    from fastapi.testclient import TestClient

    from race_command_center.main import app

    client = TestClient(app)
    with open(sheet_file, "rb") as fh:
        buf = io.BytesIO(fh.read())
    r = client.post(
        "/api/v1/setup-sheet/import",
        files={"file": ("Mejora.xlsx", buf, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")},
    )
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["category_count"] == 3
    assert body["parameter_count"] == 5
