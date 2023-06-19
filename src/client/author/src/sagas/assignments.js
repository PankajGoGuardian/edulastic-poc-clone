import {
  all,
  call,
  fork,
  put,
  select,
  takeEvery,
  takeLatest,
} from 'redux-saga/effects'
import { push } from 'connected-react-router'
import { assignmentApi, atlasApi, googleApi, cleverApi } from '@edulastic/api'
import { get, identity, omit, pickBy, set, unset } from 'lodash'
import { captureSentryException, notification } from '@edulastic/common'
import { roleuser } from '@edulastic/constants'
import * as Sentry from '@sentry/browser'

import { removeAllTokens } from '@edulastic/api/src/utils/Storage'
import realtimeApi from '@edulastic/api/src/realtime'
import mqtt from 'mqtt'
import {
  FETCH_CURRENT_ASSIGNMENT,
  FETCH_CURRENT_EDITING_ASSIGNMENT,
  RECEIVE_ASSIGNMENT_CLASS_LIST_ERROR,
  RECEIVE_ASSIGNMENT_CLASS_LIST_REQUEST,
  RECEIVE_ASSIGNMENT_CLASS_LIST_SUCCESS,
  RECEIVE_ASSIGNMENTS_ERROR,
  RECEIVE_ASSIGNMENTS_REQUEST,
  RECEIVE_ASSIGNMENTS_SUCCESS,
  RECEIVE_ASSIGNMENTS_SUMMARY_ERROR,
  RECEIVE_ASSIGNMENTS_SUMMARY_REQUEST,
  RECEIVE_ASSIGNMENTS_SUMMARY_SUCCESS,
  SYNC_ASSIGNMENT_GRADES_WITH_GOOGLE_CLASSROOM_REQUEST,
  SYNC_ASSIGNMENT_GRADES_WITH_CLEVER_REQUEST,
  SYNC_ASSIGNMENT_GRADES_WITH_SCHOOLOGY_CLASSROOM_REQUEST,
  SYNC_ASSIGNMENT_WITH_GOOGLE_CLASSROOM_ERROR,
  SYNC_ASSIGNMENT_WITH_GOOGLE_CLASSROOM_REQUEST,
  SYNC_ASSIGNMENT_WITH_GOOGLE_CLASSROOM_SUCCESS,
  SYNC_ASSIGNMENT_WITH_SCHOOLOGY_CLASSROOM_ERROR,
  SYNC_ASSIGNMENT_WITH_SCHOOLOGY_CLASSROOM_REQUEST,
  SYNC_ASSIGNMENT_WITH_SCHOOLOGY_CLASSROOM_SUCCESS,
  TOGGLE_RELEASE_GRADE_SETTINGS,
  UPDATE_CURRENT_EDITING_ASSIGNMENT,
  UPDATE_RELEASE_SCORE_SETTINGS,
  MQTT_CLIENT_SAVE_REQUEST,
  MQTT_CLIENT_REMOVE_REQUEST,
  EDIT_TAGS_REQUEST,
  BULK_UPDATE_ASSIGNMENT_SETTINGS,
} from '../constants/actions'
import { getUserRole } from '../selectors/user'
import {
  setBulkUpdateAssignmentSettingState,
  setTagsUpdatingStateAction,
} from '../actions/assignments'

function* receiveAssignmentClassList({ payload = {} }) {
  try {
    const entities = yield call(
      assignmentApi.fetchAssignmentsClassList,
      payload
    )
    yield put({
      type: RECEIVE_ASSIGNMENT_CLASS_LIST_SUCCESS,
      payload: { entities },
    })
    /**
     * Entities will come empty only when we unassign the assignments from all the entities
     * as a bulk action performed by DA/SA. In that scenario we are routing to author
     * assignments page from advanced assignments page.
     */
    if (entities?.assignments?.length === 0) {
      yield put(push('/author/assignments'))
    }
  } catch (error) {
    captureSentryException(error)
    const errorMessage = 'Receive class list failing'
    let messageKey = 'receiveClasslistFailing'
    if (get(error, 'status') === 400) {
      messageKey = 'invalidAction'
    }
    notification({ messageKey })
    yield put({
      type: RECEIVE_ASSIGNMENT_CLASS_LIST_ERROR,
      payload: { error: errorMessage },
    })
    yield put(push('/author/assignments'))
  }
}

