/* eslint-disable no-template-curly-in-string */
import { createAction, createReducer } from 'redux-starter-kit'
import {
  all,
  takeEvery,
  call,
  put,
  select,
  takeLatest,
} from 'redux-saga/effects'
import { createSelector } from 'reselect'
import { captureSentryException, notification } from '@edulastic/common'
import { get, findIndex, keyBy } from 'lodash'
import {
  googleApi,
  groupApi,
  enrollmentApi,
  userApi,
  canvasApi,
  cleverApi,
} from '@edulastic/api'
import * as Sentry from '@sentry/browser'
import { push } from 'connected-react-router'
import { receiveTeacherDashboardAction } from '../Dashboard/ducks'
import { fetchGroupsAction, addGroupAction } from '../sharedDucks/groups'
import {
  setUserGoogleLoggedInAction,
  addClassToUserAction,
  fetchUserAction,
} from '../../student/Login/ducks'
import { requestEnrolExistingUserToClassAction } from '../ClassEnrollment/ducks'
import {
  addLoadingComponentAction,
  removeLoadingComponentAction,
} from '../src/actions/authorUi'

// selectors
const manageClassSelector = (state) => state.manageClass
export const getSelectedSubject = createSelector(
  manageClassSelector,
  (state) => state.selectedSubject
)
export const getSelectedClassName = createSelector(
  manageClassSelector,
  (state) => state.entity.name
)

export const getGoogleCourseListSelector = createSelector(
  manageClassSelector,
  (state) => state.googleCourseList
)

export const getCleverClassListSelector = createSelector(
  manageClassSelector,
  (state) => state.cleverClassList
)

export const getSelectedClass = createSelector(
  manageClassSelector,
  (state) => state.entity
)

export const getClassNotFoundError = createSelector(
  manageClassSelector,
  (state) => state.classNotFoundError
)

export const getCanvasFetchingStateSelector = createSelector(
  manageClassSelector,
  (state) => state.isFetchingCanvasData
)

export const getManageCoTeacherModalVisibleStateSelector = createSelector(
  manageClassSelector,
  (state) => state.showUpdateCoTeachersModal
)

export const getGoogleAuthRequiredSelector = createSelector(
  manageClassSelector,
  (state) => state.googleAuthenticationRequired
)

export const getGoogleClassCodeSelector = createSelector(
  manageClassSelector,
  (state) => state.googleClassCode
)
// action types

export const FETCH_CLASS_LIST = '[manageClass] fetch google class'
export const FETCH_CLASS_LIST_STATUS = '[manageClass] fetch google class status'

export const SET_GOOGLE_COURSE_LIST = '[manageClass] set google classes'
export const SET_MODAL = '[manageClass] set modal'
export const SYNC_CLASS = '[manageClass] sync selected google classes'
export const SYNC_CLASS_USING_CODE =
  '[manageClass] sync google classes using code'

export const CREATE_CLASS_REQUEST = '[manageClass] create a class request'
export const CREATE_CLASS_SUCCESS = '[manageClass] create a class success'
export const CREATE_CLASS_FAILED = '[manageClass] creat a class failed'

export const UPDATE_CLASS_REQUEST = '[manageClass] update a class request'
export const UPDATE_CLASS_SUCCESS = '[manageClass] update a class success'
export const UPDATE_CLASS_FAILED = '[manageClass] update a class failed'
export const UPDATE_ARCHIVED_CLASS_FAILED =
  '[manageClass] update archived class failed'

export const FETCH_STUDENTS_BY_ID_REQUEST =
  '[manageClass] fetch students request by classId'
export const FETCH_STUDENTS_BY_ID_SUCCESS =
  '[manageClass] fetch studnets success by classId'
export const FETCH_STUDENTS_BY_ID_ERROR =
  '[manageClass] fetch students error by classId'

export const SET_CLASS = '[manageClass] set a class'

export const ADD_STUDENT_REQUEST =
  '[manageClass] add student to a class request'
export const ADD_STUDENT_SUCCESS =
  '[manageClass] add student to a class success'
export const ADD_STUDENT_FAILED = '[manageClass] add student to a class failed'

export const SELECT_STUDENTS = '[manageClass] select students'

export const CHANGE_USER_TTS_REQUEST = '[mangeClass] change student(s) tts'
export const USER_TTS_REQUEST_FAILED =
  '[manageClass] student(s) tts request failing'
export const USER_TTS_REQUEST_SUCCESS =
  '[manageClass] student(s) tts request success'

export const RESET_PASSWORD_REQUEST = '[manageClass] reset password request'
export const RESET_PASSWORD_FAILDED =
  '[manageClass] reset password request failed'
export const RESET_PASSWORD_SUCCESS =
  '[manageClass] reset password request success'

export const REMOVE_STUDENTS_REQUEST = '[manageClass] remove student(s) request'
export const REMOVE_STUDENTS_FAILDED = '[manageClass] remove student(s) failed'
export const REMOVE_STUDENTS_SUCCESS = '[manageClass] remove student(s) success'

