import { createAction, createReducer, createSelector } from 'redux-starter-kit'
import { pick, last, get, set, isBoolean, forIn, startsWith } from 'lodash'
import { takeLatest, call, put, select } from 'redux-saga/effects'
import { message } from 'antd'
import { captureSentryException } from '@edulastic/common/src/sentryHelpers'
import notification from '@edulastic/common/src/components/Notification'
import { push } from 'connected-react-router'
// import {
//   authApi,
//   userApi,
//   TokenStorage,
//   settingsApi,
//   segmentApi,
//   schoolApi,
// } from '@edulastic/api'
import authApi from '@edulastic/api/src/auth'
import userApi from '@edulastic/api/src/user'
import settingsApi from '@edulastic/api/src/settings'
import segmentApi from '@edulastic/api/src/segment'
import schoolApi from '@edulastic/api/src/school'
import * as TokenStorage from '@edulastic/api/src/utils/Storage'
import { roleuser, signUpState } from '@edulastic/constants'
import { toggleChatDisplay } from '@edulastic/common'
import firebase from 'firebase/app'
import * as Sentry from '@sentry/browser'
import roleType from '@edulastic/constants/const/roleType'
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
  isHashAssessmentUrl,
  removeSessionValue,
} from '../../common/utils/helpers'
import { userPickFields } from '../../common/utils/static/user'
import {
  signupDistrictPolicySelector,
  signupGeneralSettingsSelector,
  signupDistrictIdSelector,
  signupSchoolsSelector,
  updateUserSignupStateAction,
} from '../Signup/duck'
import {
  getUser,
  getUserOrgId,
  isSuperAdminSelector,
} from '../../author/src/selectors/user'
import { updateInitSearchStateAction } from '../../author/TestPage/components/AddItems/ducks'
import { JOIN_CLASS_REQUEST_SUCCESS } from '../ManageClass/ducks'
import 'firebase/auth'
import {
  addLoadingComponentAction,
  removeLoadingComponentAction,
} from '../../author/src/actions/authorUi'
import appConfig from '../../../app-config'
import {
  schoologySyncAssignmentAction,
  schoologySyncAssignmentGradesAction,
} from '../../author/src/actions/assignments'
import {
  fetchDashboardTiles,
  setShowJoinSchoolModalAction,
} from '../../author/Dashboard/ducks'
import { setSchoolAdminSettingsAccessAction } from '../../author/DistrictPolicy/ducks'
import {
  EXTERNAL_TOKEN,
  getExternalAuthToken,
  storeUserAuthToken,
} from '../../../loginUtils'

export const superAdminRoutes = [
  // SA-DA common routes
  '/author/districtprofile',
  '/author/schools',
  '/author/classes',
  '/author/courses',
  '/author/class-enrollment',
  '/author/groups',
  '/author/groups/students',
  '/author/users/district-admin',
  '/author/users/school-admin',
  '/author/users/teacher',
  '/author/users/student',
  '/author/content/collections',
  '/author/content/buckets',
  '/author/content/tools',
  '/author/settings/districtpolicies',
  '/author/settings/testsettings',
  '/author/settings/term',
  '/author/settings/interested-standards',
  '/author/settings/standards-proficiency',
  '/author/settings/performance-bands',
  '/author/settings/roster-import',
  // SA routes
  '/author/schoolprofile',
  '/author/settings/schoolpolicies',
]

// types
export const LOGIN = '[auth] login'
export const GOOGLE_LOGIN = '[auth] google login'
export const CLEVER_LOGIN = '[auth] clever login'
export const ATLAS_LOGIN = '[auth] atlas login'
export const NEWSELA_LOGIN = '[auth] newsela login'
export const MSO_LOGIN = '[auth] mso login'
export const GOOGLE_SSO_LOGIN = '[auth] google sso login'
export const CLEVER_SSO_LOGIN = '[auth] clever sso login'
export const MSO_SSO_LOGIN = '[auth] mso sso login'
export const ATLAS_SSO_LOGIN = '[auth] atlas sso login'
export const NEWSELA_SSO_LOGIN = '[auth] newsela sso login'
export const GET_USER_DATA = '[auth] get user data from sso response'
export const SET_USER = '[auth] set user'
export const SIGNUP = '[auth] signup'
export const SIGNUP_SUCCESS = '[auth] signup success'
export const SIGNUP_FAILED = '[auth] signup failed'
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
export const VERIFY_EMAIL_REQUEST = '[auth] verify email'
export const VERIFY_EMAIL_SUCCESS = '[auth] verify email success'
export const VERIFY_EMAIL_FAILED = '[auth] verify email failed'
export const SEND_VERIFICATION_EMAIL_REQUEST = '[auth] send verification email'
export const SEND_VERIFICATION_EMAIL_SUCCESS =
  '[auth] send verification email success'
export const SEND_VERIFICATION_EMAIL_FAILED =
  '[auth] send verification email failed'
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
export const SET_CLASS_TO_USER = '[user] set class to user'
export const SET_LOCATION_TO_USER = '[user] set location to user'
export const ADD_COLLECTION_PERMISSION = '[user] update item bank permission'
export const REMOVE_COLLECTION_PERMISSION = '[user] remove item bank permission'
export const SET_CLI_USER = '[user] set cli user'
export const TOGGLE_CLASS_CODE_MODAL = '[user] toggle class code modal'
export const TOGGLE_IMAGES_BLOCKED_NOTIFICATION =
  '[user] toggle images blocked notification'
