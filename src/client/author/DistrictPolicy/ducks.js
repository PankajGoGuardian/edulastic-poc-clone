import { createAction, createReducer } from 'redux-starter-kit'
import { takeEvery, call, put, all } from 'redux-saga/effects'
import { settingsApi } from '@edulastic/api'
import { notification } from '@edulastic/common'
import { get } from 'lodash'
import { createSelector } from 'reselect'
import { getUserRole } from '../src/selectors/user'

// action types
const RECEIVE_DISTRICT_POLICY_REQUEST = '[district policy] receive data request'
const RECEIVE_DISTRICT_POLICY_SUCCESS = '[district policy] receive data success'
const RECEIVE_DISTRICT_POLICY_ERROR = '[district policy] receive data error'
const UPDATE_DISTRICT_POLICY_REQUEST = '[district policy] update data request'
const UPDATE_DISTRICT_POLICY_SUCCESS = '[district policy] update data success'
const UPDATE_DISTRICT_POLICY_ERROR = '[district policy] update data error'
const CREATE_DISTRICT_POLICY_REQUEST = '[district policy] create data request'
const CREATE_DISTRICT_POLICY_SUCCESS = '[district policy] create data success'
const CREATE_DISTRICT_POLICY_ERROR = '[district policy] create data error'
const SET_SCHOOL_ADMIN_SETTINGS_ACCESS =
  '[district policy] set school admin settings access'

const CHANGE_DISTRICT_POLICY_ACTION = '[district policy] save changed data'
const SAVE_CANVAS_INTEGRATION_KEYS_REQUEST =
  '[district policy] save canvas integration keys request'

export const receiveDistrictPolicyAction = createAction(
  RECEIVE_DISTRICT_POLICY_REQUEST
)
export const receiveSchoolPolicyAction = (schoolId) =>
  receiveDistrictPolicyAction({ orgType: 'institution', orgId: schoolId })
export const receiveDistrictPolicySuccessAction = createAction(
  RECEIVE_DISTRICT_POLICY_SUCCESS
)
export const receiveDistrictPolicyErrorAction = createAction(
  RECEIVE_DISTRICT_POLICY_ERROR
)
export const updateDistrictPolicyAction = createAction(
  UPDATE_DISTRICT_POLICY_REQUEST
)
export const updateDistrictPolicySuccessAction = createAction(
  UPDATE_DISTRICT_POLICY_SUCCESS
)
export const updateDistrictPolicyErrorAction = createAction(
  UPDATE_DISTRICT_POLICY_ERROR
)
export const createDistrictPolicyAction = createAction(
  CREATE_DISTRICT_POLICY_REQUEST
)
export const createDistrictPolicySuccessAction = createAction(
  CREATE_DISTRICT_POLICY_SUCCESS
)
export const createDistrictPolicyErrorAction = createAction(
  CREATE_DISTRICT_POLICY_ERROR
)

export const changeDistrictPolicyAction = createAction(
  CHANGE_DISTRICT_POLICY_ACTION
)

export const saveCanvasKeysRequestAction = createAction(
  SAVE_CANVAS_INTEGRATION_KEYS_REQUEST
)
export const setSchoolAdminSettingsAccessAction = createAction(
  SET_SCHOOL_ADMIN_SETTINGS_ACCESS
)

// reducers
const initialState = {
  data: {},
  error: null,
  loading: false,
  updating: false,
  update: null,
  updateError: null,
  creating: false,
  createError: null,
  userNameAndPassword: true,
  googleSignOn: true,
  office365SignOn: true,
  cleverSignOn: true,

  teacherSignUp: true,
  studentSignUp: true,

  searchAndAddStudents: false,

  googleUsernames: true,
  office365Usernames: true,
  firstNameAndLastName: true,

  allowedDomainForStudents: '',
  allowedDomainForTeachers: '',
  allowedDomainsForDistrict: '',

  canvas: false,

  schoolAdminSettingsAccess: false,
}

