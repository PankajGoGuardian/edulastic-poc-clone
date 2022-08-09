import { createAction, createReducer, createSelector } from 'redux-starter-kit'
import { get, isEmpty, pick } from 'lodash'
import notification from '@edulastic/common/src/components/Notification'
import produce from 'immer'
import { push } from 'connected-react-router'
import { takeLatest, call, put, select } from 'redux-saga/effects'
// import {
//   schoolApi,
//   userApi,
//   settingsApi,
//   TokenStorage,
//   canvasApi,
//   realtimeApi,
// } from '@edulastic/api'
import schoolApi from '@edulastic/api/src/school'
import userApi from '@edulastic/api/src/user'
import segmentApi from '@edulastic/api/src/segment'
import settingsApi from '@edulastic/api/src/settings'
import canvasApi from '@edulastic/api/src/canvas'
import * as TokenStorage from '@edulastic/api/src/utils/Storage'
import { signUpState } from '@edulastic/constants'
import {
  persistAuthStateAndRedirectToAction,
  signupSuccessAction,
  hideJoinSchoolAction,
  fetchUserAction,
  addSchoolSaga,
} from '../Login/ducks'
import { getUser, getUserOrgId } from '../../author/src/selectors/user'

import { userPickFields } from '../../common/utils/static/user'
import { updateInitSearchStateAction } from '../../author/TestPage/components/AddItems/ducks'
import { fetchDashboardTiles } from '../../author/Dashboard/ducks'
import { slice as subscriptionSlice } from '../../author/Subscription/ducks'

// Types
const SEARCH_SCHOOL_REQUEST = '[signup] search school request'
const SEARCH_SCHOOL_SUCCESS = '[signup] search school success'
const SEARCH_SCHOOL_FAILED = '[signup] search school failed'

const SEARCH_SCHOOL_BY_DISTRICT_REQUEST =
  '[signup] search school by district request'
const SEARCH_SCHOOL_BY_DISTRICT_SUCCESS =
  '[signup] search school by district success'
const SEARCH_SCHOOL_BY_DISTRICT_FAILED =
  '[signup] search school by district failed'

const SEARCH_DISTRICTS_REQUEST = '[signup] search districts request'
const SEARCH_DISTRICTS_SUCCESS = '[signup] search districts success'
const SEARCH_DISTRICTS_FAILED = '[signup] search districts failed'

const CREATE_SCHOOL_REQUEST = '[signup] create a school request'
const CREATE_SCHOOL_SUCCESS = '[signup] create a school success'
const CREATE_SCHOOL_FAILED = '[signup] create a school failed'

const JOIN_SCHOOL_REQUEST = '[signup] update with school request'
const JOIN_SCHOOL_SUCCESS = '[signup] update with school success'
const JOIN_SCHOOL_FAILED = '[signup] update with school failed'

const SAVE_SUBJECTGRADE_REQUEST = '[signup] save with subject and grade request'
const SAVE_SUBJECTGRADE_FAILED = '[signup] save with subject and grade failed'
const SAVE_SUBJECTGRADE_RESET =
  '[signup] save with subject and grade reset state'

const CREATE_AND_JOIN_SCHOOL_REQUEST = '[signup] create and join school request'
const CREATE_AND_JOIN_SCHOOL_JOIN_REQUEST =
  '[signup] create and join school join request'
const CREATE_AND_JOIN_SCHOOL_JOIN_SUCCESS =
  '[signup] create and join school join success'

export const GET_DISTRICT_BY_SHORT_NAME_AND_ORG_TYPE_REQUEST =
  '[signup] get district by short name and org type request'
export const GET_DISTRICT_BY_SHORT_NAME_AND_ORG_TYPE_SUCCESS =
  '[signup] get district by short name and org type request success'
export const GET_DISTRICT_BY_SHORT_NAME_AND_ORG_TYPE_FAILED =
  '[signup] get district by short name and org type request failed'

const CHECK_DISTRICT_POLICY_REQUEST = '[signup] check district policy request'
const CHECK_DISTRICT_POLICY_SUCCESS = '[signup] check district policy success'
const CHECK_DISTRICT_POLICY_FAILED = '[signup] check district policy failed'