export const TOGGLE_ROLE_CONFIRMATION =
  '[user] toggle student signing up as teacher'

export const PERSIST_AUTH_STATE_AND_REDIRECT =
  '[auth] persist auth entry state and request app bundle'

export const TOGGLE_IOS_RESTRICT_NAVIGATION_MODAL =
  '[user] toggle ios restrict navigation modal'
export const TOGGLE_ADMIN_ALERT_MODAL = '[user] toggle admin alert modal'
export const TOGGLE_VERIFY_EMAIL_MODAL = '[user] toggle verify email modal'
export const SET_IS_SIGNED_UP_USING_USERNAME_AND_PASSWORD =
  '[user] set signedUpUsingUsernameAndPassword flag'
export const SET_ON_PROFILE_PAGE = '[user] set on profile page'

export const TOGGLE_FORGOT_PASSWORD_MODAL =
  '[user] toggle forgot password modal'

export const LOGIN_ATTEMPT_EXCEEDED = '[user] too many login attempt'
export const SET_SHOW_ALL_STANDARDS = '[user] set show all standards'
export const FETCH_ORG_INTERESTED_STANDARDS =
  '[user] fetch org interested standards'
export const GET_EXTERNAL_AUTH_USER_REQUEST = '[user] get external auth user'
export const GET_EXTERNAL_AUTH_USER_SUCCESS =
  '[user] get external auth user success'
export const GET_EXTERNAL_AUTH_USER_FAILED =
  '[user] get external auth user failed'
export const SET_EXTERNAL_AUTH_USER_TOKEN =
  '[user] set external auth user token'
export const SET_USER_ACCESS_PUBLIC_CONTENT = '[user] set access public content'
export const SET_USER_FEATURES_BY_NAME = '[user] set user features'

// actions
export const setSettingsSaSchoolAction = createAction(SET_SETTINGS_SA_SCHOOL)
export const loginAction = createAction(LOGIN)
export const googleLoginAction = createAction(GOOGLE_LOGIN)
export const cleverLoginAction = createAction(CLEVER_LOGIN)
export const atlasLoginAction = createAction(ATLAS_LOGIN)
export const newselaLoginAction = createAction(NEWSELA_LOGIN)
export const msoLoginAction = createAction(MSO_LOGIN)
export const googleSSOLoginAction = createAction(GOOGLE_SSO_LOGIN)
export const cleverSSOLoginAction = createAction(CLEVER_SSO_LOGIN)
export const atlasSSOLoginAction = createAction(ATLAS_SSO_LOGIN)
export const newselaSSOLoginAction = createAction(NEWSELA_SSO_LOGIN)
export const getUserDataAction = createAction(GET_USER_DATA)
export const msoSSOLoginAction = createAction(MSO_SSO_LOGIN)
export const setUserAction = createAction(SET_USER)
export const setUserFeaturesAction = createAction(SET_USER_FEATURES_BY_NAME)
export const signupAction = createAction(SIGNUP)
export const signupSuccessAction = createAction(SIGNUP_SUCCESS)
export const signupFailureAction = createAction(SIGNUP_FAILED)
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
export const verifyEmailAction = createAction(VERIFY_EMAIL_REQUEST)
export const verifyEmailSuccessAction = createAction(VERIFY_EMAIL_SUCCESS)
export const verifyEmailFailedAction = createAction(VERIFY_EMAIL_FAILED)
export const sendVerificationEmailAction = createAction(
  SEND_VERIFICATION_EMAIL_REQUEST
)
export const sendVerificationEmailSuccessAction = createAction(
  SEND_VERIFICATION_EMAIL_SUCCESS
)
export const sendVerificationEmailFailedAction = createAction(
  SEND_VERIFICATION_EMAIL_FAILED
)
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
export const setClassToUserAction = createAction(SET_CLASS_TO_USER)
export const setLocationToUserAction = createAction(SET_LOCATION_TO_USER)
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
export const toggleRoleConfirmationPopupAction = createAction(
  TOGGLE_ROLE_CONFIRMATION
)

export const persistAuthStateAndRedirectToAction = createAction(
  PERSIST_AUTH_STATE_AND_REDIRECT
)

export const toggleIosRestrictNavigationModalAction = createAction(
  TOGGLE_IOS_RESTRICT_NAVIGATION_MODAL
)

export const toggleAdminAlertModalAction = createAction(
  TOGGLE_ADMIN_ALERT_MODAL
)

export const toggleVerifyEmailModalAction = createAction(
  TOGGLE_VERIFY_EMAIL_MODAL
)

export const setIsUserSignedUpUsingUsernameAndPassword = createAction(
  SET_IS_SIGNED_UP_USING_USERNAME_AND_PASSWORD
)

export const setIsUserOnProfilePageAction = createAction(SET_ON_PROFILE_PAGE)

export const setForgotPasswordVisibleAction = createAction(
  TOGGLE_FORGOT_PASSWORD_MODAL
)

export const setTooManyAttemptAction = createAction(LOGIN_ATTEMPT_EXCEEDED)

export const setShowAllStandardsAction = createAction(SET_SHOW_ALL_STANDARDS)

export const fetchOrgInterestedStandardsAction = createAction(
  FETCH_ORG_INTERESTED_STANDARDS
)

export const getExternalAuthUserAction = createAction(
  GET_EXTERNAL_AUTH_USER_REQUEST
)

