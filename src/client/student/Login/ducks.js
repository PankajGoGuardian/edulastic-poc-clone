import { createAction, createReducer, createSelector } from 'redux-starter-kit'
import { pick, last, get, set } from 'lodash'
import { takeLatest, call, put, select } from 'redux-saga/effects'
import { message } from 'antd'
import { captureSentryException, notification } from '@edulastic/common'
import { push } from 'connected-react-router'
import {
  authApi,
  userApi,
  TokenStorage,
  settingsApi,
  segmentApi,
  schoolApi,
} from '@edulastic/api'
import { roleuser } from '@edulastic/constants'
import firebase from 'firebase/app'
import * as Sentry from '@sentry/browser'
import { fetchAssignmentsAction } from '../Assignments/ducks'
import {
  receiveLastPlayListAction,
  receiveRecentPlayListsAction,
} from '../../author/Playlist/ducks'
import {
  getWordsInURLPathName,
  getDistrictSignOutUrl,
  setSignOutUrl,
  getSignOutUrl,
  removeSignOutUrl,
  getStartedUrl,
} from '../../common/utils/helpers'
import { userPickFields } from '../../common/utils/static/user'
import {
  signupDistrictPolicySelector,
  signupGeneralSettingsSelector,
} from '../Signup/duck'
import { getUser } from '../../author/src/selectors/user'
import { updateInitSearchStateAction } from '../../author/TestPage/components/AddItems/ducks'
import { JOIN_CLASS_REQUEST_SUCCESS } from '../ManageClass/ducks'
import 'firebase/auth'
import {
  addLoadingComponentAction,
  removeLoadingComponentAction,
} from '../../author/src/actions/authorUi'

// types
export const LOGIN = '[auth] login'
export const GOOGLE_LOGIN = '[auth] google login'
export const CLEVER_LOGIN = '[auth] clever login'
export const ATLAS_LOGIN = '[auth] atlas login'
export const MSO_LOGIN = '[auth] mso login'
export const GOOGLE_SSO_LOGIN = '[auth] google sso login'
export const CLEVER_SSO_LOGIN = '[auth] clever sso login'
export const MSO_SSO_LOGIN = '[auth] mso sso login'
export const ATLAS_SSO_LOGIN = '[auth] atlas sso login'
export const GET_USER_DATA = '[auth] get user data from sso response'
export const SET_USER = '[auth] set user'
export const SIGNUP = '[auth] signup'
export const SINGUP_SUCCESS = '[auth] signup success'
export const FETCH_USER = '[auth] fetch user'
export const FETCH_USER_FAILURE = '[auth] fetch user failure'
export const FETCH_V1_REDIRECT = '[v1 redirect] fetch'
export const LOGOUT = '[auth] logout'
export const CHANGE_CLASS = '[student] change class'
export const CHANGE_CHILD = '[parent] change child'
export const LOAD_SKILL_REPORT_BY_CLASSID =
  '[reports] load skill report by class id'
export const UPDATE_USER_ROLE_REQUEST = '[auth] update user role request'
export const SET_USER_GOOGLE_LOGGED_IN = '[auth] set user google logged in'
export const UPDATE_PROFILE_IMAGE_PATH_REQUEST =
  '[user] update profile image path'
export const UPDATE_PROFILE_IMAGE_PATH_SUCCESS =
  '[user] update profile image path success'
export const UPDATE_PROFILE_IMAGE_PATH_FAILED =
  '[user] update profile image path failed'

export const REQUEST_NEW_PASSWORD_REQUEST =
  '[auth] request new password request'
export const REQUEST_NEW_PASSWORD_RESET_CONTROL =
  '[auth] request new password reset control'
export const REQUEST_NEW_PASSWORD_FAILED = '[auth] request new password failed'
export const REQUEST_NEW_PASSWORD_SUCCESS =
  '[auth] request new password success'
export const RESET_PASSWORD_USER_REQUEST = '[auth] reset password user request'
export const RESET_PASSWORD_USER_SUCCESS = '[auth] reset password user success'
export const RESET_PASSWORD_REQUEST = '[auth] reset password request'
export const RESET_PASSWORD_FAILED = '[auth] reset password failed'
export const RESET_PASSWORD_SUCCESS = '[auth] reset password success'
export const STUDENT_SIGNUP_CHECK_CLASSCODE_REQUEST =
  '[auth] student signup check classcode request'
export const UPDATE_DEFAULT_GRADES = '[user] update default grades'
export const UPDATE_DEFAULT_SUBJECT = '[user] update default subject'
export const GET_INVITE_DETAILS_REQUEST = '[auth] get invite details request'
export const GET_INVITE_DETAILS_SUCCESS = '[auth] get invite details success'
export const SET_INVITE_DETAILS_REQUEST = '[auth] set invite details request'
export const SET_INVITE_DETAILS_SUCCESS = '[auth] set invite details success'
export const RESET_MY_PASSWORD_REQUEST = '[auth] reset my password request'
export const RESET_MY_PASSWORD_FAILED = '[auth] reset my password failed'
export const RESET_MY_PASSWORD_SUCCESS = '[auth] reset my password success'
export const UPDATE_USER_DETAILS_REQUEST = '[user] update user details'
export const UPDATE_USER_DETAILS_SUCCESS = '[user] update user details success'
export const UPDATE_USER_DETAILS_FAILED = '[user] update user details failed'
export const DELETE_ACCOUNT_REQUEST = '[auth] delete account'
export const UPDATE_INTERESTED_CURRICULUMS_REQUEST =
  '[user] update interested curriculums request'
export const UPDATE_INTERESTED_CURRICULUMS_SUCCESS =
  '[user] update interested curriculums success'
export const UPDATE_INTERESTED_CURRICULUMS_FAILED =
  '[user] update interested curriculums failed'
export const REMOVE_SCHOOL_REQUEST = '[user] remove school request'
export const REMOVE_SCHOOL_SUCCESS = '[user] remove school success'
export const REMOVE_SCHOOL_FAILED = '[user] remove school failed'
export const ADD_SCHOOL_REQUEST = '[user] add school request'
export const ADD_SCHOOL_SUCCESS = '[user] add school success'
export const ADD_SCHOOL_FAILED = '[user] add school failed'
export const CREATE_AND_ADD_SCHOOL_REQUEST =
  '[user] create and add school request'
export const CREATE_AND_ADD_SCHOOL_SUCCESS =
  '[user] create and add school success'
export const CREATE_AND_ADD_SCHOOL_FAILED =
  '[user] create and add school failed'
export const SHOW_JOIN_SCHOOL = '[user] show join school'
export const HIDE_JOIN_SCHOOL = '[user] hide join school'
export const REMOVE_INTERESTED_CURRICULUMS_REQUEST =
  '[user] remove interested curriculums request'
export const GET_CURRENT_DISTRICT_USERS_REQUEST =
  '[user] get current district users request'
export const GET_CURRENT_DISTRICT_USERS_SUCCESS =
  '[user] get current district users success'

export const UPDATE_DEFAULT_SETTINGS_REQUEST =
  '[user] update default settings request'
export const UPDATE_DEFAULT_SETTINGS_SUCCESS =
  '[user] update default settings success'
export const UPDATE_DEFAULT_SETTINGS_FAILED =
  '[user] update default settings failed'

export const SET_SETTINGS_SA_SCHOOL = '[user] set sa settings school'
export const SET_SIGNUP_STATUS = '[user] set signup status'
export const UPDATE_POWER_TEACHER_TOOLS_REQUEST =
  '[user] update power teacher permission request'
export const UPDATE_POWER_TEACHER_TOOLS_SUCCESS =
  '[user] update power teacher permission success'
export const UPDATE_POWER_TEACHER_TOOLS_FAILED =
  '[user] update power teacher permission failed'
export const FETCH_USER_FAVORITES = '[user] fetch user favorites'
export const UPDATE_USER_FAVORITES = '[user] update user favorites'
export const SET_USER_FAVORITES = '[user] set user favorites'
export const ADD_CLASS_TO_USER = '[user] add class to user'
export const ADD_COLLECTION_PERMISSION = '[user] update item bank permission'
export const REMOVE_COLLECTION_PERMISSION = '[user] remove item bank permission'
export const SET_CLI_USER = '[user] set cli user'
export const TOGGLE_CLASS_CODE_MODAL = '[user] toggle class code modal'
export const TOGGLE_IMAGES_BLOCKED_NOTIFICATION =
  '[user] toggle images blocked notification'

