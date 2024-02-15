import { takeLatest, call, put, all } from 'redux-saga/effects'
import { createSelector } from 'reselect'
import { reportsApi } from '@edulastic/api'
import { notification } from '@edulastic/common'
import { createAction, createReducer } from 'redux-starter-kit'

const GET_REPORTS_ASSIGNMENTS_REQUEST =
  '[reports] get reports assignments request'
const GET_REPORTS_ASSIGNMENTS_REQUEST_SUCCESS =
  '[reports] get reports assignments success'
const GET_REPORTS_ASSIGNMENTS_REQUEST_ERROR =
  '[reports] get reports assignments error'

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const getAssignmentsRequestAction = createAction(
  GET_REPORTS_ASSIGNMENTS_REQUEST
)

// -----|-----|-----|-----| ACTIONS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SELECTORS BEGIN |-----|-----|-----|----- //

export const stateSelector = (state) =>
  state.reportReducer.reportAssignmentsReducer

export const getReportsAssignments = createSelector(
  stateSelector,
  (state) => state.assignments
)

// -----|-----|-----|-----| SELECTORS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

const initialState = {
  assignments: {},
}

export const reportAssignmentsReducer = createReducer(initialState, {
  [GET_REPORTS_ASSIGNMENTS_REQUEST]: (state, { payload }) => {
    state.loading = true
  },
  [GET_REPORTS_ASSIGNMENTS_REQUEST_SUCCESS]: (state, { payload }) => {
    state.loading = false
    state.assignments = payload.assignments
  },
  [GET_REPORTS_ASSIGNMENTS_REQUEST_ERROR]: (state, { payload }) => {
    state.loading = false
    state.error = payload.error
  },
})

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SAGAS BEGIN |-----|-----|-----|----- //

export function* getReportsAssignmentsRequest({ payload }) {
  try {
    const assignments = yield call(reportsApi.fetchAssignments)
    yield put({
      type: GET_REPORTS_ASSIGNMENTS_REQUEST_SUCCESS,
      payload: { assignments },
    })
    return assignments
  } catch (error) {
    console.log('err', error.stack)
    const msg =
      'Error getting assignments. Please try again after a few minutes.'
    notification({ msg })
    yield put({
      type: GET_REPORTS_ASSIGNMENTS_REQUEST_ERROR,
      payload: { error: msg },
    })
  }
}

export function* reportAssignmentsSaga() {
  yield all([
    takeLatest(GET_REPORTS_ASSIGNMENTS_REQUEST, getReportsAssignmentsRequest),
  ])
}

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //
