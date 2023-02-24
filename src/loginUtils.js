import * as Sentry from '@sentry/browser'

const TOKEN = 'token'
const FIREBASE_TOKEN = 'firebaseToken'

export const captureSentryException = (err) => {
  // Ignore BE's business errors
  if (!err || (err && [409, 302, 422, 403].includes(err.status))) {
    return
  }

  Sentry.captureException(err)
}

export const cleanupWindowLocationUrl = (location, history) => {
  const queryParams = new URLSearchParams(location.search)
  if (queryParams.has(TOKEN) || queryParams.has(FIREBASE_TOKEN)) {
    queryParams.delete(TOKEN)
    queryParams.delete(FIREBASE_TOKEN)
    history.replace({
      search: queryParams.toString(),
    })
  }
}