const FETCH_SCHOOL_TEACHERS_REQUEST = '[signup] fetch school teachers request'
const FETCH_SCHOOL_TEACHERS_SUCCESS = '[signup] fetch school teachers success'
const FETCH_SCHOOL_TEACHERS_FAILED = '[signup] fetch school teachers failed'
const RESET_SCHOOL_TEACHERS = '[signup] reset school teachers'
const SET_SCHOOL_SELECTED_IN_MODAL = '[signup] set school select in modal'
export const SET_SCHOOL_SELECT_WARNING = '[signup] set school select warning'
const SET_DISPLAY_HOME_SCHOOL_BUTTON = '[signup] set display home school button'

const SET_AUTO_SUGGEST_SCHOOLS = '[singup] set auto suggest schools'
const SET_PREVIOUS_AUTO_SUGGEST_SCHOOLS =
  '[signup] set previous auto suggest schools'

const BULK_SYNC_CANVAS_CLASS = '[signup] bulk sync canvas class'
const SET_BULK_SYNC_CANVAS_STATUS = '[signup] set bulk sync canvas status'
const UPDATE_USER_SIGNUP_STATE = '[user] update user signup state'

// Selectors
export const saveSubjectGradeloadingSelector = createSelector(
  ['signup.saveSubjectGradeloading'],
  (subState) => subState
)

export const updateUserWithSchoolLoadingSelector = createSelector(
  ['signup.updateUserWithSchoolLoading'],
  (subState) => subState
)

export const signupDistrictPolicySelector = createSelector(
  ['signup.districtPolicy'],
  (subState) => subState
)

export const signupGeneralSettingsSelector = createSelector(
  ['signup.generalSettings'],
  (subState) => subState
)

// Actions
export const searchSchoolRequestAction = createAction(SEARCH_SCHOOL_REQUEST)
export const searchSchoolSuccessAction = createAction(SEARCH_SCHOOL_SUCCESS)
export const searchSchoolFailedAction = createAction(SEARCH_SCHOOL_FAILED)

export const searchSchoolByDistrictRequestAction = createAction(
  SEARCH_SCHOOL_BY_DISTRICT_REQUEST
)
export const searchSchoolByDistrictSuccessAction = createAction(
  SEARCH_SCHOOL_BY_DISTRICT_SUCCESS
)
export const searchSchoolByDistrictFailedAction = createAction(
  SEARCH_SCHOOL_BY_DISTRICT_FAILED
)

export const searchDistrictsRequestAction = createAction(
  SEARCH_DISTRICTS_REQUEST
)
export const searchDistrictsSuccessAction = createAction(
  SEARCH_DISTRICTS_SUCCESS
)
export const searchDistrictsFailedAction = createAction(SEARCH_DISTRICTS_FAILED)

export const createSchoolRequestAction = createAction(CREATE_SCHOOL_REQUEST)
export const createSchoolSuccessAction = createAction(CREATE_SCHOOL_SUCCESS)
export const createSchoolFailedAction = createAction(CREATE_SCHOOL_FAILED)

export const joinSchoolRequestAction = createAction(JOIN_SCHOOL_REQUEST)

export const saveSubjectGradeAction = createAction(SAVE_SUBJECTGRADE_REQUEST)

export const createAndJoinSchoolRequestAction = createAction(
  CREATE_AND_JOIN_SCHOOL_REQUEST
)
export const getOrgDetailsByShortNameAndOrgTypeAction = createAction(
  GET_DISTRICT_BY_SHORT_NAME_AND_ORG_TYPE_REQUEST
)

export const checkDistrictPolicyRequestAction = createAction(
  CHECK_DISTRICT_POLICY_REQUEST
)
export const checkDistrictPolicySuccessAction = createAction(
  CHECK_DISTRICT_POLICY_SUCCESS
)
export const checkDistrictPolicyFailedAction = createAction(
  CHECK_DISTRICT_POLICY_FAILED
)

