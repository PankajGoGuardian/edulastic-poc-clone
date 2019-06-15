import React, { lazy, Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Layout } from "antd";
import { connect } from "react-redux";
import { Progress } from "@edulastic/common";
import { tabletWidth, mainBgColor } from "@edulastic/colors";
import DragScroll, { DOWNWARDS } from "@edulastic/common/src/components/DragScroll";
import Sidebar from "./Sidebar/SideMenu";
import SuccessPage from "../TestPage/components/SuccessPage/SuccessPage";
/* lazy load routes */

const Dashboard = lazy(() => import("../Dashboard"));
const Assignments = lazy(() => import("../Assignments"));
const AssignTest = lazy(() => import("../AssignTest"));
const AssignmentAdvanced = lazy(() => import("../AssignmentAdvanced"));
const Regrade = lazy(() => import("../Regrade"));
const AssessmentCreate = lazy(() => import("../AssessmentCreate"));
const AssignmentCreate = lazy(() => import("../AssignmentCreate"));
const AssessmentPage = lazy(() => import("../AssessmentPage"));
const ClassBoard = lazy(() => import("../ClassBoard"));
const StudentReportCardPrintPreviewContainer = lazy(() =>
  import("../Shared/Components/ClassHeader/components/StudentReportCardPrintPreviewContainer")
);
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
const Student = lazy(() => import("../Student"));
const Teacher = lazy(() => import("../Teacher"));
const DistrictAdmin = lazy(() => import("../DistrictAdmin"));
const SchoolAdmin = lazy(() => import("../SchoolAdmin"));
const Courses = lazy(() => import("../Courses"));
const Classes = lazy(() => import("../Classes"));
const InterestedStandards = lazy(() => import("../InterestedStandards"));
const PlayList = lazy(() => import("../Playlist"));
const PlaylistPage = lazy(() => import("../PlaylistPage"));

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

              <Route exact path={`${match.url}/tests/select`} component={AssessmentCreate} />
              <Route exact path={`${match.url}/tests/snapquiz`} component={AssessmentCreate} />
              <Route exact path={`${match.url}/assignments/select`} component={AssignmentCreate} />

              <Route exact path={`/author/dashboard`} component={Dashboard} />

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
              <Route exact path={`${match.url}/assignments/:testId`} component={props => <AssignTest {...props} />} />
              <Route exact path={`${match.url}/assessments/:assessmentId`} component={AssessmentPage} />
              <Route exact path={`${match.url}/classboard/:assignmentId/:classId`} component={ClassBoard} />
              <Route
                exact
                path={`${match.url}/classboard-student-report-card-print-preview/printpreview/:assignmentId/:classId`}
                component={StudentReportCardPrintPreviewContainer}
              />
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
              <Route
                exact
                path={`${match.url}/playlists`}
                render={props => (
                  <Suspense fallback={<Progress />}>
                    <PlayList {...props} />
                  </Suspense>
                )}
              />
              <Route exact path={`${match.url}/playlists/view`} component={CurriculumContainer} />
              <Route
                exact
                path={`${match.url}/playlists/filter/:filterType`}
                render={props => (
                  <Suspense fallback={<Progress />}>
                    <PlayList {...props} />
                  </Suspense>
                )}
              />
              <Route
                exacts
                path="/author/playlists/create"
                render={props => (
                  <Suspense fallback={<Progress />}>
                    <PlaylistPage {...props} />
                  </Suspense>
                )}
              />
              <Route
                exact
                path="/author/playlists/:id/edit"
                render={props => (
                  <Suspense fallback={<Progress />}>
                    <PlaylistPage {...props} />
                  </Suspense>
                )}
              />
              <Route
                exact
                path="/author/playlists/:id"
                render={props => (
                  <Suspense fallback={<Progress />}>
                    <CurriculumContainer {...props} />
                  </Suspense>
                )}
              />
              <Route
                exact
                path="/author/playlists/:id/customize"
                render={props => (
                  <Suspense fallback={<Progress />}>
                    <CurriculumContainer {...props} />
                  </Suspense>
                )}
              />
              <Route
                exact
                path="/author/playlists/:id/use-this"
                render={props => (
                  <Suspense fallback={<Progress />}>
                    <CurriculumContainer {...props} />
                  </Suspense>
                )}
              />
              <Route
                exact
                path={`${match.url}/playlists/assignments/:playlistId/:moduleId`}
                component={props => <AssignTest {...props} isPlaylist={true} />}
              />
              <Route
                exact
                path={`${match.url}/playlists/assignments/:playlistId/:moduleId/:testId`}
                component={props => <AssignTest {...props} isPlaylist={true} />}
              />
              <Route
                exact
                path="/author/playlists/:id/editAssigned"
                render={props => (
                  <Suspense fallback={<Progress />}>
                    <PlayList {...props} editAssigned />
                  </Suspense>
                )}
              />
              <Route
                exact
                path="/author/playlists/:id/publish"
                render={props => (
                  <Suspense fallback={<Progress />}>
                    <SuccessPage {...props} isPlaylist published />
                  </Suspense>
                )}
              />
              <Route
                exact
                path="/author/playlists/:id/assign"
                render={props => (
                  <Suspense fallback={<Progress />}>
                    <SuccessPage {...props} isPlaylist isAssignSuccess />
                  </Suspense>
                )}
              />

              <Route
                exact
                path="/author/playlists/limit/:limit/page/:page/:filter?"
                render={props => (
                  <Suspense fallback={<Progress />}>
                    <PlayList {...props} />
                  </Suspense>
                )}
              />
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
                path="/author/tests/:id/publish"
                render={props => (
                  <Suspense fallback={<Progress />}>
                    <SuccessPage {...props} published />
                  </Suspense>
                )}
              />
              <Route
                exact
                path="/author/tests/:id/assign"
                render={props => (
                  <Suspense fallback={<Progress />}>
                    <SuccessPage {...props} isAssignSuccess />
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
              <Route path="/author/reports/:reportType?" component={Reports} />
              <Route exact path="/author/districtprofile" component={DistrictProfile} />
              <Route exact path="/author/settings/testsettings" component={TestSetting} />
              <Route exact path="/author/settings/term" component={Term} />
              <Route exact path="/author/settings/districtpolicies" component={DistrictPolicy} />
              <Route exact path="/author/settings/performance-bands" component={PerformanceBand} />
              <Route exact path="/author/settings/standards-proficiency" component={StandardsProficiency} />
              <Route exact path="/author/schools" component={Schools} />
              <Route exact path="/author/users/student" component={Student} />
              <Route exact path="/author/users/teacher" component={Teacher} />
              <Route exact path="/author/users/district-admin" component={DistrictAdmin} />
              <Route exact path="/author/users/school-admin" component={SchoolAdmin} />
              <Route exact path="/author/courses" component={Courses} />
              <Route exact path="/author/classes" component={Classes} />
              <Route exact path="/author/settings/interested-standards" component={InterestedStandards} />
            </Switch>
          </Suspense>
          <DragScroll
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              height: 50
            }}
            direction={DOWNWARDS}
          />
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
    left: 100px;
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