export const UPDATE_STUDENT_REQUEST = '[manageClass] update student request'
export const UPDATE_STUDENT_FAILDED = '[manageClass] update student failed'
export const UPDATE_STUDENT_SUCCESS = '[manageClass] update student success'

export const UPDATE_GOOGLE_COURSE_LIST =
  '[manageClass] update google course list'
export const SYNC_CLASS_LOADING = '[manageClass] sync class loading'
export const SYNC_BY_CODE_MODAL = '[manageClass] sync by code modal'
export const SET_SUBJECT = '[manageClass] set subject'
export const SET_GROUP_SYNC_DETAILS = '[manageClass] sync google class response'

export const GET_CANVAS_COURSE_LIST_REQUEST =
  '[manageClass] get canvas course list requst'
export const GET_CANVAS_COURSE_LIST_SUCCESS =
  '[manageClass] get canvas course list success'
export const GET_CANVAS_COURSE_LIST_FAILED =
  '[manageClass] get canvas course list failed'
export const GET_CANVAS_SECTION_LIST_REQUEST =
  '[manageClass] get canvas section list request'
export const GET_CANVAS_SECTION_LIST_SUCCESS =
  '[manageClass] get canvas section list success'
export const GET_CANVAS_SECTION_LIST_FAILED =
  '[manageClass] get canvas section list failed'
export const SYNC_CLASS_WITH_CANVAS = '[manageClass] sync class with canvas'

export const FETCH_CLEVER_CLASS_LIST_REQUEST =
  '[manageclass] get class list from clever request'
export const FETCH_CLEVER_CLASS_LIST_SUCCESS =
  '[manageClass] get class list from clever success'
export const FETCH_CLEVER_CLASS_LIST_FAILED =
  '[manageClass] get class list from clever failed'
export const SYNC_CLASS_LIST_WITH_CLEVER =
  '[manageClass] sync class list with clever'
export const GOOGLE_SYNC_CLASS_NOT_FOUND_ERROR = '[manageClass] Class Not Found'

export const UNARCHIVE_CLASS_REQUEST = '[manageClass] unarchive class'
export const UNARCHIVE_CLASS_REQUEST_SUCCESS =
  '[manageClass] unarchive class success'
export const UNARCHIVE_CLASS_REQUEST_FAILED =
  '[manageClass] unarchive class failed'

export const REMOVE_CLASS_SYNC_NOTIFICATION =
  '[manageClass] remove class sync notification'

export const SET_CLEVER_SYNC_MODAL = '[manageClass] set clever sync modal'

export const SET_UPDATE_COTEACHER_MODAL =
  '[manageClass] set coteacher update modal'

export const UPDATE_CO_TEACHER_REQUEST =
  '[manageClass] update co-teacher request'

export const SET_FILTER_CLASS = '[manageClass] set filter class'

export const SET_GOOGLE_AUTHENTICATION_REQUIRED =
  '[manageClass] set google authentication required'

export const SET_GOOGLE_CLASS_CODE = '[manageClass] set google class_code'

export const SAVE_GOOGLE_TOKENS_AND_RETRY_SYNC =
  '[manageClass] save google tokens and retry sync'

// action creators

export const fetchClassListAction = createAction(FETCH_CLASS_LIST)
export const fetchClassListStatusAction = createAction(FETCH_CLASS_LIST_STATUS)
export const setGoogleCourseListAction = createAction(SET_GOOGLE_COURSE_LIST)
export const setModalAction = createAction(SET_MODAL)
export const syncClassAction = createAction(SYNC_CLASS)
export const syncClassUsingCodeAction = createAction(SYNC_CLASS_USING_CODE)

export const createClassAction = createAction(CREATE_CLASS_REQUEST)
export const createClassFailedAction = createAction(CREATE_CLASS_FAILED)
export const createClassSuccessAction = createAction(CREATE_CLASS_SUCCESS)

export const updateClassAction = createAction(UPDATE_CLASS_REQUEST)
export const updateClassSuccessAction = createAction(UPDATE_CLASS_SUCCESS)
export const updateClassFailedAction = createAction(UPDATE_CLASS_FAILED)
export const updateArchivedClassFailedAction = createAction(
  UPDATE_ARCHIVED_CLASS_FAILED
)

export const fetchStudentsByIdAction = createAction(
  FETCH_STUDENTS_BY_ID_REQUEST
)
export const fetchStudentsByIdSuccessAction = createAction(
  FETCH_STUDENTS_BY_ID_SUCCESS
)
export const fetchStudentsByIdErrorAction = createAction(
  FETCH_STUDENTS_BY_ID_ERROR
)

export const setClassAction = createAction(SET_CLASS)

export const addStudentRequestAction = createAction(ADD_STUDENT_REQUEST)
export const addStudentSuccessAction = createAction(ADD_STUDENT_SUCCESS)
export const addStudentFailedAction = createAction(ADD_STUDENT_FAILED)

