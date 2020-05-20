import { tabletWidth } from "@edulastic/colors";
import { ErrorHandler } from "@edulastic/common";
import { Layout } from "antd";
import React from "react";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";
import styled, { ThemeProvider } from "styled-components";
import { getUserOrgId, getUserRole } from "../author/src/selectors/user";
import { isProxyUser as isProxyUserSelector } from "../student/Login/ducks";
import SideMenu from "../author/src/Sidebar/SideMenu";
import { addThemeBackgroundColor } from "../common/utils/helpers";
import { themes as globalThemes } from "../theme";
import { Dashboard } from "./pages/Dashboard/dashboard";

const Publisher = props => {
  const { match, selectedTheme, isProxyUser } = props;
  const themeToPass = globalThemes[selectedTheme] || globalThemes.default;

  return (
    <ThemeProvider theme={themeToPass}>
      <StyledLayout isProxyUser={isProxyUser}>
        <MainContainer>
          <StyledSideMenu isProxyUser={isProxyUser} />
          <Wrapper>
            <ErrorHandler>
              <Switch>
                <Route path={`${match.url}/dashboard`} component={Dashboard} />
              </Switch>
            </ErrorHandler>
          </Wrapper>
        </MainContainer>
      </StyledLayout>
    </ThemeProvider>
  );
};

export default connect(
  state => ({
    orgId: getUserOrgId(state),
    role: getUserRole(state),
    isProxyUser: isProxyUserSelector(state)
  }),
  null
)(Publisher);

const StyledSideMenu = styled(SideMenu)`
  top: ${props => (props.isProxyUser ? props.theme.BannerHeight : 0)}px;
`;

const StyledLayout = styled(Layout)`
  margin-top: ${props => (props.isProxyUser ? props.theme.BannerHeight : 0)}px;
  .fixed-header {
    top: ${props => (props.isProxyUser ? props.theme.BannerHeight : 0)}px !important;
  }
`;

const MainContainer = addThemeBackgroundColor(styled.div`
  padding-left: 70px;
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

  @media (max-width: ${tabletWidth}) {
    padding-left: 0px;
  }
`);

const Wrapper = styled.div`
  position: relative;
`;
