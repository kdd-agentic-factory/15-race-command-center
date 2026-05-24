from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_env: str = "local"
    backend_port: int = 8150
    database_url: str = "sqlite+aiosqlite:///./race_command_center.db"

    kdd_pipelines_url: str = "http://localhost:8060"
    copilot_url: str = "http://localhost:8160"
    digital_twin_url: str = "http://localhost:8170"
    documentation_agent_url: str = "http://localhost:8040"
    orchestrator_url: str = "http://localhost:8000"
    observability_url: str = "http://localhost:9090"

    enable_mock_mode: bool = True
    enable_live_telemetry: bool = True
    enable_copilot: bool = True
    enable_digital_twin: bool = True
    enable_parts_module: bool = True
    enable_paper_evidence_export: bool = True

    otel_exporter_otlp_endpoint: str = "http://localhost:4317"


settings = Settings()
