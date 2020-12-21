import React from 'react'
import { lazy } from '@loadable/component'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import { get } from 'lodash'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { removeFromLocalStorage } from '@edulastic/api/src/utils/Storage'
import { SelectRolePopup } from './student/SsoLogin/selectRolePopup'
import { UnauthorizedPopup } from './student/SsoLogin/UnauthorizedPopup'
import StudentSignup from './student/Signup/components/StudentContainer'
import AdminSignup from './student/Signup/components/AdminContainer/Container'
import TeacherSignup from './student/Signup/components/TeacherContainer/Container'

import { isLoggedInForPrivateRoute } from './common/utils/helpers'
import { persistAuthStateAndRedirectToAction } from './student/Login/ducks'

const GetStarted = lazy(() =>
  import('./student/Signup/components/GetStartedContainer')
)
const Login = lazy(() => import('./student/Login/components'))

const SsoLogin = lazy(() => import('./student/SsoLogin'))

const Auth = ({
  user,
  location,
  isSignupUsingDaURL,
  generalSettings,
  districtPolicy,
  orgShortName,
  orgType,
  persistAuthStateAndRedirectTo,
}) => {
  if (isLoggedInForPrivateRoute(user)) {
    persistAuthStateAndRedirectTo()
  }

  if (location?.state?.showUnauthorized) {
    return (
      <>
        <Login
          isSignupUsingDaURL={isSignupUsingDaURL}
          generalSettings={generalSettings}
          districtPolicy={districtPolicy}
          orgShortName={orgShortName}
          orgType={orgType}
        />
        <UnauthorizedPopup visible footer={null} />
      </>
    )
  }
  if (location.pathname.toLocaleLowerCase().includes('auth')) {
    return (
      <>
        {!user || (user && !user.isAuthenticated) ? (
          <>
            <SsoLogin />
          </>
        ) : (
          <>
            <Login
              isSignupUsingDaURL={isSignupUsingDaURL}
              generalSettings={generalSettings}
              districtPolicy={districtPolicy}
              orgShortName={orgShortName}
              orgType={orgType}
            />
            <SelectRolePopup visible footer={null} />
          </>
        )}
      </>
    )
  }

  removeFromLocalStorage('defaultGrades')
  removeFromLocalStorage('defaultSubject')
  switch (location.hash) {
    case '#signup':
      return (
        <GetStarted
          isSignupUsingDaURL={isSignupUsingDaURL}
          generalSettings={generalSettings}
          districtPolicy={districtPolicy}
          orgShortName={orgShortName}
          orgType={orgType}
        />
      )
    case '#register/close/student':
      return <StudentSignup />
    case '#register/close/admin':
      return <AdminSignup />
    case '#register/close/teacher':
      return <TeacherSignup />
    default:
      return (
        <Login
          isSignupUsingDaURL={isSignupUsingDaURL}
          generalSettings={generalSettings}
          districtPolicy={districtPolicy}
          orgShortName={orgShortName}
          orgType={orgType}
        />
      )
  }
}
Auth.propTypes = {
  location: PropTypes.object.isRequired,
}

const enhance = compose(
  withRouter,
  connect(
    (state) => ({
      user: get(state, 'user', null),
    }),
    {
      persistAuthStateAndRedirectTo: persistAuthStateAndRedirectToAction,
    }
  )
)
export default enhance(Auth)