export const selectStudentAction = createAction(SELECT_STUDENTS)

export const changeTTSRequestAction = createAction(CHANGE_USER_TTS_REQUEST)
export const userTTSRequestFailedAction = createAction(USER_TTS_REQUEST_FAILED)
export const userTTSRequestSuccessAction = createAction(
  USER_TTS_REQUEST_SUCCESS
)

export const resetPasswordRequestAction = createAction(RESET_PASSWORD_REQUEST)
export const resetPasswordFaildedAction = createAction(RESET_PASSWORD_FAILDED)
export const resetPasswordSuccessAction = createAction(RESET_PASSWORD_SUCCESS)

export const removeStudentsRequestAction = createAction(REMOVE_STUDENTS_REQUEST)
export const removeStudentsFaildedAction = createAction(REMOVE_STUDENTS_FAILDED)
export const removeStudentsSuccessAction = createAction(REMOVE_STUDENTS_SUCCESS)

export const updateStudentRequestAction = createAction(UPDATE_STUDENT_REQUEST)
export const updateStudentFaildedAction = createAction(UPDATE_STUDENT_FAILDED)
export const updateStudentSuccessAction = createAction(UPDATE_STUDENT_SUCCESS)

export const updateGoogleCourseListAction = createAction(
  UPDATE_GOOGLE_COURSE_LIST
)
export const syncByCodeModalAction = createAction(SYNC_BY_CODE_MODAL)
export const setSyncClassLoadingAction = createAction(SYNC_CLASS_LOADING)
export const setSubjectAction = createAction(SET_SUBJECT)
export const setGroupSyncDataAction = createAction(SET_GROUP_SYNC_DETAILS)

export const getCanvasCourseListRequestAction = createAction(
  GET_CANVAS_COURSE_LIST_REQUEST
)
export const getCanvasCourseListSuccessAction = createAction(
  GET_CANVAS_COURSE_LIST_SUCCESS
)
export const getCanvasCourseListFailedAction = createAction(
  GET_CANVAS_COURSE_LIST_FAILED
)
export const getCanvasSectionListRequestAction = createAction(
  GET_CANVAS_SECTION_LIST_REQUEST
)
export const getCanvasSectionListSuccessAction = createAction(
  GET_CANVAS_SECTION_LIST_SUCCESS
)
export const getCanvasSectionListFailedAction = createAction(
  GET_CANVAS_SECTION_LIST_FAILED
)
export const syncClassWithCanvasAction = createAction(SYNC_CLASS_WITH_CANVAS)

export const fetchCleverClassListRequestAction = createAction(
  FETCH_CLEVER_CLASS_LIST_REQUEST
)
export const fetchCleverClassListSuccessAction = createAction(
  FETCH_CLEVER_CLASS_LIST_SUCCESS
)
export const fetchCleverClassListFailedAction = createAction(
  FETCH_CLEVER_CLASS_LIST_FAILED
)
export const syncClassesWithCleverAction = createAction(
  SYNC_CLASS_LIST_WITH_CLEVER
)
export const unarchiveClassAction = createAction(UNARCHIVE_CLASS_REQUEST)
export const unarchiveClassSuccessAction = createAction(
  UNARCHIVE_CLASS_REQUEST_SUCCESS
)
export const unarchiveClassFailedAction = createAction(
  UNARCHIVE_CLASS_REQUEST_FAILED
)

export const setClassNotFoundErrorAction = createAction(
  GOOGLE_SYNC_CLASS_NOT_FOUND_ERROR
)

export const removeClassSyncNotificationAction = createAction(
  REMOVE_CLASS_SYNC_NOTIFICATION
)

export const setShowCleverSyncModalAction = createAction(SET_CLEVER_SYNC_MODAL)

export const setFilterClassAction = createAction(SET_FILTER_CLASS)

export const updateCoTeacherAction = createAction(UPDATE_CO_TEACHER_REQUEST)

export const showUpdateCoTeacherModalAction = createAction(
  SET_UPDATE_COTEACHER_MODAL
)

export const setGoogleAuthenticationRequiredAction = createAction(
  SET_GOOGLE_AUTHENTICATION_REQUIRED
)

export const setGoogleClassCodeAction = createAction(SET_GOOGLE_CLASS_CODE)

export const saveGoogleTokensAndRetrySyncAction = createAction(
  SAVE_GOOGLE_TOKENS_AND_RETRY_SYNC
)

// initial State
const initialState = {
  googleCourseList: [],
  fetchClassListLoading: false,
  creating: false,
  updating: false,
  error: null,
  studentsList: [],
  selectedStudent: [],
  loaded: true,
  entity: {},
  submitted: false,
  added: false,
  syncClassResponse: {},
  selectedSubject: '',
  classLoaded: false,
  canvasCourseList: [],
  canvasSectionList: [],
  isFetchingCanvasData: false,
  loadingCleverClassList: false,
  cleverClassList: [],
  classNotFoundError: false,
  unarchivingClass: false,
  showCleverSyncModal: false,
  filterClass: 'Active',
  showUpdateCoTeachersModal: false,
  googleAuthenticationRequired: false,
  googleClassCode: '',
}