export const setUserAccessPublicContent = createAction(
  SET_USER_ACCESS_PUBLIC_CONTENT
)
export const setExternalAuthUserTokenAction = createAction(
  SET_EXTERNAL_AUTH_USER_TOKEN
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
  isRoleConfirmation: false,
  iosRestrictNavigationModalVisible: false,
  showAdminAlertModal: false,
  showVerifyEmailModal: false,
  emailVerifiedStatus: '',
  signedUpUsingUsernameAndPassword: false,
  isUserIdPresent: true,
  isExternalUserLoading: false,
  externalUserToken: null,
  signupInProgress: false,
}

function getValidRedirectRouteByRole(_url, user) {
  const url = (_url || '').trim()
  if (url.includes('home/group') && url.includes('assignment')) {
    return url
  }
  switch (user.role) {
    case roleuser.TEACHER:
      return url.match(/^\/author\//) || url.match(/\/embed\//)
        ? url
        : '/author/dashboard'
    case roleuser.STUDENT:
      return url.match(/^\/home\//) ||
        url.includes('/author/tests/tab/review/id/') ||
        url.match(/\/embed\//) ||
        url.includes('author/tests/verid')
        ? url
        : '/home/assignments'
    case roleuser.EDULASTIC_ADMIN:
      return url.match(/^\/admin\//) ? url : '/admin/proxyUser'
    case roleuser.EDULASTIC_CURATOR:
      return url.match(/^\/author\//) ? url : '/author/items'
    case roleuser.SCHOOL_ADMIN:
      return url.match(/^\/author\/(?!.*dashboard)/)
        ? url
        : '/author/assignments'
    case roleuser.DISTRICT_ADMIN:
      if ((user.permissions || []).includes('curator'))
        return url.match(/^\/publisher\//) ||
          url.match(/^\/author\/(?!.*dashboard)/)
          ? url
          : '/publisher/dashboard'
      if (!user?.features?.premium) {
        return url.match(/^\/author\/(?!.*dashboard)(?!.*assignments)/)
          ? url
          : '/author/reports'
      }
      return url.match(/^\/author\/(?!.*dashboard)/)
        ? url
        : '/author/assignments'
    default:
      return url
  }
}

const getRouteByGeneralRoute = (user) => {
  const {
    isDataOpsOnlyUser,
    isInsightsOnlyUser,
    premium,
    isCurator,
    isPublisherAuthor,
  } = user?.user?.features || {}
  switch (user.user.role) {
    case roleuser.EDULASTIC_ADMIN:
      return '/admin/search/clever'
    case roleuser.DISTRICT_GROUP_ADMIN:
      return '/author/reports/data-warehouse-reports'
    case roleuser.DISTRICT_ADMIN:
      if (isDataOpsOnlyUser) {
        return '/author/data-warehouse'
      }
      if (!premium || isInsightsOnlyUser) {
        return '/author/reports'
      }
      return '/author/assignments'
    case roleuser.SCHOOL_ADMIN:
      if (!premium || isInsightsOnlyUser) {
        return '/author/reports'
      }
      if (isCurator) {
        return '/publisher/dashboard'
      }
      return '/author/assignments'
    case roleuser.TEACHER:
      if (isPublisherAuthor) {
        return '/author/items'
      }
      return '/author/dashboard'
    case roleuser.STUDENT:
    case roleuser.PARENT:
      return '/home/assignments'
    case roleuser.EDULASTIC_CURATOR:
      return '/author/tests'
    default:
  }
}

const loginPaths = ['/', '/resetPassword', '/districtLogin', '/district']

const isPartOfLoginRoutes = (pathname) =>
  !loginPaths.some((path) =>
    (pathname || window.location.pathname).startsWith(path)
  )

function* persistAuthStateAndRedirectToSaga({ payload }) {
  const { _redirectRoute, toUrl } = payload || {}
  const { user } = yield select((_state) => _state) || {}

  if (!user.user) return

  let redirectRoute = _redirectRoute || ''

  let appRedirectPath = localStorage.getItem('loginRedirectUrl')
  const assignPageRegex = /\/assignments\/([a-f\d]{24})(?:\/)?$/
  if (
    assignPageRegex.test(appRedirectPath) &&
    user?.user?.currentSignUpState === signUpState.ACCESS_WITHOUT_SCHOOL &&
    user?.user?.role === roleuser.TEACHER
  ) {
    const testId = last(appRedirectPath.split('/'))
    appRedirectPath = `/author/tests/tab/review/id/${testId}`
    localStorage.setItem('loginRedirectUrl', appRedirectPath)
    sessionStorage.setItem('completeSignUp', true)
  }
  if (appRedirectPath && !isPartOfLoginRoutes(appRedirectPath)) {
    redirectRoute = getValidRedirectRouteByRole(
      appRedirectPath,
      user.user || {}
    )
    localStorage.removeItem('loginRedirectUrl')
  } else if (toUrl && !isPartOfLoginRoutes(toUrl) && toUrl != '/') {
    redirectRoute = toUrl
  } else if (localStorage.getItem('schoologyAssignmentRedirectUrl')) {
    redirectRoute = localStorage.getItem('schoologyAssignmentRedirectUrl')
    localStorage.removeItem('schoologyAssignmentRedirectUrl')
  } else if (!window.location.pathname.includes('home/group')) {
    redirectRoute = getRouteByGeneralRoute(user)
  }

  if (redirectRoute) {
    window.location.replace(redirectRoute)
  }
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
  state.user = {
    ...payload,
    pearToken: payload?.pearToken ?? state.user?.pearToken,
  }
  if (payload.role === 'parent' && payload?.children?.length > 0) {
    state.currentChild = payload.children[0]._id
    set(state, 'user.orgData', payload.children[0].orgData)
  }
  state.user.middleName = payload.middleName || undefined
  state.user.lastName = payload.lastName || undefined
  state.user.openIdProvider = payload.openIdProvider || undefined
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
  state.signupInProgress = false
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
  [SET_USER_ACCESS_PUBLIC_CONTENT]: (state, { payload }) => {
    if (!(state.user && state.user && state.user.features && payload)) {
      return state
    }
    state.user.features.canAccessPublicContent = !!payload.canAccessPublicContent
  },
  [SET_SETTINGS_SA_SCHOOL]: (state, { payload }) => {
    state.saSettingsSchool = payload
  },
  [TOGGLE_IOS_RESTRICT_NAVIGATION_MODAL]: (state, { payload }) => {
    state.iosRestrictNavigationModalVisible = payload
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
  [SIGNUP]: (state) => {
    state.signupInProgress = true
  },
  [SIGNUP_SUCCESS]: setUser,
  [SIGNUP_FAILED]: (state) => {
    state.signupInProgress = false
  },
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
  [VERIFY_EMAIL_SUCCESS]: (state, { payload }) => {
    state.emailVerifiedStatus = payload.message ? 'alreadyVerified' : 'success'
    state.userId = payload._id
    state.user = state.user || {}
    if (payload._id) {
      Object.assign(state.user, { _id: payload._id, ...state.user })
    }
  },
  [VERIFY_EMAIL_FAILED]: (state, { payload }) => {
    const { error, user } = payload
    state.emailVerifiedStatus = error?.message ? 'linkExpired' : 'failed'
    // if verification code has expired while verifying email then only set user id
    state.user = state.user || {}
    if (user?._id) {
      Object.assign(state.user, { _id: user._id, ...state.user })
    } else if (error?.message === 'Link expired') {
      state.isUserIdPresent = false
    }
  },
  [SEND_VERIFICATION_EMAIL_SUCCESS]: (state) => {
    state.emailVerifiedStatus = ''
    state.sendEmailVerificationLinkStatus = 'success'
  },
  [SEND_VERIFICATION_EMAIL_FAILED]: (state) => {
    state.emailVerifiedStatus = ''
    state.sendEmailVerificationLinkStatus = 'failed'
  },
  [SET_IS_SIGNED_UP_USING_USERNAME_AND_PASSWORD]: (state) => {
    state.signedUpUsingUsernameAndPassword = true
  },
  [SET_ON_PROFILE_PAGE]: (state, { payload }) => {
    state.onProfilePage = payload
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
    const accountIdx = (state.user.otherAccounts || []).findIndex(
      (u) => u._id === state.user._id
    )
    if (accountIdx !== -1) {
      const oldData = state.user.otherAccounts[accountIdx]
      state.user.otherAccounts[
        accountIdx
      ].institutionIds = oldData?.institutionIds?.filter((id) => id !== payload)
      state.user.otherAccounts[
        accountIdx
      ].institutions = oldData?.institutions?.filter(
        (school) => school._id !== payload
      )
    }
  },
  [REMOVE_SCHOOL_FAILED]: (state) => {
    state.removingSchool = undefined
  },
  [ADD_SCHOOL_REQUEST]: (state) => {
    state.addingSchool = true
  },
  [ADD_SCHOOL_SUCCESS]: (state, { payload }) => {
    state.addingSchool = false
    state.user.institutionIds = payload.institutionIds || []
    state.user.orgData.institutionIds = payload.orgData.institutionIds
    state.user.orgData.schools = payload.orgData.schools
    state.user.otherAccounts = payload.otherAccounts || state.user.otherAccounts
  },
  [ADD_SCHOOL_FAILED]: (state) => {
    state.addingSchool = undefined
  },
  [CREATE_AND_ADD_SCHOOL_REQUEST]: (state) => {
    state.creatingAddingSchool = true
  },
  [CREATE_AND_ADD_SCHOOL_SUCCESS]: (state, { payload }) => {
    state.creatingAddingSchool = false
    state.user.institutionIds = payload.institutionIds || []
    state.user.orgData.institutionIds = payload.orgData.institutionIds
    state.user.orgData.schools = payload.orgData.schools
    state.user.otherAccounts = payload.otherAccounts || state.user.otherAccounts
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
      defaultGrades: defaultGrades || [],
      defaultSubjects: defaultSubjects || [],
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
    } else if (Object.prototype.hasOwnProperty.call(payload, 'enable')) {
      Object.assign(state.user, {
        isPowerTeacher: payload.enable,
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
  [SET_CLASS_TO_USER]: (state, { payload }) => {
    state.user.orgData.classList = payload
  },
  [SET_LOCATION_TO_USER]: (state, { payload }) => {
    state.user.location = payload
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
  [TOGGLE_ROLE_CONFIRMATION]: (state, { payload }) => {
    if (isBoolean(payload)) {
      state.isRoleConfirmation = payload
    } else {
      state.isRoleConfirmation = true
      state.email = payload
    }
  },
  [TOGGLE_ADMIN_ALERT_MODAL]: (state) => {
    state.showAdminAlertModal = !state.showAdminAlertModal
  },
  [TOGGLE_VERIFY_EMAIL_MODAL]: (state, { payload }) => {
    state.showVerifyEmailModal = payload
  },
  [TOGGLE_FORGOT_PASSWORD_MODAL]: (state, { payload }) => {
    state.forgotPasswordVisible = payload
  },
  [LOGIN_ATTEMPT_EXCEEDED]: (state, { payload }) => {
    state.tooManyAttempt = payload
  },
  [SET_SHOW_ALL_STANDARDS]: (state, { payload }) => {
    state.user.orgData.showAllStandards = payload
  },
  [GET_EXTERNAL_AUTH_USER_REQUEST]: (state) => {
    state.isExternalUserLoading = true
  },
  [GET_EXTERNAL_AUTH_USER_SUCCESS]: (state) => {
    state.isExternalUserLoading = false
  },
  [GET_EXTERNAL_AUTH_USER_FAILED]: (state) => {
    state.isExternalUserLoading = false
  },
  [SET_EXTERNAL_AUTH_USER_TOKEN]: (state, { payload }) => {
    state.externalUserToken = payload || null
  },
  [SET_USER_FEATURES_BY_NAME]: (state, { payload }) => {
    const { featureName, value } = payload
    state.user.features[featureName] = value
  },
})

export const getUserDetails = createSelector(['user.user'], (user) => user)
export const getSignupProgressStatus = createSelector(
  ['user'],
  (user) => user.signupInProgress
)

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

export const isDemoPlaygroundUser = createSelector(
  ['user.user.isPlayground'],
  (isPlayground) => isPlayground
)

export const getIsExternalUserLoading = createSelector(
  ['user.isExternalUserLoading'],
  (isExternalUserLoading) => isExternalUserLoading
)

export const getIsProxiedByEAAccountSelector = createSelector(
  [isProxyUser],
  (_isProxyUser) => {
    const defaultTokenKey = sessionStorage.getItem('defaultTokenKey')
    if (defaultTokenKey) {
      const role = defaultTokenKey.split(':')[3]
      if (role === roleuser.EDULASTIC_ADMIN && _isProxyUser) {
        return true
      }
    }
    return false
  }
)

export const proxyRole = createSelector(
  ['user.user.proxyRole'],
  (proxyrole) => proxyrole
)

export const getEmailVerified = createSelector(
  ['user.user.emailVerified'],
  (emailVerified) => emailVerified
)

export const getVerificationTS = createSelector(
  ['user.user.verificationTS'],
  (verificationTS) => verificationTS
)

export const isDefaultDASelector = createSelector(
  [getUserOrgId, 'user.user.email', getUserRole],
  (districtId, email, role) =>
    email === `${districtId}@edulastic.com` && role === roleType.DISTRICT_ADMIN
)

export const isSignupUsingUNAndPassSelector = createSelector(
  ['user.signedUpUsingUsernameAndPassword'],
  (signedUpUsingUsernameAndPassword) => signedUpUsingUsernameAndPassword
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

export const getIsEmailVerifedSelector = createSelector(
  ['user.emailVerifiedStatus'],
  (r) => r
)

export const getIsEmailVerificationLinkSent = createSelector(
  ['user.sendEmailVerificationLinkStatus'],
  (r) => r
)

export const getForgotPasswordVisible = createSelector(
  ['user.forgotPasswordVisible'],
  (r) => r
)

export const getTooManyAtempt = createSelector(
  ['user.tooManyAttempt'],
  (r) => r
)

export const getShowVerifyEmailModal = createSelector(
  ['user.showVerifyEmailModal'],
  (r) => r
)

export const getExternalUserTokenSelector = createSelector(
  ['user.externalUserToken'],
  (r) => r
)

export const getIsCpm = createSelector(
  [getUserDetails],
  (user) =>
    user?.utm_source?.toLowerCase()?.includes('cpm') ||
    user?.referrer?.toLowerCase()?.includes('cpm')
)

const routeSelector = (state) => state.router.location.pathname

function getCurrentFirebaseUser() {
  return firebase.auth().currentUser?.uid || undefined
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
          Sentry.captureMessage(
            'Logged in teacher is a part of multiple districts.',
            'info'
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
    if (status === 429) {
      // set the flag to show reset password popup
      yield put(setForgotPasswordVisibleAction(true))
      yield put(setTooManyAttemptAction(true))
      // reset too many atempt flag on close of reset password modal
    } else {
      notification({ msg: errorMessage })
    }
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

  const districtId = yield select(signupDistrictIdSelector)
  const institutionIds = yield select(signupSchoolsSelector)

  try {
    const {
      name,
      email,
      password,
      role,
      classCode,
      passwordForExistingUser,
      isAdmin,
      utm_source,
      token,
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
      institutionIds,
      utm_source,
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
    if (token) {
      obj.token = token
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
        yield put(signupFailureAction())
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

      yield put(signupSuccessAction(result))
      localStorage.removeItem('loginRedirectUrl')

      if (generalSettings) {
        setSignOutUrl(getDistrictSignOutUrl(generalSettings))
      }
      if (user.role === roleType.STUDENT) {
        yield put(persistAuthStateAndRedirectToAction())
      } else if (
        user.role === roleType.TEACHER &&
        user.currentSignUpState === signUpState.ACCESS_WITHOUT_SCHOOL
      ) {
        window.location.replace('/author/dashboard')
      } else {
        yield put(push('/Signup'))
      }
    }
  } catch (err) {
    yield put(signupFailureAction())
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
  const search = window.location?.search
  if (pathname === '/getstarted') {
    return `/getStarted${search}`
  }
  if (pathname === '/signup') {
    return `/signup${search}`
  }
  if (pathname === '/studentsignup') {
    return '/studentsignup'
  }
  if (
    pathname === '/' &&
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
  if (pathname === '/inviteteacher' || isHashAssessmentUrl()) {
    return `${window.location.pathname}${window.location.search}${window.location.hash}`
  }
  if (pathname.includes('partnerlogin')) {
    return pathname
  }
  if (pathname.includes('/verify/')) {
    return pathname
  }
  if (pathname.includes('/login') && search.includes(EXTERNAL_TOKEN)) {
    return `${pathname}${search}`
  }
  return '/login'
}

export function* fetchUser({ payload }) {
  try {
    const isExternalTokenRequest = getExternalAuthToken()
    if (isExternalTokenRequest) {
      console.log('Avoided 0x409!!')
      return
    }
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
      if (
        !isPartOfLoginRoutes() &&
        !window.location.pathname.includes('home/group')
      ) {
        yield put(push('/login'))
      }
      return
    }
    const firebaseUser = yield call(getCurrentFirebaseUser)
    const user =
      (yield call(userApi.getUser, firebaseUser ? undefined : true)) || {}
    if (
      (!firebaseUser && user?.firebaseAuthToken) ||
      (firebaseUser && firebaseUser !== user._id && user?.firebaseAuthToken)
    ) {
      yield firebase.auth().signInWithCustomToken(user.firebaseAuthToken)
    }
    yield call(segmentApi.analyticsIdentify, { user })
    const key = `${localStorage.getItem('defaultTokenKey')}`

    if (key.includes('role:undefined') && user.role) {
      TokenStorage.removeAccessToken(user._id, 'undefined')
      // add last used or current districtId
      TokenStorage.storeAccessToken(user.token, user._id, user.role, true)
      TokenStorage.selectAccessToken(user._id, user.role)
    }
    TokenStorage.updateKID(user || {})
    const searchParam = yield select((state) => state.router.location.search)
    if (searchParam.includes('showCliBanner=1'))
      localStorage.setItem('showCLIBanner', true)
    yield put(setUserAction(user))
    yield call(segmentApi.analyticsIdentify, { user })
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
        Sentry.captureMessage(
          'Logged in teacher is a part of multiple districts.',
          'info'
        )
      })
    }
    const location = yield select(routeSelector)
    const isSuperAdmin = yield select(isSuperAdminSelector)
    if (
      (user.role === roleuser.DISTRICT_ADMIN ||
        user.role === roleuser.SCHOOL_ADMIN) &&
      !isSuperAdmin &&
      superAdminRoutes.includes(location)
    ) {
      const messageKey =
        user.role === roleuser.DISTRICT_ADMIN
          ? 'warnAccessRestrictedUrlDA'
          : 'warnAccessRestrictedUrlSA'

      yield put(push('/'))
      notification({
        type: 'warn',
        messageKey,
      })
    }
    const cliBannerShown =
      sessionStorage.cliBannerShown === 'true' ||
      !window.location?.search?.includes('showCLIBanner=1')
    const cliCheck = [
      user?.openIdProvider?.toLowerCase() === 'cli',
      cliBannerShown,
    ].every((o) => !!o)
    const canShowJoinSchoolModal = [
      user?.role == roleuser.TEACHER,
      user?.currentSignUpState !== signUpState.DONE,
      cliCheck,
      !!user?.isPolicyAccepted,
    ].every((o) => !!o)
    if (canShowJoinSchoolModal) {
      yield put(setShowJoinSchoolModalAction(true))
    }
  } catch (error) {
    console.log('err', error, error)
    if (
      error?.response &&
      error?.response?.status === 409 &&
      error?.response?.data?.message === 'oldToken'
    ) {
      window.dispatchEvent(new Event('student-session-expired'))
      return
    }
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

function redirectToUrl(url) {
  window.location.href = url
}

function* logout() {
  try {
    const user = yield select(getUser)
    if (user.isProxy || user.isPlayground) {
      TokenStorage.removeAccessToken(user._id, user.role)
      window.close()
    } else {
      if (user && TokenStorage.getAccessTokenForUser(user._id, user.role)) {
        yield call(userApi.logout)
      }
      // localStorage.clear()
      forIn(localStorage, (value, objKey) => {
        if (
          !startsWith(objKey, 'recommendedTest:') &&
          !startsWith(objKey, 'author:dashboard:classFilter:')
        ) {
          localStorage.removeItem(objKey)
        }
      })
      const districtId = yield select(getUserOrgId)
      sessionStorage.removeItem('cliBannerShown')
      sessionStorage.removeItem('cliBannerVisible')
      sessionStorage.removeItem('addAccountDetails')
      removeSessionValue({
        key: 'assignments_filter',
        userId: user._id,
        districtId,
      })
      sessionStorage.removeItem('temporaryClass')
      TokenStorage.removeKID()
      TokenStorage.initKID()
      TokenStorage.removeAllTokens()
      yield put({ type: 'RESET' })
      yield call(redirectToUrl, getSignOutUrl())
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
  localStorage.removeItem('thirdPartySignOnRole')
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
        segmentApi.genericEventTrack('Signup_ButtonClick', { Method: 'Google' })
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
    TokenStorage.removeAllTokens()
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
    if (e.status === 409) {
      const email = get(e, 'response.data.email', 'Email')
      yield put(toggleRoleConfirmationPopupAction(email))
      return
    }
    if (errorMessage === 'signInUserNotFound') {
      yield put(push(getStartedUrl()))
      notification({ type: 'warn', messageKey: 'signInUserNotFound' })
    } else if (errorMessage === 'teacherSignUpNotAllowed') {
      yield put(push(getSignOutUrl()))
      removeSignOutUrl()
      notification({ type: 'warn', messageKey: 'teacherSignUpNotAllowed' })
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
  localStorage.removeItem('thirdPartySignOnRole')
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
        segmentApi.genericEventTrack('Signup_ButtonClick', { Method: 'MSO' })
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
    TokenStorage.removeAllTokens()
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
    } else if (errorMessage === 'teacherSignUpNotAllowed') {
      yield put(push(getSignOutUrl()))
      removeSignOutUrl()
      notification({ type: 'warn', messageKey: 'teacherSignUpNotAllowed' })
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
  let isLogin = false
  if (payload.isLogin) {
    isLogin = payload.isLogin
    payload = payload.payload
  }
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
    if (payload === 'teacher' && !isLogin) {
      segmentApi.genericEventTrack('Signup_ButtonClick', { Method: 'Clever' })
    }
    const res = yield call(authApi.cleverLogin)
    TokenStorage.removeAllTokens()
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
      notification({ msg: errorMessage || 'Clever Login failed' })
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
      segmentApi.genericEventTrack('Signup_ButtonClick', { Method: 'Atlas' })
    }
    const res = yield call(authApi.atlasLogin, params)
    TokenStorage.removeAllTokens()
    window.location.href = res
  } catch (e) {
    localStorage.removeItem('schoologyAssignmentRedirectUrl')
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
      notification({
        msg:
          e?.data?.message ||
          e?.response?.data?.message ||
          'Atlas Login failed',
      })
      yield put(push(getSignOutUrl()))
    }
    removeSignOutUrl()
  }
  localStorage.removeItem('thirdPartySignOnRole')
  localStorage.removeItem('thirdPartySignOnGeneralSettings')
}

function* newselaLogin({ payload }) {
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
    const res = yield call(authApi.newselaLogin, params)
    TokenStorage.removeAllTokens()
    window.location.href = res
  } catch (e) {
    notification({ messageKey: 'newselaLoginFailed' })
  }
}

function* newselaSSOLogin({ payload }) {
  try {
    if (payload.code) {
      const res = yield call(authApi.newselaSSOLogin, payload)
      yield put(getUserDataAction(res))
    } else {
      const {
        loginUrl: authUrl,
        clientId: newselaClientId,
        redirectUrl: newselaRedirectUrl,
      } = appConfig.newsela

      const ssoRedirect = `${authUrl}?client_id=${newselaClientId}&response_type=code&redirect_uri=${newselaRedirectUrl}`
      window.location.replace(ssoRedirect)
      return
    }
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
      notification({ messageKey: 'newselaLoginFailed' })
      yield put(push(getSignOutUrl()))
    }
    removeSignOutUrl()
  }
  localStorage.removeItem('thirdPartySignOnRole')
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
      // if redirect is happening for LCB and user did action schoology sync
      const schoologySync = localStorage.getItem('schoologyShare')
      if ((redirectUrl || '').includes('classboard')) {
        const fragments = redirectUrl.split('/')
        const assignmentId = fragments[3]
        const classSectionId = fragments[4]
        if (schoologySync === 'grades') {
          schoologySyncAssignmentGradesAction({
            assignmentId,
            groupId: classSectionId,
          })
        } else if (schoologySync === 'assignment') {
          schoologySyncAssignmentAction({
            assignmentIds: [assignmentId],
            groupId: classSectionId,
          })
        }
      }
      if (
        !(
          user?.role === roleuser.STUDENT &&
          (redirectUrl.includes('author/tests/verid') ||
            redirectUrl.includes('/author/tests/tab/review/id/')) &&
          window.location.pathname.includes('/auth')
        )
      ) {
        // When student is authenticating and redirect url is a test sharing link, do not clear the loginRedirectUrl from storage
        // This will allow us to correct the URL (replace author with home) and redirect on persistAuthStateAndRedirectToSaga call
        localStorage.removeItem('loginRedirectUrl')
      }
      yield put(push(redirectUrl))
    }

    // Important redirection code removed, redirect code already present in /src/client/App.js
    // it receives new user props in each steps of teacher signup and for other roles
  } catch (e) {
    console.log(e)
    notification({ messageKey: 'failedToFetchUserData' })
    localStorage.removeItem('schoologyAssignmentRedirectUrl')

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
    console.log('e', e)
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
      yield put(push('/'))
    }
  } catch (e) {
    notification({
      msg: e?.response?.data?.message
        ? e.response.data.message
        : 'Failed to user data.',
    })
    yield put(push('/'))
  }
}

function* fetchShowAllStandardsSaga({ payload }) {
  try {
    const { districtId, schoolId } = payload
    const data = { districtId, institutionId: schoolId }
    const { showAllStandards, schoolAdminSettingsAccess } = yield call(
      settingsApi.fetchOrgInterestedStandards,
      data
    )
    yield put(setShowAllStandardsAction(showAllStandards))
    yield put(setSchoolAdminSettingsAccessAction(schoolAdminSettingsAccess))
  } catch (e) {
    captureSentryException(e)
    notification({
      msg: 'Failed to fetch user selected school details.',
    })
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
    yield put(push(`/`)) // navigate user to dashboard once user password reset success and loaded
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
    const res = yield call(userApi.resetMyPassword, payload)
    if (res?.status === 200) {
      notification({
        type: 'success',
        messageKey: 'passwordChangedSucessfully',
      })
      yield put({ type: RESET_MY_PASSWORD_SUCCESS })
    }
  } catch (e) {
    console.error(e)
    notification({ messageKey: 'failedToResetPassword' })
    yield put({
      type: RESET_MY_PASSWORD_FAILED,
    })
  }
}

function* verifyEmailSaga({ payload }) {
  let res
  try {
    res = yield call(authApi.verifyEmail, payload)
    const { error } = res
    if (error) {
      yield put({
        type: VERIFY_EMAIL_FAILED,
        payload: res,
      })
    } else {
      yield put({
        type: VERIFY_EMAIL_SUCCESS,
        payload: res,
      })
    }
  } catch (e) {
    console.error(e)
    notification({
      msg: e?.response?.data?.message
        ? e.response.data.message
        : 'Failed to verify email.',
    })
    yield put({
      type: VERIFY_EMAIL_FAILED,
    })
  }
}

function* sendVerificationEmailSaga({ payload }) {
  try {
    const res = yield call(authApi.sendEmailVerificationLink, payload)
    yield put({
      type: SEND_VERIFICATION_EMAIL_SUCCESS,
      payload: res,
    })
  } catch (e) {
    console.error(e)
    notification({
      msg: e?.response?.data?.message
        ? e.response.data.message
        : 'Failed to send verification link.',
    })
    yield put({
      type: SEND_VERIFICATION_EMAIL_FAILED,
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

export function* addSchoolSaga({ payload = {} }) {
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
  const institutionIds = payload.institutionIds || []
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
    yield put(push('/'))
  }
}

function* setInviteDetailsSaga({ payload }) {
  try {
    const result = yield call(authApi.updateInvitedUserDetails, payload)

    const user = pick(result, userPickFields)
    TokenStorage.storeAccessToken(result.token, user._id, user.role, true)
    TokenStorage.selectAccessToken(user._id, user.role)
    yield call(fetchUser, {}) // needed to update org and other user data to local store
    const userFeatures = yield select(getUserFeatures)
    yield put({
      type: SET_INVITE_DETAILS_SUCCESS,
      payload: { ...result, features: userFeatures },
    })
  } catch (e) {
    yield call(message.error, 'Failed to update user details.')
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
    window.localStorage.setItem('author:dashboard:version', 0)
    yield put(fetchDashboardTiles())
    yield put(updateUserSignupStateAction())
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

// Show or hide chat widget after receiving user
function* initiateChatWidgetAfterUserLoadSaga({ payload }) {
  /* eslint require-yield:0 */
  // Hiding chat widget for edulastic admin because internal user
  if (
    payload.role === roleuser.EDULASTIC_ADMIN ||
    payload.role === roleuser.STUDENT
  ) {
    toggleChatDisplay('hide')
  } else {
    appConfig.initEmbeddedServiceCloudWidget(payload)
  }
}

function* getAuthorizedExternalUser({ payload }) {
  const { isPearSignUpFlow } = payload
  delete payload.isPearSignUpFlow
  try {
    const userDetails = yield call(authApi.getExternalUser, payload)
    if (isPearSignUpFlow) {
      yield put({ type: GET_EXTERNAL_AUTH_USER_SUCCESS })
      yield put(setExternalAuthUserTokenAction(userDetails?.userToken))
    } else {
      storeUserAuthToken(userDetails)
      yield put({ type: GET_EXTERNAL_AUTH_USER_SUCCESS })
      const redirectPath =
        userDetails.redirectPath ||
        getRouteByGeneralRoute({ user: userDetails })
      localStorage.setItem('loginRedirectUrl', redirectPath)
      window.location.replace(redirectPath)
    }
  } catch (e) {
    yield put({ type: GET_EXTERNAL_AUTH_USER_FAILED })
    notification({
      exact: true,
      type: 'error',
      messageKey: 'failedToAutorizeUsingToken',
    })
    yield put(push('/login'))
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
  yield takeLatest(NEWSELA_LOGIN, newselaLogin)
  yield takeLatest(MSO_LOGIN, msoLogin)
  yield takeLatest(GOOGLE_SSO_LOGIN, googleSSOLogin)
  yield takeLatest(CLEVER_SSO_LOGIN, cleverSSOLogin)
  yield takeLatest(ATLAS_SSO_LOGIN, atlasSSOLogin)
  yield takeLatest(NEWSELA_SSO_LOGIN, newselaSSOLogin)
  yield takeLatest(GET_USER_DATA, getUserData)
  yield takeLatest(MSO_SSO_LOGIN, msoSSOLogin)
  yield takeLatest(UPDATE_USER_ROLE_REQUEST, updateUserRoleSaga)
  yield takeLatest(REQUEST_NEW_PASSWORD_REQUEST, requestNewPasswordSaga)
  yield takeLatest(RESET_PASSWORD_USER_REQUEST, resetPasswordUserSaga)
  yield takeLatest(FETCH_ORG_INTERESTED_STANDARDS, fetchShowAllStandardsSaga)
  yield takeLatest(VERIFY_EMAIL_REQUEST, verifyEmailSaga)
  yield takeLatest(SEND_VERIFICATION_EMAIL_REQUEST, sendVerificationEmailSaga)
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
  yield takeLatest(
    PERSIST_AUTH_STATE_AND_REDIRECT,
    persistAuthStateAndRedirectToSaga
  )
  yield takeLatest(SET_USER, initiateChatWidgetAfterUserLoadSaga)
  yield takeLatest(GET_EXTERNAL_AUTH_USER_REQUEST, getAuthorizedExternalUser)
}
