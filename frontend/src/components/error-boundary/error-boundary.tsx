import { Component, ReactNode } from "react";

import { ErrorDialog } from "src/components";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<
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

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      hasError: true,
      error,
    });
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, errorInfo);
  }

  reset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // we can render any custom fallback UI
      return (
        <ErrorDialog
          error={this.state.error}
          hasError={this.state.hasError}
          onOk={this.reset}
        />
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
