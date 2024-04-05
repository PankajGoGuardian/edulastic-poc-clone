/**
 * @typedef {Parameters<typeof import('@edulastic/common').notification>[0]} PayloadType
 */

import { captureSentryException, notification } from '@edulastic/common'

export class PAError extends Error {
  /**
   * @param {any} messageOrError
   * @param {undefined | string | PayloadType} msgOrPayload
   */
  constructor(messageOrError, msgOrPayload = undefined) {
    super(messageOrError)
    /**
     * Any payload to be forwarded with error
     * @property {PayloadType} payload
     * @public
     */
    this.payload = msgOrPayload
  }

  tryNotify() {
    if (this.payload) {
      notification(
        typeof this.payload === 'string'
          ? { type: 'error', msg: this.payload }
          : this.payload
      )
    }
  }
}

export function handleError(err, defaultMessage = 'Something went wrong.') {
  captureSentryException(err)
  if (err instanceof PAError) {
    err.tryNotify()
  } else if (defaultMessage) {
    notification({
      type: 'error',
      msg: defaultMessage,
    })
  }
}