export const reducer = createReducer(initialState, {
  [RECEIVE_DISTRICT_POLICY_REQUEST]: (state) => {
    state.loading = true
  },
  [RECEIVE_DISTRICT_POLICY_SUCCESS]: (state, { payload: _payload }) => {
    const { schoolLevel, ...payload } = _payload
    state.loading = false
    state[schoolLevel ? 'schoolData' : 'data'] = {
      ...payload,
      allowedDomainForStudents: get(
        payload,
        ['allowedDomainForStudents'],
        ''
      ).toString(),
      allowedDomainForTeachers: get(
        payload,
        ['allowedDomainForTeachers'],
        ''
      ).toString(),
      allowedDomainsForDistrict: get(
        payload,
        ['allowedDomainsForDistrict'],
        ''
      ).toString(),
    }
  },
  [RECEIVE_DISTRICT_POLICY_ERROR]: (state, { payload }) => {
    state.loading = false
    state.error = payload.error
  },
  [UPDATE_DISTRICT_POLICY_REQUEST]: (state) => {
    state.updating = true
  },
  [UPDATE_DISTRICT_POLICY_SUCCESS]: (state, { payload }) => {
    state.updating = false
    state[payload.orgType === 'institution' ? 'schoolData' : 'data'] = {
      ...payload,
      allowedDomainForStudents: get(
        payload,
        ['allowedDomainForStudents'],
        ''
      ).toString(),
      allowedDomainForTeachers: get(
        payload,
        ['allowedDomainForTeachers'],
        ''
      ).toString(),
      allowedDomainsForDistrict: get(
        payload,
        ['allowedDomainsForDistrict'],
        ''
      ).toString(),
    }
  },
  [UPDATE_DISTRICT_POLICY_ERROR]: (state, { payload }) => {
    state.updating = false
    state.updateError = payload.error
  },
  [CREATE_DISTRICT_POLICY_REQUEST]: (state) => {
    state.creating = true
  },
  [CREATE_DISTRICT_POLICY_SUCCESS]: (state, { payload }) => {
    state.creating = false
    state.data = {
      ...payload,
      allowedDomainForStudents: payload.allowedDomainForStudents.toString(),
      allowedDomainForTeachers: payload.allowedDomainForTeachers.toString(),
      allowedDomainsForDistrict: payload.allowedDomainsForDistrict.toString(),
    }
  },
  [CREATE_DISTRICT_POLICY_ERROR]: (state, { payload }) => {
    state.creating = false
    state.createError = payload.error
  },
  [CHANGE_DISTRICT_POLICY_ACTION]: (state, { payload }) => {
    const { schoolLevel, ...data } = payload
    if (schoolLevel) {
      state.schoolData = data
    } else {
      state.data = data
    }
  },
  [SET_SCHOOL_ADMIN_SETTINGS_ACCESS]: (state, { payload }) => {
    state.schoolAdminSettingsAccess = payload
  },
})

// saga
function* receiveDistrictPolicySaga({ payload }) {
  try {
    const schoolLevel = payload.orgType === 'institution'
    const districtPolicy = yield call(settingsApi.getDistrictPolicy, payload)
    yield put(
      receiveDistrictPolicySuccessAction({ ...districtPolicy, schoolLevel })
    )
  } catch (err) {
    const errorMessage = 'Unable to retrieve District policy.'
    notification({ type: 'error', msg: errorMessage })

    yield put(receiveDistrictPolicyErrorAction({ error: errorMessage }))
  }
}

function* updateDictrictPolicySaga({ payload }) {
  try {
    const updateDistrictPolicy = yield call(
      settingsApi.updateDistrictPolicy,
      payload
    )
    notification({ type: 'success', messageKey: 'SavedSuccessfully' })
    yield put(updateDistrictPolicySuccessAction({ ...updateDistrictPolicy }))
  } catch (err) {
    const errorMessage = 'Unable to update District policy.'
    notification({ type: 'error', msg: errorMessage })
    yield put(updateDistrictPolicyErrorAction({ error: errorMessage }))
  }
}

function* createDictrictPolicySaga({ payload }) {
  try {
    const createDistrictPolicy = yield call(
      settingsApi.createDistrictPolicy,
      payload
    )
    yield put(createDistrictPolicySuccessAction(createDistrictPolicy))
  } catch (err) {
    const errorMessage = 'Unable to create District policy.'
    notification({ type: 'error', msg: errorMessage })
    yield put(createDistrictPolicyErrorAction({ error: errorMessage }))
  }
}

function* saveCanvasKeysRequestSaga({ payload }) {
  try {
    const result = yield call(settingsApi.saveCanvasIntegrationKeys, payload)
    yield put(updateDistrictPolicySuccessAction(result))
    notification({
      type: 'success',
      msg: 'Canvas Integration keys saved successfully',
    })
  } catch (err) {
    const notificationData = {
      type: 'error',
      msg:
        err?.response?.data?.message ||
        'Unable to save Canvas Integration keys',
    }
    if (err?.response?.data?.statusCode === 403) {
      Object.assign(notificationData, {
        exact: true,
      })
    }
    notification(notificationData)
  }
}

export function* watcherSaga() {
  yield all([
    yield takeEvery(RECEIVE_DISTRICT_POLICY_REQUEST, receiveDistrictPolicySaga),
  ])
  yield all([
    yield takeEvery(UPDATE_DISTRICT_POLICY_REQUEST, updateDictrictPolicySaga),
  ])
  yield all([
    yield takeEvery(CREATE_DISTRICT_POLICY_REQUEST, createDictrictPolicySaga),
  ])
  yield all([
    yield takeEvery(
      SAVE_CANVAS_INTEGRATION_KEYS_REQUEST,
      saveCanvasKeysRequestSaga
    ),
  ])
}

export const getSchoolPolicy = (state) =>
  get(state, ['districtPolicyReducer', 'schoolData'], [])
export const getDistrictPolicy = (state) =>
  get(state, ['districtPolicyReducer', 'data'], [])

export const getPolicies = createSelector(
  getUserRole,
  getSchoolPolicy,
  getDistrictPolicy,
  (role, schoolPolicy = {}, districtPolicy = {}) =>
    role === 'school-admin' ? schoolPolicy : districtPolicy
)

export const getSchoolAdminSettingsAccess = createSelector(
  getPolicies,
  (state) => state.schoolAdminSettingsAccess
)

export const getEnableOneRosterSync = createSelector(
  getDistrictPolicy,
  (state) => state.enableOneRosterSync || false
)
