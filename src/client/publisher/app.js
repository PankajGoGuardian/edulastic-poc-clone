import React, { lazy, Suspense, useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import styled, { ThemeProvider } from "styled-components";
import { Layout, Spin } from "antd";

import { Progress, ErrorHandler } from "@edulastic/common";
import { tabletWidth, largeDesktopWidth } from "@edulastic/colors";

import { themes as globalThemes } from "../theme";
import { addThemeBackgroundColor } from "../common/utils/helpers";
import SideMenu from "../author/src/Sidebar/SideMenu";
import { Dashboard } from "./pages/Dashboard/dashboard";
import { getUserOrgId, getUserRole } from "../author/src/selectors/user";

const Publisher = props => {
  const { match, selectedTheme } = props;

  let themeToPass = globalThemes[selectedTheme] || globalThemes.default;

  return (
    <ThemeProvider theme={themeToPass}>
      <Layout>
        <MainContainer>
          <SideMenu />
          <Wrapper>
            <ErrorHandler>
              <Switch>
                <Route path={`${match.url}/dashboard`} component={Dashboard} />
              </Switch>
            </ErrorHandler>
          </Wrapper>
        </MainContainer>
      </Layout>
    </ThemeProvider>
  );
};

export default connect(
  state => ({
    orgId: getUserOrgId(state),
    role: getUserRole(state)
  }),
  null
)(Publisher);

const MainContainer = addThemeBackgroundColor(styled.div`
  padding-left: 100px;
  width: 100%;

  /* &.zoom1 {
    -moz-transform: scale(1.2, 1.2);
    zoom: 1.2;
    zoom: 120%;
  }

  &.zoom2 {
    -moz-transform: scale(1.4, 1.4);
    zoom: 1.4;
    zoom: 140%;
  }

  &.zoom3 {
    -moz-transform: scale(1.65, 1.65);
    zoom: 1.65;
    zoom: 165%;
  }

  &.zoom4 {
    -moz-transform: scale(2, 2);
    zoom: 2;
    zoom: 200%;
  } */

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    left: 100px;
    z-index: 1;
  }

  @media (min-width: ${tabletWidth}) and (max-width: ${largeDesktopWidth}) {
    padding-left: 90px;
  }

  @media (max-width: 768px) {
    padding-left: 0px;
    .fixed-header {
      left: 0;
      padding-left: 30px;
      background: #0188d2;
    }
  }
`);

const Wrapper = styled.div`
  position: relative;
`;
