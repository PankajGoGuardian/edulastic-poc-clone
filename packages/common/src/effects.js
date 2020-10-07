// @ts-check
import {
  call,
  fork,
  actionChannel,
  take,
  race,
  flush,
} from 'redux-saga/effects'
import { buffers } from 'redux-saga'

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}

/**
 *
 * @param {number} ms
 * @param {string} action
 * @param {GeneratorFunction} task
 */
export function throttleAction(ms, action, task) {
  return fork(function* () {
    const buffer = buffers.sliding(1)
    const throttleChannel = yield actionChannel(action, buffer)
    let retryCount = 0
    while (true) {
      const action = yield take(throttleChannel)
      let raceResult = {}
      try {
        raceResult = yield race({
          taskResult: call(task, action),
          timeout: call(delay, ms),
        })
      } catch (e) {
        console.warn('error', e)
      }
      if ('taskResult' in raceResult) {
        /* const discarded = */ yield flush(throttleChannel)
        retryCount = 0
      } else if (retryCount === 0 && buffer.isEmpty()) {
        retryCount++
        buffer.put(action)
      } else if (retryCount > 0) {
        retryCount = 0
      }
    }
  })
}