// actions
export const setSettingsSaSchoolAction = createAction(SET_SETTINGS_SA_SCHOOL)
export const loginAction = createAction(LOGIN)
export const googleLoginAction = createAction(GOOGLE_LOGIN)
export const cleverLoginAction = createAction(CLEVER_LOGIN)
export const atlasLoginAction = createAction(ATLAS_LOGIN)
export const msoLoginAction = createAction(MSO_LOGIN)
export const googleSSOLoginAction = createAction(GOOGLE_SSO_LOGIN)
export const cleverSSOLoginAction = createAction(CLEVER_SSO_LOGIN)
export const atlasSSOLoginAction = createAction(ATLAS_SSO_LOGIN)
export const getUserDataAction = createAction(GET_USER_DATA)
export const msoSSOLoginAction = createAction(MSO_SSO_LOGIN)
export const setUserAction = createAction(SET_USER)
export const signupAction = createAction(SIGNUP)
export const signupSuccessAction = createAction(SINGUP_SUCCESS)
export const fetchUserAction = createAction(FETCH_USER)
export const fetchV1RedirectAction = createAction(FETCH_V1_REDIRECT)
export const logoutAction = createAction(LOGOUT)
export const changeClassAction = createAction(CHANGE_CLASS)
export const setUserGoogleLoggedInAction = createAction(
  SET_USER_GOOGLE_LOGGED_IN
)
export const updateUserRoleAction = createAction(UPDATE_USER_ROLE_REQUEST)
export const requestNewPasswordAction = createAction(
  REQUEST_NEW_PASSWORD_REQUEST
)
export const requestNewPasswordResetControlAction = createAction(
  REQUEST_NEW_PASSWORD_RESET_CONTROL
)
export const resetPasswordUserAction = createAction(RESET_PASSWORD_USER_REQUEST)
export const resetPasswordAction = createAction(RESET_PASSWORD_REQUEST)
export const studentSignupCheckClasscodeAction = createAction(
  STUDENT_SIGNUP_CHECK_CLASSCODE_REQUEST
)
export const updateDefaultSubjectAction = createAction(UPDATE_DEFAULT_SUBJECT)
export const updateDefaultGradesAction = createAction(UPDATE_DEFAULT_GRADES)
export const getInviteDetailsAction = createAction(GET_INVITE_DETAILS_REQUEST)
export const setInviteDetailsAction = createAction(SET_INVITE_DETAILS_REQUEST)
export const resetMyPasswordAction = createAction(RESET_MY_PASSWORD_REQUEST)
export const updateProfileImageAction = createAction(
  UPDATE_PROFILE_IMAGE_PATH_REQUEST
)
export const updateUserDetailsAction = createAction(UPDATE_USER_DETAILS_REQUEST)
export const deleteAccountAction = createAction(DELETE_ACCOUNT_REQUEST)
export const updateInterestedCurriculumsAction = createAction(
  UPDATE_INTERESTED_CURRICULUMS_REQUEST
)
export const removeSchoolAction = createAction(REMOVE_SCHOOL_REQUEST)
export const addSchoolAction = createAction(ADD_SCHOOL_REQUEST)
export const createAndAddSchoolAction = createAction(
  CREATE_AND_ADD_SCHOOL_REQUEST
)
export const showJoinSchoolAction = createAction(SHOW_JOIN_SCHOOL)
export const hideJoinSchoolAction = createAction(HIDE_JOIN_SCHOOL)
export const removeInterestedCurriculumsAction = createAction(
  REMOVE_INTERESTED_CURRICULUMS_REQUEST
)
export const getCurrentDistrictUsersAction = createAction(
  GET_CURRENT_DISTRICT_USERS_REQUEST
)
export const getCurrentDistrictUsersSuccessAction = createAction(
  GET_CURRENT_DISTRICT_USERS_SUCCESS
)
export const changeChildAction = createAction(CHANGE_CHILD)
export const updateDefaultSettingsAction = createAction(
  UPDATE_DEFAULT_SETTINGS_REQUEST
)
export const setSignUpStatusAction = createAction(SET_SIGNUP_STATUS)
export const fetchUserFailureAction = createAction(FETCH_USER_FAILURE)
export const updatePowerTeacherAction = createAction(
  UPDATE_POWER_TEACHER_TOOLS_REQUEST
)
export const addClassToUserAction = createAction(ADD_CLASS_TO_USER)
export const addItemBankPermissionAction = createAction(
  ADD_COLLECTION_PERMISSION
)
export const removeItemBankPermissionAction = createAction(
  REMOVE_COLLECTION_PERMISSION
)
export const updateCliUserAction = createAction(SET_CLI_USER)
export const toggleClassCodeModalAction = createAction(TOGGLE_CLASS_CODE_MODAL)
export const toggleImageBlockNotificationAction = createAction(
  TOGGLE_IMAGES_BLOCKED_NOTIFICATION
)

const initialState = {
  addAccount: false,
  userId: null,
  isAuthenticated: false,
  authenticating: true,
  signupStatus: 0,
  currentChild: null,
  isCliUser: false,
  isClassCodeModalOpen: false,
  isImageBlockNotification: false,
}

const setUser = (state, { payload }) => {
  const defaultGrades =
    TokenStorage.getFromLocalStorage('defaultGrades') != null
      ? TokenStorage.getFromLocalStorage('defaultGrades')
        ? TokenStorage.getFromLocalStorage('defaultGrades').split(',')
        : []
      : null

  const defaultSubject = TokenStorage.getFromLocalStorage('defaultSubject')
  const defaultClass =
    get(payload, 'orgData.classList', []).length > 1
      ? ''
      : get(payload, 'orgData.defaultClass')
  state.user = payload
  if (payload.role === 'parent' && payload?.children?.length > 0) {
    state.currentChild = payload.children[0]._id
    set(state, 'user.orgData', payload.children[0].orgData)
  }
  state.user.middleName = payload.middleName || undefined
  state.user.lastName = payload.lastName || undefined
  set(state.user, 'orgData.defaultClass', defaultClass)
  set(state.user, 'orgData.selectedGrades', defaultGrades)
  set(state.user, 'orgData.selectedSubject', defaultSubject)
  let schools = payload?.orgData?.schools || []
  schools = schools.sort((a, b) => a.name.localeCompare(b.name))
  if (payload.role === 'school-admin' && schools.length) {
    // setting first school as default on initial load
    state.saSettingsSchool = schools[0]._id
  }
  state.isAuthenticated = true
  state.authenticating = false
  state.signupStatus = payload.currentSignUpState
}

const getCurrentPath = () => {
  const { location } = window
  const path = getWordsInURLPathName(location.pathname.toLocaleLowerCase())
  if (
    location.pathname.toLowerCase() === '/getstarted' ||
    location.pathname.toLowerCase() === '/signup' ||
    location.pathname.toLowerCase() === '/studentsignup' ||
    location.pathname.toLowerCase() === '/adminsignup' ||
    location.pathname.toLowerCase() === '/inviteteacher' ||
    (path[0] && path[0] === 'district') ||
    (path[0] && path[0] === 'districtlogin')
  ) {
    return ''
  }
  return `${location.pathname}${location.search}${location.hash}`
}