function* receiveAssignmentsSummary({ payload = {} }) {
  try {
    // filtering should be false otherwise it will reset the current page to 1
    const { districtId = '', filters = {}, sort, folderId } = payload
    if (get(filters, 'subject')) {
      set(filters, 'Subject', get(filters, 'subject'))
      unset(filters, 'subject')
    }
    const userRole = yield select(getUserRole)
    if (userRole === 'district-admin' || userRole === 'school-admin') {
      const entities = yield call(assignmentApi.fetchAssignmentsSummary, {
        districtId,
        filters: { ...pickBy(filters, identity), folderId },
        sort,
      })
      // handle zero assignments for current filter result
      if (entities) {
        const {
          result = [],
          total = 0,
          teachers = [],
          testInfo = [],
        } = entities
        yield put({
          type: RECEIVE_ASSIGNMENTS_SUMMARY_SUCCESS,
          payload: {
            entities: result,
            total,
            teacherList: teachers,
            testsList: testInfo,
          },
        })
      } else {
        yield put({
          type: RECEIVE_ASSIGNMENTS_SUMMARY_SUCCESS,
          payload: { entities: [], total: 0, teacherList: [], testsList: [] },
        })
      }
    }
  } catch (error) {
    let errorMessage = 'Assignments not found'
    if (error?.response?.status !== 404) {
      captureSentryException(error)
      errorMessage = 'Unable to retrive assignment summary.'
      notification({ type: 'error', msg: errorMessage })
    }
    yield put({
      type: RECEIVE_ASSIGNMENTS_SUMMARY_ERROR,
      payload: { error: errorMessage },
    })
  }
}

function* receiveAssignmentsSaga({ payload = {} }) {
  try {
    const userRole = yield select(getUserRole)
    if (userRole === roleuser.TEACHER) {
      const { groupId, filters = {}, folderId } = payload
      const entities = yield call(assignmentApi.fetchTeacherAssignments, {
        groupId,
        filters,
        folderId,
      })
      yield put({
        type: RECEIVE_ASSIGNMENTS_SUCCESS,
        payload: { entities },
      })
    }
  } catch (err) {
    captureSentryException(err)
    const errorMessage = 'Unable to retrieve assignment info.'
    notification({ type: 'error', messageKey: 'receiveTestFailing' })
    yield put({
      type: RECEIVE_ASSIGNMENTS_ERROR,
      payload: { error: errorMessage },
    })
  }
}

function* receiveAssignmentByIdSaga({ payload }) {
  try {
    const data = yield call(assignmentApi.fetchAssignments, payload.testId)
    const getCurrent = data.filter((item) => item._id === payload.assignmentId)
    yield put({
      type: UPDATE_CURRENT_EDITING_ASSIGNMENT,
      payload: getCurrent[0],
    })
    yield put({
      type: TOGGLE_RELEASE_GRADE_SETTINGS,
      payload: true,
    })
  } catch (e) {
    Sentry.captureException(e)
    yield put({
      type: UPDATE_CURRENT_EDITING_ASSIGNMENT,
      payload: {},
    })
    console.error(e)
  }
}

function* receiveAssignmentByAssignmentIdSaga({ payload }) {
  try {
    const data = yield call(assignmentApi.getById, payload)
    yield put({
      type: UPDATE_CURRENT_EDITING_ASSIGNMENT,
      payload: data,
    })
  } catch (e) {
    Sentry.captureException(e)
    yield put({
      type: UPDATE_CURRENT_EDITING_ASSIGNMENT,
      payload: {},
    })
    console.error(e)
  }
}

