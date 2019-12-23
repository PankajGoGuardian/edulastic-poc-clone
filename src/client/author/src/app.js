import React, { lazy, Suspense, useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import PropTypes from "prop-types";
import styled, { ThemeProvider } from "styled-components";
import { Layout, Spin } from "antd";
import { connect } from "react-redux";
import { Progress, ErrorHandler } from "@edulastic/common";
import { tabletWidth, mainBgColor } from "@edulastic/colors";
import ScrollContext from "@edulastic/common/src/contexts/ScrollContext";
import { get } from "lodash";
import { themes } from "../../theme";
import Sidebar from "./Sidebar/SideMenu";
import SuccessPage from "../TestPage/components/SuccessPage/SuccessPage";
import { MainContainer } from "./MainStyle";
import { getUserOrgId, getUserRole } from "./selectors/user";
import { receiveDistrictPolicyAction } from "../DistrictPolicy/ducks";
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
const PrintAssessment = lazy(() => import("../PrintAssessment"));
const ExpressGrader = lazy(() => import("../ExpressGrader"));
const LCBSettings = lazy(() => import("../LCBAssignmentSettings"));
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
const ClassDetails = lazy(() => import("../ManageClass/components/ClassDetails"));
const ClassEdit = lazy(() => import("../ManageClass/components/ClassEdit"));
const ClassCreate = lazy(() => import("../ManageClass/components/ClassCreate"));
const PrintPreviewClass = lazy(() => import("../ManageClass/components/PrintPreview"));

const Profile = lazy(() => import("../DistrictProfile/components/Container/Profile"));
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
const ClassEnrollment = lazy(() => import("../ClassEnrollment"));

// eslint-disable-next-line react/prop-types
const Author = ({ match, history, location, role, orgId, districtProfileLoading, loadDistrictPolicy }) => {
  useEffect(() => {
    if (orgId && ["school-admin", "district-admin"].includes(role)) {
      loadDistrictPolicy({ orgId });
    }
  }, [orgId]);

  const themeToPass = themes.default;

  const isPrintPreview =
    history.location.pathname.includes("printpreview") || history.location.pathname.includes("printAssessment");
  const assessmentTabs = ["description", "addItems", "review", "settings", "worksheet"];

  return (
    <ThemeProvider theme={themeToPass}>
      <ScrollContext.Provider value={{ getScrollElement: () => window }}>
        <StyledLayout>
          <MainContainer isPrintPreview={isPrintPreview}>
            <Spin spinning={districtProfileLoading} />
            <SidebarCompnent isPrintPreview={isPrintPreview} />
            <Wrapper>
              <ErrorHandler>
                <Suspense fallback={<Progress />}>
                  <Switch>
                    <Route exact path={`${match.url}/assignments`} component={Assignments} />

                    <Route exact path={`${match.url}/tests/select`} component={AssessmentCreate} />
                    <Route exact path={`${match.url}/tests/snapquiz`} component={AssessmentCreate} />
                    <Route
                      exact
                      path={`${match.url}/tests/snapquiz/add`}
                      render={props => (
                        <Suspense fallback={<Progress />}>
                          <AssessmentCreate {...props} isAddPdf />
                        </Suspense>
                      )}
                    />

                    <Route exact path={`${match.url}/assignments/select`} component={AssignmentCreate} />

                    <Route exact path="/author/dashboard" component={Dashboard} />

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
                    <Route
                      exact
                      path="/author/regrade/:id/success"
                      render={props => (
                        <Suspense fallback={<Progress />}>
                          <SuccessPage {...props} isRegradeSuccess />
                        </Suspense>
                      )}
                    />
                    <Route
                      exact
                      path={`${match.url}/assignments/:testId`}
                      component={props => <AssignTest {...props} />}
                    />
                    <Route exact path={`${match.url}/assessments/:assessmentId`} component={AssessmentPage} />
                    <Route path={`${match.url}/classboard/:assignmentId/:classId`} component={ClassBoard} />
                    <Route
                      exact
                      path={`${
                        match.url
                      }/classboard-student-report-card-print-preview/printpreview/:assignmentId/:classId`}
                      component={StudentReportCardPrintPreviewContainer}
                    />
                    <Route exact path={`${match.url}/summary/:assignmentId/:classId`} component={SummaryBoard} />
                    <Route exact path={`${match.url}/classresponses/:testActivityId`} component={ClassResponses} />
                    <Route exact path={`${match.url}/printpreview/:assignmentId/:classId`} component={PrintPreview} />
                    <Route exact path={`${match.url}/printAssessment/:testId`} component={PrintAssessment} />
                    <Route exact path={`${match.url}/manageClass/printPreview`} component={PrintPreviewClass} />
                    <Route exact path={`${match.url}/manageClass/createClass`} component={ClassCreate} />
                    <Route exact path={`${match.url}/manageClass`} component={ManageClass} />
                    <Route exact path={`${match.url}/manageClass/:classId`} component={ClassDetails} />
                    <Route exact path={`${match.url}/manageClass/:classId/Edit`} component={ClassEdit} />

                    <Route exact path={`${match.url}/expressgrader/:assignmentId/:classId`} component={ExpressGrader} />
                    <Route exact path={`${match.url}/lcb/settings/:assignmentId/:classId`} component={LCBSettings} />
                    <Route
                      exact
                      path={`${match.url}/standardsBasedReport/:assignmentId/:classId`}
                      component={StandardsBasedReport}
                    />
                    <Route exact path={`${match.url}/items`} component={ItemList} />
                    <Route exact path={`${match.url}/items/filter/:filterType`} component={ItemList} />
                    <Route exact path={`${match.url}/items/:id/item-detail`} component={ItemDetail} />
                    <Route
                      exact
                      path={`${match.url}/items/:id/item-detail/test/:testId`}
                      render={props => <ItemDetail isTestFlow {...props} />}
                    />
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
                      component={props => <AssignTest {...props} isPlaylist />}
                    />
                    <Route
                      exact
                      path={`${match.url}/playlists/assignments/:playlistId/:moduleId/:testId`}
                      component={props => <AssignTest {...props} isPlaylist />}
                    />
                    <Route
                      exact
                      path="/author/playlists/:id/editAssigned"
                      render={props => (
                        <Suspense fallback={<Progress />}>
                          {/* coming from editAssessment in assignment dropdown should land   `Review` tab */}
                          <PlayList {...props} currentTab="review" editAssigned />
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
                      path="/author/playlists/:playlistId/assign/:assignmentId"
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
                      exact
                      path="/author/tests/create"
                      render={props => <TestPage {...props} currentTab="description" />}
                    />

                    <Route
                      exact
                      path="/author/tests/:id"
                      render={props => (
                        <Suspense fallback={<Progress />}>
                          <TestPage {...props} currentTab="description" />
                        </Suspense>
                      )}
                    />

                    {/**
                     * before saving the test
                     *  */}
                    {assessmentTabs.map(x => (
                      <Route
                        exact
                        path={`/author/tests/create/${x}`}
                        render={props => <TestPage {...props} currentTab={x} />}
                      />
                    ))}

                    {/**
                     * After saving the test with id
                     *  */}
                    {assessmentTabs.map(x => (
                      <Route
                        exact
                        path={`/author/tests/tab/${x}/id/:id`}
                        render={props => <TestPage {...props} currentTab={x} />}
                      />
                    ))}

                    {/**
                     * After versioned
                     */}
                    {assessmentTabs.map(x => (
                      <Route
                        exact
                        path={`/author/tests/tab/${x}/id/:id/old/:oldId`}
                        render={props => <TestPage {...props} currentTab={x} />}
                      />
                    ))}

                    <Route
                      exact
                      path="/author/tests/:testId/createItem/:itemId"
                      render={props => (
                        <Suspense fallback={<Progress />}>
                          <ItemDetail isTestFlow {...props} />
                        </Suspense>
                      )}
                    />
                    <Route
                      exact
                      path="/author/tests/:testId/editItem/:itemId"
                      render={props => <ItemDetail isTestFlow isEditFlow {...props} />}
                    />
                    <Route
                      exact
                      path="/author/tests/:id/editAssigned"
                      render={props => (
                        <Suspense fallback={<Progress />}>
                          <TestPage {...props} currentTab="review" editAssigned />
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
                      path="/author/tests/:id/assign/:assignmentId"
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
                          <TestPage {...props} currentTab="review" versioned />
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
                    <Route
                      exact
                      path="/author/tests/:testId/createItem/:itemId/pickup-questiontype"
                      render={props => (
                        <Suspense fallback={<Progress />}>
                          <PickUpQuestionType isTestFlow {...props} />
                        </Suspense>
                      )}
                    />
                    <Route
                      exact
                      path="/author/tests/:testId/createItem/:itemId/questions/create/:questionType"
                      render={props => (
                        <Suspense fallback={<Progress />}>
                          <QuestionEditor isTestFlow {...props} />
                        </Suspense>
                      )}
                    />
                    <Route
                      exact
                      path="/author/tests/:testId/createItem/:itemId/questions/edit/:questionType"
                      render={props => (
                        <Suspense fallback={<Progress />}>
                          <QuestionEditor isTestFlow isEditFlow {...props} />
                        </Suspense>
                      )}
                    />
                    <Route exact path="/author/items/:id/pickup-questiontype" component={PickUpQuestionType} />
                    <Route exact path="/author/questions/create/:questionType" component={QuestionEditor} />
                    <Route exact path="/author/questions/edit/:questionType" component={QuestionEditor} />
                    <Route path="/author/reports/:reportType?" component={Reports} />
                    <Route exact path="/author/profile" component={Profile} />
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
                    <Route exact path="/author/Class-Enrollment" component={ClassEnrollment} />
                  </Switch>
                </Suspense>
              </ErrorHandler>
            </Wrapper>
          </MainContainer>
        </StyledLayout>
      </ScrollContext.Provider>
    </ThemeProvider>
  );
};

export default connect(
  ({ authorUi, ...state }) => ({
    orgId: getUserOrgId(state),
    role: getUserRole(state),
    districtProfile: get(state, ["districtProfileReducer", "data"], {}),
    districtProfileLoading: get(state, ["districtProfileReducer", "loading"], false)
  }),
  {
    loadDistrictPolicy: receiveDistrictPolicyAction
  }
)(Author);

Author.propTypes = {
  match: PropTypes.object.isRequired
};

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
