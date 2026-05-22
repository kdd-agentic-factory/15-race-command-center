export type SessionStatus = "created" | "active" | "closed" | "analysed";
export type SessionType = "fp1" | "fp2" | "fp3" | "qualifying" | "race" | "test" | "warmup";

export type RaceSession = {
  session_id: string;
  weekend_id?: string;
  circuit_id: string;
  bike_id: string;
  rider_id?: string;
  session_type: SessionType;
  status: SessionStatus;
  started_at?: string;
  ended_at?: string;
  weather?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
};
