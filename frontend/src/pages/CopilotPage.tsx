import ChatShell from "../copilot/components/ChatShell";

export function CopilotPage() {
  return (
    <div className="-m-6 overflow-hidden" style={{ height: "calc(100vh - 5rem)" }}>
      <ChatShell />
    </div>
  );
}
