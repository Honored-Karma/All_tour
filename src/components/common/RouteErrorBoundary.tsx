import React, { Component, type ErrorInfo, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, RefreshCw, Compass, Home } from "lucide-react";
import type { Dictionary } from "../../i18n/ru";
import type { Locale } from "../../lib/whatsapp";

interface RouteErrorBoundaryProps {
  children: ReactNode;
  dict: Dictionary;
  locale: Locale;
  resetKey?: string;
  onReset?: () => void;
  onReload?: () => void;
}

interface RouteErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Route-level Error Boundary with localized accessible fallback states,
 * recovery actions, and automatic reset on route navigation.
 */
export class RouteErrorBoundary extends Component<
  RouteErrorBoundaryProps,
  RouteErrorBoundaryState
> {
  constructor(props: RouteErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): RouteErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error for diagnostics without exposing sensitive details in DOM
    if (process.env.NODE_ENV !== "production") {
      console.error("[RouteErrorBoundary caught error]:", error, errorInfo);
    }
  }

  componentDidUpdate(prevProps: RouteErrorBoundaryProps): void {
    // Automatically reset error boundary when user navigates to another route
    if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
      this.resetError();
    }
  }

  resetError = (): void => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  handleManualReload = (): void => {
    if (this.props.onReload) {
      this.props.onReload();
      return;
    }
    if (typeof window !== "undefined" && typeof window.location?.reload === "function") {
      try {
        window.location.reload();
      } catch {
        // Fallback for jsdom or non-browser environments
      }
    }
  };

  render(): ReactNode {
    if (this.state.hasError) {
      const eb = this.props.dict.errorBoundary;

      return (
        <section
          role="alert"
          aria-live="assertive"
          className="min-h-[70vh] flex flex-col items-center justify-center px-4 sm:px-8 py-20 text-center"
        >
          <div className="max-w-md w-full p-8 rounded-3xl bg-surface/95 backdrop-blur-xl border border-accent/25 shadow-2xl shadow-accent/10 space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto text-accent">
              <AlertTriangle className="w-8 h-8" aria-hidden="true" />
            </div>

            <div className="space-y-2">
              <div className="inline-block px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs font-mono tracking-wider text-accent uppercase">
                {eb.badge}
              </div>
              <h1 className="text-xl sm:text-2xl font-display font-bold text-ink tracking-tight">
                {eb.title}
              </h1>
              <p className="text-sm text-muted font-sans leading-relaxed">
                {eb.description}
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center">
              <button
                type="button"
                onClick={this.handleManualReload}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-accent/80 hover:bg-accent text-on-accent text-xs font-semibold transition-all shadow-md shadow-accent/10 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{eb.reloadBtn}</span>
              </button>
            </div>

            <div className="pt-4 border-t border-line flex items-center justify-center gap-6 text-xs text-muted">
              <Link
                to="/tours"
                onClick={this.resetError}
                className="inline-flex items-center gap-1.5 hover:text-ink transition-colors"
              >
                <Compass className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{eb.backToCatalog}</span>
              </Link>
              <span aria-hidden="true">·</span>
              <Link
                to="/"
                onClick={this.resetError}
                className="inline-flex items-center gap-1.5 hover:text-ink transition-colors"
              >
                <Home className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{eb.backToHome}</span>
              </Link>
            </div>
          </div>
        </section>
      );
    }

    return this.props.children;
  }
}
