import React, { lazy, Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Layout } from "antd";
import { connect } from "react-redux";
import { Progress } from "@edulastic/common";
import { tabletWidth, mainBgColor } from "@edulastic/colors";
import Sidebar from "./Sidebar/SideMenu";
/* lazy load routes */
const Assignments = lazy(() => import("../Assignments"));
const AssignmentAdvanced = lazy(() => import("../AssignmentAdvanced"));
const Regrade = lazy(() => import("../Regrade"));
const AssessmentCreate = lazy(() => import("../AssessmentCreate"));
const AssessmentPage = lazy(() => import("../AssessmentPage"));
const ClassBoard = lazy(() => import("../ClassBoard"));
const SummaryBoard = lazy(() => import("../SummaryBoard"));
const ClassResponses = lazy(() => import("../ClassResponses"));
const PrintPreview = lazy(() => import("../PrintPreview"));
const ExpressGrader = lazy(() => import("../ExpressGrader"));
const TestList = lazy(() => import("../TestList"));
const TestPage = lazy(() => import("../TestPage"));
const QuestionEditor = lazy(() => import("../QuestionEditor"));
const ItemList = lazy(() => import("../ItemList"));
const ItemDetail = lazy(() => import("../ItemDetail"));
const ItemAdd = lazy(() => import("../ItemAdd"));
const PickUpQuestionType = lazy(() => import("../PickUpQuestionType"));
const CurriculumContainer = lazy(() => import("../CurriculumSequence"));
const Reports = lazy(() => import("../Reports"));
const StandardsBasedReport = lazy(() => import("../StandardsBasedReport"));
const ManageClass = lazy(() => import("../ManageClass"));
const DistrictProfile = lazy(() => import("../DistrictProfile"));
const TestSetting = lazy(() => import("../TestSetting"));
const Term = lazy(() => import("../Term"));
const DistrictPolicy = lazy(() => import("../DistrictPolicy"));
const PerformanceBand = lazy(() => import("../PerformanceBand"));
const StandardsProficiency = lazy(() => import("../StandardsProficiency"));
const Schools = lazy(() => import("../Schools"));
const Teacher = lazy(() => import("../Teacher"));

const DistrictAdmin = lazy(() => import("../DistrictAdmin"));

const SchoolAdmin = lazy(() => import("../SchoolAdmin"));

