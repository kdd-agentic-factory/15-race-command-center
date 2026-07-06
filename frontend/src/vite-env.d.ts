/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_RACE_AI_COPILOT_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
