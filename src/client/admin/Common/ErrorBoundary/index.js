import React from "react";
import * as Sentry from '@sentry/browser';

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // log the error to an error reporting service
    console.error(error, info);
    Sentry.withScope((scope) => {
      scope.setExtras(info);
      Sentry.captureException(error);
    });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

ErrorBoundary.defaultProps = {
  fallback: <span>Something went wrong</span>
};
