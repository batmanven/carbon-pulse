"use client";

import { Component, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * ErrorBoundary React component capturing crashes in child component trees,
 * preventing total app failure and displaying a friendly error recovery state.
 */
export class ErrorBoundary extends Component<Props, State> {
  /**
   * Initializes the error boundary component state.
   *
   * @param {Props} props - Children elements list.
   */
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  /**
   * React lifecycle method invoked when an exception is thrown in a child component.
   *
   * @param {Error} error - The caught exception.
   * @returns {State} The updated error state values.
   */
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-[400px] flex items-center justify-center bg-canvas"
          role="alert"
        >
          <div className="text-center p-8 max-w-md">
            <AlertTriangle className="w-12 h-12 text-brand-pink mx-auto mb-4" aria-hidden="true" />
            <h2 className="text-[24px] font-semibold text-ink mb-2">
              Something went wrong
            </h2>
            <p className="text-muted font-medium text-[15px] mb-6">
              An unexpected error occurred. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 rounded-xl bg-primary text-on-primary font-bold text-[15px] hover:opacity-90 transition-opacity"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