function* updateAssignmetSaga({ payload }) {
  try {
    const data = omit(
      {
        ...payload,
        updateTestActivities: true,
      },
      [
        '_id',
        '__v',
        'createdAt',
        'updatedAt',
        'students',
        'scoreReleasedClasses',
        'termId',
        'reportKey',
      ]
    )
    yield call(assignmentApi.update, payload._id, data)
    yield put({
      type: TOGGLE_RELEASE_GRADE_SETTINGS,
      payload: false,
    })
    yield put({
      type: UPDATE_CURRENT_EDITING_ASSIGNMENT,
      payload: data,
    })
    const successMessage = 'Successfully updated release score settings'
    notification({ type: 'success', msg: successMessage })
  } catch (e) {
    Sentry.captureException(e)
    const errorMessage = 'Unable to update release score settings.'
    yield put({
      type: TOGGLE_RELEASE_GRADE_SETTINGS,
      payload: false,
    })
    notification({ type: 'error', msg: errorMessage })
    console.error(e)
  }
}

function* syncAssignmentWithGoogleClassroomSaga({ payload = {} }) {
  try {
    notification({ type: 'success', messageKey: 'sharedAssignmentInProgress' })
    const result = yield call(assignmentApi.syncWithGoogleClassroom, payload)
    if (result?.[0]?.success) {
      yield put({
        type: SYNC_ASSIGNMENT_WITH_GOOGLE_CLASSROOM_SUCCESS,
      })
      notification({
        type: 'success',
        messageKey: 'assignmentSharedWithGoggleCLassroom',
      })
    } else {
      const errorMessage =
        result?.[0]?.message ||
        'Assignment failed to share with google classroom. Please try after sometime.'
      yield put({
        type: SYNC_ASSIGNMENT_WITH_GOOGLE_CLASSROOM_ERROR,
      })
      notification({ msg: errorMessage })
    }
  } catch (error) {
    captureSentryException(error)
    const errorMessage =
      error?.data?.message ||
      'Assignment failed to share with google classroom. Please try after sometime.'
    yield put({
      type: SYNC_ASSIGNMENT_WITH_GOOGLE_CLASSROOM_ERROR,
    })
    notification({ msg: errorMessage })
  }
}

function* syncAssignmentGradesWithGoogleClassroomSaga({ payload }) {
  try {
    const res = yield call(googleApi.syncGradesWithGoogleClassroom, payload)
    if (res?.message) {
      notification({ type: 'success', msg: res.message })
    } else {
      notification({
        type: 'success',
        msg: 'Grades are being shared to Google Classroom',
      })
    }
  } catch (err) {
    captureSentryException(err)
    notification({
      msg:
        err?.response?.data?.message ||
        'Failed to share grades to Google Classroom',
    })
    console.error(err)
  }
}

function* syncAssignmentGradesWithCleverSaga({ payload }) {
  try {
    const res = yield call(cleverApi.syncGradesWithClever, payload)
    if (res?.message) {
      notification({ type: 'success', msg: res.message })
    } else {
      notification({
        type: 'success',
        msg: 'Grades are being shared to Schoology',
      })
    }
  } catch (err) {
    captureSentryException(err)
    notification({
      msg:
        err?.response?.data?.message || 'Failed to share grades to Schoology',
    })
  }
}

