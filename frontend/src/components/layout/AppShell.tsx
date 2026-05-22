import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { StatusBar } from "./StatusBar";

export function AppShell() {
  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
      <Sidebar />
      <main className="flex min-h-screen flex-1 flex-col overflow-hidden">
        <Topbar />
        <div className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </div>
        <StatusBar />
      </main>
    </div>
  );
}
