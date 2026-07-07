import { Component, type ReactNode, type ErrorInfo } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
  moduleName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Route-level error boundary that catches render errors and shows
 * a visible fallback — never a black screen.
 */
export class RouteErrorFallback extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`[RouteErrorFallback${this.props.moduleName ? ` ${this.props.moduleName}` : ""}]`, error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  handleGoHome = () => {
    window.location.href = "/overview";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[60vh] items-center justify-center p-6">
          <div className="w-full max-w-md rounded-kdd-xl border border-kdd-border bg-kdd-card p-8 text-center">
            <AlertTriangle className="mx-auto mb-4 h-10 w-10 text-kdd-yellow" />
            <h2 className="mb-2 text-lg font-semibold text-kdd-text">
              {this.props.moduleName ?? "Module"} unavailable
            </h2>
            <p className="mb-2 text-sm text-kdd-dim">
              This module failed to render. Please try again or return to overview.
            </p>
            {import.meta.env.DEV && this.state.error && (
              <details className="mb-4 text-left">
                <summary className="cursor-pointer text-xs text-kdd-dim hover:text-kdd-muted">Error details (dev only)</summary>
                <pre className="mt-2 max-h-32 overflow-auto rounded-kdd-md bg-kdd-bg p-3 text-xs text-kdd-accent">
                  {this.state.error.message}
                  {"\n"}
                  {this.state.error.stack?.split("\n").slice(0, 4).join("\n")}
                </pre>
              </details>
            )}
            <div className="flex justify-center gap-3">
              <button
                onClick={this.handleReset}
                className="inline-flex items-center gap-2 rounded-kdd-md bg-kdd-accent px-4 py-2 text-sm font-medium text-white hover:bg-kdd-accent-hover"
              >
                <RefreshCw className="h-4 w-4" /> Try again
              </button>
              <button
                onClick={this.handleGoHome}
                className="inline-flex items-center gap-2 rounded-kdd-md border border-kdd-border px-4 py-2 text-sm text-kdd-muted hover:bg-kdd-hover hover:text-kdd-text"
              >
                <Home className="h-4 w-4" /> Overview
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
