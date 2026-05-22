import { create } from "zustand";
import type { TelemetrySample } from "../types/telemetry";

const MAX_HISTORY = 300;

type TelemetryStore = {
  history: TelemetrySample[];
  latest: TelemetrySample | null;
  push: (sample: TelemetrySample) => void;
  clear: () => void;
};

export const useTelemetryStore = create<TelemetryStore>((set) => ({
  history: [],
  latest: null,
  push: (sample) =>
    set((state) => {
      const history = [...state.history, sample];
      return {
        history: history.length > MAX_HISTORY ? history.slice(-MAX_HISTORY) : history,
        latest: sample,
      };
    }),
  clear: () => set({ history: [], latest: null }),
}));