export const fetchSchoolTeachersRequestAction = createAction(
  FETCH_SCHOOL_TEACHERS_REQUEST
)
export const resetSchoolTeachersAction = createAction(RESET_SCHOOL_TEACHERS)
export const setSchoolSelectedInModalAction = createAction(
  SET_SCHOOL_SELECTED_IN_MODAL
)
export const setSchoolSelectWarningAction = createAction(
  SET_SCHOOL_SELECT_WARNING
)
export const setDisplayHomeSchoolButtonAction = createAction(
  SET_DISPLAY_HOME_SCHOOL_BUTTON
)

export const setAutoSuggestSchools = createAction(SET_AUTO_SUGGEST_SCHOOLS)
export const setPreviousAutoSuggestSchools = createAction(
  SET_PREVIOUS_AUTO_SUGGEST_SCHOOLS
)

export const bulkSyncCanvasClassAction = createAction(BULK_SYNC_CANVAS_CLASS)
export const setBulkSyncCanvasStateAction = createAction(
  SET_BULK_SYNC_CANVAS_STATUS
)

export const joinSchoolFailedAction = createAction(JOIN_SCHOOL_FAILED)

export const updateUserSignupStateAction = createAction(
  UPDATE_USER_SIGNUP_STATE
)

// Reducers
const initialState = {
  isSearching: false,
  schools: [],
  districts: [],
  newSchool: {},
  saveSubjectGradeloading: false,
  updateUserWithSchoolLoading: false,
  createSchoolRequestPending: false,
  checkingPolicy: false,
  checkDistrictPolicy: true,
  autoSuggestSchools: [],
  bulkSyncCanvasStatus: '',
  schoolSelectedInJoinModal: {},
  displaySchoolSelectWarning: false,
  displayHomeSchoolButton: false,
}

const searchSchool = (state) => {
  state.isSearching = true
}

const receivedSchools = (state, { payload }) => {
  state.isSearching = false
  state.schools = payload
}

const failedSchools = (state) => {
  state.isSearching = false
}

const searchSchoolsByDistrict = (state) => {
  state.isSearching = true
}

const formatSearchedSchoolData = (payload) => {
  if (payload?.data) {
    return payload.data.map((item) => ({
      schoolId: item._id,
      schoolName: item._source.name,
      districtName: get(item, '_source.district.name', ''),
      districtId:
        item._source.districtId || get(item, '_source.district._id', ''),
      address: get(item, '_source.location', {}),
      isApproved: get(item, '_source.isApproved', false),
    }))
  }
  if (payload?.length) {
    return payload
  }
  return []
}

const receivedSchoolsByDistrict = (state, { payload }) => {
  state.isSearching = false
  state.schools = formatSearchedSchoolData(payload)
}

const setAutoSuggestData = (state, { payload }) => {
  state.isSearching = false
  state.autoSuggestSchools = formatSearchedSchoolData(payload)
}

const failedSchoolsByDistrict = (state) => {
  state.isSearching = false
}

const searchDistricts = (state) => {
  state.isSearching = true
}

const receivedDistricts = (state, { payload }) => {
  state.isSearching = false
  state.districts = payload
  state.autocompleteDistricts = payload.map((item) => ({
    title: item.districtName,
    cleverId: item.cleverId,
    key: item.districtId,
  }))
}

const failedDistricts = (state) => {
  state.isSearching = false
}

const createSchoolSuccess = (state, { payload }) => {
  payload = {
    ...payload,
    address: { ...payload.location },
    schoolName: payload.name,
    schoolId: payload._id,
    districtName: payload.district ? payload.district.name : '',
  }

  state.schools.push(payload)
  state.newSchool = payload
  state.createSchoolRequestPending = false
}

const setBulkSyncingStatus = (state, { payload }) => {
  state.bulkSyncCanvasStatus = payload
}

