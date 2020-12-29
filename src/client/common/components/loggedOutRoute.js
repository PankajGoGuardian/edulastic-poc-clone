import React, { useEffect } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { get } from 'lodash'
import { isLoggedInForLoggedOutRoute } from '../utils/helpers'

const LoggedOutRoute = ({
  component: Component,
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
      render={(props) => <Component {...props} orgType={orgType} />}
    />
  )
}

export default connect((state) => ({
  user: get(state, 'user', {}),
}))(LoggedOutRoute)
