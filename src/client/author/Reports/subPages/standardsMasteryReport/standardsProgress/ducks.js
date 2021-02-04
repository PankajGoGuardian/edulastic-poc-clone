import { takeLatest, call, put, all } from 'redux-saga/effects'
import { createSelector } from 'reselect'
import { reportsApi } from '@edulastic/api'
import { notification } from '@edulastic/common'
import { createAction, createReducer } from 'redux-starter-kit'

import { RESET_ALL_REPORTS } from '../../../common/reportsRedux'

const GET_REPORTS_STANDARDS_PROGRESS_REQUEST =
  '[reports] get reports standards progress request'
const GET_REPORTS_STANDARDS_PROGRESS_REQUEST_SUCCESS =
  '[reports] get reports standards progress success'
const GET_REPORTS_STANDARDS_PROGRESS_REQUEST_ERROR =
  '[reports] get reports standards progress error'

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const getStandardsProgressRequestAction = createAction(
  GET_REPORTS_STANDARDS_PROGRESS_REQUEST
)

// -----|-----|-----|-----| ACTIONS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SELECTORS BEGIN |-----|-----|-----|----- //

export const stateSelector = (state) =>
  state.reportReducer.reportStandardsProgressReducer

export const getReportsStandardsProgress = createSelector(
  stateSelector,
  (state) => state.standardsProgress
)

export const getReportsStandardsProgressLoader = createSelector(
  stateSelector,
  (state) => state.loading
)

export const getReportsStandardsProgressError = createSelector(
  stateSelector,
  (state) => state.error
)

// -----|-----|-----|-----| SELECTORS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

const initialState = {
  standardsProgress: {},
  loading: true,
}

export const reportStandardsProgressReducer = createReducer(initialState, {
  [RESET_ALL_REPORTS]: (state) => (state = initialState),
  [GET_REPORTS_STANDARDS_PROGRESS_REQUEST]: (state) => {
    state.loading = true
  },
  [GET_REPORTS_STANDARDS_PROGRESS_REQUEST_SUCCESS]: (state, { payload }) => {
    state.loading = false
    state.error = false
    state.standardsProgress = payload.standardsProgress
  },
  [GET_REPORTS_STANDARDS_PROGRESS_REQUEST_ERROR]: (state, { payload }) => {
    state.loading = false
    state.error = payload.error
  },
})

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SAGAS BEGIN |-----|-----|-----|----- //

function* getReportsStandardsProgressRequest({ payload }) {
  try {
    const standardsProgress = yield call(
      reportsApi.fetchStandardsProgressReport,
      payload
    )
    const dataSizeExceeded = standardsProgress?.data?.dataSizeExceeded || false
    if (dataSizeExceeded) {
      yield put({
        type: GET_REPORTS_STANDARDS_PROGRESS_REQUEST_ERROR,
        payload: { error: { ...standardsProgress.data } },
      })
      return
    }
    yield put({
      type: GET_REPORTS_STANDARDS_PROGRESS_REQUEST_SUCCESS,
      payload: { standardsProgress },
    })
  } catch (error) {
    console.log('err', error.stack)
    const msg =
      'Failed to fetch reports standards progress. Please try again...'

    notification({ msg })
    yield put({
      type: GET_REPORTS_STANDARDS_PROGRESS_REQUEST_ERROR,
      payload: { error: msg },
    })
  }
}

export function* reportStandardsProgressSaga() {
  yield all([
    yield takeLatest(
      GET_REPORTS_STANDARDS_PROGRESS_REQUEST,
      getReportsStandardsProgressRequest
    ),
  ])
}

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //
