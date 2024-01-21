/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect } from 'react'
import loadable from '@loadable/component'
import { Route, Switch } from 'react-router-dom'
import PropTypes from 'prop-types'
import styled, { ThemeProvider } from 'styled-components'
import { Layout, Spin } from 'antd'
import { connect } from 'react-redux'
import { Progress, ErrorHandler, toggleChatDisplay } from '@edulastic/common'
import { tabletWidth, mainBgColor } from '@edulastic/colors'
import { roleuser } from '@edulastic/constants'
import { getFromLocalStorage } from '@edulastic/api/src/utils/Storage'
import { get } from 'lodash'
import { themes } from '../../theme'
import Sidebar, { isDisablePageInMobile } from './Sidebar/SideMenu'
import SuccessPage from '../TestPage/components/SuccessPage/SuccessPage'
import { MainContainer } from './MainStyle'
import { getUserOrgId, getUserRole } from './selectors/user'
import {
  isProxyUser as isProxyUserSelector,
  isDemoPlaygroundUser,
} from '../../student/Login/ducks'
import {
  receiveDistrictPolicyAction,
  receiveSchoolPolicyAction,
} from '../DistrictPolicy/ducks'
import ImportTest from '../ImportTest'
import NotFound from '../../NotFound'
import { updateRecentCollectionsAction } from './actions/dictionaries'

/* lazy load routes */
const Dashboard = loadable(() => import('../Dashboard'), {
  fallback: <Progress />,
})
const Assignments = loadable(() => import('../Assignments'), {
  fallback: <Progress />,
})
const AssignTest = loadable(() => import('../AssignTest'), {
  fallback: <Progress />,
})
const AssignmentAdvanced = loadable(() => import('../AssignmentAdvanced'), {
  fallback: <Progress />,
})
const AssessmentCreate = loadable(() => import('../AssessmentCreate'), {
  fallback: <Progress />,
})
const AssignmentCreate = loadable(() => import('../AssignmentCreate'), {
  fallback: <Progress />,
})
const AssessmentPage = loadable(() => import('../AssessmentPage'), {
  fallback: <Progress />,
})
const ClassBoard = loadable(() => import('../ClassBoard'), {
  fallback: <Progress />,
})
const SummaryBoard = loadable(() => import('../SummaryBoard'), {
  fallback: <Progress />,
})
const ClassResponses = loadable(() => import('../ClassResponses'), {
  fallback: <Progress />,
})
const PrintPreview = loadable(() => import('../PrintPreview'), {
  fallback: <Progress />,
})
const PrintAssessment = loadable(() => import('../PrintAssessment'), {
  fallback: <Progress />,
})
const ExpressGrader = loadable(() => import('../ExpressGrader'), {
  fallback: <Progress />,
})
const LCBSettings = loadable(() => import('../LCBAssignmentSettings'), {
  fallback: <Progress />,
})
const TestList = loadable(() => import('../TestList'), {
  fallback: <Progress />,
})
const TestPage = loadable(() => import('../TestPage'), {
  fallback: <Progress />,
})
const QuestionEditor = loadable(() => import('../QuestionEditor'), {
  fallback: <Progress />,
})
const ItemList = loadable(() => import('../ItemList'), {
  fallback: <Progress />,
})
const ItemDetail = loadable(() => import('../ItemDetail'), {
  fallback: <Progress />,
})
const ItemAdd = loadable(() => import('../ItemAdd'), {
  fallback: <Progress />,
})
const PickUpQuestionType = loadable(() => import('../PickUpQuestionType'), {
  fallback: <Progress />,
})
const CurriculumSequence = loadable(() => import('../CurriculumSequence'), {
  fallback: <Progress />,
})
const Reports = loadable(() => import('../Reports'), {
  fallback: <Progress />,
})
const StandardsBasedReport = loadable(() => import('../StandardsBasedReport'), {
  fallback: <Progress />,
})

