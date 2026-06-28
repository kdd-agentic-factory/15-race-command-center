import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getAuthToken } from "../api/client";

/**
 * Auth guard for protected routes.
 * Redirects to /settings with a return hint if no token is found.
 */
export function ProtectedRoute() {
  const token = getAuthToken();
  const location = useLocation();

  if (!token) {
    // Store the intended destination so settings page can redirect back
    return <Navigate to="/settings" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
}