export default createReducer(initialState, {
  [SEARCH_SCHOOL_REQUEST]: searchSchool,
  [SEARCH_SCHOOL_SUCCESS]: receivedSchools,
  [SEARCH_SCHOOL_FAILED]: failedSchools,
  [SEARCH_SCHOOL_BY_DISTRICT_REQUEST]: searchSchoolsByDistrict,
  [SEARCH_SCHOOL_BY_DISTRICT_SUCCESS]: receivedSchoolsByDistrict,
  [SEARCH_SCHOOL_BY_DISTRICT_FAILED]: failedSchoolsByDistrict,
  [SEARCH_DISTRICTS_REQUEST]: searchDistricts,
  [SEARCH_DISTRICTS_SUCCESS]: receivedDistricts,
  [SEARCH_DISTRICTS_FAILED]: failedDistricts,
  [CREATE_AND_JOIN_SCHOOL_REQUEST]: (state) => {
    state.createSchoolRequestPending = true
  },
  [CREATE_AND_JOIN_SCHOOL_JOIN_REQUEST]: (state) => {
    state.updateUserWithSchoolLoading = true
  },
  [CREATE_AND_JOIN_SCHOOL_JOIN_SUCCESS]: (state) => {
    state.updateUserWithSchoolLoading = false
  },
  [CREATE_SCHOOL_REQUEST]: (state) => {
    state.createSchoolRequestPending = true
  },
  [CREATE_SCHOOL_SUCCESS]: createSchoolSuccess,
  [CREATE_SCHOOL_FAILED]: (state) => {
    state.createSchoolRequestPending = false
  },
  [SAVE_SUBJECTGRADE_REQUEST]: (state) => {
    state.saveSubjectGradeloading = true
  },
  [SAVE_SUBJECTGRADE_FAILED]: (state) => {
    state.saveSubjectGradeloading = false
  },
  [SAVE_SUBJECTGRADE_RESET]: (state) => {
    state.saveSubjectGradeloading = false
  },
  [JOIN_SCHOOL_REQUEST]: (state) => {
    state.updateUserWithSchoolLoading = true
  },
  [JOIN_SCHOOL_SUCCESS]: (state) => {
    state.updateUserWithSchoolLoading = false
  },
  [JOIN_SCHOOL_FAILED]: (state) => {
    state.updateUserWithSchoolLoading = false
  },
  [GET_DISTRICT_BY_SHORT_NAME_AND_ORG_TYPE_REQUEST]: (state) => {
    state.districtUrlLoading = true
    state.generalSettings = undefined
    state.districtPolicy = undefined
  },
  [GET_DISTRICT_BY_SHORT_NAME_AND_ORG_TYPE_SUCCESS]: (state, { payload }) => {
    state.districtUrlLoading = false
    state.generalSettings = payload.generalSettings
    state.districtPolicy = payload.districtPolicy
  },
  [GET_DISTRICT_BY_SHORT_NAME_AND_ORG_TYPE_FAILED]: (state) => {
    state.districtUrlLoading = false
    state.generalSettings = undefined
    state.districtPolicy = undefined
  },
  [CHECK_DISTRICT_POLICY_REQUEST]: (state) => {
    state.checkingPolicy = true
  },
  [CHECK_DISTRICT_POLICY_SUCCESS]: (state, { payload }) => {
    state.checkingPolicy = false
    state.checkDistrictPolicy = payload
  },
  [CHECK_DISTRICT_POLICY_FAILED]: (state) => {
    state.checkingPolicy = false
    state.checkDistrictPolicy = {}
  },
  [FETCH_SCHOOL_TEACHERS_REQUEST]: (state) => {
    state.schoolTeachers = []
  },
  [FETCH_SCHOOL_TEACHERS_SUCCESS]: (state, { payload }) => {
    state.schoolTeachers = get(payload, 'result.data', [])
  },
  [FETCH_SCHOOL_TEACHERS_FAILED]: (state) => {
    state.schoolTeachers = []
  },
  [SET_AUTO_SUGGEST_SCHOOLS]: setAutoSuggestData,
  [SET_PREVIOUS_AUTO_SUGGEST_SCHOOLS]: (state) => {
    state.schools = [...state.autoSuggestSchools]
  },
  [SET_BULK_SYNC_CANVAS_STATUS]: setBulkSyncingStatus,
  [RESET_SCHOOL_TEACHERS]: (state) => {
    state.schoolTeachers = []
  },
  [SET_SCHOOL_SELECTED_IN_MODAL]: (state, { payload }) => {
    state.schoolSelectedInJoinModal = payload
  },
  [SET_SCHOOL_SELECT_WARNING]: (state, { payload }) => {
    state.displaySchoolSelectWarning = payload
  },
  [SET_DISPLAY_HOME_SCHOOL_BUTTON]: (state, { payload }) => {
    state.displayHomeSchoolButton = payload
  },
})

