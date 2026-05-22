from pydantic import BaseModel, Field


class ReportRequest(BaseModel):
    report_type: str
    session_id: str | None = None
    circuit_id: str | None = None
    weekend_id: str | None = None
    include_evidence: bool = True
    notes: str | None = None


class Report(BaseModel):
    report_id: str
    report_type: str
    title: str
    session_id: str | None = None
    circuit_id: str | None = None
    status: str = "generated"
    created_at: str | None = None
    summary: str = ""
    sections: list[dict] = Field(default_factory=list)
    evidence: list[dict] = Field(default_factory=list)
    mode: str = "mock"
