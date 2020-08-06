import React, { Fragment } from "react";
import styled from "styled-components";
import { greenPrimary } from "@edulastic/colors";
import { withRouter } from "react-router-dom";
import * as Sentry from "@sentry/browser";
import { IconNotAllowed } from "@edulastic/icons";
import MainHeader from "./MainHeader";
import MainContentWrapper from "./MainContentWrapper";

class ErrorHandler extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true, path: window.location.pathname };
  }

  componentDidCatch(error, info) {
    Sentry.withScope(scope => {
      Sentry.captureException(error);
      scope.setExtra("componentStack", info);
      scope.setTag("issueType", "UnexpectedError");
    });
    // log the error to an error reporting service
    console.error(error, info);
  }

  static getDerivedStateFromProps(prevState) {
    if (prevState.path !== window.location.pathname && prevState.hasError) {
      return {
        hasError: false,
        path: window.location.pathname
      };
    }
  }

  render() {
    const { history, children, disablePage } = this.props;
    const { hasError } = this.state;
    if (hasError) {
      return (
        <div style={{ textAlign: "center" }}>
          <h1> Sorry, something went wrong.</h1>
          <h2> We are working on it and we will get it fixed as soon as we can. </h2>
          <GoBacK
            onClick={() => {
              this.setState({
                hasError: false
              });
              history.goBack();
            }}
          >
            Go Back
          </GoBacK>
        </div>
      );
    }

    if (disablePage) {
      const mainContentStyle = {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column"
      };

      return (
        <Fragment>
          <MainHeader />
          <MainContentWrapper style={mainContentStyle}>
            <IconNotAllowed color="#6c7781" />
            <DesktopOnlyText>Desktop only</DesktopOnlyText>
            <DesktopOnlyDescription>
              This functionality is available only on a device <br />
              with a higher resolution (tablet or desktop)
            </DesktopOnlyDescription>
          </MainContentWrapper>
        </Fragment>
      );
    }

    return children;
  }
}

export default withRouter(ErrorHandler);

const GoBacK = styled.h3`
  color: ${greenPrimary};
`;

const DesktopOnlyText = styled.h1`
  color: #304050;
  font-size: 22px;
  font-weight: 700;
  text-align: center;
  margin: 20px 0px;
  line-height: 1;
`;

const DesktopOnlyDescription = styled.p`
  color: #848993;
  font-size: 14px;
  text-align: center;
`;
