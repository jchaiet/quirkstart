/**
 * ErrorBoundary.tsx
 *
 * React class component — error boundaries must be class components.
 * Catches render errors in any child component tree and renders a
 * fallback instead of crashing the whole page.
 *
 * Usage:
 *   <ErrorBoundary fallback={<p>Something went wrong.</p>}>
 *     <PageBuilder sections={sections} pageData={pageData} />
 *   </ErrorBoundary>
 *
 * Or with the section name for better debugging:
 *   <BlockErrorBoundary blockType={section._type}>
 *     <HeroBlock {...section} />
 *   </BlockErrorBoundary>
 */

"use client";

import React from "react";

type ErrorBoundaryProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, info: React.ErrorInfo) => void;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error?: Error;
};

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[ErrorBoundary] Block render error:", error, info);
    this.props.onError?.(error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? null;
    }
    return this.props.children;
  }
}

// ─── Per-block wrapper ────────────────────────────────────────────────────────
// Wraps a single block with a fallback that's invisible in production
// but shows the block type in development for easier debugging.

type BlockErrorBoundaryProps = {
  children: React.ReactNode;
  blockType?: string;
};

export function BlockErrorBoundary({
  children,
  blockType,
}: BlockErrorBoundaryProps) {
  const fallback =
    process.env.NODE_ENV === "development" ? (
      <div
        style={{
          padding: "1rem",
          margin: "1rem 0",
          border: "2px dashed #f00",
          borderRadius: "4px",
          color: "#f00",
          fontFamily: "monospace",
          fontSize: "0.875rem",
        }}
      >
        ⚠ Block render error: <strong>{blockType ?? "unknown"}</strong>
        <br />
        Check the console for details.
      </div>
    ) : null; // Silent in production — broken block just disappears

  return <ErrorBoundary fallback={fallback}>{children}</ErrorBoundary>;
}