function* getAtlasGradeSyncUpdate({ assignmentId, groupId, signedUrl }) {
  const subscriptionTopic = `atlas-grade-sync-${assignmentId}_${groupId}`
  const client = mqtt.connect(signedUrl)
  yield put({
    type: MQTT_CLIENT_SAVE_REQUEST,
    payload: client,
  })
  const promise = new Promise((resolve, reject) => {
    client.on('connect', () => {
      client.subscribe(subscriptionTopic, (err) => {
        if (err) {
          console.log('Error subscribing to topic: ', subscriptionTopic)
          reject(err)
        } else {
          console.log('Successfully subscribed to topic', subscriptionTopic)
        }
      })
    })
    client.on('message', (topic, _message) => {
      let msg = _message.toString()
      msg = JSON.parse(msg)
      console.log(`response from mqtt client with topic ${topic}`, msg)
      if (msg.data.status === 200) {
        notification({ type: 'success', msg: msg.data.message })
      } else {
        notification({ type: 'error', msg: msg.data.message })
      }
      resolve(msg)
      client.end()
    })

    client.on('error', (err) => {
      console.error('error in mqtt client', err)
      reject(err)
      client.end()
    })
  })
  return promise.then((res) => res).catch((err) => err)
}

function* syncAssignmentGradesWithSchoologyClassroomSaga({ payload }) {
  const { atlasProviderName = 'Schoology' } = payload
  try {
    delete payload?.atlasProviderName
    const { result } = yield call(
      atlasApi.syncGradesWithSchoologyClassroom,
      payload
    )
    const { url: signedUrl } = yield call(realtimeApi.getSignedUrl)
    yield fork(getAtlasGradeSyncUpdate, {
      ...payload,
      signedUrl,
    })
    if (result?.reAuth) {
      const mqttClient = yield select(
        (state) => state.author_assignments.mqttClient
      )
      yield put({
        type: MQTT_CLIENT_REMOVE_REQUEST,
      })
      mqttClient && mqttClient.end()
      try {
        removeAllTokens()
        localStorage.setItem('loginRedirectUrl', window.location.pathname)
        localStorage.setItem('atlasShareOriginUrl', window.location.pathname)
        localStorage.setItem('schoologyShare', 'grades')
        window.location.href = result.reAuth
      } catch (e) {
        notification({ messageKey: 'atlasLoginFailed' })
      }
    } else if (result?.statusCode === 200) {
      notification({
        type: 'success',
        msg: `Grade sync with ${atlasProviderName} is in progress`,
      })
    } else {
      notification({
        type: 'success',
        msg: `Grades are being shared to ${atlasProviderName} Classroom`,
      })
    }
  } catch (err) {
    const mqttClient = yield select(
      (state) => state.author_assignments.mqttClient
    )
    yield put({
      type: MQTT_CLIENT_REMOVE_REQUEST,
    })
    mqttClient && mqttClient.end()
    captureSentryException(err)
    notification({
      msg:
        err?.response?.data?.message ||
        `Failed to share grades to ${atlasProviderName} Classroom`,
    })
    console.error(err)
  }
}

function* syncAssignmentWithSchoologyClassroomSaga({ payload = {} }) {
  const { atlasProviderName = 'Schoology' } = payload
  try {
    notification({ type: 'success', messageKey: 'sharedAssignmentInProgress' })
    const result = yield call(assignmentApi.syncWithSchoologyClassroom, payload)
    if (result?.reAuth) {
      try {
        removeAllTokens()
        localStorage.setItem('loginRedirectUrl', window.location.pathname)
        localStorage.setItem('atlasShareOriginUrl', window.location.pathname)
        localStorage.setItem('schoologyShare', 'assignment')
        window.location.href = result.reAuth
      } catch (e) {
        notification({ messageKey: 'atlasLoginFailed' })
      }
    } else if (result?.[0]?.success) {
      yield put({
        type: SYNC_ASSIGNMENT_WITH_SCHOOLOGY_CLASSROOM_SUCCESS,
      })
      notification({
        msg: `Assignment is shared with ${atlasProviderName} Classroom successfully`,
      })
    } else {
      const errorMessage =
        result?.[0]?.message ||
        `Assignment failed to share with ${atlasProviderName} classroom. Please try after sometime.`
      yield put({
        type: SYNC_ASSIGNMENT_WITH_SCHOOLOGY_CLASSROOM_ERROR,
      })
      notification({ msg: errorMessage })
    }
  } catch (error) {
    captureSentryException(error)
    const errorMessage =
      error?.data?.message ||
      `Assignment failed to share with ${atlasProviderName} classroom. Please try after sometime.`
    yield put({
      type: SYNC_ASSIGNMENT_WITH_SCHOOLOGY_CLASSROOM_ERROR,
    })
    notification({ msg: errorMessage })
  }
}

