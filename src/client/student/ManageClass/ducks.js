import { createAction, createReducer } from 'redux-starter-kit'
import { createSelector } from 'reselect'
import { all, takeEvery, call, put } from 'redux-saga/effects'
import { enrollmentApi } from '@edulastic/api'
import { get } from 'lodash'
import { notification } from '@edulastic/common'

export const RESET_ENROLLED_CLASSES =
  '[manage class] reset all enrolled classes'
export const RESET_CLASS_LIST = '[manage class] reset class list'

export const GET_ENROLL_CLASSES_REQUEST = '[auth] load enroll classes request'
export const GET_ENROLL_CLASSES_SUCCESS =
  '[auth] load enroll classes request success'
export const GET_ENROLL_CLASSES_FAIL = '[auth] load enroll classes request fail'
export const SET_FILTER_CLASS = '[manage class] set active class'

export const JOIN_CLASS_REQUEST = '[manage class] join class request'
export const JOIN_CLASS_REQUEST_SUCCESS =
  '[manage class] join class request success'
export const JOIN_CLASS_REQUEST_FAIL = '[manage class] join class request fail'

export const resetEnrolledClassAction = createAction(RESET_ENROLLED_CLASSES)
export const resetClassListAction = createAction(RESET_CLASS_LIST)

export const getEnrollClassAction = createAction(GET_ENROLL_CLASSES_REQUEST)
export const getEnrollClassActionSuccess = createAction(
  GET_ENROLL_CLASSES_SUCCESS
)
export const getEnrollClassActionFail = createAction(GET_ENROLL_CLASSES_FAIL)

export const joinClassAction = createAction(JOIN_CLASS_REQUEST)
export const joinClassSuccessAction = createAction(JOIN_CLASS_REQUEST_SUCCESS)
export const joinClassFailAction = createAction(JOIN_CLASS_REQUEST_FAIL)

export const setFilterClassAction = createAction(SET_FILTER_CLASS)

const initialState = {
  allClasses: [],
  filteredClasses: [],
  loading: true,
  error: null,
}

const resetEnrolledClassList = (state) => {
  state.allClasses = []
  state.filteredClasses = []
  state.loading = true
  state.error = null
}

const setEnrollClassListSuccess = (state, { payload }) => {
  state.allClasses = payload || []
  state.loading = false
}

const setEnrollClassListFail = (state) => {
  state.allClasses = []
  state.loading = false
}

const setFilterClass = (state, { payload }) => {
  state.filteredClasses = payload || []
}

const joinClassReq = (state) => {
  state.loading = true
}

const joinClassSuccess = (state, { payload }) => {
  if (payload) {
    state.filteredClasses.push(payload)
    state.loading = false
  }
}

const joinClassFail = (state) => {
  state.loading = false
}

export const reducer = createReducer(initialState, {
  [RESET_CLASS_LIST]: resetEnrolledClassList,
  [GET_ENROLL_CLASSES_SUCCESS]: setEnrollClassListSuccess,
  [GET_ENROLL_CLASSES_FAIL]: setEnrollClassListFail,
  [SET_FILTER_CLASS]: setFilterClass,
  [JOIN_CLASS_REQUEST]: joinClassReq,
  [JOIN_CLASS_REQUEST_SUCCESS]: joinClassSuccess,
  [JOIN_CLASS_REQUEST_FAIL]: joinClassFail,
})

function* resetEnrolledClasses() {
  yield put(resetClassListAction())
}

function* getEnrollClass() {
  try {
    const res = yield call(enrollmentApi.fetchStudentEnrollClass)
    const { result } = res.data
    yield put(setFilterClassAction(result))
    yield put(getEnrollClassActionSuccess(result))
  } catch (e) {
    yield put(getEnrollClassActionFail())
  }
}

function* joinClass({ payload }) {
  try {
    const result = yield call(enrollmentApi.addStudent, payload)
    const student = get(result, 'data.result')
    if (student) {
      const newStudent = {
        ...student,
        enrollmentStatus: 1,
      }
      yield put(joinClassSuccessAction(newStudent))
      const successMsg = 'You joined class successfully.'
      notification({ type: 'success', msg: successMsg })
    }
  } catch (error) {
    const msg = get(error.response, 'data.message', 'Unable to join class.')
    notification({ msg })
    yield put(joinClassFailAction(error))
  }
}

export function* watcherSaga() {
  yield all([
    yield takeEvery(GET_ENROLL_CLASSES_REQUEST, getEnrollClass),
    yield takeEvery(JOIN_CLASS_REQUEST, joinClass),
    yield takeEvery(RESET_ENROLLED_CLASSES, resetEnrolledClasses),
  ])
}

export const stateSelector = (state) => state.studentEnrollClassList

export const getAllClassesSelector = createSelector(
  stateSelector,
  (state) => state.allClasses
)

export const getFilteredClassesSelector = createSelector(
  stateSelector,
  (state) => state.filteredClasses
)

export const getLoaderSelector = createSelector(
  stateSelector,
  (state) => state.loading
)