const ManageClass = loadable(() => import('../ManageClass'), {
  fallback: <Progress />,
})
const ClassDetails = loadable(
  () => import('../ManageClass/components/ClassDetails'),
  {
    fallback: <Progress />,
  }
)
const ClassEdit = loadable(
  () => import('../ManageClass/components/ClassEdit'),
  {
    fallback: <Progress />,
  }
)
const ClassCreate = loadable(
  () => import('../ManageClass/components/ClassCreate'),
  {
    fallback: <Progress />,
  }
)
const PrintPreviewClass = loadable(
  () => import('../ManageClass/components/PrintPreview'),
  {
    fallback: <Progress />,
  }
)

const Profile = loadable(
  () => import('../DistrictProfile/components/Container/Profile'),
  {
    fallback: <Progress />,
  }
)
const Subscription = loadable(() => import('../Subscription'), {
  fallback: <Progress />,
})
const ManageSubscription = loadable(() => import('../ManageSubscription'), {
  fallback: <Progress />,
})
const DistrictProfile = loadable(() => import('../DistrictProfile'), {
  fallback: <Progress />,
})
const TestSetting = loadable(() => import('../TestSetting'), {
  fallback: <Progress />,
})
const Term = loadable(() => import('../Term'), {
  fallback: <Progress />,
})
const DistrictPolicy = loadable(() => import('../DistrictPolicy'), {
  fallback: <Progress />,
})
const PerformanceBand = loadable(() => import('../PerformanceBand'), {
  fallback: <Progress />,
})
const StandardsProficiency = loadable(() => import('../StandardsProficiency'), {
  fallback: <Progress />,
})
const Schools = loadable(() => import('../Schools'), {
  fallback: <Progress />,
})
const Student = loadable(() => import('../Student'), {
  fallback: <Progress />,
})
const Teacher = loadable(() => import('../Teacher'), {
  fallback: <Progress />,
})
const DistrictAdmin = loadable(() => import('../DistrictAdmin'), {
  fallback: <Progress />,
})
const SchoolAdmin = loadable(() => import('../SchoolAdmin'), {
  fallback: <Progress />,
})
const ContentAuthor = loadable(() => import('../ContentAuthor'), {
  fallback: <Progress />,
})
const ContentApprover = loadable(() => import('../ContentApprover'), {
  fallback: <Progress />,
})
const Courses = loadable(() => import('../Courses'), {
  fallback: <Progress />,
})
const Classes = loadable(() => import('../Classes'), {
  fallback: <Progress />,
})
const Groups = loadable(() => import('../Groups'), {
  fallback: <Progress />,
})
const InterestedStandards = loadable(() => import('../InterestedStandards'), {
  fallback: <Progress />,
})
const RosterImport = loadable(() => import('../RosterImport'), {
  fallback: <Progress />,
})
const PlayList = loadable(() => import('../Playlist'), {
  fallback: <Progress />,
})
const PlaylistPage = loadable(() => import('../PlaylistPage'), {
  fallback: <Progress />,
})
const ClassEnrollment = loadable(() => import('../ClassEnrollment'), {
  fallback: <Progress />,
})
const ContentBuckets = loadable(() => import('../ContentBuckets'), {
  fallback: <Progress />,
})
const Collections = loadable(() => import('../ContentCollections'), {
  fallback: <Progress />,
})
const ExternalTools = loadable(() => import('../ExternalTools'), {
  fallback: <Progress />,
})
const StudentsReportCard = loadable(() => import('../StudentsReportCard'), {
  fallback: <Progress />,
})
const Gradebook = loadable(() => import('../Gradebook'), {
  fallback: <Progress />,
})
const StartAssignment = loadable(
  () => import('../../student/StartAssignment'),
  {
    fallback: <Progress />,
  }
)

const Collaboration = loadable(() => import('../Collaboration'), {
  fallback: <Progress />,
})

const MemberCollaboration = loadable(
  () => import('../Groups/MemberCollaboration'),
  {
    fallback: <Progress />,
  }
)
const DataWarehouse = loadable(() => import('../DataWarehouse'), {
  fallback: <Progress />,
})

