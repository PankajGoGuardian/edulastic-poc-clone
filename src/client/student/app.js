import React, { useEffect } from 'react'
import { Route, Switch } from 'react-router-dom'
import PropTypes from 'prop-types'
import qs from 'qs'
import { ErrorHandler } from '@edulastic/common'
import styled, { ThemeProvider } from 'styled-components'
import { Layout } from 'antd'
import { connect } from 'react-redux'
import { mobileWidthLarge } from '@edulastic/colors'
// import { getZoomedTheme } from "./zoomTheme";
import { roleuser } from '@edulastic/constants'
import Sidebar from './Sidebar/SideMenu'
import { Assignment } from './Assignments'
import { Report } from './Reports'
import { StudentPlaylist } from './StudentPlaylist'
// TODOSidebar
import { ReportList } from './TestAcitivityReport'
import { Profile } from './Profile'

import { ManageClass } from './ManageClass'
import SkillReportContainer from './SkillReport'
import DeepLink from './DeeplinkAssessment'
import StartAssignment from './StartAssignment'

import { themes as globalThemes } from '../theme'
import { addThemeBackgroundColor } from '../common/utils/helpers'
import NotFound from '../NotFound'
import {
  isProxyUser as isProxyUserSelector,
  updateCliUserAction,
} from './Login/ducks'
import { AssignmentEmbedLink } from '../assignmentEmbedLink'
import PrivacyPolicyModal from '../privacyPolicy'
import FeaturesSwitch from '../features/components/FeaturesSwitch'

const StudentApp = ({
  match,
  isProxyUser,
  location,
  updateCliUser,
  isCliUser,
  user,
}) => {
  // themeToPass = getZoomedTheme(themeToPass, zoomLevel);
  // themeToPass = { ...themeToPass, ...globalThemes.zoomed(themeToPass) };

  useEffect(() => {
    const searchParams = qs.parse(location.search, { ignoreQueryPrefix: true })
    if (searchParams.cliUser) {
      updateCliUser(true)
    }
  }, [])

  const userInfo = user?.user
  const userRole = userInfo?.role || ''

  const showEulaForQA = process.env.REACT_APP_QA_ENV
    ? process.env.REACT_APP_QA_ENV && window.showEulaForQA
    : true // Eula Modal Hidden For QA Environment &  Window Variable value changed on Automation to display

  const showPrivacyPolicyModal =
    !isProxyUser &&
    !!showEulaForQA &&
    userRole !== roleuser.STUDENT &&
    userInfo?.isPolicyAccepted === false

  return (
    <ThemeProvider theme={globalThemes.default}>
      <StyledLayout isProxyUser={isProxyUser}>
        {showPrivacyPolicyModal && (
          <FeaturesSwitch inputFeatures="eula" actionOnInaccessible="hidden">
            <PrivacyPolicyModal
              userID={userInfo._id}
              userRole={userRole}
              roleuser={roleuser}
            />
          </FeaturesSwitch>
        )}
        <MainContainer isCliUser={isCliUser}>
          {!isCliUser && <Sidebar isProxyUser={isProxyUser} />}
          <Wrapper>
            <ErrorHandler>
              <Switch>
                <Route
                  path={`${match.url}/assignments`}
                  component={Assignment}
                />
                <Route path={`${match.url}/dashboard`} component={Assignment} />
                <Route
                  path={`${match.url}/seb/test/:testId/type/:testType/assignment/:assignmentId/testActivity/:testActivityId`}
                  component={DeepLink}
                />
                <Route
                  path={`${match.url}/seb/test/:testId/type/:testType/assignment/:assignmentId`}
                  component={DeepLink}
                />

                <Route path={`${match.url}/grades`} component={Report} />
                <Route
                  path={`${match.url}/skill-mastery`}
                  component={SkillReportContainer}
                />
                <Route path={`${match.url}/manage`} component={ManageClass} />
                <Route path={`${match.url}/profile`} component={Profile} />
                <Route
                  path={`${match.url}/class/:classId/test/:testId/testActivityReport/:id`}
                  component={ReportList}
                />
                <Route
                  path={`${match.url}/group/:groupId/assignment/:assignmentId`}
                  component={StartAssignment}
                />
                <Route
                  path={`${match.url}/playlist`}
                  component={StudentPlaylist}
                />
                <Route
                  path={`${match.url}/tests/verid/:versionId`}
                  render={(props) => (
                    <AssignmentEmbedLink {...props} isVersionId />
                  )}
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
  ({ ui, user }) => ({
    user,
    zoomLevel: ui.zoomLevel,
    isProxyUser: isProxyUserSelector({ user }),
    isCliUser: user?.isCliUser,
  }),
  {
    updateCliUser: updateCliUserAction,
  }
)(StudentApp)

StudentApp.propTypes = {
  match: PropTypes.object.isRequired,
  selectedTheme: PropTypes.string.isRequired,
}

const MainContainer = addThemeBackgroundColor(styled.div`
  padding-left: ${({ isCliUser }) => (isCliUser ? '0' : '70px')};
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

  @media (max-width: ${mobileWidthLarge}) {
    padding-left: 0px;
  }
`)

const Wrapper = styled.div`
  position: relative;
`

const StyledLayout = styled(Layout)`
  .fixed-header {
    top: ${(props) =>
      props.isProxyUser ? props.theme.BannerHeight : 0}px !important;
  }
  margin-top: ${(props) =>
    props.isProxyUser ? props.theme.BannerHeight : 0}px;
`