// Sagas
function* searchSchoolSaga({ payload = {} }) {
  try {
    const result = yield call(schoolApi.searchSchool, payload)
    yield put(searchSchoolSuccessAction(result))
    // check if no search text is passed
    // consider the result as auto suggest content
    if (!payload?.searchText) {
      yield put(setAutoSuggestSchools(result))
    }
  } catch (err) {
    console.error(err)
    yield put(searchSchoolFailedAction())
  }
}

function* searchSchoolByDistricySaga({ payload = {} }) {
  try {
    const result = yield call(schoolApi.getSchools, payload)
    yield put(searchSchoolByDistrictSuccessAction(result))
    // check if no search text is passed
    // consider the result as auto suggest content
    if (!payload?.search?.name) {
      yield put(setAutoSuggestSchools(result))
    }
  } catch (err) {
    console.error(err)
    yield put(searchSchoolByDistrictFailedAction())
  }
}

function* searchDistrictsSaga({ payload = {} }) {
  try {
    const result = yield call(schoolApi.searchDistricts, payload)
    const districts = get(result, 'data.result', [])
    yield put(searchDistrictsSuccessAction(districts))
  } catch (err) {
    console.error(err)
    yield put(searchDistrictsFailedAction())
  }
}

function* createSchoolSaga({ payload = {} }) {
  try {
    const result = yield call(schoolApi.createSchool, payload)
    yield put(createSchoolSuccessAction(result))
  } catch (err) {
    console.error(err)
    yield put(createSchoolFailedAction())
  }
}

function* createAndJoinSchoolSaga({ payload = {} }) {
  const createSchoolPayload = payload.createSchool
  const joinSchoolPayload = payload.joinSchool
  const { setSchoolInJoinSchoolModal = false, onSuccessHandler } = payload
  let isCreateSchoolSuccessful = false
  let result
  try {
    result = yield call(schoolApi.createSchool, createSchoolPayload)
    yield put(createSchoolSuccessAction(result))
    isCreateSchoolSuccessful = true
  } catch (err) {
    console.log('err', err)
    yield put(createSchoolFailedAction())
    notification({
      msg: get(err, 'data.result.message', '') || 'Failed to create school',
    })
  }

  try {
    if (isCreateSchoolSuccessful) {
      yield put({ type: CREATE_AND_JOIN_SCHOOL_JOIN_REQUEST })

      joinSchoolPayload.data = {
        ...joinSchoolPayload.data,
        institutionIds: [result._id],
        districtId: result.districtId,
      }
      const _result = yield call(userApi.updateUser, joinSchoolPayload)
      if (_result && _result.token) {
        TokenStorage.storeAccessToken(
          _result.token,
          _result._id,
          _result.role,
          true
        )
        TokenStorage.selectAccessToken(_result._id, _result.role)
      }
      const user = pick(_result, userPickFields)
      yield put({ type: CREATE_AND_JOIN_SCHOOL_JOIN_SUCCESS })
      yield put(signupSuccessAction(user))
      if (setSchoolInJoinSchoolModal) {
        onSuccessHandler(createSchoolPayload)
      }
      yield call(segmentApi.trackTeacherSignUp, { user: result })
      window.localStorage.setItem('author:dashboard:version', 0)
      yield put(hideJoinSchoolAction())
      yield put(fetchDashboardTiles())
      yield put(subscriptionSlice.actions.fetchUserSubscriptionStatus())
    }
  } catch (err) {
    console.log('_err', err)
    yield put({
      type: JOIN_SCHOOL_FAILED,
    })
    notification({ msg: JOIN_SCHOOL_FAILED })
  }
}