const setFilterClass = (state, { payload }) => {
  state.filterClass = payload
}

const setShowCleverSyncModal = (state, { payload }) => {
  state.showCleverSyncModal = payload
}

const setshowUpdateCoTeachersModal = (state, { payload }) => {
  state.showUpdateCoTeachersModal = payload
}

const setGoogleCourseList = (state, { payload }) => {
  state.googleCourseList = payload.map((o) => {
    o.courseId = o.course && o.course.id
    return o
  })
}

const updateGoogleCourseList = (state, { payload }) => {
  state.googleCourseList = payload
}

// toggle modal
const setModal = (state, { payload }) => {
  state.showModal = payload
}

const createClass = (state) => {
  state.creating = true
  state.error = null
}

const createClassSuccess = (state, { payload }) => {
  state.creating = false
  state.entity = payload
}

const createClassFailed = (state, { payload }) => {
  state.creating = false
  state.error = payload
}

const setClass = (state, { payload }) => {
  state.entity = payload
  state.selectedStudent = []
  state.classLoaded = true
}

const setFetchStudents = (state) => {
  state.loaded = false
  state.error = null
}

const setStudents = (state, { payload }) => {
  state.loaded = true
  state.studentsList = payload
}

const errorOnFetchStudents = (state, { payload }) => {
  state.loaded = true
  state.error = payload
}

const updateClass = (state) => {
  state.updating = true
  state.error = null
}

const updateClassSuccess = (state, { payload }) => {
  state.updating = false
  state.entity = payload
}

const updateClassFailed = (state, { payload }) => {
  state.updating = false
  state.error = payload
}

const updateArchivedClassFailed = (state) => {
  state.updating = false
}

const addStudentRequest = (state) => {
  state.submitted = true
  state.added = false
  state.error = null
}

const addStudentSuccess = (state, { payload }) => {
  if (payload) {
    state.submitted = false
    state.added = true
    state.studentsList.push(payload)
  }
}

const addStudentFailed = (state, { payload }) => {
  state.error = payload
  state.submitted = false
  state.added = false
}

const selectStudent = (state, { payload }) => {
  state.selectedStudent = payload
}

const updateStudent = (state) => {
  state.updating = true
}

const updateStudentSuccess = (state, { payload }) => {
  const stdList = state.studentsList
  const updatedIndex = findIndex(
    stdList,
    (std) => std._id === payload._id || std.userId === payload._id
  )
  if (updatedIndex !== -1) {
    state.studentsList.splice(updatedIndex, 1, payload)
  }
  state.updating = false
}

const updateStudentFailed = (state) => {
  state.updating = false
}

const updateStudentsAfterTTSChange = (state, { payload }) => {
  state.studentsList = payload
  state.selectedStudent = []
}

const removeStudentsSuccess = (state, { payload: studentIds }) => {
  // creating a hashmap of studentIds to reduce the loop complexity from n^2 to 2n
  const studentIdHash = keyBy(studentIds)
  // here we are mutating the enrollment status to 0 for all the deleted students so that table is refreshed
  // setting current time to show the not enrolled date (as the newly removed user will have the same date as today)
  // mutating the username to add .deactivate in the end to match with database data
  // after refresh or fetching new data the correct updated date will come for students
  state.studentsList.forEach((student, index) => {
    if (studentIdHash[student._id]) {
      const studentDetails = state.studentsList[index]
      studentDetails.enrollmentStatus = '0'
      studentDetails.enrollmentUpdatedAt = new Date().getTime()
    }
  })
}

const setSubject = (state, { payload: subject }) => {
  state.selectedSubject = subject
}

const openOrCloseModal = (state, { payload }) => {
  state.openGCModal = payload
}

const setSyncClassLoading = (state, { payload }) => {
  state.syncClassLoading = payload
}

const setFetchClassRequest = (state, { payload }) => {
  state.fetchClassListLoading = payload
}

const setGroupSyncDetails = (state, { payload }) => {
  state.syncClassResponse = payload
}

const setCanvasCourseList = (state, { payload }) => {
  state.canvasCourseList = payload
}

const setCanvasSectionList = (state, { payload }) => {
  state.canvasSectionList = payload
  state.isFetchingCanvasData = false
}

const setCleverClassList = (state, { payload }) => {
  state.cleverClassList = payload
  state.loadingCleverClassList = false
}

const setGoogleClassCodeNotFound = (state, { payload }) => {
  state.classNotFoundError = payload
}