export default createReducer(initialState, {
  [SET_USER]: setUser,
  [SET_SETTINGS_SA_SCHOOL]: (state, { payload }) => {
    state.saSettingsSchool = payload
  },
  [CHANGE_CLASS]: (state, { payload }) => {
    if (!(state.user && state.user.orgData)) {
      return state
    }
    state.user.orgData.defaultClass = payload
  },
  [UPDATE_DEFAULT_GRADES]: (state, { payload }) => {
    state.user.orgData.selectedGrades = payload
  },
  [UPDATE_DEFAULT_SUBJECT]: (state, { payload }) => {
    state.user.orgData.selectedSubject = payload
  },
  [FETCH_USER]: (state, { payload }) => {
    if (!payload?.background) {
      state.authenticating = true
      state.isAuthenticated = false
    }
    if (payload?.addAccount === 'true') {
      state.addAccount = true
      state.userId = payload.userId
    }
  },
  [FETCH_USER_FAILURE]: (state) => {
    state.isAuthenticated = false
  },
  [FETCH_V1_REDIRECT]: (state) => {
    state.isAuthenticated = false
    state.authenticating = true
  },
  [SET_USER_GOOGLE_LOGGED_IN]: (state, { payload }) => {
    state.user.isUserGoogleLoggedIn = payload
  },
  [SINGUP_SUCCESS]: setUser,
  [REQUEST_NEW_PASSWORD_REQUEST]: (state) => {
    state.requestingNewPassword = true
    state.requestNewPasswordSuccess = false
  },
  [REQUEST_NEW_PASSWORD_FAILED]: (state) => {
    state.requestingNewPassword = false
  },
  [REQUEST_NEW_PASSWORD_SUCCESS]: (state, { payload }) => {
    state.requestingNewPassword = false
    state.requestNewPasswordSuccess = payload
  },
  [REQUEST_NEW_PASSWORD_RESET_CONTROL]: (state) => {
    state.requestingNewPassword = false
    state.requestNewPasswordSuccess = false
  },
  [RESET_PASSWORD_USER_SUCCESS]: (state, { payload }) => {
    state.resetPasswordUser = payload
  },
  [RESET_PASSWORD_REQUEST]: (state) => {
    state.requestingNewPassword = true
  },
  [RESET_PASSWORD_SUCCESS]: (state) => {
    delete state.resetPasswordUser
    state.requestingNewPassword = false
  },
  [RESET_PASSWORD_FAILED]: (state) => {
    state.requestingNewPassword = false
  },
  [GET_INVITE_DETAILS_SUCCESS]: (state, { payload }) => {
    state.invitedUserDetails = payload
  },
  [SET_INVITE_DETAILS_SUCCESS]: setUser,
  [RESET_MY_PASSWORD_REQUEST]: (state) => {
    state.requestingChangePassword = true
  },
  [RESET_MY_PASSWORD_SUCCESS]: (state) => {
    state.requestingChangePassword = false
  },
  [RESET_MY_PASSWORD_FAILED]: (state) => {
    state.requestingChangePassword = false
  },
  [UPDATE_PROFILE_IMAGE_PATH_REQUEST]: (state) => {
    state.user.updatingImagePath = true
  },
  [UPDATE_PROFILE_IMAGE_PATH_SUCCESS]: (state, { payload }) => {
    state.user.updatingImagePath = false
    state.user.thumbnail = payload
  },
  [UPDATE_PROFILE_IMAGE_PATH_FAILED]: (state) => {
    state.user.updatingImagePath = false
  },
  [UPDATE_USER_DETAILS_REQUEST]: (state) => {
    state.updatingUserDetails = true
  },
  [UPDATE_USER_DETAILS_SUCCESS]: (state, { payload }) => {
    delete state.updatingUserDetails
    state.user = {
      ...state.user,
      ...payload,
    }
  },
  [UPDATE_USER_DETAILS_FAILED]: (state) => {
    delete state.updatingUserDetails
  },
  [UPDATE_INTERESTED_CURRICULUMS_REQUEST]: (state) => {
    state.updatingInterestedCurriculums = true
  },
  [UPDATE_INTERESTED_CURRICULUMS_SUCCESS]: (state, { payload }) => {
    state.updatingInterestedCurriculums = undefined
    state.user.orgData.interestedCurriculums = payload
  },
  [UPDATE_INTERESTED_CURRICULUMS_FAILED]: (state) => {
    state.updatingInterestedCurriculums = undefined
  },
  [REMOVE_SCHOOL_REQUEST]: (state) => {
    state.removingSchool = true
  },
  [REMOVE_SCHOOL_SUCCESS]: (state, { payload }) => {
    state.removingSchool = undefined
    const updatedSchoolIds = state.user.institutionIds.filter(
      (id) => id !== payload
    )
    const updatedSchools = state.user.orgData.schools.filter(
      (school) => school._id !== payload
    )
    state.user.institutionIds = updatedSchoolIds
    state.user.orgData.institutionIds = updatedSchoolIds
    state.user.orgData.schools = updatedSchools
  },
  [REMOVE_SCHOOL_FAILED]: (state) => {
    state.removingSchool = undefined
  },
  [ADD_SCHOOL_REQUEST]: (state) => {
    state.addingSchool = true
  },
  [ADD_SCHOOL_SUCCESS]: (state, { payload }) => {
    state.addingSchool = false
    state.user.institutionIds = payload.institutionIds
    state.user.orgData.institutionIds = payload.orgData.institutionIds
    state.user.orgData.schools = payload.orgData.schools
  },
  [ADD_SCHOOL_FAILED]: (state) => {
    state.addingSchool = undefined
  },
  [CREATE_AND_ADD_SCHOOL_REQUEST]: (state) => {
    state.creatingAddingSchool = true
  },
  [CREATE_AND_ADD_SCHOOL_SUCCESS]: (state, { payload }) => {
    state.creatingAddingSchool = false
    state.user.institutionIds = payload.institutionIds
    state.user.orgData.institutionIds = payload.orgData.institutionIds
    state.user.orgData.schools = payload.orgData.schools
  },
  [CREATE_AND_ADD_SCHOOL_FAILED]: (state) => {
    state.creatingAddingSchool = undefined
  },
  [SHOW_JOIN_SCHOOL]: (state) => {
    state.joinSchoolVisible = true
  },
  [HIDE_JOIN_SCHOOL]: (state) => {
    state.joinSchoolVisible = undefined
  },
  [REMOVE_INTERESTED_CURRICULUMS_REQUEST]: (state, { payload }) => {
    const updatedCurriculums = state.user.orgData.interestedCurriculums.filter(
      (curriculum) => curriculum._id !== payload
    )
    state.user.orgData.interestedCurriculums = updatedCurriculums
  },
  [GET_CURRENT_DISTRICT_USERS_SUCCESS]: (state, { payload }) => {
    state.user.currentDistrictUsers = payload
  },
  [CHANGE_CHILD]: (state, { payload }) => {
    state.currentChild = payload
    set(
      state,
      'user.orgData',
      state.user.children.find((child) => child._id === payload).orgData
    )
  },
  [JOIN_CLASS_REQUEST_SUCCESS]: (state, { payload }) => {
    state.user.orgData.classList.push(payload)
  },
  [UPDATE_DEFAULT_SETTINGS_REQUEST]: (state) => {
    state.updatingDefaultSettings = true
  },
  [UPDATE_DEFAULT_SETTINGS_SUCCESS]: (state, { payload }) => {
    state.updatingDefaultSettings = false
    const { defaultGrades, defaultSubjects, autoShareGCAssignment } = payload
    Object.assign(state.user.orgData, {
      defaultGrades,
      defaultSubjects,
      autoShareGCAssignment,
    })
  },
  [UPDATE_DEFAULT_SETTINGS_FAILED]: (state) => {
    state.updatingDefaultSettings = false
  },
  [SET_SIGNUP_STATUS]: (state, { payload }) => {
    state.signupStatus = payload
  },
  [UPDATE_POWER_TEACHER_TOOLS_REQUEST]: (state) => {
    state.updatingPowerTeacher = true
  },
  [UPDATE_POWER_TEACHER_TOOLS_SUCCESS]: (state, { payload }) => {
    if (!payload?.usernames) {
      Object.assign(state.user, {
        isPowerTeacher: !state.user.isPowerTeacher,
      })
    }
    state.updatingPowerTeacher = false
  },
  [UPDATE_POWER_TEACHER_TOOLS_FAILED]: (state) => {
    state.updatingPowerTeacher = false
  },
  [ADD_CLASS_TO_USER]: (state, { payload }) => {
    state.user.orgData.classList.push(payload)
  },
  [ADD_COLLECTION_PERMISSION]: (state, { payload }) => {
    const itemBanks = get(state, 'user.orgData.itemBanks', [])
    const { itemBankId, accessLevel, status } = payload
    const itemBankIndex = itemBanks.findIndex((item) => item._id === itemBankId)
    if (itemBankIndex > -1) {
      state.user.orgData.itemBanks[itemBankIndex].accessLevel = accessLevel
      state.user.orgData.itemBanks[itemBankIndex].status = status
    } else {
      state.user.orgData.itemBanks.push({ ...payload })
    }
  },
  [REMOVE_COLLECTION_PERMISSION]: (state, { payload }) => {
    const itemBanks = get(state, 'user.orgData.itemBanks', [])
    const { itemBankId } = payload
    const itemBankIndex = itemBanks.findIndex((item) => item._id === itemBankId)
    if (itemBankIndex > -1) {
      state.user.orgData.itemBanks[itemBankIndex].status = 0
    }
  },
  [SET_CLI_USER]: (state, { payload }) => {
    state.isCliUser = payload
  },
  [TOGGLE_CLASS_CODE_MODAL]: (state, { payload }) => {
    state.isClassCodeModalOpen = payload
  },
  [TOGGLE_IMAGES_BLOCKED_NOTIFICATION]: (state, { payload }) => {
    state.isImageBlockNotification = payload
  },
})

export const getUserDetails = createSelector(['user.user'], (user) => user)

export const getCurrentDistrictUsersSelector = createSelector(
  [getUserDetails],
  (state) => state.currentDistrictUsers
)

export const getClasses = createSelector(
  ['user.user.orgData.classList'],
  (classes) => classes
)

export const getCurrentGroup = createSelector(
  ['user.user.orgData.defaultClass'],
  (r) => {
    if (r === 'archive') {
      return ''
    }
    return r
  }
)

export const getCurrentGroupExactValue = createSelector(
  ['user.user.orgData.defaultClass'],
  (r) => r
)