// eslint-disable-next-line react/prop-types
const Author = ({ match, history, isSidebarCollapsed }) => {
  const isPickQuestion = !!history.location.pathname.includes("pickup-questiontype");
  const isCollapsed = isPickQuestion || isSidebarCollapsed;
  const isPrintPreview = history.location.pathname.includes("printpreview");
  return (
    <StyledLayout>
      <MainContainer isCollapsed={isCollapsed} isPrintPreview={isPrintPreview}>
        <SidebarCompnent isPrintPreview={isPrintPreview} />
        <Wrapper>
          <Suspense fallback={<Progress />}>
            <Switch>
              <Route exact path={`${match.url}/assignments`} component={Assignments} />
              <Route
                exact
                path={`${match.url}/assignments/:districtId/:testId`}
                component={props => <AssignmentAdvanced {...props} />}
              />
              <Route
                exact
                path={`${match.url}/assignments/regrade/new/:newTestId/old/:oldTestId`}
                component={Regrade}
              />
              <Route exact path={`${match.url}/assessments/create`} component={AssessmentCreate} />
              <Route exact path={`${match.url}/assessments/:assessmentId`} component={AssessmentPage} />
              <Route exact path={`${match.url}/classboard/:assignmentId/:classId`} component={ClassBoard} />
              <Route exact path={`${match.url}/summary/:assignmentId/:classId`} component={SummaryBoard} />
              <Route exact path={`${match.url}/classresponses/:testActivityId`} component={ClassResponses} />
              <Route exact path={`${match.url}/printpreview/:testActivityId`} component={PrintPreview} />
              <Route exact path={`${match.url}/manageClass`} component={ManageClass} />
              <Route
                exact
                path={`${match.url}/expressgrader/:assignmentId/:classId/:testActivityId`}
                component={ExpressGrader}
              />
              <Route
                exact
                path={`${match.url}/standardsBasedReport/:assignmentId/:classId`}
                component={StandardsBasedReport}
              />
              <Route exact path={`${match.url}/items`} component={ItemList} />
              <Route exact path={`${match.url}/items/filter/:filterType`} component={ItemList} />
              <Route exact path={`${match.url}/items/:id/item-detail`} component={ItemDetail} />
              <Route exact path={`${match.url}/items/:id/item-detail/test/:testId`} component={ItemDetail} />
              <Route exact path="/author/playlist" component={CurriculumContainer} />
              <Route exact path="/author/add-item" component={ItemAdd} />
              <Route
                exact
                path={`${match.url}/tests`}
                render={props => (
                  <Suspense fallback={<Progress />}>
                    <TestList {...props} />
                  </Suspense>
                )}
              />

              <Route
                exact
                path={`${match.url}/tests/filter/:filterType`}
                render={props => (
                  <Suspense fallback={<Progress />}>
                    <TestList {...props} />
                  </Suspense>
                )}
              />
              <Route
                exacts
                path="/author/tests/create"
                render={props => (
                  <Suspense fallback={<Progress />}>
                    <TestPage {...props} />
                  </Suspense>
                )}
              />
              <Route
                exact
                path="/author/tests/:id"
                render={props => (
                  <Suspense fallback={<Progress />}>
                    <TestPage {...props} />
                  </Suspense>
                )}
              />
              <Route
                exact
                path="/author/tests/:id/editAssigned"
                render={props => (
                  <Suspense fallback={<Progress />}>
                    <TestPage {...props} editAssigned />
                  </Suspense>
                )}
              />

              <Route
                exact
                path="/author/tests/:id/versioned/old/:oldId"
                render={props => (
                  <Suspense fallback={<Progress />}>
                    <TestPage {...props} versioned />
                  </Suspense>
                )}
              />

              <Route
                exact
                path="/author/tests/limit/:limit/page/:page/:filter?"
                render={props => (
                  <Suspense fallback={<Progress />}>
                    <TestList {...props} />
                  </Suspense>
                )}
              />
              <Route exact path="/author/items/:id/pickup-questiontype" component={PickUpQuestionType} />
              <Route exact path="/author/questions/create" component={QuestionEditor} />
              <Route exact path="/author/questions/edit" component={QuestionEditor} />
              <Route path="/author/reports/" component={Reports} />
              <Route exact path="/author/districtprofile" component={DistrictProfile} />
              <Route exact path="/author/settings/testsettings" component={TestSetting} />
              <Route exact path="/author/settings/term" component={Term} />
              <Route exact path="/author/settings/districtpolicies" component={DistrictPolicy} />
              <Route exact path="/author/settings/performance-bands" component={PerformanceBand} />
              <Route exact path="/author/settings/standards-proficiency" component={StandardsProficiency} />
              <Route exact path="/author/schools" component={Schools} />
              <Route exact path="/author/users/teacher" component={Teacher} />

              <Route exact path="/author/users/district-admin" component={DistrictAdmin} />

              <Route exact path="/author/users/school-admin" component={SchoolAdmin} />
            </Switch>
          </Suspense>
        </Wrapper>
      </MainContainer>
    </StyledLayout>
  );
};

export default connect(({ authorUi }) => ({
  isSidebarCollapsed: authorUi.isSidebarCollapsed
}))(Author);

Author.propTypes = {
  match: PropTypes.object.isRequired
};

const MainContainer = styled.div`
  padding-left: ${props => {
    if (props.isPrintPreview) {
      return "0";
    }
    return "100px";
  }};
  width: 100%;
  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    left: ${props => (props.isCollapsed ? "100px" : "240px")};
    z-index: 999;
  }
  @media (max-width: ${tabletWidth}) {
    padding-left: 0px;
    .fixed-header {
      left: 0;
      background: #0188d2;
    }
  }
`;
const SidebarCompnent = styled(Sidebar)`
  display: ${props => (props.isPrintPreview ? "none" : "block")};
  @media (max-width: ${tabletWidth}) {
    display: none;
  }
`;
const Wrapper = styled.div`
  position: relative;
`;

const StyledLayout = styled(Layout)`
  background: ${mainBgColor};
`;