function* joinSchoolSaga({ payload = {} }) {
  try {
    const result = yield call(userApi.updateUser, payload)
    if (result && result.token) {
      TokenStorage.storeAccessToken(result.token, result._id, result.role, true)
      TokenStorage.selectAccessToken(result._id, result.role)
    }
    const user = pick(result, userPickFields)
    yield put(signupSuccessAction(user))
    yield put({ type: JOIN_SCHOOL_SUCCESS })
    yield call(segmentApi.trackTeacherSignUp, { user: result })
    window.localStorage.setItem('author:dashboard:version', 0)
    yield put(hideJoinSchoolAction())
    yield put(fetchDashboardTiles())
    yield put(subscriptionSlice.actions.fetchUserSubscriptionStatus())
  } catch (err) {
    yield put({
      type: JOIN_SCHOOL_FAILED,
      payload: {},
    })
    notification({ msg: JOIN_SCHOOL_FAILED })
  }
}

function* updateUserSignupStateSaga({ payload = {} } = {}) {
  try {
    const user = yield select(getUser)
    const districtId = yield select(getUserOrgId)
    if (
      (!isEmpty(user.orgData.districtIds) &&
        !isEmpty(user.orgData.defaultGrades) &&
        !isEmpty(user.orgData.defaultSubjects)) ||
      payload?.isSignupDone
    ) {
      const data = {
        email: user.email,
        districtId,
        currentSignUpState: 'DONE',
        institutionIds: user.orgData.institutionIds,
      }
      const _result = yield call(userApi.updateUser, {
        data,
        userId: user._id,
      })
      const finalUser = {
        ..._result,
        features: user.features,
      }
      // setting user in store to put updated currentSignupState in store
      yield put(signupSuccessAction(finalUser))
      yield call(segmentApi.trackTeacherSignUp, { user: finalUser })
    } else {
      // call user/me to update user in store
      yield put(fetchUserAction({ background: true }))
    }
  } catch (err) {
    console.log('_err', err)
    notification({ messageKey: 'failedToUpdateUser' })
  }
}

function* saveSubjectGradeSaga({ payload: _payload }) {
  const {
    isTestRecommendationCustomizer,
    setShowTestCustomizerModal,
    onSuccessCallback,
    schoolSelectedFromDropdown,
    schoolData,
    addSchoolFlow,
    ...payload
  } = _payload
  let isSaveSubjectGradeSuccessful = false
  const initialUser = yield select(getUser)
  try {
    if (schoolSelectedFromDropdown) {
      const schoolPayload = {
        data: schoolData,
        userId: payload.orgId,
      }
      addSchoolFlow
        ? yield call(addSchoolSaga, {
            payload: schoolPayload,
          })
        : yield call(joinSchoolSaga, {
            payload: schoolPayload,
          })
    }
    const result = yield call(settingsApi.saveInterestedStandards, payload) ||
      {}
    isSaveSubjectGradeSuccessful = true
    const user = yield select(getUser)
    const newUser = produce(user, (draft) => {
      if (!draft.orgData) {
        draft.orgData = {}
      }
      draft.orgData.interestedCurriculums = result ? result.curriculums : []
      draft.orgData.defaultSubjects = result?.defaultSubjects || []
      draft.orgData.defaultGrades = result?.defaultGrades || []
      return draft
    })
    // setting user in store to put orgData in store
    yield put(signupSuccessAction(newUser))
    yield call(segmentApi.trackTeacherSignUp, { user: result })
    yield put(
      updateInitSearchStateAction({
        grades: result?.defaultGrades,
        subject: result?.defaultSubjects,
      })
    )
  } catch (err) {
    yield put({
      type: SAVE_SUBJECTGRADE_FAILED,
      payload: {},
    })
    notification({ msg: SAVE_SUBJECTGRADE_FAILED })

    const errMsg = get(err, 'data.message', '')
    if (errMsg === 'Settings already exist') {
      isSaveSubjectGradeSuccessful = true
    }
  }

  if (isSaveSubjectGradeSuccessful) {
    yield* updateUserSignupStateSaga()
    notification({
      msg: isTestRecommendationCustomizer
        ? 'Update under process. We will notify shortly once done.'
        : 'Sign up completed.',
      type: 'success',
    })
    window.localStorage.setItem('author:dashboard:version', 0)
    yield put(fetchDashboardTiles())
    if (isTestRecommendationCustomizer) {
      setShowTestCustomizerModal(false)
    }
    if (onSuccessCallback) {
      onSuccessCallback()
    }
  }

  if (!isTestRecommendationCustomizer) {
    // If user has signUpState ACCESS_WITHOUT_SCHOOL, it means he is already accessing in-session app
    if (
      initialUser.currentSignUpState &&
      initialUser.currentSignUpState !== signUpState.ACCESS_WITHOUT_SCHOOL &&
      initialUser.currentSignUpState !== signUpState.SCHOOL_NOT_SELECTED
    ) {
      yield put(persistAuthStateAndRedirectToAction())
    }
  }

  yield put({
    type: SAVE_SUBJECTGRADE_RESET,
    payload: {},
  })
}