export const getCurrentGroupWithAllClasses = createSelector(
  [
    'user.user.orgData.defaultClass',
    'studentAssignment.byId',
    'studentAssignment.current',
    'user.user.orgData.classList',
  ],
  (groupId, assignmentsById, currentAssignmentId, classes) => {
    if (groupId) {
      return groupId
    }
    if (currentAssignmentId) {
      const currentAssignment = assignmentsById[currentAssignmentId]
      if (!currentAssignment) {
        return groupId
      }

      const allClassIds = new Set(classes.map((x) => x._id))
      const assignmentClassId = currentAssignment.class.find((cl) =>
        allClassIds.has(cl._id)
      )

      return assignmentClassId ? assignmentClassId._id : groupId
    }
    return groupId
  }
)

export const getCurrentSchool = createSelector(
  ['user.user.orgData.defaultSchool'],
  (r) => r
)

export const getUserRole = createSelector(['user.user.role'], (r) => r)

export const getUserId = createSelector(
  ['user.user._id', 'user.currentChild'],
  (_id, currentChild) => _id || currentChild
)

export const getUserName = createSelector(
  ['user.user.firstName', 'user.user.middleName', 'user.user.lastName'],
  (firstName, middleName, lastName) =>
    [firstName || '', middleName || '', lastName || ''].join(' ').trim()
)

export const getUserFeatures = createSelector(
  ['user.user.features'],
  (features) => features
)

export const isProxyUser = createSelector(
  ['user.user.isProxy'],
  (isProxy) => isProxy
)

export const proxyRole = createSelector(
  ['user.user.proxyRole'],
  (proxyrole) => proxyrole
)

export const getAddAccount = createSelector(
  ['user.addAccount'],
  (addAccount) => addAccount
)

export const getAddAccountUserId = createSelector(
  ['user.userId'],
  (userId) => userId
)

export const getIsClassCodeModalOpen = createSelector(
  ['user.isClassCodeModalOpen'],
  (r) => r
)

const routeSelector = (state) => state.router.location.pathname

function getCurrentFirebaseUser() {
  return firebase.auth().currentUser?.uid || undefined
}

