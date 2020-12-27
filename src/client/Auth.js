import React, { useState, useEffect } from 'react'
import { lazy } from '@loadable/component'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import { get } from 'lodash'
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

import { isLoggedInForPrivateRoute } from './common/utils/helpers'
import { persistAuthStateAndRedirectToAction } from './student/Login/ducks'

const GetStarted = lazy(() =>
  import('./student/Signup/components/GetStartedContainer')
)
const Login = lazy(() => import('./student/Login/components'))

const SsoLogin = lazy(() => import('./student/SsoLogin'))

const isNewSela = () => window.location.pathname.includes('newsela')
const needToBeExcluded = () => isNewSela()

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

  console.log('current login state', {
    user,
    token: getAccessToken(),
    loading,
    isPrivate: isLoggedInForPrivateRoute(user),
  })
  const loggedInForPrivateRoute = isLoggedInForPrivateRoute(user)

  useEffect(() => {
    if (loggedInForPrivateRoute) {
      console.log('loggedin private persist', window.location.pathname)
      persistAuthStateAndRedirectTo()
    }
  }, [loggedInForPrivateRoute])

  if (
    ((user?.authenticating && getAccessToken()) || loading) &&
    !needToBeExcluded()
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
    }),
    {
      persistAuthStateAndRedirectTo: persistAuthStateAndRedirectToAction,
    }
  )
)
export default enhance(Auth)
