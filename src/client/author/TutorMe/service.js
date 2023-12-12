/**
 * NOTE: import order is relevant and should not be changed
 */
import './patchTutormeReact18'
import tutorMeService from '@goguardian/tutorme-sdk'
import '@goguardian/tutorme-sdk/dist/style.css'

import { formatName } from '@edulastic/constants/reportUtils/common'
import { delay } from 'redux-saga'
import { tutorMeSdkConfig } from '../../../app-config'

const { accountId, api, orgId, secret } = tutorMeSdkConfig

/**
 * @param {{email: string; firstName: string; middleName?: string; lastName?: string}} user
 */
export async function initTutorMeService(user) {
  await tutorMeService.init(btoa(`${orgId}:${accountId}:${secret}`), {
    requestor: {
      name: formatName(user, { lastNameFirst: false }),
      email: user.email,
    },
    api,
  })
  // FIXME: SDK isn't ready yet, delay until it is.
  await delay(1000)
}

/**
 * @typedef {Parameters<(typeof tutorme)['requestSession']>[0]} ISessionRequest
 * @typedef {{
 *  grade: string;
 *  subject: string;
 *  category: string;
 *  link?: string;
 *  notes?: string;
 *  standards: Required<ISessionRequest>['data']['standards'];
 * }} ISDKState
 */

/**
 * @param {ISessionRequest} request
 * @param {Parameters<typeof init>[0]} user
 * @returns {Promise<{result: ISessionResult, state: ISDKState }>} Success is indicated by the `.cancelled === false` property.
 */
export async function createSessionRequest(request) {
  return new Promise((resolve) => {
    /** @type {ISDKState} */
    const state = {
      cancelled: true,
      grade: request.data.grade,
      subject: request.data.subject,
      subjectArea: request.data.category,
    }

    tutorMeService.requestSession({
      analyticsCallback: (event) => {
        console.log(event)
        // FIXME use event.properties or result after the SDK is updated.
        switch (event.event) {
          case 'assign_tutoring_copy_link_click':
          case 'assign_tutoring_request_flow_exit':
            state.tutoringLink = [
              ...document.querySelectorAll('.buttonLabel'),
            ].find((d) => d.innerText.includes('https://'))?.innerText
            break
          case 'assign_tutoring_grade_level_select':
            state.grade = event.properties.grade
            break
          case 'assign_tutoring_step3of4_submitted':
            state.notes = document.querySelector(
              'textarea[name="description"]'
            )?.value
            break
          case 'assign_tutoring_step1of4_submitted':
            state.grade = +document.querySelector('input[name=grade]')?.value
            state.subject = document.querySelector(
              'input[name=subject]'
            )?.nextElementSibling?.lastChild?.innerText
            state.subjectArea = document.querySelector(
              'input[name=category]'
            )?.nextElementSibling?.lastChild?.innerText
            break
          default:
            break
        }
      },
      ...request,
      callback: ({ data, cancelled, step } = {}) => {
        const {
          // FIXME: wrong category fetched in response (got Early Math in place of Math)
          // category: subjectArea,
          subject,
          description: notes,
          grade,
          tutoringId,
          studentTutormeId: studentTutorMeId,
          tutoringUrl: tutoringLink,
          standards,
        } = data
        resolve({
          ...state,
          // subjectArea,
          subject,
          notes,
          grade,
          tutoringId,
          studentTutorMeId,
          tutoringLink,
          standards,
          cancelled,
          step,
        })
      },
    })
  })
}
