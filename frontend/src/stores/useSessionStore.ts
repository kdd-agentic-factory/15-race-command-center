import { create } from "zustand";
import type { RaceSession } from "../types/session";

type SessionStore = {
  activeSession: RaceSession | null;
  setActiveSession: (session: RaceSession | null) => void;
  lap: number;
  setLap: (lap: number) => void;
};

export const useSessionStore = create<SessionStore>((set) => ({
  activeSession: null,
  setActiveSession: (session) => set({ activeSession: session }),
  lap: 14,
  setLap: (lap) => set({ lap }),
}));