// main reducer
export default createReducer(initialState, {
  [SET_GOOGLE_COURSE_LIST]: setGoogleCourseList,
  [FETCH_CLASS_LIST_STATUS]: setFetchClassRequest,
  [UPDATE_GOOGLE_COURSE_LIST]: updateGoogleCourseList,
  [SET_MODAL]: setModal,
  [SET_CLASS]: setClass,
  [SYNC_CLASS_LOADING]: setSyncClassLoading,
  [CREATE_CLASS_REQUEST]: createClass,
  [CREATE_CLASS_SUCCESS]: createClassSuccess,
  [CREATE_CLASS_FAILED]: createClassFailed,
  [FETCH_STUDENTS_BY_ID_REQUEST]: setFetchStudents,
  [FETCH_STUDENTS_BY_ID_SUCCESS]: setStudents,
  [FETCH_STUDENTS_BY_ID_ERROR]: errorOnFetchStudents,
  [UPDATE_CLASS_REQUEST]: updateClass,
  [UPDATE_CLASS_SUCCESS]: updateClassSuccess,
  [UPDATE_CLASS_FAILED]: updateClassFailed,
  [UPDATE_ARCHIVED_CLASS_FAILED]: updateArchivedClassFailed,
  [ADD_STUDENT_REQUEST]: addStudentRequest,
  [ADD_STUDENT_SUCCESS]: addStudentSuccess,
  [ADD_STUDENT_FAILED]: addStudentFailed,
  [SELECT_STUDENTS]: selectStudent,
  [UPDATE_STUDENT_REQUEST]: updateStudent,
  [UPDATE_STUDENT_SUCCESS]: updateStudentSuccess,
  [UPDATE_STUDENT_FAILDED]: updateStudentFailed,
  [SYNC_BY_CODE_MODAL]: openOrCloseModal,
  [REMOVE_STUDENTS_SUCCESS]: removeStudentsSuccess,
  [SET_SUBJECT]: setSubject,
  [SET_GROUP_SYNC_DETAILS]: setGroupSyncDetails,
  [USER_TTS_REQUEST_SUCCESS]: updateStudentsAfterTTSChange,
  [GET_CANVAS_COURSE_LIST_REQUEST]: (state) => {
    state.isFetchingCanvasData = true
  },
  [GET_CANVAS_COURSE_LIST_SUCCESS]: setCanvasCourseList,
  [GET_CANVAS_COURSE_LIST_FAILED]: (state) => {
    state.isFetchingCanvasData = false
    state.canvasCourseList = []
  },
  [GET_CANVAS_SECTION_LIST_REQUEST]: (state) => {
    state.isFetchingCanvasData = true
  },
  [GET_CANVAS_SECTION_LIST_SUCCESS]: setCanvasSectionList,
  [GET_CANVAS_SECTION_LIST_FAILED]: (state) => {
    state.isFetchingCanvasData = false
    state.canvasSectionList = []
  },
  [FETCH_CLEVER_CLASS_LIST_REQUEST]: (state) => {
    state.loadingCleverClassList = true
  },
  [FETCH_CLEVER_CLASS_LIST_SUCCESS]: setCleverClassList,
  [FETCH_CLEVER_CLASS_LIST_FAILED]: (state) => {
    state.loadingCleverClassList = false
    state.cleverClassList = []
  },
  [GOOGLE_SYNC_CLASS_NOT_FOUND_ERROR]: setGoogleClassCodeNotFound,
  [UNARCHIVE_CLASS_REQUEST]: (state) => {
    state.unarchivingClass = true
  },
  [UNARCHIVE_CLASS_REQUEST_SUCCESS]: (state) => {
    state.unarchivingClass = false
  },
  [UNARCHIVE_CLASS_REQUEST_FAILED]: (state) => {
    state.unarchivingClass = false
  },
  [SET_CLEVER_SYNC_MODAL]: setShowCleverSyncModal,
  [SET_FILTER_CLASS]: setFilterClass,
  [SET_UPDATE_COTEACHER_MODAL]: setshowUpdateCoTeachersModal,
  [SET_GOOGLE_AUTHENTICATION_REQUIRED]: (state) => {
    state.googleAuthenticationRequired = !state.googleAuthenticationRequired
  },
  [SET_GOOGLE_CLASS_CODE]: (state, { payload }) => {
    state.googleClassCode = payload
  },
})

function* fetchClassList({ payload }) {
  try {
    const { data } = payload
    yield put(fetchClassListStatusAction(true))
    const result = yield call(googleApi.getCourseList, { code: data.code })
    yield put(setUserGoogleLoggedInAction(true))
    yield put(setGoogleCourseListAction(result.courseDetails))
    yield put(fetchClassListStatusAction(false))
    yield put(setFilterClassAction(data.filterClass))
  } catch (e) {
    Sentry.captureException(e)
    const errorMessage = 'fetching classlist failed'
    notification({ msg: errorMessage })
    yield put(fetchClassListStatusAction(false))
    console.log(e)
  }
}

function* fetchStudentsByClassId({ payload }) {
  try {
    const { classId } = payload
    const result = yield call(enrollmentApi.fetch, classId)
    const { group, students } = result
    yield put(fetchStudentsByIdSuccessAction(students))
    yield put(setClassAction(group))
  } catch (error) {
    Sentry.captureException(error)
    yield put(fetchStudentsByIdErrorAction(error))
  }
}

