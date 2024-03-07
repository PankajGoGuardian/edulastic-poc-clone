import { createAction, createReducer } from 'redux-starter-kit'
import { createSelector } from 'reselect'
import { takeEvery, takeLatest, call, put, all } from 'redux-saga/effects'
import { enrollmentApi, userApi } from '@edulastic/api'
import { keyBy, get, omit } from 'lodash'
import { captureSentryException, notification } from '@edulastic/common'
import { userPermissions } from '@edulastic/constants'
import { receiveClassEnrollmentListAction } from '../ClassEnrollment/ducks'
import { UPDATE_POWER_TEACHER_TOOLS_SUCCESS } from '../../student/Login/ducks'

const RECEIVE_SCHOOLADMIN_REQUEST = '[schooladmin] receive data request'
const RECEIVE_SCHOOLADMIN_SUCCESS = '[schooladmin] receive data success'
const RECEIVE_SCHOOLADMIN_ERROR = '[schooladmin] receive data error'
const UPDATE_SCHOOLADMIN_REQUEST = '[schooladmin] update data request'
const UPDATE_SCHOOLADMIN_SUCCESS = '[schooladmin] update data success'
const UPDATE_SCHOOLADMIN_ERROR = '[schooladmin] update data error'
const CREATE_SCHOOLADMIN_REQUEST = '[schooladmin] create data request'
const CREATE_SCHOOLADMIN_SUCCESS = '[schooladmin] create data success'
const CREATE_SCHOOLADMIN_ERROR = '[schooladmin] create data error'
const DELETE_SCHOOLADMIN_REQUEST = '[schooladmin] delete data request'
const DELETE_SCHOOLADMIN_SUCCESS = '[schooladmin] delete data success'
const DELETE_SCHOOLADMIN_ERROR = '[schooladmin] delete data error'

const SET_SCHOOLADMIN_SEARCHNAME = '[schooladmin] set search name'
const SET_SCHOOLADMIN_SETFILTERS = '[schooladmin] set filters'
const SET_SHOW_ACTIVE_COURSES = '[schooladmin] set showActiveUsers flag'
const SET_PAGE_NO = '[schooladmin] set page number'
const CHANGE_FILTER_COLUMN = '[schooladmin] change filter column'
const CHANGE_FILTER_TYPE = '[schooladmin] change filter type'
const CHANGE_FILTER_VALUE = '[schooladmin] change filter value'
const ADD_FILTER_ACTION = '[schooladmin] add filter'
const REMOVE_FILTER = '[schooladmin] remove filter'
const SET_ROLE = '[schooladmin] set role'

const ADD_BULK_TEACHER_REQUEST = '[teacher] add bulk teacher request'
const ADD_BULK_TEACHER_SUCCESS = '[teacher] add bulk teacher success'
const ADD_BULK_TEACHER_ERROR = '[teacher] add bulk teacher error'

const SET_TEACHERDETAIL_MODAL_VISIBLE =
  '[teacher] set teacher detail modal visible'

const REMOVE_USERS_ENROLLMENTS_REQUEST = '[Admin] remove enrollment request'
const REMOVE_USERS_ENROLLMENTS_SUCCESS = '[Admin] remove enrollment success'
const REMOVE_USERS_ENROLLMENTS_ERROR = '[Admin] remove enrollment error'

const UPDATE_INSIGHTS_ONLY_PERMISSION_SUCCESS =
  '[schooladmin] update user permission success'
const UPDATE_INSIGHTS_ONLY_PERMISSION_FAILED =
  '[schooladmin] update user permission failed'
const UPDATE_INSIGHTS_ONLY_PERMISSION_REQUEST =
  '[schooladmin] update user permission request'

export const receiveAdminDataAction = createAction(RECEIVE_SCHOOLADMIN_REQUEST)
export const receiveSchoolAdminSuccessAction = createAction(
  RECEIVE_SCHOOLADMIN_SUCCESS
)
export const receiveSchoolAdminErrorAction = createAction(
  RECEIVE_SCHOOLADMIN_ERROR
)
export const updateAdminUserAction = createAction(UPDATE_SCHOOLADMIN_REQUEST)
export const updateSchoolAdminSuccessAction = createAction(
  UPDATE_SCHOOLADMIN_SUCCESS
)
export const updateSchoolAdminErrorAction = createAction(
  UPDATE_SCHOOLADMIN_ERROR
)
export const createAdminUserAction = createAction(CREATE_SCHOOLADMIN_REQUEST)
export const createSchoolAdminSuccessAction = createAction(
  CREATE_SCHOOLADMIN_SUCCESS
)
export const createSchoolAdminErrorAction = createAction(
  CREATE_SCHOOLADMIN_ERROR
)
export const deleteAdminUserAction = createAction(DELETE_SCHOOLADMIN_REQUEST)
export const deleteSchoolAdminSuccessAction = createAction(
  DELETE_SCHOOLADMIN_SUCCESS
)
export const deleteSchoolAdminErrorAction = createAction(
  DELETE_SCHOOLADMIN_ERROR
)
export const changeFilterColumnAction = createAction(CHANGE_FILTER_COLUMN)

