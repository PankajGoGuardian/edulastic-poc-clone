import React, { lazy, Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import PropTypes from "prop-types";
import { Progress, ErrorHandler } from "@edulastic/common";
import styled, { ThemeProvider } from "styled-components";
import { Layout } from "antd";
import { connect } from "react-redux";
import { tabletWidth, largeDesktopWidth } from "@edulastic/colors";
// import { getZoomedTheme } from "./zoomTheme";
import Sidebar from "./Sidebar/SideMenu";
import { Assignment } from "./Assignments";
import { Report } from "./Reports";
import { StudentPlaylist } from "./StudentPlaylist";
// TODOSidebar
import { ReportList } from "./TestAcitivityReport";
import { Profile } from "./Profile";

import { ManageClass } from "./ManageClass";
import SkillReportContainer from "./SkillReport";
import DeepLink from "./DeeplinkAssessment";
import StartAssignment from "./StartAssignment";

import { themes as globalThemes } from "../theme";
import { addThemeBackgroundColor } from "../common/utils/helpers";

const CurriculumContainer = lazy(() => import("../author/CurriculumSequence"));
const StudentApp = ({ match, selectedTheme }) => {
  const themeToPass = globalThemes[selectedTheme] || globalThemes.default;
  // themeToPass = getZoomedTheme(themeToPass, zoomLevel);
  // themeToPass = { ...themeToPass, ...globalThemes.zoomed(themeToPass) };

  return (
    <ThemeProvider theme={themeToPass}>
      <Layout>
        <MainContainer>
          <Sidebar />
          <Wrapper>
            <ErrorHandler>
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

                <Route path={`${match.url}/grades`} component={Report} />
                <Route path={`${match.url}/skill-mastery`} component={SkillReportContainer} />
                <Route path={`${match.url}/manage`} component={ManageClass} />
                <Route path={`${match.url}/profile`} component={Profile} />
                <Route
                  path={`${match.url}/class/:classId/test/:testId/testActivityReport/:id`}
                  component={ReportList}
                />
                <Route path={`${match.url}/group/:groupId/assignment/:assignmentId`} component={StartAssignment} />
                <Route exact path={`${match.url}/playlist`} component={StudentPlaylist} />
                <Route
                  exact
                  path={`${match.url}/playlist/:playlistId`}
                  render={props => (
                    <Suspense fallback={<Progress />}>
                      <CurriculumContainer {...props} urlHasUseThis="true" />
                    </Suspense>
                  )}
                />
              </Switch>
            </ErrorHandler>
          </Wrapper>
        </MainContainer>
      </Layout>
    </ThemeProvider>
  );
};

export default connect(({ ui }) => ({
  selectedTheme: ui.selectedTheme,
  zoomLevel: ui.zoomLevel
}))(StudentApp);

StudentApp.propTypes = {
  match: PropTypes.object.isRequired,
  selectedTheme: PropTypes.string.isRequired
};

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
    }
  }
`);

const Wrapper = styled.div`
  position: relative;
`;