function* receiveCreateClassRequest({ payload }) {
  try {
    const { studentIds, callUserMeApi, ...rest } = payload
    const result = yield call(groupApi.createGroup, rest)
    const { name, type, code: classCode, districtId } = result
    const typeText = type === 'custom' ? 'group' : 'class'
    if (studentIds?.length) {
      notification({ type: 'success', msg: `${name} ${typeText} is created` })
      yield put(
        requestEnrolExistingUserToClassAction({
          name,
          type,
          classCode,
          districtId,
          studentIds,
        })
      )
    } else {
      notification({
        type: 'success',
        msg: `${name} is created. Please add students to your ${typeText} and begin using Edulastic.`,
      })
    }
    if (callUserMeApi) {
      yield put(fetchUserAction({ background: true }))
    }
    yield put(createClassSuccessAction(result))
    yield put(addGroupAction(result))
    yield put(addClassToUserAction(result))
  } catch (err) {
    const {
      data: { message: errorMessage },
    } = err.response
    captureSentryException(err)
    notification({ msg: errorMessage })
    yield put(createClassFailedAction({ message: errorMessage }))
  }
}

function* receiveUpdateClass({ payload }) {
  try {
    const { params, classId } = payload
    const result = yield call(groupApi.editGroup, {
      body: params,
      groupId: classId,
    })
    if (result?.status === 400) {
      notification({
        type: 'warn',
        msg:
          `${result?.message}` ||
          'Failed to update the class. Please try again later.',
      })
      yield put(updateArchivedClassFailedAction())
    } else {
      const successMessage = 'Class details updated successfully!'
      notification({ type: 'success', msg: successMessage })
      yield put(updateClassSuccessAction(result))
    }
  } catch (error) {
    yield put(updateClassFailedAction(error))
  }
}

function* receiveAddStudentRequest({ payload }) {
  try {
    const result = yield call(enrollmentApi.addStudent, payload)
    const student = get(result, 'data.result')
    if (student) {
      const newStudent = {
        ...student,
        _id: student.userId,
        enrollmentStatus: 1,
      }
      yield put(addStudentSuccessAction(newStudent))
      const successMsg = 'Student added to class successfully.'
      notification({ type: 'success', msg: successMsg })
    } else {
      const msg = get(
        result,
        'data.message',
        'Student already part of this class section'
      )
      notification({ msg })
      yield put(addStudentFailedAction('add student to class failed'))
    }
  } catch (error) {
    Sentry.captureException(error)
    const {
      data: { message: errorMessage },
    } = error.response
    const msg = errorMessage || 'User already part of this class section'
    notification({ msg })
    yield put(addStudentFailedAction(error))
  }
}

function* changeUserTTSRequest({ payload }) {
  try {
    yield call(userApi.changeUserTTS, payload)
    const msg = 'TTS updated successfully'
    const userIds = payload.userId.split(',')
    const tts = payload.ttsStatus
    const studentsList = yield select((state) => state.manageClass.studentsList)
    const newStdList = studentsList.map((std) => {
      if (userIds.indexOf(std._id) > -1) {
        return {
          ...std,
          tts,
        }
      }
      return std
    })
    yield put(userTTSRequestSuccessAction(newStdList))
    notification({ type: 'success', msg })
  } catch (error) {
    Sentry.captureException(error)
    notification({
      type: 'error',
      messageKey: 'errorOccurredWhileEnablingOrDisablingTextToSpeech',
    })
  }
}

function* resetPasswordRequest({ payload }) {
  try {
    const result = yield call(userApi.resetPassword, payload)
    const msg = 'Password has been changed for the selected student(s).'
    notification({ type: 'success', msg })
    yield put(resetPasswordSuccessAction(result.data))
  } catch (error) {
    Sentry.captureException(error)
    notification({ messageKey: 'resetPasswordRequestFailing' })
    yield put(resetPasswordFaildedAction())
  }
}

function* removeStudentsRequest({ payload }) {
  try {
    const result = yield call(enrollmentApi.removeStudents, payload)
    const { result: msg } = result.data
    notification({ type: 'success', msg })
    yield put(removeStudentsSuccessAction(payload.studentIds))
  } catch (error) {
    Sentry.captureException(error)
    yield put(removeStudentsFaildedAction(error))
  }
}

function* updateStudentRequest({ payload }) {
  try {
    const { userId, data } = payload
    const result = yield call(userApi.updateUser, { userId, data })
    const updatedStudent = {
      ...result,
      enrollmentStatus: 1,
    }
    yield put(updateStudentSuccessAction(updatedStudent))
    const msg = 'Successfully Updated student.'
    notification({ type: 'success', msg })
  } catch (error) {
    Sentry.captureException(error)
    notification({ messageKey: 'updateAstudentRequestFailing' })
    yield put(updateStudentFaildedAction())
  }
}