export const setSearchNameAction = createAction(SET_SCHOOLADMIN_SEARCHNAME)
export const setFiltersAction = createAction(SET_SCHOOLADMIN_SETFILTERS)
export const setShowActiveUsersAction = createAction(SET_SHOW_ACTIVE_COURSES)
export const setPageNoAction = createAction(SET_PAGE_NO)
export const changeFilterTypeAction = createAction(CHANGE_FILTER_TYPE)
export const changeFilterValueAction = createAction(CHANGE_FILTER_VALUE)
export const addFilterAction = createAction(ADD_FILTER_ACTION)
export const removeFilterAction = createAction(REMOVE_FILTER)
export const setRoleAction = createAction(SET_ROLE)

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

export const removeUserEnrollmentsAction = createAction(
  REMOVE_USERS_ENROLLMENTS_REQUEST
)
export const removeUserEnrollmentsSuccessAction = createAction(
  REMOVE_USERS_ENROLLMENTS_SUCCESS
)
export const removeUserEnrollmentsErrorAction = createAction(
  REMOVE_USERS_ENROLLMENTS_ERROR
)

export const updateInsightsOnlyPermissionAction = createAction(
  UPDATE_INSIGHTS_ONLY_PERMISSION_REQUEST
)

// selectors
const stateSchoolAdminSelector = (state) => state.schoolAdminReducer
const filterSelector = (state) => state.schoolAdminReducer.filters

export const getAdminUsersDataSelector = createSelector(
  stateSchoolAdminSelector,
  (state) => state.data.result
)

export const getAdminUsersDataCountSelector = createSelector(
  stateSchoolAdminSelector,
  (state) => state.data.totalUsers
)

export const getShowActiveUsersSelector = createSelector(
  stateSchoolAdminSelector,
  ({ showActiveUsers }) => showActiveUsers
)

export const getPageNoSelector = createSelector(
  stateSchoolAdminSelector,
  ({ pageNo }) => pageNo
)

export const getFiltersSelector = createSelector(
  filterSelector,
  (filters) => filters
)
// reducers
const initialState = {
  data: {
    result: {},
    totalUsers: 0,
  },
  loading: false,
  error: null,
  update: {},
  updating: false,
  updateError: null,
  create: { _id: -1 },
  creating: false,
  createError: null,
  delete: null,
  deleting: false,
  deleteError: null,
  // searchName: "",
  // filtersColumn: "",
  // filtersValue: "",
  // filtersText: "",
  showActiveUsers: true,
  pageNo: 1,
  bulkTeacherData: [],
  teacherDetailsModalVisible: false,
  // filters: {
  //   other: {
  //     type: "",
  //     value: ""
  //   }
  // },
  // role: ""
  updatingInsightsOnlyPermision: false,
}

