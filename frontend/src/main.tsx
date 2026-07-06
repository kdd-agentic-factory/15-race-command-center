import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { setAuthToken } from "./api/client";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { RaceSessionProvider } from "./context/RaceSessionContext";
import "./index.css";
import "./styles/kdd-tokens.css";

function bootstrapAuthTokenFromUrl() {
  if (typeof window === "undefined") return;
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const searchParams = new URLSearchParams(window.location.search);
  const token = hashParams.get("auth_token") ?? searchParams.get("auth_token");
  if (!token) return;

  setAuthToken(token);
  const url = new URL(window.location.href);
  url.hash = "";
  url.searchParams.delete("auth_token");
  window.history.replaceState({}, "", url.toString());
}

bootstrapAuthTokenFromUrl();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <RaceSessionProvider>
        <RouterProvider router={router} />
      </RaceSessionProvider>
    </ErrorBoundary>
  </StrictMode>
);
