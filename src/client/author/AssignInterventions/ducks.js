import { createAction, createReducer } from 'redux-starter-kit'
import { createSelector } from 'reselect'
import { all, call, put, takeLatest } from 'redux-saga/effects'

import { assignmentApi } from '@edulastic/api'
import { notification } from 'antd'

export const GET_STANDARDS_MASTERY_REQUEST =
  '[interventionPage] get standards mastery request'
export const GET_STANDARDS_MASTERY_SUCCESS =
  '[interventionsPage] get standards mastery success'
export const GET_STANDARDS_MASTERY_ERROR =
  '[interventionsPage] get standards mastery error'

export const getStandardsMasteryRequestAction = createAction(
  GET_STANDARDS_MASTERY_REQUEST
)

const initialState = {
  loading: false,
  studentStandardData: {},
}

const getStandardsMasteryRequest = (state) => {
  state.loading = true
}

const getStandardsMasterySuccess = (state, { payload }) => {
  state.studentStandardData = payload
  state.loading = false
}

const getStandardsMasteryError = (state) => {
  state.loading = false
}

export const reducer = createReducer(initialState, {
  [GET_STANDARDS_MASTERY_REQUEST]: getStandardsMasteryRequest,
  [GET_STANDARDS_MASTERY_SUCCESS]: getStandardsMasterySuccess,
  [GET_STANDARDS_MASTERY_ERROR]: getStandardsMasteryError,
})

function* getStandardsMasterySaga({ payload }) {
  try {
    const { studentList } = yield call(
      assignmentApi.getMasteryStudentList,
      payload
    )
    yield put({
      type: GET_STANDARDS_MASTERY_SUCCESS,
      payload: studentList,
    })
  } catch (err) {
    yield put({
      type: GET_STANDARDS_MASTERY_ERROR,
    })
    notification({
      type: 'error',
      msg: 'Unable to fetch mastery data',
    })
  }
}

export function* watcherSaga() {
  yield all([
    yield takeLatest(GET_STANDARDS_MASTERY_REQUEST, getStandardsMasterySaga),
  ])
}

const getStateSelector = (state) => state.assignInterventions

export const getStudentLoadingSelector = createSelector(
  getStateSelector,
  (state) => state.loading
)

export const getStudentStandardsDataSelector = createSelector(
  getStateSelector,
  (state) => state.studentStandardData
)