export const reducer = createReducer(initialState, {
  [RECEIVE_SCHOOLADMIN_REQUEST]: (state) => {
    state.loading = true
  },
  [RECEIVE_SCHOOLADMIN_SUCCESS]: (
    state,
    { payload: { result, totalUsers } }
  ) => {
    state.loading = false
    const _result = keyBy(result, '_id')

    state.data = {
      result: _result,
      totalUsers,
    }
  },
  [RECEIVE_SCHOOLADMIN_ERROR]: (state, { payload }) => {
    state.loading = false
    state.error = payload.error
  },
  [UPDATE_SCHOOLADMIN_REQUEST]: (state) => {
    state.updating = true
  },
  [UPDATE_SCHOOLADMIN_SUCCESS]: (state, { payload }) => {
    state.update = payload
    state.updating = false
    if (state.data.result[payload._id]) {
      state.data.result[payload._id]._source = {
        ...state.data.result[payload._id]._source,
        ...payload,
      }
    }
  },
  [UPDATE_SCHOOLADMIN_ERROR]: (state, { payload }) => {
    state.updating = false
    state.updateError = payload.error
  },
  [CREATE_SCHOOLADMIN_REQUEST]: (state) => {
    state.creating = true
  },
  [CREATE_SCHOOLADMIN_SUCCESS]: (state, { payload }) => {
    const { _id } = payload
    state.creating = false
    state.create = payload
    state.data.result[_id] = {
      _id,
      _source: payload,
    }
    ++state.data.totalUsers
  },
  [CREATE_SCHOOLADMIN_ERROR]: (state, { payload }) => {
    state.createError = payload.error
    state.creating = false
  },
  [DELETE_SCHOOLADMIN_REQUEST]: (state) => {
    state.deleting = true
  },
  [DELETE_SCHOOLADMIN_SUCCESS]: (state, { payload }) => {
    const { userIds } = payload // userIds in an array of ids
    state.data.result = omit(state.data.result, userIds)
    state.data.totalUsers -= userIds.length
    state.delete = payload
    state.deleting = false
  },
  [DELETE_SCHOOLADMIN_ERROR]: (state, { payload }) => {
    state.deleting = false
    state.deleteError = payload.error
  },
  [SET_SCHOOLADMIN_SEARCHNAME]: (state, { payload: value }) => {
    state.searchName = value
  },
  [SET_SHOW_ACTIVE_COURSES]: (state, { payload: bool }) => {
    state.showActiveUsers = bool
    // here we set back the page to 1, since for the current page the user is on,
    // with the active courses flag, we may get back zero results
    state.pageNo = 1
  },
  [SET_PAGE_NO]: (state, { payload: pageNo }) => {
    state.pageNo = pageNo
  },
  [CHANGE_FILTER_COLUMN]: (state, { payload: { prevKey, newKey } }) => {
    delete state.filters[prevKey]
    state.filters[newKey] = {
      type: '',
      value: '',
    }
  },
  [CHANGE_FILTER_TYPE]: (state, { payload: { key, value } }) => {
    state.filters[key].type = value
  },
  [CHANGE_FILTER_VALUE]: (state, { payload: { key, value } }) => {
    state.filters[key].value = value
  },
  [ADD_FILTER_ACTION]: (state) => {
    state.filters.other = {
      type: '',
      value: '',
    }
  },
  [REMOVE_FILTER]: (state, { payload: filterKey }) => {
    delete state.filters[filterKey]
  },
  [SET_ROLE]: (state, { payload: role }) => {
    state.role = role
  },
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
  [UPDATE_POWER_TEACHER_TOOLS_SUCCESS]: (
    state,
    { payload: { usernames, enable } }
  ) => {
    if (state.data?.result) {
      Object.keys(state.data.result).forEach((id) => {
        const _user = state.data.result[id]
        const _source = _user?._source

        if (
          usernames.includes(_source?.email) ||
          usernames.includes(_source?.username)
        ) {
          _user._source.isPowerTeacher = enable
        }
        state.data.result[id] = _user
      })
    }
  },
  [REMOVE_USERS_ENROLLMENTS_REQUEST]: (state) => {
    state.deleting = true
  },
  [REMOVE_USERS_ENROLLMENTS_SUCCESS]: (state, { payload }) => {
    state.delete = payload
    state.deleting = false
  },
  [REMOVE_USERS_ENROLLMENTS_ERROR]: (state, { payload }) => {
    state.deleting = false
    state.deleteError = payload.error
  },
  [UPDATE_INSIGHTS_ONLY_PERMISSION_SUCCESS]: (state, { payload }) => {
    if (state.data.result) {
      Object.keys(state.data.result).forEach((id) => {
        if (payload && payload.includes(id)) {
          state.data.result[id]._source.permissions = [
            ...state.data.result[id]._source.permissions,
            userPermissions.INSIGHTS_ONLY,
          ]
        }
      })
    }
    state.updatingUserPermisions = false
  },
  [UPDATE_INSIGHTS_ONLY_PERMISSION_REQUEST]: (state) => {
    state.updatingUserPermisions = true
  },
  [UPDATE_INSIGHTS_ONLY_PERMISSION_FAILED]: (state) => {
    state.updatingUserPermisions = false
  },
})

// sagas
function* receiveSchoolAdminSaga({ payload }) {
  try {
    const data = yield call(userApi.fetchUsers, payload)
    yield put(receiveSchoolAdminSuccessAction(data))
  } catch (err) {
    captureSentryException(err)
    const errorMessage = 'Unable to fetch admin info.'
    notification({ type: 'error', msg: errorMessage })
    yield put(receiveSchoolAdminErrorAction({ error: errorMessage }))
  }
}

function* updateSchoolAdminSaga({ payload }) {
  try {
    const updateSchoolAdmin = yield call(userApi.updateUser, payload)
    yield put(updateSchoolAdminSuccessAction(updateSchoolAdmin))
    notification({ type: 'success', messageKey: 'userUpdatedSuccessfully' })
  } catch (err) {
    const {
      data: { message: errorMessage },
    } = err.response
    captureSentryException(err)
    notification({
      type: 'error',
      msg: errorMessage || 'Unable to update the user.',
    })
    yield put(updateSchoolAdminErrorAction({ error: errorMessage }))
  }
}

