from __future__ import annotations

import json

from sqlalchemy import String, Text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


class GovernanceAction(Base):
    __tablename__ = "governance_actions"

    action_id: Mapped[str] = mapped_column(String(64), primary_key=True)
    decision_id: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    action_type: Mapped[str] = mapped_column(String(32), index=True, nullable=False)
    actor: Mapped[str | None] = mapped_column(Text, nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    payload_json: Mapped[str] = mapped_column(Text, nullable=False, default="{}")
    created_at: Mapped[str] = mapped_column(Text, nullable=False, index=True)

    def to_record(self) -> dict:
        return {
            "action_id": self.action_id,
            "decision_id": self.decision_id,
            "action_type": self.action_type,
            "actor": self.actor,
            "notes": self.notes,
            "payload": json.loads(self.payload_json or "{}"),
            "created_at": self.created_at,
        }


class FeedbackEntry(Base):
    __tablename__ = "feedback_entries"

    feedback_id: Mapped[str] = mapped_column(String(64), primary_key=True)
    session_id: Mapped[str | None] = mapped_column(String(64), index=True, nullable=True)
    source: Mapped[str | None] = mapped_column(Text, nullable=True)
    feedback_kind: Mapped[str] = mapped_column(String(32), index=True, nullable=False)
    payload_json: Mapped[str] = mapped_column(Text, nullable=False, default="{}")
    created_at: Mapped[str] = mapped_column(Text, nullable=False, index=True)

    def to_record(self) -> dict:
        payload = json.loads(self.payload_json or "{}")
        return {
            "id": self.feedback_id,
            "session_id": self.session_id,
            "source": self.source,
            "feedback_kind": self.feedback_kind,
            "created_at": self.created_at,
            **payload,
        }


class ReportSnapshot(Base):
    __tablename__ = "report_snapshots"

    snapshot_id: Mapped[str] = mapped_column(String(64), primary_key=True)
    report_id: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    report_type: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    session_id: Mapped[str | None] = mapped_column(String(64), index=True, nullable=True)
    circuit_id: Mapped[str | None] = mapped_column(String(64), index=True, nullable=True)
    report_json: Mapped[str] = mapped_column(Text, nullable=False, default="{}")
    created_at: Mapped[str] = mapped_column(Text, nullable=False, index=True)

    def to_record(self) -> dict:
        return json.loads(self.report_json or "{}")