// eslint-disable-next-line react/prop-types
const Author = ({
  match,
  history,
  role,
  orgId,
  districtProfileLoading,
  loadDistrictPolicy,
  loadSchoolPolicy,
  schoolId,
  isProxyUser,
  isCliUser,
  isDemoAccount,
  updateRecentCollections,
}) => {
  useEffect(() => {
    if (orgId) {
      const recentCollections = getFromLocalStorage(
        `recentCollections_${orgId}`
      )
        ? JSON.parse(getFromLocalStorage(`recentCollections_${orgId}`))
        : []
      updateRecentCollections({
        recentCollections,
      })
    }
  }, [orgId])

  useEffect(() => {
    if (role === roleuser.SCHOOL_ADMIN && schoolId) {
      loadSchoolPolicy(schoolId)
    }
    if (role === roleuser.DISTRICT_ADMIN && orgId) {
      loadDistrictPolicy({ orgId, orgType: 'district' })
    }
  }, [orgId, schoolId])

  useEffect(() => {
    // Hiding chat widget for cli user
    if (isCliUser) {
      toggleChatDisplay('hide')
    }
  }, [isCliUser])

  const themeToPass = {
    isProxyUser: isProxyUser || isDemoAccount || false,
    ...themes.default,
  }

  const isPrintPreview =
    history.location.pathname.includes('printpreview') ||
    history.location.pathname.includes('printAssessment') ||
    history.location.pathname.includes('students-report-card')
  const assessmentTabs = [
    'description',
    'manageSections',
    'addItems',
    'review',
    'settings',
    'worksheet',
  ]

  return (
    <ThemeProvider theme={themeToPass}>
      <StyledLayout isBannerShown={isProxyUser || isDemoAccount}>
        <MainContainer isPrintPreview={isPrintPreview || isCliUser}>
          <Spin spinning={districtProfileLoading} />
          <SidebarCompnent
            isPrintPreview={isPrintPreview || isCliUser}
            isBannerShown={isProxyUser || isDemoAccount}
            style={{ display: isCliUser && 'none' }}
          />
          <Wrapper>
            <ErrorHandler
              disablePage={isDisablePageInMobile(history.location.pathname)}
            >
              <Switch>
                <Route
                  exact
                  path={`${match.url}/assignments`}
                  component={Assignments}
                />
                <Route
                  exact
                  path={`${match.url}/tests/select`}
                  component={AssessmentCreate}
                />
                <Route
                  exact
                  path={`${match.url}/tests/snapquiz`}
                  component={AssessmentCreate}
                />
                <Route
                  exact
                  path={`${match.url}/tests/videoquiz`}
                  component={AssessmentCreate}
                />
                <Route
                  exact
                  path={`${match.url}/tests/snapquiz/add`}
                  render={(props) => <AssessmentCreate {...props} isAddPdf />}
                />

                <Route
                  exact
                  path={`${match.url}/assignments/select`}
                  component={AssignmentCreate}
                />

                <Route exact path="/author/dashboard" component={Dashboard} />

                <Route
                  exact
                  path={`${match.url}/assignments/:districtId/:testId`}
                  component={(props) => <AssignmentAdvanced {...props} />}
                />
                <Route
                  exact
                  path="/author/regrade/:id/success"
                  render={(props) => (
                    <SuccessPage {...props} isRegradeSuccess />
                  )}
                />
                <Route
                  exact
                  path={`${match.url}/assignments/:testId`}
                  component={(props) => (
                    <AssignTest {...props} from="assignments" />
                  )}
                />
                <Route
                  exact
                  path={`${match.url}/assessments/:assessmentId`}
                  component={AssessmentPage}
                />
                <Route
                  path={`${match.url}/classboard/:assignmentId/:classId`}
                  component={ClassBoard}
                />

                <Route
                  exact
                  path={`${match.url}/summary/:assignmentId/:classId`}
                  component={SummaryBoard}
                />
                <Route
                  exact
                  path={`${match.url}/classresponses/:testActivityId`}
                  component={ClassResponses}
                />
                <Route
                  exact
                  path={`${match.url}/printpreview/:assignmentId/:classId`}
                  component={PrintPreview}
                />
                <Route
                  exact
                  path={`${match.url}/printAssessment/:testId`}
                  component={PrintAssessment}
                />
                <Route
                  exact
                  path={`${match.url}/manageClass/:classId/printpreview`}
                  component={PrintPreviewClass}
                />
                <Route
                  exact
                  path={`${match.url}/manageClass/createClass`}
                  component={ClassCreate}
                />
                <Route
                  exact
                  path={`${match.url}/manageClass`}
                  component={ManageClass}
                />
                <Route
                  exact
                  path={`${match.url}/manageClass/:classId`}
                  component={ClassDetails}
                />
                <Route
                  exact
                  path={`${match.url}/manageClass/:classId/Edit`}
                  component={ClassEdit}
                />

                <Route
                  exact
                  path={`${match.url}/expressgrader/:assignmentId/:classId`}
                  component={ExpressGrader}
                />
                <Route
                  exact
                  path={`${match.url}/lcb/settings/:assignmentId/:classId`}
                  component={LCBSettings}
                />
                {/* 
                      on navigation from 3rd party 
                      /author/group/{groupId}/assignment/{assignmentId} 
                      StartAssignment will navigate author to LCB
                    */}
                <Route
                  exact
                  path={`${match.url}/group/:groupId/assignment/:assignmentId`}
                  component={StartAssignment}
                />
                <Route
                  exact
                  path={`${match.url}/standardsBasedReport/:assignmentId/:classId`}
                  component={StandardsBasedReport}
                />
                <Route exact path={`${match.url}/items`} component={ItemList} />
                <Route
                  exact
                  path={`${match.url}/items/filter/:filterType`}
                  component={ItemList}
                />
                <Route
                  exact
                  path={`${match.url}/items/:id/item-detail`}
                  component={ItemDetail}
                />
                <Route
                  exact
                  path={`${match.url}/items/:id/item-detail/test/:testId`}
                  render={(props) => <ItemDetail isTestFlow {...props} />}
                />
                <Route
                  exact
                  path={`${match.url}/playlists`}
                  render={(props) => <PlayList {...props} />}
                />
                <Route
                  exact
                  path={`${match.url}/playlists/view`}
                  component={CurriculumSequence}
                />
                <Route
                  exact
                  path={`${match.url}/playlists/filter/:filterType`}
                  render={(props) => <PlayList {...props} />}
                />
                <Route
                  exact
                  path={`${match.url}/playlists/filter/:filterType/page/:page`}
                  render={(props) => <PlayList {...props} />}
                />
                <Route
                  exact
                  path={`${match.url}/playlists/page/:page`}
                  render={(props) => <PlayList {...props} />}
                />
                <Route
                  exacts
                  path="/author/playlists/create"
                  render={(props) => <PlaylistPage {...props} isCreatePage />}
                />
                <Route
                  exact
                  path="/author/playlists/:id/edit"
                  render={(props) => <PlaylistPage {...props} isEditPage />}
                />
                <Route
                  exact
                  path="/author/playlists/:id"
                  render={(props) => (
                    <CurriculumSequence {...props} fromPlaylist />
                  )}
                />
                <Route
                  exact
                  path="/author/playlists/:currentTab/:id/use-this"
                  render={(props) => (
                    <CurriculumSequence {...props} urlHasUseThis />
                  )}
                />
                <Route
                  exact
                  path="/author/playlists/customize/:id/:cloneId"
                  render={(props) => (
                    <CurriculumSequence {...props} urlHasUseThis />
                  )}
                />
                <Route
                  exact
                  path={`${match.url}/playlists/assignments/:playlistId/:moduleId`}
                  component={(props) => (
                    <AssignTest {...props} isPlaylist from="myPlaylist" />
                  )}
                />

                <Route
                  exact
                  path={`${match.url}/playlists/assignments/:playlistId/:moduleId/:testId`}
                  component={(props) => (
                    <AssignTest {...props} isPlaylist from="myPlaylist" />
                  )}
                />
                <Route
                  exact
                  path="/author/playlists/:id/editAssigned"
                  render={(props) => (
                    /* coming from editAssessment in assignment dropdown should land   
                      `Review` tab */
                    <PlayList {...props} currentTab="review" editAssigned />
                  )}
                />
                <Route
                  exact
                  path="/author/playlists/:id/publish"
                  render={(props) => (
                    <SuccessPage {...props} isPlaylist published />
                  )}
                />
                <Route
                  exact
                  path="/author/playlists/:playlistId/assign/:assignmentId"
                  render={(props) => (
                    <SuccessPage {...props} isPlaylist isAssignSuccess />
                  )}
                />
                <Route
                  exact
                  path="/author/playlists/:playlistId/async-assign"
                  render={(props) => (
                    <SuccessPage {...props} isPlaylist isAsyncAssign />
                  )}
                />
                <Route
                  exact
                  path="/author/playlists/limit/:limit/page/:page/:filter?"
                  render={(props) => <PlayList {...props} />}
                />
                <Route
                  exact
                  path="/author/gradebook"
                  render={(props) => <Gradebook {...props} />}
                />
                <Route
                  exact
                  path="/author/gradebook/student/:studentId"
                  render={(props) => <Gradebook {...props} urlHasStudent />}
                />
                <Route
                  exact
                  path="/author/gradebook/createClass"
                  component={ClassCreate}
                />
                <Route exact path="/author/add-item" component={ItemAdd} />
                <Route
                  exact
                  path={`${match.url}/tests`}
                  render={(props) => <TestList {...props} />}
                />

                <Route
                  exact
                  path={`${match.url}/tests/filter/:filterType`}
                  render={(props) => <TestList {...props} />}
                />
                <Route
                  exact
                  path="/author/tests/create"
                  render={(props) => (
                    <TestPage {...props} currentTab="description" />
                  )}
                />

                <Route
                  exact
                  path="/author/tests/:id"
                  render={(props) => (
                    <TestPage {...props} currentTab="description" />
                  )}
                />

                {/**
                 * before saving the test
                 *  */}
                {assessmentTabs.map((x) => (
                  <Route
                    exact
                    path={`/author/tests/create/${x}`}
                    render={(props) => <TestPage {...props} currentTab={x} />}
                  />
                ))}

                {/**
                 * After saving the test with id
                 *  */}
                {assessmentTabs.map((x) => (
                  <Route
                    exact
                    path={`/author/tests/tab/${x}/id/:id`}
                    render={(props) => <TestPage {...props} currentTab={x} />}
                  />
                ))}

                {/**
                 * After versioned
                 */}
                {assessmentTabs.map((x) => (
                  <Route
                    exact
                    path={`/author/tests/tab/${x}/id/:id/old/:oldId`}
                    render={(props) => <TestPage {...props} currentTab={x} />}
                  />
                ))}

                <Route
                  exact
                  path="/author/tests/verid/:versionId"
                  render={(props) => <TestPage isVersionFlow {...props} />}
                />

                <Route
                  exact
                  path="/author/tests/:testId/createItem/:itemId"
                  render={(props) => <ItemDetail isTestFlow {...props} />}
                />
                <Route
                  exact
                  path="/author/tests/:testId/editItem/:itemId"
                  render={(props) => (
                    <ItemDetail isTestFlow isEditFlow {...props} />
                  )}
                />
                <Route
                  exact
                  path="/author/tests/:id/editAssigned"
                  render={(props) => (
                    <TestPage {...props} currentTab="review" editAssigned />
                  )}
                />

                <Route
                  exact
                  path="/author/tests/:id/publish"
                  render={(props) => <SuccessPage {...props} published />}
                />
                <Route
                  exact
                  path="/author/tests/:id/assign/:assignmentId"
                  render={(props) => <SuccessPage {...props} isAssignSuccess />}
                />
                <Route
                  exact
                  path="/author/tests/:id/async-assign"
                  render={(props) => <SuccessPage {...props} isAsyncAssign />}
                />

                <Route
                  exact
                  path="/author/tests/:id/versioned/old/:oldId"
                  render={(props) => (
                    <TestPage {...props} currentTab="review" versioned />
                  )}
                />

                <Route
                  exact
                  path="/author/tests/limit/:limit/page/:page/:filter?"
                  render={(props) => <TestList {...props} />}
                />
                <Route
                  exact
                  path="/author/tests/:testId/createItem/:itemId/pickup-questiontype"
                  render={(props) => (
                    <PickUpQuestionType isTestFlow {...props} />
                  )}
                />
                <Route
                  exact
                  path="/author/tests/:testId/createItem/:itemId/questions/create/:questionType"
                  render={(props) => <QuestionEditor isTestFlow {...props} />}
                />
                <Route
                  exact
                  path="/author/tests/:testId/createItem/:itemId/questions/edit/:questionType"
                  render={(props) => (
                    <QuestionEditor isTestFlow isEditFlow {...props} />
                  )}
                />
                <Route
                  exact
                  path="/author/tests/:testId/editItem/:itemId/questions/edit/:questionType" // needed as per https://snapwiz.atlassian.net/browse/EV-13426
                  render={(props) => (
                    <QuestionEditor isTestFlow isEditFlow {...props} />
                  )}
                />
                <Route
                  exact
                  path="/author/items/:id/pickup-questiontype"
                  component={PickUpQuestionType}
                />
                <Route
                  exact
                  path="/author/questions/create/:questionType"
                  component={QuestionEditor}
                />
                <Route
                  exact
                  path="/author/questions/edit/:questionType"
                  component={QuestionEditor}
                />
                <Route
                  path="/author/reports/:reportType?"
                  component={Reports}
                />
                <Route exact path="/author/profile" component={Profile} />
                <Route
                  exact
                  path="/author/subscription"
                  component={Subscription}
                />
                <Route
                  exact
                  path={`${match.url}/manage-subscriptions`}
                  component={ManageSubscription}
                />
                <Route
                  exact
                  path="/author/districtprofile"
                  component={DistrictProfile}
                />
                <Route
                  exact
                  path="/author/schoolprofile"
                  component={DistrictProfile}
                />
                <Route
                  exact
                  path="/author/settings/testsettings"
                  component={TestSetting}
                />
                <Route exact path="/author/settings/term" component={Term} />
                <Route
                  exact
                  path="/author/settings/districtpolicies"
                  component={DistrictPolicy}
                />
                <Route
                  exact
                  path="/author/settings/schoolpolicies"
                  component={DistrictPolicy}
                />
                <Route
                  exact
                  path="/author/settings/performance-bands"
                  component={PerformanceBand}
                />
                <Route
                  exact
                  path="/author/settings/standards-proficiency"
                  component={StandardsProficiency}
                />
                <Route
                  exact
                  path="/author/settings/roster-import"
                  component={RosterImport}
                />
                <Route exact path="/author/schools" component={Schools} />
                <Route exact path="/author/users/student" component={Student} />
                <Route exact path="/author/users/teacher" component={Teacher} />
                <Route
                  exact
                  path="/author/users/district-admin"
                  component={DistrictAdmin}
                />
                <Route
                  exact
                  path="/author/users/school-admin"
                  component={SchoolAdmin}
                />
                <Route
                  exact
                  path="/author/users/content-authors"
                  component={ContentAuthor}
                />
                <Route
                  exact
                  path="/author/users/content-approvers"
                  component={ContentApprover}
                />
                <Route exact path="/author/courses" component={Courses} />
                <Route exact path="/author/classes" component={Classes} />
                <Route
                  exact
                  path="/author/groups/createClass"
                  component={ClassCreate}
                />
                <Route
                  exact
                  path="/author/groups/students/createClass"
                  component={ClassCreate}
                />
                <Route
                  exact
                  path={[
                    '/author/groups/details/:classId',
                    '/author/groups/students/details/:classId',
                  ]}
                  component={ClassDetails}
                />
                <Route
                  exact
                  path={[
                    '/author/groups/edit/:classId',
                    '/author/groups/students/edit/:classId',
                  ]}
                  component={ClassEdit}
                />
                <Route
                  exact
                  path="/author/groups"
                  render={(props) => <Groups tab="collaborations" {...props} />}
                />
                <Route
                  exact
                  path="/author/groups/collaborations"
                  render={(props) => <Groups tab="collaborations" {...props} />}
                />
                <Route
                  exact
                  path="/author/collaborations"
                  component={MemberCollaboration}
                />
                <Route
                  exact
                  path="/author/groups/students"
                  render={(props) => <Groups tab="students" {...props} />}
                />
                <Route
                  exact
                  path="/author/collaborations/:id"
                  component={Collaboration}
                />
                <Route
                  exact
                  path="/author/settings/interested-standards"
                  component={InterestedStandards}
                />
                <Route
                  exact
                  path="/author/class-enrollment"
                  component={ClassEnrollment}
                />
                <Route
                  exact
                  path="/author/class-enrollment/createClass"
                  component={ClassCreate}
                />
                <Route
                  exact
                  path="/author/content/buckets"
                  component={ContentBuckets}
                />
                <Route
                  exact
                  path="/author/content/collections"
                  component={Collections}
                />
                <Route
                  exact
                  path="/author/content/tools"
                  component={ExternalTools}
                />
                <Route
                  exact
                  path="/author/import-test"
                  component={ImportTest}
                />
                <Route
                  exact
                  path="/author/import-content"
                  component={ImportTest}
                />
                <Route
                  exact
                  path={`${match.url}/students-report-card/:assignmentId/:classId`}
                  render={(props) => <StudentsReportCard {...props} audit />}
                />
                <Route
                  exact
                  path={`${match.url}/data-warehouse`}
                  component={DataWarehouse}
                />
                <Route component={NotFound} />
              </Switch>
            </ErrorHandler>
          </Wrapper>
        </MainContainer>
      </StyledLayout>
    </ThemeProvider>
  )
}