function* createSchoolAdminSaga({ payload }) {
  try {
    const createSchoolAdmin = yield call(userApi.createUser, payload.createReq)
    yield put(createSchoolAdminSuccessAction(createSchoolAdmin))
    // here after an update/delete/create, the new data is fetched back again
    const isFetchClassEnrollmentList = get(
      payload,
      'classEnrollmentPage',
      false
    )
    if (isFetchClassEnrollmentList) {
      yield put(receiveClassEnrollmentListAction(payload.listReq))
    }
    const { role } = createSchoolAdmin
    let msg = ''
    switch (role) {
      case 'teacher':
        msg = 'New user created successfully'
        break
      case 'student':
        msg = 'User added to class successfully'
        break
      case 'school-admin':
        msg = 'School admin created successfully'
        break
      case 'district-admin':
        msg = 'District admin created successfully'
        break
      case 'content-author':
        msg = 'Content Author created successfully'
        break
      case 'content-approver':
        msg = 'Content Approver created successfully'
        break
      default:
        msg = 'Created Successfully'
    }
    notification({ type: 'success', msg })
  } catch (err) {
    captureSentryException(err)
    const errorMessage =
      err.response.data.message || 'Unable to create the user.'
    notification({ type: 'error', msg: errorMessage })
    yield put(createSchoolAdminErrorAction({ error: errorMessage }))
  }
}

function* deleteSchoolAdminSaga({ payload }) {
  try {
    yield call(userApi.deleteUser, payload.deleteReq)
    yield put(deleteSchoolAdminSuccessAction(payload.deleteReq))

    // here after an update/delete/create, the new data is fetched back again
    const isFetchClassEnrollmentList = get(
      payload,
      'classEnrollmentPage',
      false
    )
    if (isFetchClassEnrollmentList) {
      yield put(receiveClassEnrollmentListAction(payload.listReq))
    }
    notification({ type: 'success', messageKey: 'userSucessfullyDeactivated' })
  } catch (err) {
    captureSentryException(err)
    const errorMessage = 'Unable to delete school admin.'
    notification({ type: 'error', msg: errorMessage })
    yield put(deleteSchoolAdminErrorAction({ deleteError: errorMessage }))
  }
}
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

function* removeUserEnrollmentsSaga({ payload }) {
  try {
    yield call(enrollmentApi.removeUsers, payload.deleteReq)
    yield put(deleteSchoolAdminSuccessAction(payload.deleteReq))

    // here after an update/delete/create, the new data is fetched back again
    const isFetchClassEnrollmentList = get(
      payload,
      'classEnrollmentPage',
      false
    )
    if (isFetchClassEnrollmentList) {
      yield put(receiveClassEnrollmentListAction(payload.listReq))
    }
    notification({
      type: 'success',
      messageKey: 'userSuccessfullyUn-enrolled',
    })
  } catch (err) {
    captureSentryException(err)
    const errorMessage = 'Error on removing user enrollments.'
    notification({ msg: errorMessage })
    yield put(deleteSchoolAdminErrorAction({ deleteError: errorMessage }))
  }
}

function* updateInsightsOnlyPermissionSaga({ payload }) {
  try {
    const response = yield call(userApi.updateInsightsOnlyPermission, payload)
    yield put({
      type: UPDATE_INSIGHTS_ONLY_PERMISSION_SUCCESS,
      payload: response?.data?.result?.updatedUserIds || [],
    })
    notification({
      type: 'success',
      msg:
        response?.data?.result?.message ||
        'Eligible users are updated successfully.',
    })
  } catch (e) {
    yield put({ type: UPDATE_INSIGHTS_ONLY_PERMISSION_FAILED })
    notification({
      type: 'error',
      msg: 'User permission update failed',
    })
  }
}

export function* watcherSaga() {
  yield all([
    yield takeEvery(RECEIVE_SCHOOLADMIN_REQUEST, receiveSchoolAdminSaga),
  ])
  yield all([
    yield takeEvery(UPDATE_SCHOOLADMIN_REQUEST, updateSchoolAdminSaga),
  ])
  yield all([
    yield takeEvery(CREATE_SCHOOLADMIN_REQUEST, createSchoolAdminSaga),
  ])
  yield all([
    yield takeEvery(DELETE_SCHOOLADMIN_REQUEST, deleteSchoolAdminSaga),
  ])
  yield all([
    yield takeLatest(ADD_BULK_TEACHER_REQUEST, addBulkTeacherAdminSaga),
  ])
  yield all([
    yield takeEvery(
      REMOVE_USERS_ENROLLMENTS_REQUEST,
      removeUserEnrollmentsSaga
    ),
  ])
  yield all([
    yield takeLatest(
      UPDATE_INSIGHTS_ONLY_PERMISSION_REQUEST,
      updateInsightsOnlyPermissionSaga
    ),
  ])
}