function getValidRedirectRouteByRole(_url, user) {
  const url = (_url || '').trim()
  switch (user.role) {
    case roleuser.TEACHER:
      return url.match(/^\/author\//) ? url : '/author/dashboard'
    case roleuser.STUDENT:
      return url.match(/^\/home\//) ||
        url.includes('/author/tests/tab/review/id/')
        ? url
        : '/home/assignments'
    case roleuser.EDULASTIC_ADMIN:
      return url.match(/^\/admin\//) ? url : '/admin/proxyUser'
    case roleuser.EDULASTIC_CURATOR:
      return url.match(/^\/author\//) ? url : '/author/items'
    case roleuser.SCHOOL_ADMIN:
      return url.match(/^\/author\//) ? url : '/author/assignments'
    case roleuser.DISTRICT_ADMIN:
      if ((user.permissions || []).includes('curator'))
        return url.match(/^\/publisher\//) || url.match(/^\/author\//)
          ? url
          : '/publisher/dashboard'
      return url.match(/^\/author\//) ? url : '/author/assignments'
    default:
      return url
  }
}

function* login({ payload }) {
  yield put(addLoadingComponentAction({ componentName: 'loginButton' }))
  const _payload = { ...payload }
  const generalSettings = yield select(signupGeneralSettingsSelector)
  if (generalSettings) {
    if (generalSettings.orgType === 'institution') {
      _payload.institutionId = generalSettings.orgId
      _payload.institutionName = generalSettings.name
    } else {
      _payload.districtId = generalSettings.orgId
      _payload.districtName = generalSettings.name
    }
  }

  try {
    const addAccount = yield select(getAddAccount)
    const addAccountTo = yield select(getAddAccountUserId)
    if (addAccount === true) {
      _payload.addAccountTo = addAccountTo
    }
    const result = yield call(authApi.login, _payload)
    if (result.needClassCode) {
      yield put(toggleClassCodeModalAction(true))
    } else {
      yield put(toggleClassCodeModalAction(false))
      const user = pick(result, userPickFields)
      yield firebase.auth().signInWithCustomToken(result.firebaseAuthToken)
      if (addAccount === true) {
        TokenStorage.storeAccessToken(result.token, user._id, user.role, false)
      } else {
        TokenStorage.storeAccessToken(result.token, user._id, user.role, true)
      }
      TokenStorage.selectAccessToken(user._id, user.role)
      TokenStorage.updateKID(user)
      yield put(setUserAction(user))
      yield put(
        updateInitSearchStateAction({
          grades: user?.orgData?.defaultGrades,
          subject: user?.orgData?.defaultSubjects,
        })
      )
      yield put(receiveLastPlayListAction())
      if (user.role !== roleuser.STUDENT) {
        yield put(receiveRecentPlayListsAction())
      }

      if (
        user.role == roleuser.TEACHER &&
        user?.orgData?.districtIds?.length > 1
      ) {
        Sentry.withScope((scope) => {
          scope.setExtra('userId', user._id)
          Sentry.captureException(
            new Error('Logged in teacher is a part of multiple districts.')
          )
        })
      }

      yield call(segmentApi.analyticsIdentify, { user })

      const redirectUrl = yield call(
        getValidRedirectRouteByRole,
        localStorage.getItem('loginRedirectUrl'),
        user
      )

      const isAuthUrl = /signup|login/gi.test(redirectUrl)
      if (redirectUrl && !isAuthUrl) {
        if (
          user.role === roleuser.STUDENT &&
          Object.prototype.hasOwnProperty.call(localStorage, 'publicUrlAccess')
        ) {
          const publicUrl = localStorage.getItem('publicUrlAccess')
          localStorage.removeItem('publicUrlAccess')
          yield put(push({ pathname: publicUrl, state: { isLoading: true } }))
        } else {
          localStorage.removeItem('loginRedirectUrl')
          yield put(push(redirectUrl))
        }
      }

      if (generalSettings) {
        setSignOutUrl(getDistrictSignOutUrl(generalSettings))
      }
    }

    // Important redirection code removed, redirect code already present in /src/client/App.js
    // it receives new user props in each steps of teacher signup and for other roles
  } catch (err) {
    const { status, data = {} } = err
    console.error(err)
    let errorMessage = 'You have entered an invalid email/username or password.'
    if (
      (status === 403 || status === 412) &&
      (data.message || err?.response?.data?.message)
    ) {
      errorMessage = data.message || err?.response?.data?.message
    }
    notification({ msg: errorMessage })
  } finally {
    yield put(removeLoadingComponentAction({ componentName: 'loginButton' }))
  }
}

const checkEmailPolicy = (policy, role, email) => {
  if (!policy) {
    return { status: true, message: '', error: '', role }
  }
  const inputDomain = email.split('@')[1]
  let allowedDomains
  if (role === 'teacher') {
    allowedDomains = policy.allowedDomainForTeachers
      ? policy.allowedDomainForTeachers.map((item) => item.toLocaleLowerCase())
      : []
  } else if (role === 'student') {
    allowedDomains = policy.allowedDomainForStudents
      ? policy.allowedDomainForStudents.map((item) => item.toLocaleLowerCase())
      : []
  } else if (role === 'da') {
    allowedDomains = policy.allowedDomainsForDistrict
      ? policy.allowedDomainsForDistrict.map((item) => item.toLocaleLowerCase())
      : []
  }
  if (
    (role === 'student'
      ? !inputDomain || allowedDomains.includes(inputDomain.toLocaleLowerCase())
      : allowedDomains.includes(inputDomain.toLocaleLowerCase())) ||
    !allowedDomains.length
  ) {
    return { status: true, message: '', error: '', role }
  }
  return {
    status: false,
    message: 'This email id is not allowed in your district',
    error: 'domain',
    role,
  }
}

function* signup({ payload }) {
  const districtPolicy = yield select(signupDistrictPolicySelector)
  const generalSettings = yield select(signupGeneralSettingsSelector)

  let districtId
  if (generalSettings) {
    districtId = generalSettings.orgId
  }

  try {
    const {
      name,
      email,
      password,
      role,
      classCode,
      passwordForExistingUser,
      isAdmin,
    } = payload
    let nameList = name.split(' ')
    nameList = nameList.filter((item) => !!(item && item.trim()))
    if (!nameList.length) {
      throw new Error({ message: 'Please provide your full name.' })
    }
    const allow = checkEmailPolicy(districtPolicy, role, email)
    if (!allow.status) {
      throw allow
    }

    let firstName
    let lastName
    let middleName
    if (nameList.length === 1) {
      firstName = nameList[0]
    } else if (nameList.length === 2) {
      firstName = nameList[0]
      lastName = nameList[1]
    } else if (nameList.length > 2) {
      firstName = nameList[0]
      middleName = nameList.slice(1, nameList.length - 1).join(' ')
      lastName = last(nameList)
    }

    const obj = {
      password,
      email,
      firstName,
      middleName,
      lastName,
      role,
      districtId,
    }

    if (classCode) {
      obj.code = classCode
    }

    if (passwordForExistingUser) {
      obj.passwordForExistingUser = passwordForExistingUser
    }

    if (isAdmin) {
      obj.isAdmin = isAdmin
    }

    const addAccount = yield select(getAddAccount)
    const addAccountTo = yield select(getAddAccountUserId)
    if (addAccount === true) {
      obj.addAccountTo = addAccountTo
    }

    const response = yield call(authApi.signup, obj)
    const {
      message: _responseMsg,
      result,
      askPassword,
      passwordMatch,
    } = response
    if (_responseMsg && !result) {
      const { errorCallback } = payload
      if (errorCallback) {
        if (askPassword === true) {
          errorCallback({
            ...response.existingUser,
            currentSelectedRole: role,
            askPassword,
            passwordMatch,
          })
        } else {
          errorCallback(_responseMsg)
        }
      } else {
        notification({ msg: _responseMsg })
      }
    } else {
      if (result.existingUser && result.existingUser.passwordMatch) {
        notification({ type: 'info', messageKey: 'weAlreadyHaveAccount' })
      }
      const user = pick(result, userPickFields)

      TokenStorage.storeAccessToken(result.token, user._id, user.role, true)
      TokenStorage.selectAccessToken(user._id, user.role)
      const firebaseUser = yield call(getCurrentFirebaseUser)
      if (
        (!firebaseUser && result.firebaseAuthToken) ||
        (firebaseUser && firebaseUser !== user._id && result.firebaseAuthToken)
      ) {
        yield firebase.auth().signInWithCustomToken(result.firebaseAuthToken)
      }
      yield call(segmentApi.trackTeacherSignUp, { user: result })

      if (
        role === 'teacher' &&
        sessionStorage.getItem('signupFlow') !== 'canvas'
      ) {
        const userPayload = {
          data: {
            email: user.email,
            currentSignUpState: 'ACCESS_WITHOUT_SCHOOL',
          },
          userId: user._id,
        }

        const userUpdateResult = yield call(userApi.updateUser, userPayload)
        if (userUpdateResult && userUpdateResult.token) {
          TokenStorage.storeAccessToken(
            userUpdateResult.token,
            userUpdateResult._id,
            userUpdateResult.role,
            true
          )
          TokenStorage.selectAccessToken(
            userUpdateResult._id,
            userUpdateResult.role
          )
        }
        const updatedUser = pick(userUpdateResult, userPickFields)
        yield put(signupSuccessAction(updatedUser))
      } else {
        yield put(signupSuccessAction(result))
      }

      localStorage.removeItem('loginRedirectUrl')

      if (generalSettings) {
        setSignOutUrl(getDistrictSignOutUrl(generalSettings))
      }

      // Important redirection code removed, redirect code already present in /src/client/App.js
      // it receives new user props in each steps of teacher signup and for other roles
    }
  } catch (err) {
    const { role } = payload
    let errorMessage = 'Email already exists. Please sign in to your account.'
    errorMessage =
      role === roleuser.STUDENT ? `Username/${errorMessage}` : errorMessage
    const msg1 = get(err, 'data.message', '')
    const msg2 = get(err, 'message', '')
    const msg = msg1 || msg2 || errorMessage

    const { errorCallback } = payload
    if (errorCallback) {
      errorCallback(msg)
    } else {
      notification({ msg })
    }
  }
}

const getLoggedOutUrl = () => {
  // When u try to change this function change the duplicate function in "packages/api/src/utils/API.js" also
  const path = getWordsInURLPathName(window.location.pathname)
  const pathname = window.location.pathname.toLocaleLowerCase()
  if (pathname === '/getstarted') {
    return '/getStarted'
  }
  if (pathname === '/signup') {
    return '/signup'
  }
  if (pathname === '/studentsignup') {
    return '/studentsignup'
  }
  if (
    pathname === '/login' &&
    (window.location.hash.includes('register') ||
      window.location.hash.includes('signup'))
  ) {
    return `${window.location.pathname}${window.location.search}${window.location.hash}`
  }
  if (pathname === '/adminsignup') {
    return '/adminsignup'
  }
  if (
    path[0] &&
    (path[0].toLocaleLowerCase() === 'district' ||
      path[0].toLocaleLowerCase() === 'districtlogin') &&
    path[1]
  ) {
    const arr = [...path]
    arr.shift()
    const restOfPath = arr.join('/')
    const [, districtLogin] = window.location.pathname?.split('/')
    return `/${districtLogin || 'districtLogin'}/${restOfPath}`
  }
  if (path[0] && path[0].toLocaleLowerCase() === 'school' && path[1]) {
    const arr = [...path]
    arr.shift()
    const restOfPath = arr.join('/')
    return `/school/${restOfPath}`
  }
  if (pathname === '/resetpassword') {
    return window.location.href.split(window.location.origin)[1]
  }
  if (pathname === '/inviteteacher') {
    return `${window.location.pathname}${window.location.search}${window.location.hash}`
  }
  return '/login'
}

export function* fetchUser({ payload }) {
  try {
    // TODO: handle the case of invalid token
    if (!TokenStorage.getAccessToken()) {
      if (
        !window.location.pathname
          .toLocaleLowerCase()
          .includes(getLoggedOutUrl())
      ) {
        localStorage.setItem('loginRedirectUrl', getCurrentPath())
      }
      yield put(push(getLoggedOutUrl()))
      // Capture referrer when no access-token
      const referrer = window.document.referrer
      if (!window.localStorage.getItem('originalreferrer') && referrer) {
        window.localStorage.setItem('originalreferrer', referrer)
      }
      return
    }
    if (payload && payload.addAccount === 'true') {
      sessionStorage.setItem(
        'addAccountDetails',
        JSON.stringify({
          addAccount: payload.addAccount,
          addAccountTo: payload.userId,
        })
      )
      yield put(push('/login'))
      return
    }
    const firebaseUser = yield call(getCurrentFirebaseUser)
    const user = yield call(userApi.getUser, firebaseUser ? undefined : true)
    if (
      (!firebaseUser && user.firebaseAuthToken) ||
      (firebaseUser && firebaseUser !== user._id)
    ) {
      yield firebase.auth().signInWithCustomToken(user.firebaseAuthToken)
    }
    yield call(segmentApi.analyticsIdentify, { user })
    const key = `${localStorage.getItem('defaultTokenKey')}`

    if (key.includes('role:undefined') && user.role) {
      TokenStorage.removeAccessToken(user._id, 'undefined')
      TokenStorage.storeAccessToken(user.token, user._id, user.role, true)
      TokenStorage.selectAccessToken(user._id, user.role)
    }
    TokenStorage.updateKID(user)
    const searchParam = yield select((state) => state.router.location.search)
    if (searchParam.includes('showCliBanner=1'))
      localStorage.setItem('showCLIBanner', true)
    yield put(setUserAction(user))
    yield put(
      updateInitSearchStateAction({
        grades: user?.orgData?.defaultGrades,
        subject: user?.orgData?.defaultSubjects,
      })
    )
    yield put(receiveLastPlayListAction())
    if (user.role !== roleuser.STUDENT) {
      yield put(receiveRecentPlayListsAction())
    }
    if (
      user.role == roleuser.TEACHER &&
      user?.orgData?.districtIds?.length > 1
    ) {
      Sentry.withScope((scope) => {
        scope.setExtra('userId', user._id)
        Sentry.captureException(
          new Error('Logged in teacher is a part of multiple districts.')
        )
      })
    }
  } catch (error) {
    console.log('err', error, error)
    notification({ messageKey: 'failedLoadingUserData' })
    if (!(error?.response && error?.response?.status === 501)) {
      if (
        !window.location.pathname
          .toLocaleLowerCase()
          .includes(getLoggedOutUrl())
      ) {
        localStorage.setItem('loginRedirectUrl', getCurrentPath())
      }
      const pathname = window.location.pathname.toLocaleLowerCase().split('/')
      yield put(fetchUserFailureAction())
      if (!(pathname.includes('public') && pathname.includes('view-test'))) {
        yield put(push(getLoggedOutUrl()))
      }
    }
  }
}

export function* fetchV1Redirect({ payload: id }) {
  try {
    // TODO: handle the case of invalid token
    const { authToken, _id, role } = yield call(authApi.V1Redirect, id)
    if (authToken) {
      TokenStorage.storeAccessToken(authToken, _id, role)
      TokenStorage.selectAccessToken(_id, role)
    } else {
      notification({ messageKey: 'authtokenInvalidOnRedirection' })
      return
    }

    const user = yield call(userApi.getUser)
    TokenStorage.updateKID(user)
    yield put(setUserAction(user))
    yield put(
      updateInitSearchStateAction({
        grades: user?.orgData?.defaultGrades,
        subject: user?.orgData?.defaultSubjects,
      })
    )
    /**
     * redirect to base url, would handle redirects according to role & other logics
     */
    yield put(push('/'))
  } catch (e) {
    console.log(e)
    notification({ messageKey: 'failedLoadingUserData' })
  }
}

function* logout() {
  try {
    const user = yield select(getUser)
    if (user.isProxy) {
      TokenStorage.removeAccessToken(user._id, user.role)
      window.close()
    } else {
      yield call(segmentApi.unloadIntercom, { user })
      if (user && TokenStorage.getAccessTokenForUser(user._id, user.role)) {
        yield call(userApi.logout)
      }
      const version = localStorage.getItem('author:dashboard:version')
      const configurableTiles = localStorage.getItem('author:dashboard:tiles')
      localStorage.clear()
      if (version && configurableTiles) {
        localStorage.setItem('author:dashboard:tiles', configurableTiles)
        localStorage.setItem('author:dashboard:version', version)
      }
      sessionStorage.removeItem('cliBannerShown')
      sessionStorage.removeItem('cliBannerVisible')
      sessionStorage.removeItem('addAccountDetails')
      sessionStorage.removeItem('filters[Assignments]')
      sessionStorage.removeItem('temporaryClass')
      TokenStorage.removeKID()
      TokenStorage.initKID()
      TokenStorage.removeTokens()
      yield put({ type: 'RESET' })
      yield put(push(getSignOutUrl()))
      removeSignOutUrl()
    }
  } catch (e) {
    console.log(e)
  }
}

function* changeClass({ payload }) {
  try {
    const url = yield select(routeSelector)
    if (!url.includes('/home/skill-mastery')) {
      yield put(fetchAssignmentsAction(payload))
    }
  } catch (e) {
    console.log(e)
  }
}

function* googleLogin({ payload }) {
  const generalSettings = yield select(signupGeneralSettingsSelector)
  let districtId
  if (generalSettings) {
    localStorage.setItem(
      'thirdPartySignOnGeneralSettings',
      JSON.stringify(generalSettings)
    )
    districtId = generalSettings.orgId

    setSignOutUrl(getDistrictSignOutUrl(generalSettings))
  }

  try {
    let classCode = ''
    let role = ''
    const params = {}
    if (payload) {
      if (payload.role === 'teacher') {
        localStorage.setItem('thirdPartySignOnRole', payload.role)
        if (payload.isAdmin) {
          localStorage.setItem('thirdPartySignOnAdditionalRole', 'admin')
        }
        role = 'teacher'
      } else if (payload.role === 'student') {
        localStorage.setItem('thirdPartySignOnRole', payload.role)
        localStorage.setItem('thirdPartySignOnClassCode', payload.classCode)
        classCode = payload.classCode
        role = 'student'
      }
      if (payload.prompt) {
        params.prompt = payload.prompt
      }
    }

    if (classCode) {
      yield call(authApi.validateClassCode, {
        classCode,
        signOnMethod: 'googleSignOn',
        role,
        districtId,
      })
    }

    const res = yield call(authApi.googleLogin, params)
    window.location.href = res
  } catch (e) {
    notification({
      msg: e.response?.data?.message
        ? e.response.data.message
        : 'Google Login failed',
    })
  }
}

function* googleSSOLogin({ payload }) {
  const _payload = { ...payload }

  let generalSettings = localStorage.getItem('thirdPartySignOnGeneralSettings')
  if (generalSettings) {
    generalSettings = JSON.parse(generalSettings)
    _payload.districtId = generalSettings.orgId
    _payload.districtName = generalSettings.name
  }

  try {
    if (_payload.edulasticRole === 'student') {
      const classCode = localStorage.getItem('thirdPartySignOnClassCode')
      if (classCode) {
        _payload.classCode = classCode
      }
    }
    const { isNewUser, ...res } = yield call(authApi.googleSSOLogin, _payload)
    if (res.reAuthGoogle) {
      TokenStorage.storeInLocalStorage(
        'payloadForUserData',
        JSON.stringify(res)
      )
      window.location.href = '/auth/google'
    } else {
      if (isNewUser) {
        yield call(segmentApi.trackTeacherSignUp, { user: res })
      }
      yield put(getUserDataAction(res))
    }
  } catch (e) {
    const errorMessage = get(e, 'response.data.message', 'Google Login failed')
    if (errorMessage === 'signInUserNotFound') {
      yield put(push(getStartedUrl()))
      notification({ type: 'warn', messageKey: 'signInUserNotFound' })
    } else {
      notification({ msg: errorMessage })
      yield put(push(getSignOutUrl()))
      removeSignOutUrl()
    }
  }
  localStorage.removeItem('thirdPartySignOnRole')
  localStorage.removeItem('thirdPartySignOnClassCode')
  localStorage.removeItem('thirdPartySignOnGeneralSettings')
  localStorage.removeItem('thirdPartySignOnAdditionalRole')
}

function* msoLogin({ payload }) {
  const generalSettings = yield select(signupGeneralSettingsSelector)
  let districtId
  if (generalSettings) {
    localStorage.setItem(
      'thirdPartySignOnGeneralSettings',
      JSON.stringify(generalSettings)
    )
    districtId = generalSettings.orgId

    setSignOutUrl(getDistrictSignOutUrl(generalSettings))
  }

  try {
    let classCode = ''
    let role = ''
    if (payload) {
      if (payload.role === 'teacher') {
        localStorage.setItem('thirdPartySignOnRole', payload.role)
        if (payload.isAdmin) {
          localStorage.setItem('thirdPartySignOnAdditionalRole', 'admin')
        }
        role = 'teacher'
      } else if (payload.role === 'student') {
        localStorage.setItem('thirdPartySignOnRole', payload.role)
        localStorage.setItem('thirdPartySignOnClassCode', payload.classCode)
        classCode = payload.classCode
        role = 'student'
      }
    }
    if (classCode) {
      yield call(authApi.validateClassCode, {
        classCode,
        signOnMethod: 'office365SignOn',
        role,
        districtId,
      })
    }
    const res = yield call(authApi.msoLogin)
    window.location.href = res
  } catch (e) {
    notification({ msg: get(e, 'response.data.message', 'MSO Login failed') })
  }
}

function* msoSSOLogin({ payload }) {
  const _payload = { ...payload }

  const isAllowed = localStorage.getItem('studentRoleConfirmation')
  if (isAllowed) {
    _payload.isTeacherAllowed = true
    localStorage.removeItem('studentRoleConfirmation')
  }

  let generalSettings = localStorage.getItem('thirdPartySignOnGeneralSettings')
  if (generalSettings) {
    generalSettings = JSON.parse(generalSettings)
    _payload.districtId = generalSettings.orgId
    _payload.districtName = generalSettings.name
  }

  try {
    if (_payload.edulasticRole === 'student') {
      const classCode = localStorage.getItem('thirdPartySignOnClassCode')
      if (classCode) {
        _payload.classCode = classCode
      }
    }
    const { isNewUser, ...res } = yield call(authApi.msoSSOLogin, _payload)
    if (isNewUser) {
      yield call(segmentApi.trackTeacherSignUp, { user: res })
    }
    yield put(getUserDataAction(res))
  } catch (e) {
    const errorMessage = get(e, 'response.data.message', 'MSO Login failed')
    if (e.status === 409) {
      const email = get(e, 'response.data.email', 'Email')
      yield put(toggleRoleConfirmationPopupAction(email))
      return
    }
    if (errorMessage === 'signInUserNotFound') {
      yield put(push(getStartedUrl()))
      notification({ type: 'warn', messageKey: 'signInUserNotFound' })
    } else {
      notification({ msg: errorMessage })
      yield put(push(getSignOutUrl()))
      removeSignOutUrl()
    }
  }
  localStorage.removeItem('thirdPartySignOnRole')
  localStorage.removeItem('thirdPartySignOnClassCode')
  localStorage.removeItem('thirdPartySignOnGeneralSettings')
  localStorage.removeItem('thirdPartySignOnAdditionalRole')
}

function* cleverLogin({ payload }) {
  const generalSettings = yield select(signupGeneralSettingsSelector)
  if (generalSettings) {
    localStorage.setItem(
      'thirdPartySignOnGeneralSettings',
      JSON.stringify(generalSettings)
    )

    setSignOutUrl(getDistrictSignOutUrl(generalSettings))
  }

  try {
    if (payload) {
      localStorage.setItem('thirdPartySignOnRole', payload)
    }
    const res = yield call(authApi.cleverLogin)
    window.location.href = res
  } catch (e) {
    notification({ messageKey: 'cleverLoginFailed' })
  }
}

function* cleverSSOLogin({ payload }) {
  const _payload = { ...payload }

  let generalSettings = localStorage.getItem('thirdPartySignOnGeneralSettings')
  if (generalSettings) {
    generalSettings = JSON.parse(generalSettings)
    _payload.districtId = generalSettings.orgId
    _payload.districtName = generalSettings.name
  }

  try {
    const res = yield call(authApi.cleverSSOLogin, _payload)
    yield put(getUserDataAction(res))
  } catch (err) {
    const { data = {} } = err.response || {}
    const { message: errorMessage } = data
    captureSentryException(err)
    if (
      errorMessage ===
      'User not yet authorized to use Edulastic. Please contact your district administrator!'
    ) {
      yield put(
        push({
          pathname: getSignOutUrl(),
          state: { showCleverUnauthorized: true },
          hash: '#login',
        })
      )
    } else {
      notification({ msg: errorMessage || 'Clever Login failed' })
      yield put(push(getSignOutUrl()))
    }
    removeSignOutUrl()
  }
  localStorage.removeItem('thirdPartySignOnRole')
  localStorage.removeItem('thirdPartySignOnGeneralSettings')
}

function* atlasLogin({ payload }) {
  const generalSettings = yield select(signupGeneralSettingsSelector)
  const params = {}
  if (generalSettings) {
    localStorage.setItem(
      'thirdPartySignOnGeneralSettings',
      JSON.stringify(generalSettings)
    )
    setSignOutUrl(getDistrictSignOutUrl(generalSettings))
    params.districtId = generalSettings.orgId
  }

  try {
    if (payload) {
      localStorage.setItem('thirdPartySignOnRole', payload)
    }
    const res = yield call(authApi.atlasLogin, params)
    window.location.href = res
  } catch (e) {
    notification({ messageKey: 'atlasLoginFailed' })
  }
}

function* atlasSSOLogin({ payload }) {
  const _payload = { ...payload }

  let generalSettings = localStorage.getItem('thirdPartySignOnGeneralSettings')
  if (generalSettings) {
    generalSettings = JSON.parse(generalSettings)
    _payload.districtId = generalSettings.orgId
    _payload.districtName = generalSettings.name
  }

  try {
    const res = yield call(authApi.atlasSSOLogin, _payload)
    yield put(getUserDataAction(res))
  } catch (e) {
    if (
      e?.response?.data?.message ===
      'User not yet authorized to use Edulastic. Please contact your district administrator!'
    ) {
      yield put(
        push({
          pathname: getSignOutUrl(),
          state: { showUnauthorized: true },
          hash: '#login',
        })
      )
    } else {
      notification({ msg: e?.data?.message || 'Atlas Login failed' })
      yield put(push(getSignOutUrl()))
    }
    removeSignOutUrl()
  }
  localStorage.removeItem('thirdPartySignOnRole')
  localStorage.removeItem('thirdPartySignOnGeneralSettings')
}

function* getUserData({ payload: res }) {
  try {
    const { firebaseAuthToken } = res
    const firebaseUser = yield call(getCurrentFirebaseUser)
    if (
      (!firebaseUser && firebaseAuthToken) ||
      (firebaseUser && firebaseUser !== res._id)
    ) {
      yield firebase.auth().signInWithCustomToken(firebaseAuthToken)
    }
    const user = pick(res, userPickFields)
    TokenStorage.storeAccessToken(res.token, user._id, user.role, true)
    TokenStorage.selectAccessToken(user._id, user.role)
    TokenStorage.updateKID(user)
    yield put(setUserAction(user))
    yield put(receiveLastPlayListAction())
    if (user.role !== roleuser.STUDENT) {
      yield put(receiveRecentPlayListsAction())
    }
    const redirectUrl = TokenStorage.getFromLocalStorage('loginRedirectUrl')

    const isAuthUrl = /signup|login/gi.test(redirectUrl)
    if (redirectUrl && !isAuthUrl) {
      localStorage.removeItem('loginRedirectUrl')
      yield put(push(redirectUrl))
    }

    // Important redirection code removed, redirect code already present in /src/client/App.js
    // it receives new user props in each steps of teacher signup and for other roles
  } catch (e) {
    console.warn(e)
    notification({ messageKey: 'failedToFetchUserData' })

    yield put(push(getSignOutUrl()))
    removeSignOutUrl()
  }
}

function* updateUserRoleSaga({ payload }) {
  try {
    const user = yield select(getUser)
    const res = yield call(userApi.updateUserRole, {
      data: payload,
      userId: user._id,
    })
    const _user = {
      ...user,
      role: payload.role,
    }

    TokenStorage.removeAccessToken(_user._id, 'undefined')

    TokenStorage.storeAccessToken(res.token, _user._id, _user.role, true)
    TokenStorage.selectAccessToken(_user._id, _user.role)
    yield put(signupSuccessAction(_user))
    yield call(fetchUser, {}) // needed to update org and other user data to local store
  } catch (e) {
    console.warn('e', e)
    notification({
      msg: get(
        e,
        'response.data.message',
        'Failed to update user please try again.'
      ),
    })
  }
}

function* requestNewPasswordSaga({ payload }) {
  try {
    const res = yield call(userApi.requestNewPassword, payload)
    yield put({
      type: REQUEST_NEW_PASSWORD_SUCCESS,
      payload: res,
    })
  } catch (e) {
    console.error(e)
    notification({
      msg: e?.response?.data?.message
        ? e.response.data.message
        : 'Failed to request new password.',
    })
    yield put({
      type: REQUEST_NEW_PASSWORD_FAILED,
    })
  }
}

function* resetPasswordUserSaga({ payload }) {
  try {
    const res = yield call(userApi.fetchResetPasswordUser, payload)
    if (res) {
      yield put({ type: RESET_PASSWORD_USER_SUCCESS, payload: res })
    } else {
      yield put(push('/login'))
    }
  } catch (e) {
    notification({
      msg: e?.response?.data?.message
        ? e.response.data.message
        : 'Failed to user data.',
    })
    yield put(push('/login'))
  }
}

function* resetPasswordRequestSaga({ payload }) {
  try {
    const result = yield call(userApi.resetUserPassword, payload)
    yield put({ type: RESET_PASSWORD_SUCCESS })
    const user = pick(result, userPickFields)
    TokenStorage.storeAccessToken(result.token, user._id, user.role, true)
    TokenStorage.selectAccessToken(user._id, user.role)
    yield put(signupSuccessAction(result))
    yield call(fetchUser, {}) // needed to update org and other user data to local store
    localStorage.removeItem('loginRedirectUrl')
  } catch (e) {
    notification({
      msg: e?.response?.data?.message
        ? e.response.data.message
        : 'Failed to reset password.',
    })
    yield put({
      type: RESET_PASSWORD_FAILED,
    })
  }
}

function* resetMyPasswordRequestSaga({ payload }) {
  try {
    yield call(userApi.resetMyPassword, payload)
    notification({ type: 'success', messageKey: 'passwordChangedSucessfully' })
    yield put({ type: RESET_MY_PASSWORD_SUCCESS })
  } catch (e) {
    console.error(e)
    notification({ messageKey: 'failedToResetPassword' })
    yield put({
      type: RESET_MY_PASSWORD_FAILED,
    })
  }
}

function* updateProfileImageSaga({ payload }) {
  try {
    yield call(userApi.updateUser, payload)
    notification({
      type: 'success',
      messageKey: 'thumbnailChangedSuccessfully',
    })
    yield put({
      type: UPDATE_PROFILE_IMAGE_PATH_SUCCESS,
      payload: payload.data.thumbnail,
    })
  } catch (e) {
    console.error(e)
    notification({ messageKey: 'failedToUpdateImage' })
    yield put({
      type: UPDATE_PROFILE_IMAGE_PATH_FAILED,
    })
  }
}
function* updateUserDetailsSaga({ payload }) {
  try {
    const result = yield call(userApi.updateUser, payload)
    notification({
      type: 'success',
      messageKey: 'userDetailsUpdatedSUccessfully',
    })
    yield put({ type: UPDATE_USER_DETAILS_SUCCESS, payload: result })
    if (payload.isLogout) {
      notification({ type: 'success', messageKey: 'loggingOut' })
      yield put({ type: LOGOUT })
    }
  } catch (e) {
    console.error(e)
    notification({ messageKey: 'failedToUpdateUserDetails' })
    yield put({
      type: UPDATE_USER_DETAILS_FAILED,
    })
  }
}

function* deleteAccountSaga({ payload }) {
  try {
    yield call(userApi.deleteAccount, payload)
    notification({ type: 'success', messageKey: 'accountDeletedSuccessfully' })
    yield put({ type: LOGOUT })
  } catch (e) {
    console.error(e)
    notification({ messageKey: 'failedToUpdateUserDetails' })
  }
}

function* updateInterestedCurriculumsSaga({ payload }) {
  try {
    yield call(settingsApi.updateInterestedStandards, payload)
    notification({
      type: 'success',
      messageKey: 'standardSetsUpdatedSuccessfully',
    })
    yield put({
      type: UPDATE_INTERESTED_CURRICULUMS_SUCCESS,
      payload: payload.curriculums.map((item) => ({
        ...item,
        orgType: payload.orgType,
      })),
    })
  } catch (e) {
    yield put({ type: UPDATE_INTERESTED_CURRICULUMS_FAILED })
    console.error(e)
    if (e.status === 403 && e.response.data?.message) {
      notification({
        msg: e.response.data.message,
      })
    } else {
      notification({ messageKey: 'failedToUploadStandardSets' })
    }
  }
}

function* removeSchoolSaga({ payload }) {
  try {
    yield call(userApi.removeSchool, payload)
    notification({
      type: 'success',
      messageKey: 'requestedSchoolRemovedSucessfully',
    })
    yield put({ type: REMOVE_SCHOOL_SUCCESS, payload: payload.schoolId })
  } catch (e) {
    yield put({ type: REMOVE_SCHOOL_FAILED })
    console.error(e)
    if (e.status === 403) {
      notification({ msg: e.response.data })
    } else {
      notification({ messageKey: 'failedToRemoveRequestedSchool' })
    }
  }
}

function* addSchoolSaga({ payload = {} }) {
  try {
    const result = yield call(userApi.updateUser, payload)
    const user = pick(result, userPickFields)
    yield put({ type: ADD_SCHOOL_SUCCESS, payload: user })
    yield put({ type: HIDE_JOIN_SCHOOL })
  } catch (err) {
    yield put({ type: ADD_SCHOOL_FAILED })
    notification({ messageKey: 'failedToAddRequestedSchool' })
  }
}

function* createAndAddSchoolSaga({ payload = {} }) {
  const createSchoolPayload = payload.createSchool
  const joinSchoolPayload = payload.joinSchool
  const institutionIds = payload.institutionIds
  let isCreateSchoolSuccessful = false
  let result
  try {
    result = yield call(schoolApi.createSchool, createSchoolPayload)
    isCreateSchoolSuccessful = true
  } catch (err) {
    yield put({
      type: CREATE_AND_ADD_SCHOOL_FAILED,
    })
    console.log('err', err)
    notification({ messageKey: 'failedToCreateSchool' })
  }

  try {
    if (isCreateSchoolSuccessful) {
      joinSchoolPayload.data = {
        ...joinSchoolPayload.data,
        institutionIds: [...institutionIds, result._id],
        districtId: result.districtId,
      }
      const _result = yield call(userApi.updateUser, joinSchoolPayload)
      const user = pick(_result, userPickFields)
      yield put({ type: CREATE_AND_ADD_SCHOOL_SUCCESS, payload: user })
      yield put({ type: HIDE_JOIN_SCHOOL })
    }
  } catch (err) {
    console.log('_err', err)
    yield put({
      type: CREATE_AND_ADD_SCHOOL_FAILED,
    })
    notification({ messageKey: 'failedToJoinSchool' })
  }
}

function* studentSignupCheckClasscodeSaga({ payload }) {
  try {
    yield call(authApi.validateClassCode, payload.reqData)
  } catch (e) {
    if (payload.errorCallback) {
      payload.errorCallback(e?.response?.data?.message || 'Unknown Error')
    } else {
      notification({ msg: e?.response?.data?.message || 'Unknown Error' })
    }
  }
}

function* getInviteDetailsSaga({ payload }) {
  try {
    const result = yield call(authApi.getInvitedUserDetails, payload)
    yield put({ type: GET_INVITE_DETAILS_SUCCESS, payload: result })
  } catch (e) {
    yield put(push('/login'))
  }
}

function* setInviteDetailsSaga({ payload }) {
  try {
    const result = yield call(authApi.updateInvitedUserDetails, payload)

    const user = pick(result, userPickFields)
    TokenStorage.storeAccessToken(result.token, user._id, user.role, true)
    TokenStorage.selectAccessToken(user._id, user.role)
    yield call(fetchUser, {}) // needed to update org and other user data to local store
    yield put({ type: SET_INVITE_DETAILS_SUCCESS, payload: result })
  } catch (e) {
    yield call(message.err, 'Failed to update user details.')
  }
}

function* getCurrentDistrictUsersSaga({ payload }) {
  try {
    const users = yield call(userApi.fetchUsersFromDistrict, payload)
    yield put(getCurrentDistrictUsersSuccessAction(users))
  } catch (e) {
    notification({ messageKey: 'failedToGetUsersFromDistrict' })
    console.error(e)
  }
}

function* updateDefaultSettingsSaga({ payload }) {
  try {
    yield call(settingsApi.updateInterestedStandards, payload)
    notification({
      type: 'success',
      messageKey: 'defaultSettingsUpdatedSuccessfully',
    })
    yield put({ type: UPDATE_DEFAULT_SETTINGS_SUCCESS, payload })
  } catch (e) {
    yield put({ type: UPDATE_DEFAULT_SETTINGS_FAILED })
    console.error(e)
    notification({ messageKey: 'failedToUpdateDefaultSettings' })
  }
}

function* updatePowerTeacher({ payload }) {
  try {
    yield call(userApi.updatePowerTeacherTools, payload)
    notification({
      type: 'success',
      messageKey: 'powerTeacherToolsUpdatedSuccessfully',
    })
    yield put({ type: UPDATE_POWER_TEACHER_TOOLS_SUCCESS, payload })
  } catch (e) {
    yield put({ type: UPDATE_POWER_TEACHER_TOOLS_FAILED })
    notification({
      type: 'error',
      messageKey: 'failedToUpdatePowerTeacherTools',
    })
  }
}

export function* watcherSaga() {
  yield takeLatest(LOGIN, login)
  yield takeLatest(SIGNUP, signup)
  yield takeLatest(LOGOUT, logout)
  yield takeLatest(FETCH_USER, fetchUser)
  yield takeLatest(FETCH_V1_REDIRECT, fetchV1Redirect)
  yield takeLatest(CHANGE_CLASS, changeClass)
  yield takeLatest(GOOGLE_LOGIN, googleLogin)
  yield takeLatest(CLEVER_LOGIN, cleverLogin)
  yield takeLatest(ATLAS_LOGIN, atlasLogin)
  yield takeLatest(MSO_LOGIN, msoLogin)
  yield takeLatest(GOOGLE_SSO_LOGIN, googleSSOLogin)
  yield takeLatest(CLEVER_SSO_LOGIN, cleverSSOLogin)
  yield takeLatest(ATLAS_SSO_LOGIN, atlasSSOLogin)
  yield takeLatest(GET_USER_DATA, getUserData)
  yield takeLatest(MSO_SSO_LOGIN, msoSSOLogin)
  yield takeLatest(UPDATE_USER_ROLE_REQUEST, updateUserRoleSaga)
  yield takeLatest(REQUEST_NEW_PASSWORD_REQUEST, requestNewPasswordSaga)
  yield takeLatest(RESET_PASSWORD_USER_REQUEST, resetPasswordUserSaga)
  yield takeLatest(RESET_PASSWORD_REQUEST, resetPasswordRequestSaga)
  yield takeLatest(
    STUDENT_SIGNUP_CHECK_CLASSCODE_REQUEST,
    studentSignupCheckClasscodeSaga
  )
  yield takeLatest(GET_INVITE_DETAILS_REQUEST, getInviteDetailsSaga)
  yield takeLatest(SET_INVITE_DETAILS_REQUEST, setInviteDetailsSaga)
  yield takeLatest(RESET_MY_PASSWORD_REQUEST, resetMyPasswordRequestSaga)
  yield takeLatest(UPDATE_PROFILE_IMAGE_PATH_REQUEST, updateProfileImageSaga)
  yield takeLatest(UPDATE_USER_DETAILS_REQUEST, updateUserDetailsSaga)
  yield takeLatest(DELETE_ACCOUNT_REQUEST, deleteAccountSaga)
  yield takeLatest(
    UPDATE_INTERESTED_CURRICULUMS_REQUEST,
    updateInterestedCurriculumsSaga
  )
  yield takeLatest(REMOVE_SCHOOL_REQUEST, removeSchoolSaga)
  yield takeLatest(ADD_SCHOOL_REQUEST, addSchoolSaga)
  yield takeLatest(CREATE_AND_ADD_SCHOOL_REQUEST, createAndAddSchoolSaga)
  yield takeLatest(
    GET_CURRENT_DISTRICT_USERS_REQUEST,
    getCurrentDistrictUsersSaga
  )
  yield takeLatest(UPDATE_DEFAULT_SETTINGS_REQUEST, updateDefaultSettingsSaga)
  yield takeLatest(UPDATE_POWER_TEACHER_TOOLS_REQUEST, updatePowerTeacher)
}
