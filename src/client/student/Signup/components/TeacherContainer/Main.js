import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { ThemeProvider } from 'styled-components'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { get } from 'lodash'
import { Col } from 'antd'
import { notification } from '@edulastic/common'
import { canvasApi } from '@edulastic/api'
import queryString from 'query-string'
import Header from './Header'
import JoinSchool from './JoinSchool'
import SignupForm from './SignupForm'
import AddSchoolAndGradeModal from './AddSchoolAndGradeModal'
import SubjectGradeForm from './SubjectGrade'
import teacherBg from '../../../assets/bg-teacher.png'
import { getPartnerKeyFromUrl } from '../../../../common/utils/helpers'
import { Partners } from '../../../../common/utils/static/partnerData'
import { logoutAction } from '../../../Login/ducks'
import CanvasBulkAddClass from '../../../../common/components/CanvasBulkAddClass'
import authorizeCanvas from '../../../../common/utils/CanavsAuthorizationModule'
import {
  getCanvasCourseListRequestAction,
  getCanvasSectionListRequestAction,
} from '../../../../author/ManageClass/ducks'
import {
  currentDistrictInstitutionIds,
  getUserOrgId,
} from '../../../../author/src/selectors/user'
import { themes } from '../../../../theme'

const Container = ({
  user,
  isSignupUsingDaURL,
  generalSettings,
  districtPolicy,
  orgShortName,
  logout,
  invitedUser = false,
  invitedUserDetails = {},
  getCanvasCourseListRequest,
  getCanvasSectionListRequest,
  canvasCourseList,
  canvasSectionList,
  orgType,
  institutionIds,
  isModalView,
  isModalVisible,
  toggleModal,
  districtId,
}) => {
  const { isAuthenticated, signupStatus } = user
  const allowCanvas = sessionStorage.getItem('signupFlow') === 'canvas'
  const partnerKey = getPartnerKeyFromUrl(window.location.pathname)
  const partner = Partners[partnerKey]
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [school, setSchool] = useState(null)
  const userInfo = get(user, 'user', {})

  const query = queryString.parse(window.location.search)

  const handleAuthorization = async () => {
    const result = await canvasApi.getCanvasAuthURI(
      school?.schoolId || institutionIds[0]
    )
    if (!result.userAuthenticated) {
      const subscriptionTopic = `canvas:${districtId}_${userInfo._id}_${
        userInfo.username || userInfo.email || ''
      }`
      authorizeCanvas(result.canvasAuthURL, subscriptionTopic)
        .then(() => {
          setIsAuthorized(true)
        })
        .catch(() => {
          notification({ msg: 'canvasAuthenticationFailed' })
        })
    } else {
      setIsAuthorized(true)
    }
  }

  useEffect(() => {
    if (signupStatus === 2 && !isAuthorized && allowCanvas)
      handleAuthorization()
  }, [signupStatus, allowCanvas])

  const schoolchange = (value) => {
    setSchool(value)
  }

  if (!isAuthenticated) {
    return (
      <ThemeProvider theme={themes.default}>
        <SignupForm
          image={
            generalSettings && isSignupUsingDaURL
              ? generalSettings.pageBackground
              : isSignupUsingDaURL
              ? ''
              : partner.keyName === 'login'
              ? teacherBg
              : partner.background
          }
          isSignupUsingDaURL={isSignupUsingDaURL}
          generalSettings={generalSettings}
          districtPolicy={districtPolicy}
          orgShortName={orgShortName}
          orgType={orgType}
          invitedUser={invitedUser}
          invitedUserDetails={invitedUserDetails}
          utm_source={query?.utm_source}
        />
      </ThemeProvider>
    )
  }

  if (isModalView) {
    return (
      <AddSchoolAndGradeModal
        user={user}
        districtId={isSignupUsingDaURL ? generalSettings.orgId : false}
        isSignupUsingDaURL={isSignupUsingDaURL}
        generalSettings={generalSettings}
        districtPolicy={districtPolicy}
        orgShortName={orgShortName}
        orgType={orgType}
        isVisible={isModalVisible}
        handleCancel={() => toggleModal(false)}
        hideJoinSchoolBanner
      />
    )
  }

  return (
    <ThemeProvider theme={themes.default}>
      <Header userInfo={userInfo} logout={logout} />
      {signupStatus === 1 && (
        <JoinSchool
          userInfo={userInfo}
          districtId={isSignupUsingDaURL ? generalSettings.orgId : false}
          isSignupUsingDaURL={isSignupUsingDaURL}
          generalSettings={generalSettings}
          districtPolicy={districtPolicy}
          orgShortName={orgShortName}
          orgType={orgType}
          allowCanvas={allowCanvas}
          schoolchange={schoolchange}
        />
      )}
      {signupStatus === 2 && !allowCanvas && (
        <SubjectGradeForm
          userInfo={userInfo}
          districtId={isSignupUsingDaURL ? generalSettings.orgId : false}
        />
      )}
      {signupStatus === 2 && allowCanvas && isAuthorized && (
        <Col xs={{ span: 20, offset: 2 }} lg={{ span: 18, offset: 3 }}>
          <CanvasBulkAddClass
            user={userInfo}
            getCanvasCourseListRequest={getCanvasCourseListRequest}
            getCanvasSectionListRequest={getCanvasSectionListRequest}
            canvasCourseList={canvasCourseList}
            canvasSectionList={canvasSectionList}
            institutionId={school?.schoolId || institutionIds[0]}
          />
        </Col>
      )}
    </ThemeProvider>
  )
}

Container.propTypes = {
  user: PropTypes.object,
  logout: PropTypes.func,
  isModalView: PropTypes.bool,
  isModalVisible: PropTypes.bool,
  toggleModal: PropTypes.func,
}

Container.defaultProps = {
  user: null,
  logout: () => null,
  isModalView: false,
  isModalVisible: false,
  toggleModal: () => null,
}

const enhance = compose(
  withRouter,
  connect(
    (state) => ({
      user: state.user,
      canvasCourseList: get(state, 'manageClass.canvasCourseList', []),
      canvasSectionList: get(state, 'manageClass.canvasSectionList', []),
      institutionIds: currentDistrictInstitutionIds(state),
      districtId: getUserOrgId(state),
    }),
    {
      logout: logoutAction,
      getCanvasCourseListRequest: getCanvasCourseListRequestAction,
      getCanvasSectionListRequest: getCanvasSectionListRequestAction,
    }
  )
)

export default enhance(Container)
