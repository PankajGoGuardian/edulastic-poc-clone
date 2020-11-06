import { takeEvery, call, all, put, select } from 'redux-saga/effects'
import { createAction } from 'redux-starter-kit'
import { classBoardApi } from '@edulastic/api'
import { notification } from '@edulastic/common'
import { roleuser } from '@edulastic/constants'
import { getUserRole } from '../src/selectors/user'

// constants
export const BULK_OPEN_ASSIGNMENT = '[test assignments] bulk open'
export const BULK_CLOSE_ASSIGNMENT = '[test assignments] bulk close'
export const BULK_PAUSE_ASSIGNMENT = '[test assignments] bulk pause'
export const BULK_MARK_AS_DONE_ASSIGNMENT =
  '[test assignments] bulk mark as done'
export const BULK_RELEASE_SCORE_ASSIGNMENT =
  '[test assignments] bulk release score'
export const BULK_UNASSIGN_ASSIGNMENT = '[test assignments] bulk unassign'
export const BULK_DOWNLOAD_GRADES_AND_RESPONSES =
  '[test assignments] bulk download grades and responses'
export const SET_BULK_ACTION_STATUS =
  '[test assignments] set bulk action status'

// actions
export const bulkOpenAssignmentAction = createAction(BULK_OPEN_ASSIGNMENT)
export const bulkCloseAssignmentAction = createAction(BULK_CLOSE_ASSIGNMENT)
export const bulkPauseAssignmentAction = createAction(BULK_PAUSE_ASSIGNMENT)
export const bulkMarkAsDoneAssignmentAction = createAction(
  BULK_MARK_AS_DONE_ASSIGNMENT
)
export const bulkReleaseScoreAssignmentAction = createAction(
  BULK_RELEASE_SCORE_ASSIGNMENT
)
export const bulkUnassignAssignmentAction = createAction(
  BULK_UNASSIGN_ASSIGNMENT
)
export const bulkDownloadGradesAndResponsesAction = createAction(
  BULK_DOWNLOAD_GRADES_AND_RESPONSES
)
export const setAssignmentBulkActionStatus = createAction(
  SET_BULK_ACTION_STATUS
)

// saga
function* bulkOpenAssignmentSaga({ payload }) {
  try {
    yield call(classBoardApi.bulkOpenAssignment, payload)
    yield put(setAssignmentBulkActionStatus(true))
    notification({ type: 'info', msg: 'Starting Bulk Action Request' })
  } catch (err) {
    console.error(err)
    const errorMessage =
      err.response.data?.message || 'Failed to start Bulk Action request'
    notification({ msg: errorMessage })
    yield put(setAssignmentBulkActionStatus(false))
  }
}

function* bulkCloseAssignmentSaga({ payload }) {
  try {
    yield call(classBoardApi.bulkCloseAssignment, payload)
    yield put(setAssignmentBulkActionStatus(true))
    notification({ type: 'info', msg: 'Starting Bulk Action Request' })
  } catch (err) {
    console.error(err)
    const errorMessage =
      err.response.data?.message || 'Failed to start Bulk Action request'
    notification({ msg: errorMessage })
    yield put(setAssignmentBulkActionStatus(false))
  }
}

function* bulkPauseAssignmentSaga({ payload }) {
  try {
    yield call(classBoardApi.bulkPauseAssignment, payload)
    yield put(setAssignmentBulkActionStatus(true))
    notification({ type: 'info', msg: 'Starting Bulk Action Request' })
  } catch (err) {
    console.error(err)
    const errorMessage =
      err.response.data?.message || 'Failed to start Bulk Action request'
    notification({ msg: errorMessage })
    yield put(setAssignmentBulkActionStatus(false))
  }
}

function* bulkMarkAsDoneAssignmentSaga({ payload }) {
  try {
    yield call(classBoardApi.bulkMarkAsDoneAssignment, payload)
    yield put(setAssignmentBulkActionStatus(true))
    notification({ type: 'info', msg: 'Starting Bulk Action Request' })
  } catch (err) {
    console.error(err)
    const errorMessage =
      err.response.data?.message || 'Failed to start Bulk Action request'
    notification({ msg: errorMessage })
    yield put(setAssignmentBulkActionStatus(false))
  }
}

function* bulkReleaseScoreAssignmentSaga({ payload }) {
  try {
    yield call(classBoardApi.bulkReleaseScoreAssignment, payload)
    yield put(setAssignmentBulkActionStatus(true))
    notification({ type: 'info', msg: 'Starting Bulk Action Request' })
  } catch (err) {
    console.error(err)
    const errorMessage =
      err.response.data?.message || 'Failed to start Bulk Action request'
    notification({ msg: errorMessage })
    yield put(setAssignmentBulkActionStatus(false))
  }
}

function* bulkUnassignAssignmentSaga({ payload }) {
  try {
    yield call(classBoardApi.bulkUnassignAssignment, payload)
    yield put(setAssignmentBulkActionStatus(true))
    if (!payload.fromHomePage)
      notification({ type: 'info', msg: 'Starting Bulk Action Request' })
  } catch (err) {
    console.error(err)
    let errorMessage =
      err.response.data?.message || 'Failed to start Bulk Action request'
    if (payload.fromHomePage)
      errorMessage = 'Failed to Unassign the assignments.'
    notification({ msg: errorMessage })
    yield put(setAssignmentBulkActionStatus(false))
  }
}

function* bulkDownloadGradesAndResponsesSaga({ payload }) {
  try {
    const {
      data,
      testId,
      testType,
      isResponseRequired = false,
      status,
    } = payload
    const _payload = {
      data: {
        assignmentGroups: data,
        isResponseRequired,
      },
      testId,
      testType,
      status,
    }
    const userRole = yield select(getUserRole)
    if (userRole === roleuser.TEACHER) {
      notification({
        type: 'info',
        msg: 'Assessment responses are being processed for downloading',
      })
    } else {
      notification({ type: 'info', msg: 'Starting Bulk Action Request' })
    }
    yield call(classBoardApi.bulkDownloadGrades, _payload)
    yield put(setAssignmentBulkActionStatus(true))
  } catch (err) {
    console.error(err)
    const errorMessage =
      err.response.data?.message || 'Failed to start Bulk Action request'
    notification({ msg: errorMessage })
    yield put(setAssignmentBulkActionStatus(false))
  }
}

export function* watcherSaga() {
  yield all([
    yield takeEvery(BULK_OPEN_ASSIGNMENT, bulkOpenAssignmentSaga),
    yield takeEvery(BULK_CLOSE_ASSIGNMENT, bulkCloseAssignmentSaga),
    yield takeEvery(BULK_PAUSE_ASSIGNMENT, bulkPauseAssignmentSaga),
    yield takeEvery(BULK_MARK_AS_DONE_ASSIGNMENT, bulkMarkAsDoneAssignmentSaga),
    yield takeEvery(
      BULK_RELEASE_SCORE_ASSIGNMENT,
      bulkReleaseScoreAssignmentSaga
    ),
    yield takeEvery(BULK_UNASSIGN_ASSIGNMENT, bulkUnassignAssignmentSaga),
    yield takeEvery(
      BULK_DOWNLOAD_GRADES_AND_RESPONSES,
      bulkDownloadGradesAndResponsesSaga
    ),
  ])
}
