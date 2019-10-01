import React from "react";
import { Route, Switch } from "react-router-dom";
import PropTypes from "prop-types";
import styled, { ThemeProvider } from "styled-components";
import { Layout } from "antd";
import { connect } from "react-redux";
import { tabletWidth, largeDesktopWidth } from "@edulastic/colors";

import { getZoomedTheme } from "./zoomTheme";

import Sidebar from "./Sidebar/SideMenu";
import { Assignment } from "./Assignments";
import { Report } from "./Reports";
//TODOSidebar
import { ReportList } from "./TestAcitivityReport";
import { Profile } from "./Profile";

import { ManageClass } from "./ManageClass";
import SkillReportContainer from "./SkillReport";
import DeepLink from "./DeeplinkAssessment";
import StartAssignment from "./StartAssignment";

import { themes as globalThemes } from "../theme";

const StudentApp = ({ match, isSidebarCollapsed, selectedTheme, zoomLevel }) => {
  let themeToPass = globalThemes[selectedTheme] || globalThemes.default;
  themeToPass = getZoomedTheme(themeToPass, zoomLevel);
  themeToPass = { ...themeToPass, ...globalThemes.zoomed(themeToPass) };

  return (
    <ThemeProvider theme={themeToPass}>
      <Layout>
        <MainContainer isCollapsed={isSidebarCollapsed}>
          <Sidebar />
          <Wrapper>
            <Switch>
              <Route path={`${match.url}/assignments`} component={Assignment} />
              <Route path={`${match.url}/dashboard`} component={Assignment} />
              <Route
                path={`${
                  match.url
                }/seb/test/:testId/type/:testType/assignment/:assignmentId/testActivity/:testActivityId`}
                component={DeepLink}
              />
              <Route
                path={`${match.url}/seb/test/:testId/type/:testType/assignment/:assignmentId`}
                component={DeepLink}
              />

              <Route path={`${match.url}/reports`} component={Report} />
              <Route path={`${match.url}/skill-report`} component={SkillReportContainer} />
              <Route path={`${match.url}/manage`} component={ManageClass} />
              <Route path={`${match.url}/profile`} component={Profile} />
              <Route path={`${match.url}/class/:classId/test/:testId/testActivityReport/:id`} component={ReportList} />
              <Route path={`${match.url}/group/:groupId/assignment/:assignmentId`} component={StartAssignment} />
            </Switch>
          </Wrapper>
        </MainContainer>
      </Layout>
    </ThemeProvider>
  );
};

export default connect(({ ui }) => ({
  isSidebarCollapsed: ui.isSidebarCollapsed,
  selectedTheme: ui.selectedTheme,
  zoomLevel: ui.zoomLevel
}))(StudentApp);

StudentApp.propTypes = {
  match: PropTypes.object.isRequired,
  isSidebarCollapsed: PropTypes.bool.isRequired,
  selectedTheme: PropTypes.string.isRequired
};

const MainContainer = styled.div`
  padding-left: 100px;
  width: 100%;

  &.zoom1 {
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
  }

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
`;

const Wrapper = styled.div`
  position: relative;
  margin-bottom: 15vh;
`;
