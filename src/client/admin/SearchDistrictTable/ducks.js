import { createReducer, createAction } from 'redux-starter-kit'
import { createSelector } from 'reselect'
import { put, takeEvery, takeLatest, call, all } from 'redux-saga/effects'
import { notification } from '@edulastic/common'
import { adminApi } from '@edulastic/api'

// CONSTANTS
export const GET_TABLE_DATA = '[admin] GET_TABLE_DATA'
export const GET_CLASSLINK_TABLE_DATA = '[admin] GET_CLASSLINK_TABLE_DATA'
export const CLEAR_TABLE_DATA = '[admin] CLEAR_TABLE_DATA'
export const UPDATE_CLEVER = '[admin] UPDATE_CLEVER'
export const UPDATE_CLASSLINK = '[admin] UPDATE_CLASSLINK'
export const DELETE_DISTRICT_ID = '[admin] DELETE_DISTRICT_ID'
export const GET_USERS_DATA = '[admin] GET_USERS_DATA'
export const SET_USERS_LOADING = '[admin] SET_USERS_LOADING'

export const TABLE_DATA_SUCCESS = '[admin] TABLE_DATA_SUCCESS'
export const CLEVER_ID_UPDATE_SUCCESS = '[admin] CLEVER_ID_UPDATE_SUCCESS'
export const CLASSLINK_ID_UPDATE_SUCCESS = '[admin] CLASSLINK_ID_UPDATE_SUCCESS'
export const DELETE_DISTRICT_ID_SUCCESS = '[admin] DELETE_DISTRICT_ID_SUCCESS'
export const GET_USERS_DATA_SUCCESS = '[admin] GET_USERS_DATA_SUCCESS'

// ACTION CREATORS
export const fetchTableData = createAction(GET_TABLE_DATA)
export const fetchClasslinkTableDataAction = createAction(
  GET_CLASSLINK_TABLE_DATA
)
export const clearTableDataAction = createAction(CLEAR_TABLE_DATA)
export const updateClever = createAction(UPDATE_CLEVER)
export const updateClasslink = createAction(UPDATE_CLASSLINK)
export const deleteDistrictId = createAction(DELETE_DISTRICT_ID)
export const getUsersDataAction = createAction(GET_USERS_DATA)
export const setUsersLoadingAction = createAction(SET_USERS_LOADING)

export const cleverIdUpdateAction = createAction(CLEVER_ID_UPDATE_SUCCESS)
export const classlinkIdUpdateAction = createAction(CLASSLINK_ID_UPDATE_SUCCESS)
export const tableDataSuccessAction = createAction(TABLE_DATA_SUCCESS)
export const deleteDistrictIdSuccess = createAction(DELETE_DISTRICT_ID_SUCCESS)
export const getUsersDataSuccess = createAction(GET_USERS_DATA_SUCCESS)

// REDUCERS
const initialState = []

const setCleverIdSuccess = (state, { payload }) => {
  const recordIndex = state.findIndex((item) => item._id === payload.districtId)
  state[recordIndex]._source.cleverId = payload.cleverId
}

const setClasslinkIdSuccess = (state, { payload }) => {
  const recordIndex = state.findIndex((item) => item._id === payload.districtId)
  state[recordIndex]._source.atlasId = payload.atlasId
}

const tableDataReducer = createReducer(initialState, {
  [TABLE_DATA_SUCCESS]: (_, action) => action.payload.data,
  [CLEAR_TABLE_DATA]: () => initialState,
  [CLEVER_ID_UPDATE_SUCCESS]: setCleverIdSuccess,
  [CLASSLINK_ID_UPDATE_SUCCESS]: setClasslinkIdSuccess,
  [DELETE_DISTRICT_ID_SUCCESS]: (state, { payload }) => {
    const recordIndex = state.findIndex(
      (item) => item._id === payload.districtId
    )
    state[recordIndex]._source.status = 0
  },
  [GET_USERS_DATA_SUCCESS]: (state, { payload: { index, ...rest } }) => {
    state[index].users.data = rest
    state[index].users.loading = false
  },
  [SET_USERS_LOADING]: (state, { payload: index }) => {
    state[index].users = {
      loading: true,
    }
  },
})

// SELECTORS
const adminStateSelector = (state) => state.admin

export const getTableData = createSelector(
  adminStateSelector,
  ({ tableData }) => tableData
)

// SAGAS
const {
  searchUpdateDistrict: searchUpdateDistrictApi,
  searchClasslinkDistrict: searchClasslinkDistrictApi,
  updateDistrictCleverId: updateDistrictCleverIdApi,
  updateDistrictClasslinkId: updateDistrictClasslinkIdApi,
  deleteDistrictApi,
  getUsersDataApi,
  getClasslinkUsersDataApi,
  deleteClasslinkDistrictApi,
} = adminApi

function* updateCleverRequest({ payload }) {
  try {
    const item = yield call(updateDistrictCleverIdApi, payload)
    if (item.data.success) {
      yield put(cleverIdUpdateAction(item.data))
    } else {
      notification({ msg: item.data.message })
    }
  } catch (err) {
    console.error(err)
  }
}

function* updateClasslinkRequest({ payload }) {
  try {
    const item = yield call(updateDistrictClasslinkIdApi, payload)
    if (item.data.success) {
      yield put(classlinkIdUpdateAction(item.data))
    } else {
      notification({ msg: item.data.message })
    }
  } catch (err) {
    console.error(err)
  }
}

function* fetchTableDataGenerator({ payload }) {
  try {
    const item = yield call(searchUpdateDistrictApi, payload)
    yield put(tableDataSuccessAction(item))
  } catch (err) {
    console.error(err)
  }
}

function* fetchClasslinkTableData({ payload }) {
  try {
    const item = yield call(searchClasslinkDistrictApi, payload)
    yield put(tableDataSuccessAction(item))
  } catch (err) {
    console.error(err)
  }
}

function* fetchDeleteDistrictIdRequest({
  payload: { districtId, isClasslink },
}) {
  try {
    let item
    if (isClasslink) {
      item = yield call(deleteClasslinkDistrictApi, districtId)
    } else {
      item = yield call(deleteDistrictApi, districtId)
    }
    if (item.data.success) {
      notification({
        msg: `${item.data.districtId} successfully deleted`,
        type: 'success',
      })
      yield put(deleteDistrictIdSuccess(item.data))
    }
  } catch (err) {
    console.error(err)
  }
}

function* getUsersDataSaga({ payload: { districtId, index, isClasslink } }) {
  try {
    yield put(setUsersLoadingAction(index))
    let item
    if (isClasslink) {
      item = yield call(getClasslinkUsersDataApi, districtId)
    } else {
      item = yield call(getUsersDataApi, districtId)
    }
    yield put(getUsersDataSuccess({ ...item.data, index }))
  } catch (err) {
    console.error(err)
  }
}

export function* watcherSaga() {
  yield all([
    takeLatest(GET_TABLE_DATA, fetchTableDataGenerator),
    takeLatest(GET_CLASSLINK_TABLE_DATA, fetchClasslinkTableData),
    takeEvery(UPDATE_CLEVER, updateCleverRequest),
    takeEvery(UPDATE_CLASSLINK, updateClasslinkRequest),
    takeEvery(DELETE_DISTRICT_ID, fetchDeleteDistrictIdRequest),
    takeEvery(GET_USERS_DATA, getUsersDataSaga),
  ])
}

export const sagas = [watcherSaga()]

// ALWAYS EXPORT DEFAULT A REDUCER
export default tableDataReducer