// sync google class
function* syncClass({ payload }) {
  try {
    const classNames = payload.classList.flatMap((o) => o.name)
    if (classNames.includes('')) {
      return notification({ messageKey: 'classNameIsMissing' })
    }
    yield put(setSyncClassLoadingAction(true))
    yield call(googleApi.syncClass, payload)
    notification({
      type: 'success',
      messageKey: 'googleClassImportInProgress',
    })
  } catch (e) {
    Sentry.captureException(e)
    yield put(setSyncClassLoadingAction(false))
    notification({ messageKey: 'classSyncFailed' })
    console.log(e)
  }
}

function* syncClassUsingCode({ payload }) {
  try {
    const {
      googleCode,
      groupId: classId,
      institutionId,
      syncGoogleCoTeacher,
    } = payload
    yield put(setSyncClassLoadingAction(true))
    const result = yield call(googleApi.syncClass, {
      googleCode,
      groupId: classId,
      institutionId,
      syncGoogleCoTeacher,
    })
    yield put(setSyncClassLoadingAction(false))
    if (result?.message === 'invalid_grant') {
      yield put(setGoogleAuthenticationRequiredAction(true))
      yield put(setGoogleClassCodeAction(payload.googleCode))
    } else {
      notification({
        type: 'success',
        messageKey: 'googleClassImportInProgress',
      })
    }
  } catch (err) {
    const { data = {} } = err.response || {}
    const { message: errorMessage } = data
    captureSentryException(err)
    if (errorMessage === 'No class found') {
      yield put(setClassNotFoundErrorAction(true))
    } else {
      notification({ messageKey: 'classSyncFailed' })
    }
    yield put(setSyncClassLoadingAction(false))
  }
}

function* getCanvasCourseListRequestSaga({ payload }) {
  try {
    const courseList = yield call(canvasApi.fetchCourseList, payload)
    if (courseList.length === 0) {
      notification({ type: 'info', messageKey: 'noCourseFound' })
      yield put(getCanvasCourseListFailedAction())
    } else {
      yield put(getCanvasCourseListSuccessAction(courseList))
    }
  } catch (err) {
    captureSentryException(err)
    console.error(err)
    yield put(getCanvasCourseListFailedAction())
    notification({ messageKey: 'failedToGetCourseList' })
  }
}

function* getCanvasSectionListRequestSaga({ payload }) {
  try {
    const sectionList = yield call(canvasApi.fetchCourseSectionList, payload)
    yield put(getCanvasSectionListSuccessAction(sectionList))
    if (sectionList.length === 0) {
      notification({ type: 'info', messageKey: 'noCourseSectionFound' })
    }
  } catch (err) {
    captureSentryException(err)
    console.error(err)
    yield put(getCanvasSectionListFailedAction())
    notification({ messageKey: 'failedToGetCourseSectionList' })
  }
}

function* syncClassWithCanvasSaga({ payload }) {
  try {
    const { groupId: classId } = payload
    yield put(setSyncClassLoadingAction(true))
    yield call(canvasApi.canvasSync, payload)
    yield put(setSyncClassLoadingAction(false))
    yield put(fetchStudentsByIdAction({ classId }))
    notification({ type: 'success', messageKey: 'syncWithCanvasIsComplete' })
  } catch (err) {
    captureSentryException(err)
    console.error(err)
    notification({ messageKey: 'classSyncWithCanvasFailed' })
    yield put(setSyncClassLoadingAction(false))
  }
}

function* fetchCleverClassListRequestSaga() {
  try {
    const cleverClassList = yield call(cleverApi.fetchCleverClasses)
    yield put(fetchCleverClassListSuccessAction(cleverClassList))
    if (cleverClassList.length === 0) {
      notification({
        type: 'info',
        messageKey: 'noClassessfoundInCleverAccount',
      })
    }
  } catch (err) {
    captureSentryException(err)
    console.error(err)
    yield put(fetchCleverClassListFailedAction())
    const errorMessage = err?.response?.data?.message
    if (err.status === 403 && errorMessage) {
      yield put(setShowCleverSyncModalAction(false))
      notification({ type: 'warn', msg: errorMessage })
    } else {
      notification({ messageKey: 'failedToFetchCleverClasses' })
    }
  }
}

function* syncClassListWithCleverSaga({ payload }) {
  try {
    const { classList, refreshPage } = payload
    const filteredPayload = classList.map((c) => ({
      name: c.name,
      cleverId: c.cleverId,
      course: c.course,
      subject: c.subject,
      grades: c.grades,
      standardSets: c.standardSets,
    }))
    yield call(cleverApi.syncCleverClasses, filteredPayload)
    notification({ type: 'success', messageKey: 'syncWithCleverIsComplete' })
    switch (refreshPage) {
      case 'dashboard':
        yield put(receiveTeacherDashboardAction())
        break
      case 'manageClass':
        yield put(fetchGroupsAction())
        break

      // no default
    }
  } catch (err) {
    captureSentryException(err)
    console.error(err)
    const errorMessage = err?.response?.data?.message
    if (err.status === 403 && errorMessage) {
      notification({ type: 'warn', msg: errorMessage })
    } else {
      notification({ messageKey: 'syncWithCleverFailed' })
    }
  }
}

