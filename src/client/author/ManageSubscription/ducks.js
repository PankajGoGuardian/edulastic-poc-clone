/* eslint-disable no-template-curly-in-string */
import { userApi } from '@edulastic/api'
import { captureSentryException, notification } from '@edulastic/common'
import { takeLatest } from 'redux-saga'
import { all, call, put } from 'redux-saga/effects'
import { createAction, createReducer } from 'redux-starter-kit'
import { createSelector } from 'reselect'

// selectors
const manageSubscriptionSelector = (state) => state.manageSubscription
export const getSubsLicenses = createSelector(
  manageSubscriptionSelector,
  (state) => state.licenses
)

// action types
export const SET_LICENSES_DATA =
  '[manageSubscriptions] set manage subscriptions license data'

const ADD_BULK_TEACHER_REQUEST = '[teacher] add bulk teacher request'
const ADD_BULK_TEACHER_SUCCESS = '[teacher] add bulk teacher success'
const ADD_BULK_TEACHER_ERROR = '[teacher] add bulk teacher error'

const SET_TEACHERDETAIL_MODAL_VISIBLE =
  '[teacher] set teacher detail modal visible'

// action creators
export const addBulkTeacherAdminAction = createAction(ADD_BULK_TEACHER_REQUEST)
export const addBulkTeacherAdminSuccessAction = createAction(
  ADD_BULK_TEACHER_SUCCESS
)
export const addBulkTeacherAdminErrorAction = createAction(
  ADD_BULK_TEACHER_ERROR
)
export const setTeachersDetailsModalVisibleAction = createAction(
  SET_TEACHERDETAIL_MODAL_VISIBLE
)

// initial State
const initialState = {
  data: {
    result: {},
    totalUsers: 0,
  },
  creating: false,
  bulkTeacherData: [],
  teacherDetailsModalVisible: false,
  licenses: [
    {
      validEndDate: 'Jun 6, 2021',
      count: 20,
      used: 5,
      product: {
        name: 'Teacher Premium Licenses',
        id: '',
        linkedProductId: '',
        type: 'PREMIUM',
      },
    },
    {
      validEndDate: 'Jun 6, 2021',
      count: 20,
      used: 5,
      product: {
        name: 'SparkMath Licenses',
        id: '',
        linkedProductId: '',
        type: 'ITEM_BANK',
      },
    },
  ],
}

const setLicensesData = (state, { payload }) => {
  state.licenses = payload
}

// main reducer
export const reducer = createReducer(initialState, {
  [SET_LICENSES_DATA]: setLicensesData,
  [ADD_BULK_TEACHER_REQUEST]: (state) => {
    state.creating = true
    state.teacherDetailsModalVisible = false
  },
  [ADD_BULK_TEACHER_SUCCESS]: (state, { payload: { res, _bulkTeachers } }) => {
    state.bulkTeacherData = res
    state.data.result = { ..._bulkTeachers, ...state.data.result }
    state.data.totalUsers += Object.keys(_bulkTeachers).length
    state.creating = false
    state.teacherDetailsModalVisible = true
  },
  [ADD_BULK_TEACHER_ERROR]: (state, { payload }) => {
    state.creating = false
    state.addBulkTeacherError = payload.bulkAddError
    state.teacherDetailsModalVisible = false
  },
  [SET_TEACHERDETAIL_MODAL_VISIBLE]: (state, { payload }) => {
    state.teacherDetailsModalVisible = payload
  },
})

// sagas
function* addBulkTeacherAdminSaga({ payload }) {
  try {
    const res = yield call(userApi.adddBulkTeacher, payload.addReq)
    const _bulkTeachers = {}
    res
      .filter((_t) => _t.status == 'SUCCESS')
      .forEach((_o) => {
        const { _id } = _o
        _bulkTeachers[_id] = {
          _id,
          _source: {
            ..._o,
            status: 1,
          },
        }
      })
    yield put(addBulkTeacherAdminSuccessAction({ res, _bulkTeachers }))
  } catch (err) {
    captureSentryException(err)
    const errorMessage = 'Unable to add teachers in bulk.'
    notification({ type: 'error', msg: errorMessage })
    yield put(addBulkTeacherAdminErrorAction({ bulkAddError: errorMessage }))
  }
}

// watcher saga
export function* watcherSaga() {
  yield all([
    yield takeLatest(ADD_BULK_TEACHER_REQUEST, addBulkTeacherAdminSaga),
  ])
}
