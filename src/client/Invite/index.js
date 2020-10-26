import React, { useEffect } from 'react'
import { lazy } from '@loadable/component'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter, Redirect } from 'react-router'
import { get, isEmpty } from 'lodash'
import qs from 'qs'

import { roleuser } from '@edulastic/constants'
import { isLoggedInForPrivateRoute } from '../common/utils/helpers'

import { getInviteDetailsAction } from '../student/Login/ducks'

const TeacherSignup = lazy(() =>
  import('../student/Signup/components/TeacherContainer/Container')
)

const Invite = ({ user, location, history, getInviteDetailsAction }) => {
  useEffect(() => {
    const queryParams = qs.parse(location.search, { ignoreQueryPrefix: true })
    const params = {
      uid: queryParams.uid,
    }
    getInviteDetailsAction(params)
  }, [])

  if (
    isLoggedInForPrivateRoute(user) &&
    (user.user.role === roleuser.TEACHER ||
      user.user.role === roleuser.SCHOOL_ADMIN ||
      user.user.role === roleuser.DISTRICT_ADMIN)
  ) {
    return <Redirect exact to="/author/dashboard" />
  }
  if (isLoggedInForPrivateRoute(user) && user.user.role === 'student') {
    return <Redirect exact to="/home/assignments" />
  }
  if (user && user.invitedUserDetails && !isEmpty(user.invitedUserDetails)) {
    return (
      <TeacherSignup invitedUser invitedUserDetails={user.invitedUserDetails} />
    )
  }
  return 'Please Wait...'
}

export default compose(
  withRouter,
  connect(
    (state) => ({
      user: get(state, 'user', null),
    }),
    {
      getInviteDetailsAction,
    }
  )
)(Invite)
