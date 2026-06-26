import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { setAuthToken } from "./api/client";
import "./index.css";

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

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
