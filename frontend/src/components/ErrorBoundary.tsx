import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    // In production this would log to an error reporting service
    console.error("[ErrorBoundary] caught:", error, info.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="error-boundary" role="alert">
          <h3 className="error-boundary__title">Something went wrong</h3>
          <p className="error-boundary__msg">{this.state.error?.message ?? "Unknown error"}</p>
          <button className="btn btn--secondary" onClick={this.handleRetry}>
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