function* unarchiveClass({ payload }) {
  const { isGroup, exitPath, ...restPayload } = payload || {}
  const groupTypeText = isGroup ? 'group' : 'class'
  try {
    yield call(groupApi.unarchiveClass, restPayload)
    yield put(unarchiveClassSuccessAction())
    notification({
      type: 'success',
      messageKey: `${groupTypeText}SuccessfullyUnarchived`,
    })
    if (exitPath) yield put(push('/'))
    yield put(push(exitPath || '/author/manageClass'))
  } catch (err) {
    captureSentryException(err)
    console.error(err)
    yield put(unarchiveClassFailedAction())
    notification({
      msg:
        err?.response?.data?.message || `Unarchiving ${groupTypeText} failed.`,
    })
  }
}

// remove class sync completed notification from firebase
function* removeClassSyncNotification() {
  try {
    yield call(googleApi.removeClassSyncNotification)
    console.log(`Class sync notification removed.`)
  } catch (e) {
    Sentry.captureException(e)
    console.log(e)
  }
}

function* saveGoogleTokensAndRetrySyncSaga({ payload }) {
  try {
    yield put(setGoogleAuthenticationRequiredAction())
    const { code, ...classSyncData } = payload
    yield call(googleApi.saveGoogleTokens, { code })
    const googleCode = yield select(getGoogleClassCodeSelector)
    yield put(syncClassUsingCodeAction({ ...classSyncData, googleCode }))
  } catch (err) {
    Sentry.captureException(err)
    notification({
      msg: err?.response?.data?.message || `Class Sync failed`,
    })
  }
}

// update co-teacher or primary teacher for the group
function* updateGroupTeachers({ payload }) {
  yield put(addLoadingComponentAction({ componentName: 'updateButton' }))
  try {
    const { removedTeacherIds = [] } = payload
    const userId = yield select((state) => state.user.user._id || '')
    const group = yield call(groupApi.updateCoTeacher, payload)
    yield put(showUpdateCoTeacherModalAction(false))
    if (removedTeacherIds?.length && removedTeacherIds.includes(userId)) {
      yield put(push('/author/manageClass'))
    } else {
      yield put(setClassAction(group))
    }
    notification({
      type: 'success',
      msg: `Group co-teachers updated.`,
    })
  } catch (e) {
    notification({
      type: 'error',
      msg: 'Failed to updated group teachers.',
    })
    Sentry.captureException(e)
  } finally {
    yield put(removeLoadingComponentAction({ componentName: 'updateButton' }))
  }
}

// watcher saga
export function* watcherSaga() {
  yield all([
    yield takeLatest(FETCH_CLASS_LIST, fetchClassList),
    yield takeEvery(SYNC_CLASS, syncClass),
    yield takeEvery(SYNC_CLASS_USING_CODE, syncClassUsingCode),
    yield takeEvery(CREATE_CLASS_REQUEST, receiveCreateClassRequest),
    yield takeEvery(FETCH_STUDENTS_BY_ID_REQUEST, fetchStudentsByClassId),
    yield takeEvery(UPDATE_CLASS_REQUEST, receiveUpdateClass),
    yield takeEvery(ADD_STUDENT_REQUEST, receiveAddStudentRequest),
    yield takeEvery(CHANGE_USER_TTS_REQUEST, changeUserTTSRequest),
    yield takeEvery(REMOVE_STUDENTS_REQUEST, removeStudentsRequest),
    yield takeEvery(RESET_PASSWORD_REQUEST, resetPasswordRequest),
    yield takeEvery(UPDATE_STUDENT_REQUEST, updateStudentRequest),
    yield takeLatest(
      GET_CANVAS_COURSE_LIST_REQUEST,
      getCanvasCourseListRequestSaga
    ),
    yield takeLatest(
      GET_CANVAS_SECTION_LIST_REQUEST,
      getCanvasSectionListRequestSaga
    ),
    yield takeLatest(SYNC_CLASS_WITH_CANVAS, syncClassWithCanvasSaga),
    yield takeLatest(
      FETCH_CLEVER_CLASS_LIST_REQUEST,
      fetchCleverClassListRequestSaga
    ),
    yield takeLatest(SYNC_CLASS_LIST_WITH_CLEVER, syncClassListWithCleverSaga),
    yield takeLatest(UNARCHIVE_CLASS_REQUEST, unarchiveClass),
    yield takeLatest(
      REMOVE_CLASS_SYNC_NOTIFICATION,
      removeClassSyncNotification
    ),
    yield takeLatest(UPDATE_CO_TEACHER_REQUEST, updateGroupTeachers),
    yield takeLatest(
      SAVE_GOOGLE_TOKENS_AND_RETRY_SYNC,
      saveGoogleTokensAndRetrySyncSaga
    ),
  ])
}
