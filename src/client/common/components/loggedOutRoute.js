import React, { useEffect } from 'react'
import { Route } from 'react-router-dom'
import { connect } from 'react-redux'
import { get, isEmpty } from 'lodash'
import { isLoggedInForLoggedOutRoute } from '../utils/helpers'

const LoggedOutRoute = ({
  component: Component,
  notifications: Notifications,
  user,
  redirectPath,
  orgType,
  ...rest
}) => {
  useEffect(() => {
    if (isLoggedInForLoggedOutRoute(user)) {
      window.location = redirectPath
    }
  }, [user])

  return (
    <Route
      {...rest}
      render={(props) => [
        <Component {...props} orgType={orgType} />,
        !isEmpty(Notifications)
          ? Notifications.map((Notification) => <Notification />)
          : null,
      ]}
    />
  )
}

export default connect((state) => ({
  user: get(state, 'user', {}),
}))(LoggedOutRoute)
