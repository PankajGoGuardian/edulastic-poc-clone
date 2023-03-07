import * as Sentry from '@sentry/browser'
import * as firebase from 'firebase/app'
import { TokenStorage } from '@edulastic/api'

export const EXTERNAL_TOKEN = 'extt'

export const captureSentryException = (err) => {
  // Ignore BE's business errors
  if (!err || (err && [409, 302, 422, 403].includes(err.status))) {
    return
  }

  Sentry.captureException(err)
}

export const storeUserAuthToken = ({
  userToken,
  firebaseToken,
  _id: userId,
  role,
}) => {
  if (userToken && userId && role) {
    TokenStorage.storeAccessToken(userToken, userId, role)
    TokenStorage.selectAccessToken(userId, role)
    if (firebaseToken) {
      firebase.auth().signInWithCustomToken(firebaseToken)
    }
  } else if (userId && role) {
    TokenStorage.selectAccessToken(userId, role)
  }
}

export const getExternalAuthToken = () => {
  const queryParams = new URLSearchParams(window.location.search)
  return queryParams.get(EXTERNAL_TOKEN)
}
