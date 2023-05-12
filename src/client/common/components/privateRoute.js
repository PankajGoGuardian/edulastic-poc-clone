import React, { useMemo } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { get, isEmpty } from 'lodash'
import { isLoggedInForPrivateRoute } from '../utils/helpers'

function RedirectWithFrom({ redirectPath, fromPath, fromSearch, fromHash }) {
  const toProp = useMemo(() => {
    return {
      pathname: redirectPath,
      state: {
        from: { pathname: fromPath, search: fromSearch, hash: fromHash },
      },
    }
  }, [redirectPath, fromPath, fromSearch, fromHash])
  return <Redirect to={toProp} />
}

const PrivateRoute = ({
  component: Component,
  notifications: Notifications,
  user,
  redirectPath,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        isLoggedInForPrivateRoute(user) ? (
          [
            <Component {...props} user={user} />,
            !isEmpty(Notifications)
              ? Notifications.map((Notification) => <Notification />)
              : null,
          ]
        ) : (
          <RedirectWithFrom
            redirectPath={redirectPath}
            fromPath={props.location.pathname}
            fromSearch={props.location.search}
            fromHash={props.location.hash}
          />
        )
      }
    />
  )
}

export default connect((state) => ({
  user: get(state, 'user', {}),
}))(PrivateRoute)
