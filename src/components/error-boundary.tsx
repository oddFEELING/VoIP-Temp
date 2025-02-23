"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // ~ ======= Log error to your error reporting service ======= ~
    console.error("Error caught by error boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

// ~ ======= Client-side error fallback component ======= ~
const ErrorFallback = ({ error }: { error: Error | null }) => {
  const pathname = usePathname();

  return (
    <div className="flex h-screen min-h-[400px] w-full flex-col items-center justify-center gap-6 rounded-lg border border-destructive/50 bg-destructive/5 p-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <AlertTriangle className="h-12 w-12 text-destructive" />
        <h2 className="text-xl font-semibold">Something went wrong</h2>
        <p className="max-w-md text-sm text-muted-foreground">
          An error occurred while rendering this page. Our team has been
          notified and is working to fix the issue.
        </p>
        {error && (
          <p className="mt-2 max-w-md rounded-md bg-destructive/10 p-2 text-xs text-destructive">
            {error.message}
          </p>
        )}
      </div>
      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={() => {
            window.location.reload();
          }}
        >
          Try again
        </Button>
        {pathname !== "/" && (
          <Button
            variant="default"
            onClick={() => {
              window.location.href = "/";
            }}
          >
            Return home
          </Button>
        )}
      </div>
    </div>
  );
};

export default ErrorBoundary;