export default connect(
  ({ authorUi, ...state }) => ({
    orgId: getUserOrgId(state),
    role: getUserRole(state),
    districtProfile: get(state, ['districtProfileReducer', 'data'], {}),
    districtProfileLoading: get(
      state,
      ['districtProfileReducer', 'loading'],
      false
    ),
    schoolId: get(state, 'user.saSettingsSchool'),
    isProxyUser: isProxyUserSelector(state),
    isCliUser: get(state, 'user.isCliUser', false),
    isDemoAccount: isDemoPlaygroundUser(state),
  }),
  {
    loadDistrictPolicy: receiveDistrictPolicyAction,
    loadSchoolPolicy: receiveSchoolPolicyAction,
    updateRecentCollections: updateRecentCollectionsAction,
  }
)(Author)

Author.propTypes = {
  match: PropTypes.object.isRequired,
}

const SidebarCompnent = styled(Sidebar)`
  display: ${(props) => (props.isPrintPreview ? 'none' : 'block')};
  @media (max-width: ${tabletWidth}) {
    display: none;
  }
  top: ${(props) => (props.isBannerShown ? props.theme.BannerHeight : 0)}px;
`
const Wrapper = styled.div`
  position: relative;
`

const StyledLayout = styled(Layout)`
  background: ${mainBgColor};
  .fixed-header {
    top: ${(props) =>
      props.isBannerShown ? props.theme.BannerHeight : 0}px !important;
  }
  padding-top: ${(props) =>
    props.isBannerShown ? props.theme.BannerHeight : 0}px;
`
