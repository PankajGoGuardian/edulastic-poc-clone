import * as Sentry from '@sentry/browser';

export const captureSentryException = (err) => {
	// Ignore BE's business errors
	if (!err || (err && [409, 302, 422, 403].includes(err.status))) {
	  return
	}
  
	Sentry.captureException(err)
  }
  