function* editTagsRequestSaga({ payload }) {
  try {
    yield put(setTagsUpdatingStateAction('UPDATING'))
    yield call(assignmentApi.editTagsRequest, payload)
    yield put(setTagsUpdatingStateAction('SUCCESS'))
    notification({
      msg: 'Successfully updated tags in the Assignment(s)',
      type: 'success',
    })
  } catch (err) {
    const errorMessage =
      err?.data?.message || 'Failed to update tags in the Assignment(s)'
    notification({ msg: errorMessage })
    yield put(setTagsUpdatingStateAction('ERROR'))
  }
}

function* bulkUpdateAssignmentSettingsSaga({ payload }) {
  try {
    yield put(setBulkUpdateAssignmentSettingState('INITIATED'))
    const response = yield call(assignmentApi.bulkEditSettings, payload)
    yield put(setBulkUpdateAssignmentSettingState('SUCCESS'))
    const successMessage =
      response?.data?.result || 'Starting Bulk Action Request'
    notification({ type: 'info', msg: successMessage })
  } catch (err) {
    yield put(setBulkUpdateAssignmentSettingState('FAILED'))
    const errorMessage =
      err.response.data?.message || 'Failed to bulk update assignment settings.'
    notification({ msg: errorMessage })
  }
}

export default function* watcherSaga() {
  yield all([
    yield takeEvery(RECEIVE_ASSIGNMENTS_REQUEST, receiveAssignmentsSaga),
    yield takeLatest(
      RECEIVE_ASSIGNMENTS_SUMMARY_REQUEST,
      receiveAssignmentsSummary
    ),
    yield takeEvery(
      FETCH_CURRENT_EDITING_ASSIGNMENT,
      receiveAssignmentByIdSaga
    ),
    yield takeEvery(
      FETCH_CURRENT_ASSIGNMENT,
      receiveAssignmentByAssignmentIdSaga
    ),
    yield takeLatest(UPDATE_RELEASE_SCORE_SETTINGS, updateAssignmetSaga),
    yield takeEvery(
      RECEIVE_ASSIGNMENT_CLASS_LIST_REQUEST,
      receiveAssignmentClassList
    ),
    yield takeEvery(
      SYNC_ASSIGNMENT_WITH_GOOGLE_CLASSROOM_REQUEST,
      syncAssignmentWithGoogleClassroomSaga
    ),
    yield takeEvery(
      SYNC_ASSIGNMENT_GRADES_WITH_GOOGLE_CLASSROOM_REQUEST,
      syncAssignmentGradesWithGoogleClassroomSaga
    ),
    yield takeEvery(
      SYNC_ASSIGNMENT_GRADES_WITH_CLEVER_REQUEST,
      syncAssignmentGradesWithCleverSaga
    ),
    yield takeEvery(
      SYNC_ASSIGNMENT_GRADES_WITH_SCHOOLOGY_CLASSROOM_REQUEST,
      syncAssignmentGradesWithSchoologyClassroomSaga
    ),
    yield takeEvery(
      SYNC_ASSIGNMENT_WITH_SCHOOLOGY_CLASSROOM_REQUEST,
      syncAssignmentWithSchoologyClassroomSaga
    ),
    yield takeEvery(EDIT_TAGS_REQUEST, editTagsRequestSaga),
    yield takeEvery(
      BULK_UPDATE_ASSIGNMENT_SETTINGS,
      bulkUpdateAssignmentSettingsSaga
    ),
  ])
}
