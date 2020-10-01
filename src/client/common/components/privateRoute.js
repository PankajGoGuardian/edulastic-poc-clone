import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { get, isEmpty } from 'lodash'
import { isLoggedInForPrivateRoute } from '../utils/helpers'

const PrivateRoute = ({
  component: Component,
  notifications: Notifications,
  user,
  redirectPath,
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) =>
      isLoggedInForPrivateRoute(user) ? (
        [
          <Component {...props} />,
          !isEmpty(Notifications)
            ? Notifications.map((Notification) => <Notification />)
            : null,
        ]
      ) : (
        <Redirect
          to={{ pathname: redirectPath, state: { from: props.location } }}
        />
      )
    }
  />
)

export default connect((state) => ({
  user: get(state, 'user', {}),
}))(PrivateRoute)
