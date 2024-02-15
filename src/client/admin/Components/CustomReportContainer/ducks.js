import { notification } from '@edulastic/common'
import { createSelector } from 'reselect'
import { createAction, createReducer } from 'redux-starter-kit'
import { all, call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import { adminApi, customReportApi, schoolApi } from '@edulastic/api'

const GET_CUSTOM_REPORT_REQUEST =
  '[custom-reports] get custom reports for district request'
const GET_CUSTOM_REPORT_REQUEST_SUCCESS =
  '[custom-reports] get custom reports for district success'
const GET_CUSTOM_REPORT_REQUEST_ERROR =
  '[custom-reports] get custom reports for district error'

const UPDATE_PERMISSION_STATUS_REQUEST =
  '[custom-reports] get custom reports permission status request'
const UPDATE_PERMISSION_STATUS_REQUEST_SUCCESS =
  '[custom-reports] get custom reports permission status success'
const UPDATE_PERMISSION_STATUS_REQUEST_ERROR =
  '[custom-reports] get custom reports permission status error'

const UPDATE_CUSTOM_REPORT_REQUEST =
  '[custom-reports] update custom report request'
const UPDATE_CUSTOM_REPORT_REQUEST_SUCCESS =
  '[custom-reports] update custom report success'
const UPDATE_CUSTOM_REPORT_REQUEST_ERROR =
  '[custom-reports] update custom report error'

const CREATE_CUSTOM_REPORT_REQUEST =
  '[custom-reports] create custom report request'
const CREATE_CUSTOM_REPORT_REQUEST_SUCCESS =
  '[custom-reports] create custom report success'
const CREATE_CUSTOM_REPORT_REQUEST_ERROR =
  '[custom-reports] create custom report error'

const SET_OPEN_MODAL_TYPE = '[custom-reports] set opened modal type'

const GET_DISTRICT_DATA = '[custom-reports] search district'
const GET_DISTRICT_DATA_SUCCESS = '[custom-reports] search district success'
const GET_DISTRICT_DATA_ERROR = '[custom-reports] search district error'

const SET_SELECTED_DISTRICT_STATE = '[custom-reports] set selected district'

const SEARCH_SCHOOL_REQUEST = '[custom-reports] search school'
const SEARCH_SCHOOL_REQUEST_SUCCESS = '[custom-reports] search school success'
const SEARCH_SCHOOL_REQUEST_ERROR = '[custom-reports] search school error'

const SET_SELECTED_REPORT_DATA = '[custom-reports] set selected report data'

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const getDistrictDataAction = createAction(GET_DISTRICT_DATA)

export const getCustomReportAction = createAction(GET_CUSTOM_REPORT_REQUEST)

export const updatePermissionStatusAction = createAction(
  UPDATE_PERMISSION_STATUS_REQUEST
)

export const updateCustomReportAction = createAction(
  UPDATE_CUSTOM_REPORT_REQUEST
)

export const createCustomReportAction = createAction(
  CREATE_CUSTOM_REPORT_REQUEST
)

export const setOpenModalTypeAction = createAction(SET_OPEN_MODAL_TYPE)

export const setSelectedDistrict = createAction(SET_SELECTED_DISTRICT_STATE)

export const searchSchoolRequestAction = createAction(SEARCH_SCHOOL_REQUEST)

export const setSelectedReportDataAction = createAction(
  SET_SELECTED_REPORT_DATA
)

// -----|-----|-----|-----| ACTIONS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SELECTORS BEGIN |-----|-----|-----|----- //

export const stateSelector = (state) => state.customReportReducer

export const getCustomReportList = createSelector(
  stateSelector,
  (state) => state.customReportList
)

export const getCustomReportLoader = createSelector(
  stateSelector,
  (state) => state.loading
)

export const getOpenModalType = createSelector(
  stateSelector,
  (state) => state.modalType
)

export const getDistrictList = createSelector(
  stateSelector,
  (state) => state.districtList
)

export const getIsDistrictLoading = createSelector(
  stateSelector,
  (state) => state.loadingDistrict
)

export const getSelectedDistrict = createSelector(
  stateSelector,
  (state) => state.selectedDistrict
)

export const getSearchedSchools = createSelector(
  stateSelector,
  (state) => state.searchedSchool
)

export const getSearchingSchools = createSelector(
  stateSelector,
  (state) => state.searchingSchool
)

export const getSelectedReportData = createSelector(
  stateSelector,
  (state) => state.selectedReportData
)

// -----|-----|-----|-----| SELECTORS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

const initialState = {
  customReportList: [],
  districtList: [],
  modalType: '',
  searchedSchool: [],
  searchingSchool: false,
}

export const customReportReducer = createReducer(initialState, {
  [GET_CUSTOM_REPORT_REQUEST]: (state) => {
    state.loading = true
  },
  [GET_CUSTOM_REPORT_REQUEST_SUCCESS]: (state, { payload }) => {
    state.loading = false
    state.customReportList = payload
  },
  [GET_CUSTOM_REPORT_REQUEST_ERROR]: (state, { payload }) => {
    state.loading = false
    state.error = payload.error
  },
  [UPDATE_PERMISSION_STATUS_REQUEST]: (state) => {
    state.loading = true
  },
  [UPDATE_PERMISSION_STATUS_REQUEST_SUCCESS]: (state, { payload }) => {
    state.loading = false
    state.permissionUpdateStatus = payload
  },
  [UPDATE_PERMISSION_STATUS_REQUEST_ERROR]: (state, { payload }) => {
    state.loading = false
    state.error = payload.error
  },
  [UPDATE_CUSTOM_REPORT_REQUEST]: (state) => {
    state.loading = true
  },
  [UPDATE_CUSTOM_REPORT_REQUEST_SUCCESS]: (state, { payload }) => {
    state.loading = false
    state.updatedReport = payload
  },
  [UPDATE_CUSTOM_REPORT_REQUEST_ERROR]: (state, { payload }) => {
    state.loading = false
    state.error = payload.error
  },
  [CREATE_CUSTOM_REPORT_REQUEST]: (state) => {
    state.loading = true
  },
  [CREATE_CUSTOM_REPORT_REQUEST_SUCCESS]: (state, { payload }) => {
    state.loading = false
    state.newReport = payload
  },
  [CREATE_CUSTOM_REPORT_REQUEST_ERROR]: (state, { payload }) => {
    state.loading = false
    state.error = payload.error
  },
  [SET_OPEN_MODAL_TYPE]: (state, { payload }) => {
    state.modalType = payload
  },
  [GET_DISTRICT_DATA]: (state) => {
    state.loadingDistrict = true
  },
  [GET_DISTRICT_DATA_SUCCESS]: (state, { payload }) => {
    state.loadingDistrict = false
    state.districtList = payload
  },
  [GET_DISTRICT_DATA_ERROR]: (state) => {
    state.loadingDistrict = false
  },
  [SET_SELECTED_DISTRICT_STATE]: (state, { payload }) => {
    state.selectedDistrict = state.districtList[payload] || {}
  },
  [SEARCH_SCHOOL_REQUEST]: (state) => {
    state.searchingSchool = true
  },
  [SEARCH_SCHOOL_REQUEST_SUCCESS]: (state, { payload }) => {
    state.searchingSchool = false
    state.searchedSchool = payload
  },
  [SEARCH_SCHOOL_REQUEST_ERROR]: (state) => {
    state.searchingSchool = false
  },
  [SET_SELECTED_REPORT_DATA]: (state, { payload }) => {
    state.selectedReportData = payload || {}
  },
})

// -----|-----|-----|-----| REDUCER ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SAGAS BEGIN |-----|-----|-----|----- //

function* getCustomReportRequest({ payload }) {
  try {
    const customReportList = yield call(
      customReportApi.getCustomReports,
      payload
    )
    yield put({
      type: GET_CUSTOM_REPORT_REQUEST_SUCCESS,
      payload: customReportList,
    })
  } catch (error) {
    console.log('err', error.stack)
    yield call(notification, { message: 'getCustomReportErr' })
    yield put({
      type: GET_CUSTOM_REPORT_REQUEST_ERROR,
      payload: { error: 'getCustomReportErr' },
    })
  }
}

function* updatePermissionStatusRequest({ payload }) {
  try {
    const permissionStatus = yield call(
      customReportApi.updatePermissionStatus,
      payload
    )
    yield put({
      type: UPDATE_PERMISSION_STATUS_REQUEST_SUCCESS,
      payload: permissionStatus,
    })
    const customReportList = yield call(customReportApi.getCustomReports, {
      id: payload.districtId,
    })
    yield put({
      type: GET_CUSTOM_REPORT_REQUEST_SUCCESS,
      payload: customReportList,
    })
    yield call(notification, {
      type: 'success',
      message: 'permissionUpdateSucc',
    })
  } catch (error) {
    console.log('err', error.stack)
    yield call(notification, { message: 'permissionUpdateErr' })
    yield put({
      type: UPDATE_PERMISSION_STATUS_REQUEST_ERROR,
      payload: { error: 'permissionUpdateErr' },
    })
  }
}

function* updateCustomReportRequest({ payload }) {
  try {
    const updatedReport = yield call(
      customReportApi.updateCustomReport,
      payload
    )
    yield put({
      type: UPDATE_CUSTOM_REPORT_REQUEST_SUCCESS,
      payload: updatedReport,
    })
    const customReportList = yield call(customReportApi.getCustomReports, {
      id: payload.districtId,
    })
    yield put({
      type: GET_CUSTOM_REPORT_REQUEST_SUCCESS,
      payload: customReportList,
    })
    yield call(notification, { message: 'customReportUpdated' })
  } catch (error) {
    console.log('err', error.stack)
    yield call(notification, { message: 'customReportUpdateErr' })
    yield put({
      type: UPDATE_CUSTOM_REPORT_REQUEST_ERROR,
      payload: { error: 'customReportUpdateErr' },
    })
  }
}

function* createCustomReportRequest({ payload }) {
  try {
    const newReport = yield call(customReportApi.createCustomReport, payload)
    yield put({
      type: CREATE_CUSTOM_REPORT_REQUEST_SUCCESS,
      payload: newReport,
    })
    const customReportList = yield call(customReportApi.getCustomReports, {
      id: payload.districtId,
    })
    yield put({
      type: GET_CUSTOM_REPORT_REQUEST_SUCCESS,
      payload: customReportList,
    })
    yield call(notification, {
      type: 'success',
      message: 'customReportCreated',
    })
  } catch (error) {
    console.log('err', error.stack)
    yield call(notification, { message: 'customReportCreateErr' })
    yield put({
      type: CREATE_CUSTOM_REPORT_REQUEST_ERROR,
      payload: { error: 'customReportCreateErr' },
    })
  }
}

function* getDistrictData({ payload }) {
  try {
    const districts = yield call(adminApi.searchUpdateDistrict, payload)
    yield put({
      type: GET_DISTRICT_DATA_SUCCESS,
      payload: districts.data,
    })
  } catch (err) {
    const msg = 'Failed to get district info, please try again...'
    yield put({
      type: GET_DISTRICT_DATA_ERROR,
      payload: { error: msg },
    })
    console.error(err)
  }
}

function* searchSchoolRequest({ payload }) {
  try {
    const schools = yield call(schoolApi.getSchools, payload)
    yield put({
      type: SEARCH_SCHOOL_REQUEST_SUCCESS,
      payload: schools.data,
    })
  } catch (err) {
    const msg = 'School search failed, please try again...'
    yield put({
      type: SEARCH_SCHOOL_REQUEST_ERROR,
      payload: { error: msg },
    })
    console.error(err)
  }
}

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //

export function* customReportForDistrictSaga() {
  yield all([
    takeLatest(GET_CUSTOM_REPORT_REQUEST, getCustomReportRequest),
    takeEvery(UPDATE_PERMISSION_STATUS_REQUEST, updatePermissionStatusRequest),
    takeEvery(UPDATE_CUSTOM_REPORT_REQUEST, updateCustomReportRequest),
    takeEvery(CREATE_CUSTOM_REPORT_REQUEST, createCustomReportRequest),
    takeLatest(GET_DISTRICT_DATA, getDistrictData),
    takeLatest(SEARCH_SCHOOL_REQUEST, searchSchoolRequest),
  ])
}

export const saga = customReportForDistrictSaga()
