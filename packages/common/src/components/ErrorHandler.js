import React from "react";
import { greenPrimary } from "@edulastic/colors";
import { withRouter, Link } from "react-router-dom";
class ErrorHandler extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    console.error("error:", error);
    return { hasError: true, path: window.location.pathname };
  }

  static getDerivedStateFromProps(prop, prevState) {
    if (prevState.path !== window.location.pathname && prevState.hasError) {
      return {
        hasError: false,
        path: window.location.pathname
      };
    }
  }

  render() {
    const { history } = this.props;
    if (this.state.hasError) {
      return (
        <div style={{ textAlign: "center" }}>
          <h1> Sorry, something went wrong.</h1>
          <h2> We're working on it and we will get it fixed as soon as we can. </h2>
          <h3 style={{ color: greenPrimary }} onClick={history.goBack}>
            Go Back
          </h3>
        </div>
      );
    }

    return this.props.children;
  }
}

export default withRouter(ErrorHandler);
