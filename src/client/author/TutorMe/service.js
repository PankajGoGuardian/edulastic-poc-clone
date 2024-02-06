import tutorMeService from '@goguardian/tutorme-sdk'
import '@goguardian/tutorme-sdk/dist/style.css'

import { formatName } from '@edulastic/constants/reportUtils/common'
import { delay } from 'redux-saga'
import { tutorMeSdkConfig } from '../../../app-config'

const { api } = tutorMeSdkConfig

/**
 * @param {{email: string; firstName: string; middleName?: string; lastName?: string}} user
 */
export async function initTutorMeService(auth, user) {
  await tutorMeService.init(auth.key, {
    requestor: {
      name: formatName(user, { lastNameFirst: false }),
      email: user.email,
    },
    secret: auth.secret,
    api,
    theme: {
      modal: {
        zIndex: 9999, // NOTE: >= 1002 works to occlude header + side menu
      },
    },
  })
  // FIXME: SDK isn't ready yet, delay until it is.
  await delay(100)
}

/**
 * @typedef {Parameters<(typeof tutorMeService)['requestSession']>[0]} ISessionRequest
 * @typedef {Parameters<ISessionRequest['callback']>[0]} ISessionResult
 * @typedef {{
 *  cancelled: false;
 *  step: number;
 *  subjectArea: string;
 *  subject: string;
 *  notes: string;
 *  grade: number;
 *  tutoringId: string;
 *  studentTutorMeId?: string;
 *  tutoringLink: string;
 *  standards: Required<ISessionResult>['data']['standards'];
 * } | {
 *  cancelled: true;
 *  step: number;
 * }} ISDKResponse
 */

/**
 * @param {ISessionRequest} request
 * @param {Parameters<typeof init>[0]} user
 * @returns {Promise<ISDKResponse>} Success is indicated by the `.cancelled === false` property.
 */
export async function createSessionRequest(request) {
  return new Promise((resolve, reject) => {
    try {
      /** @type {ISDKResponse} */
      tutorMeService.requestSession({
        ...request,
        callback: (response) => {
          const { data = {}, cancelled, step } = response
          if (cancelled) {
            resolve({ cancelled, step })
            return
          }
          const {
            category: subjectArea,
            subject,
            description: notes,
            grade,
            tutoringId,
            studentTutormeId: studentTutorMeId,
            tutoringUrl: tutoringLink,
            standards,
          } = data
          resolve({
            subjectArea,
            subject,
            notes,
            grade,
            tutoringId,
            studentTutorMeId: studentTutorMeId ?? String(studentTutorMeId),
            tutoringLink,
            standards,
            cancelled,
            step,
          })
        },
      })
    } catch (error) {
      reject(error)
    }
  })
}
