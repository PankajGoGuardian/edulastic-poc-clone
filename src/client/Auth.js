import React, { useState, useEffect } from 'react'
import { lazy } from '@loadable/component'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import { get, isEmpty } from 'lodash'
import { compose } from 'redux'
import { connect } from 'react-redux'
import Spin from 'antd/es/spin'
import {
  removeFromLocalStorage,
  getAccessToken,
} from '@edulastic/api/src/utils/Storage'
import { SelectRolePopup } from './student/SsoLogin/selectRolePopup'
import { UnauthorizedPopup } from './student/SsoLogin/UnauthorizedPopup'
import StudentSignup from './student/Signup/components/StudentContainer'
import AdminSignup from './student/Signup/components/AdminContainer/Container'
import TeacherSignup from './student/Signup/components/TeacherContainer/Container'

import {
  isLoggedInForPrivateRoute,
  isHashAssessmentUrl,
  getSchoologyTestId,
} from './common/utils/helpers'
import {
  getExternalAuthUserAction,
  getIsExternalUserLoading,
  persistAuthStateAndRedirectToAction,
} from './student/Login/ducks'
import { getExternalAuthToken } from '../loginUtils'

const GetStarted = lazy(() =>
  import('./student/Signup/components/GetStartedContainer')
)
const Login = lazy(() => import('./student/Login/components'))

const SsoLogin = lazy(() => import('./student/SsoLogin'))

const RedirectToTest = lazy(() => import('./author/RedirectToTest'))

function getCurrentPath() {
  const location = window.location
  return `${location.pathname}${location.search}${location.hash}`
}

function canShowLoginForAddAccount(user) {
  const addAccountToUser = JSON.parse(
    window.sessionStorage.addAccountDetails || '{}'
  )?.addAccountTo
  return user?.userId === addAccountToUser
}

const Auth = ({
  user,
  location,
  isSignupUsingDaURL,
  generalSettings,
  districtPolicy,
  orgShortName,
  orgType,
  persistAuthStateAndRedirectTo,
  getExternalAuthorizedUser,
  isExternalUserLoading,
}) => {
  const [loading, setLoading] = useState(!!getAccessToken())
  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 1000)

    const onBeforeUnload = () => setLoading(true)

    window.addEventListener('beforeunload', onBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload)
    }
  }, [])

  useEffect(() => {
    const externalAuthToken = getExternalAuthToken()
    if (!isEmpty(externalAuthToken)) {
      getExternalAuthorizedUser({ token: externalAuthToken })
    }
  }, [])

  const loggedInForPrivateRoute = isLoggedInForPrivateRoute(user)

  const showLoginForAddAccount = canShowLoginForAddAccount(user)
  useEffect(() => {
    if (loggedInForPrivateRoute && !showLoginForAddAccount) {
      const currentUrl = getCurrentPath()
      const schoologyTestId = getSchoologyTestId()
      if (
        isHashAssessmentUrl() ||
        schoologyTestId ||
        window.location.pathname.includes('/assignments/embed/')
      ) {
        persistAuthStateAndRedirectTo({
          toUrl: schoologyTestId
            ? `/assignments/embed/${schoologyTestId}`
            : currentUrl,
        })
      } else {
        persistAuthStateAndRedirectTo()
      }
    }
  }, [loggedInForPrivateRoute, showLoginForAddAccount])

  if (isHashAssessmentUrl()) {
    const v1Id = location.hash.split('/')[2]
    return <RedirectToTest v1Id={v1Id} />
  }

  if (
    ((user?.authenticating && getAccessToken()) ||
      loading ||
      isExternalUserLoading) &&
    !showLoginForAddAccount
  ) {
    return <Spin />
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
            {user?.user?.role ? null : (
              <SelectRolePopup visible footer={null} />
            )}
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
      isExternalUserLoading: getIsExternalUserLoading(state),
    }),
    {
      persistAuthStateAndRedirectTo: persistAuthStateAndRedirectToAction,
      getExternalAuthorizedUser: getExternalAuthUserAction,
    }
  )
)
export default enhance(Auth)
