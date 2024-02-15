import { takeEvery, takeLatest, call, put, all } from 'redux-saga/effects'
import { settingsApi } from '@edulastic/api'
import { notification } from '@edulastic/common'
import { createAction, createReducer } from 'redux-starter-kit'

const RECEIVE_DISTRICT_PROFILE_REQUEST =
  '[districtProfile] receive data request'
const RECEIVE_DISTRICT_PROFILE_SUCCESS =
  '[districtProfile] receive data success'
const RECEIVE_DISTRICT_PROFILE_ERROR = '[districtProfile] receive data error'
const UPDATE_DISTRICT_PROFILE_REQUEST = '[districtProfile] update data request'
const UPDATE_DISTRICT_PROFILE_SUCCESS = '[districtProfile] update data success'
const UPDATE_DISTRICT_PROFILE_ERROR = '[districtProfile] update data error'
const CREATE_DISTRICT_PROFILE_REQUEST = '[districtProfile] create data request'
const CREATE_DISTRICT_PROFILE_SUCCESS = '[districtProfile] create data success'
const CREATE_DISTRICT_PROFILE_ERROR = '[districtProfile] create data error'

const SET_DISTRICT_PROFILE_VALUE = '[districtProfile] set data value'
const SET_IMAGE_LOADING_STATUS = '[districtProfile] set image uploading status'

export const receiveDistrictProfileAction = createAction(
  RECEIVE_DISTRICT_PROFILE_REQUEST
)
export const receiveSchoolProfileAction = (schoolId) =>
  receiveDistrictProfileAction({ orgType: 'institution', orgId: schoolId })
export const receiveDistrictProfileSuccessAction = createAction(
  RECEIVE_DISTRICT_PROFILE_SUCCESS
)
export const receiveDistrictProfileErrorAction = createAction(
  RECEIVE_DISTRICT_PROFILE_ERROR
)
export const updateDistrictProfileAction = createAction(
  UPDATE_DISTRICT_PROFILE_REQUEST
)
export const updateDistrictProfileSuccessAction = createAction(
  UPDATE_DISTRICT_PROFILE_SUCCESS
)
export const updateDistrictProfileErrorAction = createAction(
  UPDATE_DISTRICT_PROFILE_ERROR
)
export const createDistrictProfileAction = createAction(
  CREATE_DISTRICT_PROFILE_REQUEST
)
export const createDistrictProfileSuccessAction = createAction(
  CREATE_DISTRICT_PROFILE_SUCCESS
)
export const createDistrictProfileErrorAction = createAction(
  CREATE_DISTRICT_PROFILE_ERROR
)

export const setDistrictValueAction = createAction(SET_DISTRICT_PROFILE_VALUE)
export const setImageUploadingStatusAction = createAction(
  SET_IMAGE_LOADING_STATUS
)

const initialState = {
  data: {},
  error: null,
  loading: false,
  updating: false,
  updateError: null,
  creating: false,
  createError: null,
  imageUploading: false,
}

export const reducer = createReducer(initialState, {
  [RECEIVE_DISTRICT_PROFILE_REQUEST]: (state) => {
    state.loading = true
  },
  [RECEIVE_DISTRICT_PROFILE_SUCCESS]: (state, { payload }) => {
    state.loading = false
    state.data = payload
  },
  [RECEIVE_DISTRICT_PROFILE_ERROR]: (state, { payload }) => {
    state.loading = false
    state.error = payload.error
  },
  [UPDATE_DISTRICT_PROFILE_REQUEST]: (state) => {
    state.updating = true
  },
  [UPDATE_DISTRICT_PROFILE_SUCCESS]: (state, { payload }) => {
    state.updating = false
    state.data = payload
  },
  [UPDATE_DISTRICT_PROFILE_ERROR]: (state, { payload }) => {
    state.updating = false
    state.updateError = payload.error
  },
  [SET_DISTRICT_PROFILE_VALUE]: (state, { payload }) => {
    state.data = { ...payload }
  },
  [CREATE_DISTRICT_PROFILE_REQUEST]: (state) => {
    state.creating = true
  },
  [CREATE_DISTRICT_PROFILE_SUCCESS]: (state, { payload }) => {
    state.creating = false
    state.data = payload
  },
  [CREATE_DISTRICT_PROFILE_ERROR]: (state, { payload }) => {
    state.creating = false
    state.createError = payload.error
  },
  [SET_IMAGE_LOADING_STATUS]: (state, { payload }) => {
    state.imageUploading = payload
  },
})

function* receiveDistrictProfileSaga({ payload }) {
  try {
    const districtProfile = yield call(settingsApi.getDistrictProfile, payload)
    yield put(receiveDistrictProfileSuccessAction(districtProfile))
  } catch (err) {
    const errorMessage = 'Unable to retrieve District profile.'
    notification({ type: 'error', msg: errorMessage })
    yield put(receiveDistrictProfileErrorAction({ error: errorMessage }))
  }
}

function* updateDictrictProfileSaga({ payload }) {
  try {
    const updateDistrictProfile = yield call(
      settingsApi.updateDistrictProfile,
      payload
    )
    yield put(updateDistrictProfileSuccessAction(updateDistrictProfile))
    notification({ type: 'success', messageKey: 'profileChangeSaved' })
  } catch (err) {
    let errorMessage = 'Unable to update District profile.'
    let notificationType = 'error'
    if (err && err.status === 400 && err.response?.data?.message) {
      errorMessage = err.response.data.message
      notificationType = 'warn'
    }
    notification({ type: notificationType, msg: errorMessage })
    yield put(updateDistrictProfileErrorAction({ error: errorMessage }))
  }
}

function* createDictrictProfileSaga({ payload }) {
  try {
    const createdDistrictProfile = yield call(
      settingsApi.createDistrictProfile,
      payload
    )
    yield put(createDistrictProfileSuccessAction(createdDistrictProfile))
    notification({ type: 'success', messageKey: 'profileChangeSaved' })
  } catch (err) {
    const errorMessage = 'Unable to create District profile.'
    notification({ type: 'error', msg: errorMessage })
    yield put(createDistrictProfileErrorAction({ error: errorMessage }))
  }
}

export function* watcherSaga() {
  yield all([
    takeLatest(RECEIVE_DISTRICT_PROFILE_REQUEST, receiveDistrictProfileSaga),
  ])
  yield all([
    takeEvery(UPDATE_DISTRICT_PROFILE_REQUEST, updateDictrictProfileSaga),
  ])
  yield all([
    takeEvery(CREATE_DISTRICT_PROFILE_REQUEST, createDictrictProfileSaga),
  ])
}