function* getOrgDetailsByShortNameAndOrgTypeSaga({ payload }) {
  try {
    const result = yield call(
      settingsApi.getOrgDetailsByShortNameAndOrgType,
      payload.data
    )
    const { generalSettings, districtPolicy } = result

    if (generalSettings && districtPolicy) {
      yield put({
        type: GET_DISTRICT_BY_SHORT_NAME_AND_ORG_TYPE_SUCCESS,
        payload: { generalSettings, districtPolicy },
      })
      if (generalSettings.orgType === 'district') {
        const [, districtLogin] = window.location.pathname?.split('/')
        yield put(
          push(
            `/${districtLogin || 'districtLogin'}/${generalSettings.shortName}`
          )
        )
      }
    } else {
      throw payload.error.message
    }
  } catch (e) {
    console.log('error getting data', e)
    yield put({
      type: GET_DISTRICT_BY_SHORT_NAME_AND_ORG_TYPE_FAILED,
    })
  }
}

function* checkDistrictPolicyRequestSaga({ payload }) {
  try {
    const result = yield call(userApi.validateDistrictPolicy, payload.data)
    yield put(checkDistrictPolicySuccessAction(result))
  } catch (e) {
    console.log('e', e)
    yield put(checkDistrictPolicyFailedAction())
    yield put(setSchoolSelectWarningAction(true))
    notification({ msg: payload.error.message })
  }
}

function* fetchSchoolTeachersSaga({ payload }) {
  try {
    const result = yield call(userApi.fetchUsersForShare, payload)
    yield put({ type: FETCH_SCHOOL_TEACHERS_SUCCESS, payload: result })
  } catch (e) {
    console.log('e', e)
    yield put({ type: FETCH_SCHOOL_TEACHERS_FAILED })
  }
}

function* bulkSyncCanvasClassSaga({ payload }) {
  try {
    yield put(setBulkSyncCanvasStateAction('INPROGRESS'))
    yield call(canvasApi.bulkSync, payload)
  } catch (err) {
    console.error(err)
    notification({ messageKey: 'bulkSyncFailed' })
    yield put(setBulkSyncCanvasStateAction('FAILED'))
  }
}

export function* watcherSaga() {
  yield takeLatest(SEARCH_SCHOOL_REQUEST, searchSchoolSaga)
  yield takeLatest(
    SEARCH_SCHOOL_BY_DISTRICT_REQUEST,
    searchSchoolByDistricySaga
  )
  yield takeLatest(SEARCH_DISTRICTS_REQUEST, searchDistrictsSaga)
  yield takeLatest(CREATE_SCHOOL_REQUEST, createSchoolSaga)
  yield takeLatest(JOIN_SCHOOL_REQUEST, joinSchoolSaga)
  yield takeLatest(SAVE_SUBJECTGRADE_REQUEST, saveSubjectGradeSaga)
  yield takeLatest(CREATE_AND_JOIN_SCHOOL_REQUEST, createAndJoinSchoolSaga)
  yield takeLatest(
    GET_DISTRICT_BY_SHORT_NAME_AND_ORG_TYPE_REQUEST,
    getOrgDetailsByShortNameAndOrgTypeSaga
  )
  yield takeLatest(
    CHECK_DISTRICT_POLICY_REQUEST,
    checkDistrictPolicyRequestSaga
  )
  yield takeLatest(FETCH_SCHOOL_TEACHERS_REQUEST, fetchSchoolTeachersSaga)
  yield takeLatest(BULK_SYNC_CANVAS_CLASS, bulkSyncCanvasClassSaga)
  yield takeLatest(UPDATE_USER_SIGNUP_STATE, updateUserSignupStateSaga)
}
