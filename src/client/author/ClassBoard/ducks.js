import {
  takeEvery,
  call,
  put,
  all,
  select,
  takeLatest,
} from 'redux-saga/effects'
import {
  classBoardApi,
  testActivityApi,
  enrollmentApi,
  classResponseApi,
  canvasApi,
  utilityApi,
  testItemsApi,
} from '@edulastic/api'
import moment from 'moment'
import { createSelector } from 'reselect'
import { push } from 'connected-react-router'
import {
  values as _values,
  get,
  keyBy,
  sortBy,
  isEmpty,
  groupBy,
  cloneDeep,
  round,
} from 'lodash'
import { captureSentryException, notification } from '@edulastic/common'
import {
  test,
  testActivity,
  assignmentPolicyOptions,
  roleuser,
  testActivityStatus,
} from '@edulastic/constants'
import { isNullOrUndefined } from 'util'
import * as Sentry from '@sentry/browser'
import {
  updateAssignmentStatusAction,
  updateCloseAssignmentsAction,
  updateOpenAssignmentsAction,
  updateStudentActivityAction,
  setIsPausedAction,
  updateRemovedStudentsAction,
  updateClassStudentsAction,
  setAllTestActivitiesForStudentAction,
  updateSubmittedStudentsAction,
  receiveTestActivitydAction,
  redirectToAssignmentsAction,
  updatePasswordDetailsAction,
  toggleViewPasswordAction,
  updatePauseStatusAction,
  receiveStudentResponseAction,
  reloadLcbDataInStudentViewAction,
  correctItemUpdateProgressAction,
  setSilentCloningAction,
} from '../src/actions/classBoard'

import { createFakeData, hasRandomQuestions } from './utils'

import {
  markQuestionLabel,
  getQuestionLabels,
  transformTestItems,
  transformGradeBookResponse,
  getStandardsForStandardBasedReport,
  getScoringType,
} from './Transformer'

import {
  RECEIVE_GRADEBOOK_REQUEST,
  RECEIVE_GRADEBOOK_SUCCESS,
  RECEIVE_GRADEBOOK_ERROR,
  RECEIVE_TESTACTIVITY_REQUEST,
  RECEIVE_TESTACTIVITY_SUCCESS,
  RECEIVE_TESTACTIVITY_ERROR,
  RECEIVE_STUDENT_RESPONSE_REQUEST,
  UPDATE_RELEASE_SCORE,
  SET_MARK_AS_DONE,
  OPEN_ASSIGNMENT,
  CLOSE_ASSIGNMENT,
  SAVE_OVERALL_FEEDBACK,
  MARK_AS_ABSENT,
  TOGGLE_PAUSE_ASSIGNMENT,
  REMOVE_STUDENTS,
  FETCH_STUDENTS,
  ADD_STUDENTS,
  GET_ALL_TESTACTIVITIES_FOR_STUDENT,
  MARK_AS_SUBMITTED,
  DOWNLOAD_GRADES_RESPONSES,
  RECEIVE_CLASS_RESPONSE_SUCCESS,
  REDIRECT_TO_ASSIGNMENTS,
  REGENERATE_PASSWORD,
  CANVAS_SYNC_GRADES,
  CANVAS_SYNC_ASSIGNMENT,
  FETCH_SERVER_TIME,
  PAUSE_STUDENTS,
  CORRECT_ITEM_UPDATE_REQUEST,
  TOGGLE_REGRADE_MODAL,
  RELOAD_LCB_DATA_IN_STUDENT_VIEW,
} from '../src/constants/actions'

import { downloadCSV } from '../Reports/common/util'
import { getUserIdSelector, getUserNameSelector } from '../src/selectors/user'
import { getAllQids } from '../SummaryBoard/Transformer'
import { getUserId, getUserRole } from '../../student/Login/ducks'
import {
  setAddedStudentsAction,
  setLcbActionProgress,
  setProgressStatusAction,
  updateServerTimeAction,
  updateAdditionalDataAction,
} from '../src/reducers/testActivity'
import { getServerTs } from '../../student/utils'
import { setShowCanvasShareAction } from '../src/reducers/gradeBook'

import {
  isIncompleteQuestion,
  hasImproperDynamicParamsConfig,
  isOptionsRemoved,
  isV1MultipartItem,
} from '../questionUtils'
import {
  setFreezeTestSettings,
  setRegradeFirestoreDocId,
} from '../TestPage/ducks'
import { getQindex } from '../QuestionEditor/ducks'
import { studentIsEnrolled } from '../utils/userEnrollment'

const {
  authorAssignmentConstants: {
    assignmentStatus: { IN_GRADING, DONE },
  },
} = testActivity

const { testContentVisibility, ATTEMPT_WINDOW_TYPE } = test

export const LCB_LIMIT_QUESTION_PER_VIEW = 20
export const SCROLL_SHOW_LIMIT = 30

function* receiveGradeBookSaga({ payload }) {
  try {
    const entities = yield call(classBoardApi.gradebook, payload)

    yield put({
      type: RECEIVE_GRADEBOOK_SUCCESS,
      payload: { entities },
    })
  } catch (err) {
    const msg = 'Unable to retrieve gradebook activity.'
    notification({ type: 'error', messageKey: 'receiveTestFailing' })
    yield put({
      type: RECEIVE_GRADEBOOK_ERROR,
      payload: { error: msg },
    })
  }
}

export function* receiveTestActivitySaga({ payload }) {
  const { studentResponseParams, ...classResponseParams } = payload || {}
  try {
    let additionalData = {}
    const gradebookData = {
      enrollmentStatus: {},
      recentTestActivitiesGrouped: {},
      status: '',
      students: [],
      testActivities: [],
      testQuestionActivities: [],
    }
    let isAllDataFetched = false
    let page = 0
    let leftOverStudents = []
    let studentsToFetchData = []
    while (!isAllDataFetched) {
      const _data = yield call(classBoardApi.testActivity, {
        ...classResponseParams,
        page,
        leftOverStudents: studentsToFetchData,
      })
      const {
        students,
        enrollmentStatus,
        testActivities = [],
        testQuestionActivities = [],
        recentTestActivitiesGrouped = [],
        leftOverStudents: _leftOverStudents = [],
      } = _data
      if (page === 0) {
        leftOverStudents = _leftOverStudents || []
        additionalData = _data.additionalData
        additionalData = {
          ...additionalData,
          assignmentId: classResponseParams.assignmentId,
        }
        gradebookData.status = additionalData.status
        gradebookData.enrollmentStatus = enrollmentStatus
        gradebookData.students = students
      }
      gradebookData.recentTestActivitiesGrouped = {
        ...gradebookData.recentTestActivitiesGrouped,
        ...recentTestActivitiesGrouped,
      }
      gradebookData.testActivities.push(...testActivities)
      gradebookData.testQuestionActivities.push(...testQuestionActivities)
      studentsToFetchData = leftOverStudents.splice(0, 40)
      isAllDataFetched = studentsToFetchData.length === 0
      page++
    }
    if (!additionalData.recentTestActivitiesGrouped) {
      /**
       * resetting attempts data if not recieved from response
       */
      additionalData.recentTestActivitiesGrouped = {}
    }
    const classResponse = yield call(classResponseApi.classResponse, {
      ...classResponseParams,
      testId: additionalData.testId,
    })
    const testItems = classResponse.itemGroups
      .flatMap((itemGroup) => itemGroup.items || [])
      .map((item) => {
        item.data.questions = get(item, 'data.questions', []).map((q) => ({
          ...q,
        }))
        return item
      })
    const originalItems = cloneDeep(testItems)
    const reportStandards = getStandardsForStandardBasedReport(
      testItems,
      classResponse?.summary?.standardsDescriptions || {}
    )
    markQuestionLabel(testItems)
    yield put({
      type: RECEIVE_CLASS_RESPONSE_SUCCESS,
      payload: { ...classResponse, testItems, reportStandards, originalItems },
    })
    yield put(setFreezeTestSettings(classResponse.freezeSettings))
    const students = get(gradebookData, 'students', [])
    // the below methods mutates the gradebookData
    gradebookData.passageData = classResponse.passages
    gradebookData.testItemsData = testItems
    gradebookData.testItemsDataKeyed = keyBy(testItems, '_id')
    gradebookData.test = classResponse
    gradebookData.endDate = additionalData.endDate
    transformTestItems(gradebookData)
    // attach fake data to students for presentation mode.
    const fakeData = createFakeData(students.length)
    gradebookData.students = students.map((student, index) => ({
      ...student,
      ...fakeData[index],
    }))

    let entities = []
    const {
      ITEM_GROUP_DELIVERY_TYPES: { ALL_RANDOM, LIMITED_RANDOM },
    } = test
    const isRandomDelivery = classResponse.itemGroups.some(
      (group) =>
        group.deliveryType === ALL_RANDOM ||
        group.deliveryType === LIMITED_RANDOM
    )
    if (isRandomDelivery) {
      // students can have different test items so generating student data for each student with its testItems
      const studentsDataWithTestItems = gradebookData.testActivities.map(
        (activity) => {
          let allItems = []
          if (activity) {
            allItems = activity.itemsToDeliverInGroup
              .flatMap((g) => g.items)
              .map((id) => {
                const item = gradebookData.testItemsData.find(
                  (ti) => ti._id === id
                )
                if (item) return item
                return {
                  _id: id,
                  itemLevelScoring: true,
                }
              })
          } else {
            classResponse.itemGroups.forEach((group) => {
              if (
                group.deliveryType === ALL_RANDOM ||
                group.deliveryType === LIMITED_RANDOM
              ) {
                const dummyItems = [...new Array(group.deliverItemsCount)].map(
                  () => ({
                    _id: '',
                    itemLevelScoring: true,
                  })
                )
                allItems.push(...dummyItems)
              } else {
                allItems.push(...group.items)
              }
            })
          }

          return {
            activityId: activity?._id || '',
            studentId: activity.userId,
            items: allItems,
          }
        }
      )

      entities = studentsDataWithTestItems.map((studentData) => {
        const studentActivityData = transformGradeBookResponse({
          ...gradebookData,
          testItemsData: studentData.items,
          ts: additionalData.ts,
          gradingPolicy: additionalData.scoringType,
          applyEBSR: additionalData.applyEBSR,
        })
        return studentActivityData.find(
          (sa) => sa.studentId === studentData.studentId
        )
      })
    } else {
      entities = transformGradeBookResponse({
        ...gradebookData,
        ts: additionalData.ts,
        gradingPolicy: additionalData.scoringType,
        applyEBSR: additionalData.applyEBSR,
      })
    }

    yield put({
      type: RECEIVE_TESTACTIVITY_SUCCESS,
      payload: { gradebookData, additionalData, entities },
    })

    if (studentResponseParams) {
      // studentResponseParams has studentId and testActivityId
      // we need to retrieve student response again,
      // when regrade is successful in LCB
      yield put({
        type: RECEIVE_STUDENT_RESPONSE_REQUEST,
        payload: {
          groupId: payload.classId,
          ...studentResponseParams,
        },
      })
    }
  } catch (err) {
    console.log('err is', err)
    const msg = 'Unable to retrieve test activity.'
    if (err.status === 404) {
      yield put(push(`/author/assignments`))
      notification({ msg: err?.response?.data?.message || msg })
    } else {
      notification({ type: 'error', messageKey: 'receiveTestFailing' })
    }
    yield put({
      type: RECEIVE_TESTACTIVITY_ERROR,
      payload: { error: msg },
    })
  }
}

function* releaseScoreSaga({ payload }) {
  try {
    yield call(classBoardApi.releaseScore, payload)
    yield call(notification, {
      type: 'success',
      msg: 'Successfully updated the release score settings',
    })
    yield put(
      updateAdditionalDataAction({ releaseScore: payload.releaseScore })
    )
  } catch (err) {
    captureSentryException(err)
    const {
      data: { message: errorMessage },
    } = err.response
    if (errorMessage === 'Assignment does not exist anymore') {
      yield put(redirectToAssignmentsAction(''))
    }
    const msg = err.response.data.message || 'Update release score is failed'
    yield call(notification, { msg })
  }
}

function* markAsDoneSaga({ payload }) {
  try {
    yield call(classBoardApi.markAsDone, payload)
    yield put(updateAssignmentStatusAction('DONE'))
    yield call(notification, {
      type: 'success',
      msg: 'Successfully marked as done',
    })
  } catch (err) {
    captureSentryException(err)
    const {
      data: { message: errorMessage },
    } = err.response
    if (
      err &&
      err.status == 422 &&
      err.response.data &&
      err.response.data.message
    ) {
      yield call(notification, { msg: err.response.data.message })
    } else {
      if (errorMessage === 'Assignment does not exist anymore') {
        yield put(redirectToAssignmentsAction(''))
      }
      yield call(notification, {
        msg: err.response.data?.message || 'Mark as done is failed',
      })
    }
  }
}

function* openAssignmentSaga({ payload }) {
  try {
    const { result: assignment } = yield call(
      classBoardApi.openAssignment,
      payload
    )
    const { classId } = payload
    const classData = assignment.class.find((_clazz) => _clazz._id === classId)
    yield put(updateOpenAssignmentsAction(classId))
    yield put(
      updatePasswordDetailsAction({
        assignmentPassword: classData.assignmentPassword,
        passwordExpireTime: classData.passwordExpireTime,
        passwordExpireIn: assignment.passwordExpireIn,
      })
    )
    if (classData.assignmentPassword) {
      yield put(toggleViewPasswordAction())
    }
    yield call(notification, { type: 'success', msg: 'Success' })
  } catch (err) {
    captureSentryException(err)
    let {
      data: { message: errorMessage },
    } = err.response
    const {
      data: { allowedOpenDate, teacherDeniedToOpenBeforeOpenDate },
    } = err.response
    if (errorMessage === 'Assignment does not exist anymore') {
      yield put(redirectToAssignmentsAction(''))
    }
    if (teacherDeniedToOpenBeforeOpenDate && allowedOpenDate) {
      errorMessage = `You cannot open the assessment before ${moment(
        allowedOpenDate
      ).format('lll')}`
    }
    yield call(notification, {
      msg: errorMessage || 'Failed to open',
    })
  }
}

function* closeAssignmentSaga({ payload }) {
  try {
    yield put(setProgressStatusAction(true))
    yield call(classBoardApi.closeAssignment, payload)
    yield put(updateCloseAssignmentsAction(payload.classId))
    yield put(setProgressStatusAction(false))
    yield put(receiveTestActivitydAction(payload.assignmentId, payload.classId))
    yield call(notification, { type: 'success', msg: 'Success' })
  } catch (err) {
    captureSentryException(err)
    const {
      data: { message: errorMessage },
    } = err.response
    yield put(setProgressStatusAction(false))
    if (errorMessage === 'Assignment does not exist anymore') {
      yield put(redirectToAssignmentsAction(''))
    }
    yield call(notification, { msg: errorMessage || 'Failed to close' })
  }
}

function* saveOverallFeedbackSaga({ payload }) {
  try {
    yield call(testActivityApi.saveOverallFeedback, payload)
    yield call(notification, { type: 'success', msg: 'feedback saved' })
  } catch (err) {
    captureSentryException(err)
    const {
      data: { message: errorMessage },
    } = err.response
    if (errorMessage === 'Assignment does not exist anymore') {
      yield put(redirectToAssignmentsAction(''))
    }
    yield call(notification, { msg: errorMessage || 'Saving failed' })
  }
}

function* markAbsentSaga({ payload }) {
  try {
    yield call(classBoardApi.markAbsent, payload)
    yield put(updateStudentActivityAction(payload.students))
    yield call(notification, {
      type: 'success',
      msg: 'Successfully marked as absent',
    })
  } catch (err) {
    captureSentryException(err)
    const {
      data: { message: errorMessage },
    } = err.response
    if (errorMessage === 'Assignment does not exist anymore') {
      yield put(redirectToAssignmentsAction(''))
    }
    yield call(notification, {
      msg: errorMessage || 'Mark absent students failed',
    })
  }
}

function* markAsSubmittedSaga({ payload }) {
  try {
    const response = yield call(classBoardApi.markSubmitted, payload)
    console.log(response, '===r')
    yield put(updateSubmittedStudentsAction(response.updatedTestActivities))
    yield call(notification, {
      type: 'success',
      msg: 'Successfully marked as submitted',
    })
  } catch (err) {
    captureSentryException(err)
    const {
      data: { message: errorMessage },
    } = err.response
    if (errorMessage === 'Assignment does not exist anymore') {
      yield put(redirectToAssignmentsAction(''))
    }
    yield call(notification, { msg: errorMessage || 'Mark as submit failed' })
  }
}

function* togglePauseAssignment({ payload }) {
  try {
    yield call(classBoardApi.togglePause, payload)
    yield put(setIsPausedAction(payload.value))
    const msg = `Assignment ${payload.name} is now ${
      payload.value ? 'paused.' : 'open and available for students to work.'
    }`
    yield call(notification, { type: 'success', msg })
  } catch (err) {
    const {
      data: { message: errorMessage },
    } = err.response
    captureSentryException(err)
    if (errorMessage === 'Assignment does not exist anymore') {
      yield put(redirectToAssignmentsAction(''))
    }
    const msg =
      errorMessage || `${payload.value ? 'Pause' : 'Resume'} assignment failed`
    yield call(notification, { msg })
  }
}

function* fetchStudentsByClassSaga({ payload }) {
  try {
    const isActiveStudents = true
    const { students = [] } = yield call(
      enrollmentApi.fetch,
      payload.classId,
      isActiveStudents
    )
    yield put(updateClassStudentsAction(students))
  } catch (err) {
    captureSentryException(err)
    console.error('Receive students from class failed')
  }
}

function* removeStudentsSaga({ payload }) {
  try {
    const { students } = yield call(classBoardApi.removeStudents, payload)
    yield put(updateRemovedStudentsAction(students))
    yield call(notification, { type: 'success', msg: 'Successfully removed' })
  } catch (err) {
    captureSentryException(err)
    const { data = {} } = err.response || {}
    const { message: errorMessage } = data
    if (errorMessage === 'Assignment does not exist anymore') {
      yield put(redirectToAssignmentsAction(''))
    }
    yield call(notification, {
      msg: err.response.data.message || 'Remove students failed',
    })
  }
}

function* addStudentsSaga({ payload }) {
  try {
    yield put(setLcbActionProgress(true))
    yield call(classBoardApi.addStudents, payload)
    yield call(notification, { type: 'success', msg: 'Successfully added' })
    yield put(setAddedStudentsAction(payload.students))
  } catch (err) {
    captureSentryException(err)
    const {
      data: { message: errorMessage },
    } = err.response
    if (errorMessage === 'Assignment does not exist anymore') {
      yield put(redirectToAssignmentsAction(''))
    }
    yield call(notification, {
      msg: err.response.data.message || 'Add students failed',
    })
  } finally {
    yield put(setLcbActionProgress(false))
  }
}

function* getAllTestActivitiesForStudentSaga({ payload }) {
  try {
    const { assignmentId, groupId, studentId } = payload
    const result = yield call(classBoardApi.testActivitiesForStudent, {
      assignmentId,
      groupId,
      studentId,
    })
    yield put(setAllTestActivitiesForStudentAction(result))
  } catch (err) {
    captureSentryException(err)
    const { data = {} } = err.response || {}
    const { message: errorMessage } = data
    if (errorMessage === 'Assignment does not exist anymore') {
      yield put(redirectToAssignmentsAction(''))
    }
    yield call(notification, {
      msg: errorMessage || 'Fetching all test activities failed',
    })
  }
}

function* downloadGradesAndResponseSaga({ payload }) {
  try {
    const data = yield call(classBoardApi.downloadGrades, payload)
    const userName = yield select(getUserNameSelector)
    // eslint-disable-next-line no-use-before-define
    const testName = yield select(testNameSelector)
    let fileName = `${testName}_${userName}`
    const isNonASCIIChar = [...fileName].some(
      (char) => char.charCodeAt(0) > 127
    )
    if (isNonASCIIChar) {
      fileName = `${payload.assignmentId}_${payload.classId}`
    }

    downloadCSV(`${fileName}.csv`, data)
  } catch (err) {
    captureSentryException(err)
    const {
      data: { message: errorMessage },
    } = err.response
    yield call(notification, { msg: errorMessage || 'Download failed' })
  }
}

function* redirectToAssignmentsSaga() {
  yield put(push(`/author/assignments`))
}

function* regeneratePasswordSaga({ payload }) {
  try {
    const data = yield call(classBoardApi.regeneratePassword, payload)
    yield put(
      updatePasswordDetailsAction({
        assignmentPassword: data.assignmentPassword,
        passwordExpireTime: data.passwordExpireTime,
        passwordExpireIn: data.passwordExpireIn,
        ts: data.ts,
      })
    )
  } catch (e) {
    Sentry.captureException(e)
    console.log(e)
    yield call(notification, { msg: 'Regenerate password failed' })
  }
}

function* canvasSyncGradesSaga({ payload }) {
  try {
    yield call(canvasApi.canvasGradesSync, payload)
    yield call(notification, {
      type: 'success',
      msg: 'Grades synced with canvas successfully.',
    })
  } catch (err) {
    captureSentryException(err)
    const {
      data: { message: errorMessage },
    } = err.response
    if (errorMessage === 'Not shared with canvas') {
      yield put(setShowCanvasShareAction(true))
      return
    }
    yield call(notification, {
      msg: errorMessage || 'Failed to sync grades with canvas.',
    })
  }
}

function* canvasSyncAssignmentSaga({ payload }) {
  try {
    yield call(canvasApi.canvasAssignmentSync, payload)
    yield call(notification, {
      type: 'success',
      msg: 'Assignment synced with canvas successfully.',
    })
  } catch (err) {
    captureSentryException(err)
    const {
      data: { message: errorMessage },
    } = err.response
    yield call(notification, {
      msg: errorMessage || 'Failed to sync assignment with canvas.',
    })
  }
}

function* fetchServerTimeSaga() {
  try {
    const ts = yield call(utilityApi.fetchServerTime)
    yield put(updateServerTimeAction(ts))
  } catch (err) {
    captureSentryException(err)
  }
}

function* togglePauseStudentsSaga({ payload }) {
  try {
    const { result } = yield call(classBoardApi.togglePauseStudents, payload)
    yield put(updatePauseStatusAction({ result, isPaused: payload.isPause }))
    if (payload.isPause) {
      return notification({
        type: 'success',
        msg: 'Successfully paused students',
      })
    }
    return notification({
      type: 'success',
      msg: 'Assignment is open and available for students to work.',
    })
  } catch (err) {
    captureSentryException(err)
    const {
      data: { message: errorMessage },
    } = err.response
    if (errorMessage === 'Assignment does not exist anymore') {
      yield put(redirectToAssignmentsAction(''))
    }
    yield call(notification, {
      msg: errorMessage || 'Mark absent students failed',
    })
  }
}

function* reloadLcbDataInStudentView({ payload }) {
  try {
    const isQuestionsView = payload.lcbView === 'question-view'
    yield call(receiveTestActivitySaga, {
      payload: { ...payload, isQuestionsView },
    })

    if (payload.lcbView === 'student-report') {
      yield put(receiveStudentResponseAction(payload))
    }
    const { modalState } = payload
    if (payload.lcbView === 'question-view' && modalState) {
      let firstQuestionId = get(modalState, 'item.data.questions.[0].id')
      if (
        !modalState.item.itemLevelScoring &&
        get(modalState, 'item.data.questions', []).length > 1
      ) {
        const previousQid = get(modalState, 'question.id')
        const prevQuestionInNewItem = get(
          modalState,
          'item.data.questions',
          []
        ).find((q) => q.previousQuestionId === previousQid)
        if (prevQuestionInNewItem && prevQuestionInNewItem.id) {
          firstQuestionId = prevQuestionInNewItem.id
        }
      }
      if (firstQuestionId) {
        yield put(
          push(
            `/author/classboard/${payload.assignmentId}/${payload.classId}/question-activity/${firstQuestionId}`
          )
        )
      }
    }
  } catch (err) {
    console.error(err)
    captureSentryException(err)
    notification({ type: 'error', msg: 'Unable to refresh data' })
  }
}

function* correctItemUpdateSaga({ payload }) {
  try {
    const {
      testItemId,
      testId,
      question,
      callBack,
      assignmentId,
      proceedRegrade,
      editRegradeChoice,
    } = payload
    const classResponse = yield select((state) => state.classResponse)
    const testItems = get(classResponse, 'data.originalItems', [])
    const studentResponse = yield select((state) => state.studentResponse)
    const testItem = testItems.find((t) => t._id === testItemId) || {}
    const { itemLevelScoring = false, multipartItem = false, rows } =
      testItem || {}

    const qIndex = getQindex(question?.id, testItem)

    const [isIncomplete, errMsg] = isIncompleteQuestion(
      question,
      itemLevelScoring,
      multipartItem || isV1MultipartItem(rows),
      testItemId,
      qIndex
    )

    if (isIncomplete) {
      notification({ msg: errMsg })
      return
    }

    const [hasImproperConfig, warningMsg] = hasImproperDynamicParamsConfig(
      question
    )

    if (hasImproperConfig) {
      notification({ type: 'warn', msg: warningMsg })
    }
    if (isOptionsRemoved(testItem?.data?.questions, [question])) {
      return notification({
        type: 'warn',
        messageKey: 'optionRemove',
      })
    }

    const cloneItem = cloneDeep(testItem)
    cloneItem.data.questions = testItem.data.questions.map((q) =>
      q.id === question.id ? question : q
    )
    if (question.validation.unscored) {
      cloneItem.itemLevelScoring = false
    }
    yield put(correctItemUpdateProgressAction(true))
    const result = yield call(testItemsApi.updateCorrectItemById, {
      testItemId,
      testItem: cloneItem,
      testId,
      assignmentId,
      proceedRegrade,
      editRegradeChoice,
    })
    yield put(correctItemUpdateProgressAction(false))
    if (!proceedRegrade && !result.isRegradeNeeded && result.firestoreDocId) {
      yield put(setRegradeFirestoreDocId(result.firestoreDocId))
      yield put(setSilentCloningAction(true))
      return
    }
    if (typeof callBack === 'function') {
      // close correct item edit modal here
      callBack()
    }

    const { testId: newTestId, isRegradeNeeded } = result

    if (proceedRegrade) {
      yield put({
        type: TOGGLE_REGRADE_MODAL,
        payload: {
          newTestId,
          oldTestId: testId,
          itemData: payload,
          item: result.item,
          question,
        },
      })
      yield put(setRegradeFirestoreDocId(result.firestoreDocId))
    }
    if (isRegradeNeeded && !proceedRegrade) {
      yield put({
        type: TOGGLE_REGRADE_MODAL,
        payload: { newTestId, oldTestId: testId, itemData: payload },
      })
    }
    const { groupId: payloadGroupId, lcbView } = payload
    if (!isRegradeNeeded && !proceedRegrade && result.item) {
      yield put(
        reloadLcbDataInStudentViewAction({
          assignmentId,
          classId: payloadGroupId,
          isQuestionsView: lcbView === 'question-view',
          lcbView,
          testActivityId: studentResponse?.data?.testActivity?._id,
          groupId: studentResponse?.data?.testActivity?.groupId,
          studentId: studentResponse?.data?.testActivity?.userId,
        })
      )
      return notification({
        type: 'success',
        messageKey: 'publishCorrectItemSuccess',
      })
    }
  } catch (error) {
    yield put(correctItemUpdateProgressAction(false))
    yield put(setRegradeFirestoreDocId(''))
    notification({
      msg: error?.response?.data?.message,
      messageKey: 'publishCorrectItemFailing',
    })
  }
}

export function* watcherSaga() {
  yield all([
    yield takeEvery(RECEIVE_GRADEBOOK_REQUEST, receiveGradeBookSaga),
    yield takeLatest(RECEIVE_TESTACTIVITY_REQUEST, receiveTestActivitySaga),
    yield takeEvery(UPDATE_RELEASE_SCORE, releaseScoreSaga),
    yield takeEvery(SET_MARK_AS_DONE, markAsDoneSaga),
    yield takeEvery(OPEN_ASSIGNMENT, openAssignmentSaga),
    yield takeEvery(CLOSE_ASSIGNMENT, closeAssignmentSaga),
    yield takeEvery(SAVE_OVERALL_FEEDBACK, saveOverallFeedbackSaga),
    yield takeEvery(TOGGLE_PAUSE_ASSIGNMENT, togglePauseAssignment),
    yield takeEvery(MARK_AS_ABSENT, markAbsentSaga),
    yield takeEvery(MARK_AS_SUBMITTED, markAsSubmittedSaga),
    yield takeEvery(REMOVE_STUDENTS, removeStudentsSaga),
    yield takeEvery(PAUSE_STUDENTS, togglePauseStudentsSaga),
    yield takeEvery(FETCH_STUDENTS, fetchStudentsByClassSaga),
    yield takeEvery(
      GET_ALL_TESTACTIVITIES_FOR_STUDENT,
      getAllTestActivitiesForStudentSaga
    ),
    yield takeEvery(ADD_STUDENTS, addStudentsSaga),
    yield takeEvery(DOWNLOAD_GRADES_RESPONSES, downloadGradesAndResponseSaga),
    yield takeEvery(REDIRECT_TO_ASSIGNMENTS, redirectToAssignmentsSaga),
    yield takeEvery(REGENERATE_PASSWORD, regeneratePasswordSaga),
    yield takeEvery(CANVAS_SYNC_GRADES, canvasSyncGradesSaga),
    yield takeEvery(CANVAS_SYNC_ASSIGNMENT, canvasSyncAssignmentSaga),
    yield takeEvery(FETCH_SERVER_TIME, fetchServerTimeSaga),
    yield takeEvery(CORRECT_ITEM_UPDATE_REQUEST, correctItemUpdateSaga),
    yield takeEvery(
      RELOAD_LCB_DATA_IN_STUDENT_VIEW,
      reloadLcbDataInStudentView
    ),
  ])
}

export const stateGradeBookSelector = (state) =>
  state.author_classboard_gradebook
export const stateTestActivitySelector = (state) =>
  state.author_classboard_testActivity
export const stateClassResponseSelector = (state) => state.classResponse
export const stateStudentResponseSelector = (state) => state.studentResponse
export const stateClassStudentResponseSelector = (state) =>
  state.classStudentResponse
export const stateFeedbackResponseSelector = (state) => state.feedbackResponse
export const stateStudentAnswerSelector = (state) =>
  state.studentQuestionResponse
export const stateExpressGraderAnswerSelector = (state) => state.answers
export const stateQuestionAnswersSelector = (state) =>
  state.classQuestionResponse
export const getPageNumberSelector = createSelector(
  stateTestActivitySelector,
  (state) => state.pageNumber
)

export const getAnswerByQidSelector = createSelector(
  stateExpressGraderAnswerSelector,
  (answers) => {
    const answerByQid = {}
    Object.keys(answers).forEach((answer) => {
      const [, qid] = answer.split(/_(.+)/)
      answerByQid[qid] = answers[answer]
    })
    return answerByQid
  }
)

export const getTestItemById = createSelector(
  stateClassResponseSelector,
  (state, testItemId) =>
    get(state, 'data.testItems', []).find((t) => t._id === testItemId) || {}
)

const getTestItemsData = createSelector(
  stateTestActivitySelector,
  (state) => state?.data?.testItemsData || []
)

export const getClassResponseSelector = createSelector(
  stateClassResponseSelector,
  (state) => state?.data || {}
)

export const getSilentCloneSelector = createSelector(
  stateClassResponseSelector,
  (state) => state?.silentClone
)

export const ttsUserIdSelector = createSelector(
  stateTestActivitySelector,
  (state) => {
    const { data: { students = [] } = {} } = state || {}
    const ttsUser = (student) => student.tts === 'yes'
    return students.filter(ttsUser).map((student) => student._id)
  }
)

export const getHasRandomQuestionselector = createSelector(
  getClassResponseSelector,
  (_test) => hasRandomQuestions(_test || {})
)

export const getTotalPoints = createSelector(
  getClassResponseSelector,
  (_test) => _test?.summary?.totalPoints
)

export const getIsDocBasedTestSelector = createSelector(
  getClassResponseSelector,
  (_test) => _test?.isDocBased
)

export const getCurrentTestActivityIdSelector = createSelector(
  stateTestActivitySelector,
  (state) => state.currentTestActivityId || ''
)

export const getAllTestActivitiesForStudentSelector = createSelector(
  stateTestActivitySelector,
  (state) => state.allTestActivitiesForStudent || []
)

export const getViewPasswordSelector = createSelector(
  stateTestActivitySelector,
  (state) => state.viewPassword
)

export const getAssignmentPasswordDetailsSelector = createSelector(
  stateTestActivitySelector,
  (state) => ({
    assignmentPassword: state?.additionalData?.assignmentPassword,
    passwordExpireTime: state?.additionalData?.passwordExpireTime,
    passwordExpireIn: state?.additionalData?.passwordExpireIn,
  })
)

export const getAttemptWindowSelector = createSelector(
  stateTestActivitySelector,
  (state) => {
    const attemptWindow = state?.additionalData?.attemptWindow

    if (!attemptWindow) return

    if (attemptWindow.type === ATTEMPT_WINDOW_TYPE.DEFAULT) return

    const start = attemptWindow.startTime
    const end = attemptWindow.endTime

    const text = `Student can attempt between `

    const res =
      attemptWindow.type === ATTEMPT_WINDOW_TYPE.WEEKDAYS
        ? text.concat(`Weekdays (Mon to Fri) ${start} to ${end}`)
        : text.concat(`${start} to ${end} on ${attemptWindow.days.join(', ')}`)

    return res
  }
)

export const getStudentsPrevSubmittedUtasSelector = createSelector(
  stateTestActivitySelector,
  (state) => {
    const groupedUtas = state?.data?.recentTestActivitiesGrouped || {}
    const groupedSubmittedUtas = {}
    for (const [key, value] of Object.entries(groupedUtas)) {
      const lastSubmittedUTA = value.find(
        (v) => v.status !== testActivityStatus.ABSENT
      )
      if (lastSubmittedUTA) {
        groupedSubmittedUtas[key] = lastSubmittedUTA
      }
    }
    return groupedSubmittedUtas
  }
)

export const getItemSummary = (
  entities,
  questionsOrder,
  itemsSummary,
  originalQuestionActivities
) => {
  const questionMap = {}

  if (originalQuestionActivities) {
    // originalQuestionActivitiesKeyed = keyBy(originalQuestionActivities, "_id");
    const originalQuestionActivitiesGrouped = groupBy(
      originalQuestionActivities,
      'testItemId'
    )
    for (const itemId of Object.keys(originalQuestionActivitiesGrouped)) {
      const manuallyGradedPresent = originalQuestionActivitiesGrouped[
        itemId
      ].find((x) => x.graded === false)
      /**
       * even if at-least 1 questionActivity with graded false
       * and itemLevelScoring is enabled,
       * then every other questionActivities in the item
       * should be treated as manually gradable
       */
      if (
        manuallyGradedPresent &&
        originalQuestionActivitiesGrouped[itemId][0].weight > 1
      ) {
        originalQuestionActivitiesGrouped[
          itemId
        ] = originalQuestionActivitiesGrouped[itemId].map((x) => ({
          ...x,
          score: undefined,
          graded: false,
        }))
      }
    }
  }

  for (const entity of entities) {
    const { questionActivities = [] } = entity
    for (const _activity of questionActivities.filter((x) => !x.disabled)) {
      const {
        _id,
        testItemId,
        score,
        maxScore,
        graded,
        qLabel,
        barLabel,
        timeSpent,
        pendingEvaluation,
        isPractice,
      } = _activity
      const itemQuestionKey = `${testItemId}_${_id}`
      let { notStarted, skipped } = _activity

      let skippedx = false
      if (!questionMap[itemQuestionKey]) {
        questionMap[itemQuestionKey] = {
          _id,
          qLabel,
          barLabel,
          itemLevelScoring: false,
          itemId: null,
          attemptsNum: 0,
          avgTimeSpent: 0,
          correctNum: 0,
          skippedNum: 0,
          wrongNum: 0,
          partialNum: 0,
          notStartedNum: 0,
          timeSpent: 0,
          manualGradedNum: 0,
          unscoredItems: 0,
        }
      }
      if (testItemId) {
        questionMap[itemQuestionKey].itemLevelScoring = true
        questionMap[itemQuestionKey].itemId = testItemId
      }

      if (!notStarted) {
        questionMap[itemQuestionKey].attemptsNum += 1
      } else if (score > 0) {
        notStarted = false
      } else {
        questionMap[itemQuestionKey].notStartedNum += 1
      }

      if (skipped && score === 0 && !isPractice) {
        questionMap[itemQuestionKey].skippedNum += 1
        skippedx = true
      }
      if (score > 0) {
        skipped = false
      }
      if (isPractice) {
        questionMap[itemQuestionKey].unscoredItems += 1
      } else if (
        (graded === false && !notStarted && !skipped && !score) ||
        pendingEvaluation
      ) {
        questionMap[itemQuestionKey].manualGradedNum += 1
      } else if (score === maxScore && !notStarted && score > 0) {
        questionMap[itemQuestionKey].correctNum += 1
      } else if (score === 0 && !notStarted && maxScore > 0 && !skippedx) {
        questionMap[itemQuestionKey].wrongNum += 1
      } else if (score > 0 && score < maxScore) {
        questionMap[itemQuestionKey].partialNum += 1
      }
      if (timeSpent && !notStarted) {
        questionMap[itemQuestionKey].timeSpent += timeSpent
      }
    }
  }
  // eslint-disable-next-line guard-for-in
  for (const question in questionMap) {
    questionMap[question].avgTimeSpent =
      questionMap[question].timeSpent / questionMap[question].attemptsNum
  }
  return sortBy(_values(questionMap), [(x) => questionsOrder[x._id]])
}

export const getAggregateByQuestion = (entities, studentId) => {
  if (!entities) {
    return {}
  }
  const total = entities.filter(
    ({ isAssigned, isEnrolled, enrollmentStatus, archived }) =>
      isAssigned &&
      studentIsEnrolled({ isEnrolled, enrollmentStatus, archived })
  ).length
  const submittedEntities = entities.filter(
    ({ UTASTATUS, isEnrolled, enrollmentStatus, archived }) =>
      UTASTATUS === testActivityStatus.SUBMITTED &&
      studentIsEnrolled({ isEnrolled, enrollmentStatus, archived })
  )
  const activeEntities = entities.filter(
    (x) =>
      (x.UTASTATUS === testActivityStatus.START ||
        x.UTASTATUS === testActivityStatus.SUBMITTED) &&
      x.isAssigned
  )
  let questionsOrder = {}
  if (entities.length > 0) {
    let entity = entities[0]
    if (studentId) {
      entity = entities?.find((e) => e.studentId === studentId)
    }
    questionsOrder = (entity?.questionActivities || []).reduce(
      (acc, cur, ind) => {
        acc[cur._id] = ind
        return acc
      },
      {}
    )
  }
  const submittedNumber = submittedEntities.length
  const absentNumber =
    entities.filter((x) => x.UTASTATUS === testActivityStatus.ABSENT)?.length ||
    0
  const scores = activeEntities
    .map(({ score, maxScore }) => score / maxScore)
    .reduce((prev, cur) => prev + cur, 0)

  const scorePercentagePerStudent = activeEntities
    .map(({ score, maxScore }) => {
      let percentage = (score / maxScore) * 100
      if (Number.isNaN(percentage) || !Number.isFinite(percentage)) {
        percentage = 0
      }
      return percentage
    })
    .sort((a, b) => a - b)
  const numberOfActivities = scorePercentagePerStudent.length
  const mid = Math.ceil(numberOfActivities / 2)
  const median =
    numberOfActivities % 2 === 0
      ? (scorePercentagePerStudent[mid] + scorePercentagePerStudent[mid - 1]) /
        2
      : scorePercentagePerStudent[mid - 1]
  const submittedScoresAverage =
    activeEntities.length > 0 ? scores / activeEntities.length : 0
  if (studentId) {
    entities = entities.filter((x) => x.studentId === studentId)
  }

  const itemsSummary = getItemSummary(entities, questionsOrder)
  const result = {
    total,
    submittedNumber,
    absentNumber,
    avgScore: submittedScoresAverage,
    questionsOrder,
    itemsSummary,
    median: round(median, 2) || 0,
  }
  return result
}

export const classStudentsSelector = createSelector(
  stateTestActivitySelector,
  (state) =>
    state.classStudents.filter(
      (student) => student.enrollmentStatus !== '0' && student.status !== 0
    )
)
export const removedStudentsSelector = createSelector(
  stateTestActivitySelector,
  (state) =>
    get(state, 'entities', [])
      .filter((item) => item.isAssigned === false)
      .map(({ studentId }) => studentId)
)

export const getAllActivities = createSelector(
  stateTestActivitySelector,
  (state) => state.entities
)

export const getEnrollmentStatus = createSelector(
  getAllActivities,
  (entities) => {
    const enrollmentStatus = {}
    for (const entity of entities) {
      enrollmentStatus[entity.studentId] = entity.isEnrolled ? 1 : 0
    }
    return enrollmentStatus
  }
)

export const getIsShowAllStudents = createSelector(
  stateTestActivitySelector,
  (state) => get(state, 'isShowAllStudents', false)
)

export const getAllStudentsList = createSelector(
  stateTestActivitySelector,
  (state) => get(state, 'data.students', [])
)

export const getAdditionalDataSelector = createSelector(
  stateTestActivitySelector,
  (state) => state.additionalData
)

export const getScoringTypeSelector = createSelector(
  getAdditionalDataSelector,
  (state) => get(state, 'scoringType', '')
)

export const getEBSRSelector = createSelector(
  getAdditionalDataSelector,
  (state) => get(state, 'applyEBSR', false)
)

export const getCurrentClassIdSelector = createSelector(
  getAdditionalDataSelector,
  (state) => get(state, 'classId', '')
)

export const getRedirectedDatesSelector = createSelector(
  getAdditionalDataSelector,
  (state) => get(state, 'redirectedDates', {})
)

export const getTestDataSelector = createSelector(
  stateTestActivitySelector,
  (state) => get(state, 'data.test', {})
)

export const getIsOverrideFreezeSelector = createSelector(
  getAdditionalDataSelector,
  getTestDataSelector,
  getUserIdSelector,
  (additionalData, testData, userId) => {
    if (!testData.freezeSettings) {
      return false
    }
    if (additionalData?.testAuthors?.some((author) => author._id === userId)) {
      return false
    }
    return true
  }
)

export const getTestActivitySelector = createSelector(
  getAllActivities,
  getEnrollmentStatus,
  getIsShowAllStudents,
  getRedirectedDatesSelector,
  getCurrentClassIdSelector,
  (entities, enrollments, showAll, redirectedDates, classId) =>
    entities
      .map((item) => ({
        ...item,
        enrollmentStatus: enrollments[item.studentId],
        redirectedDate:
          redirectedDates[`student_${item.studentId}`] ||
          redirectedDates[`class_${classId}`] ||
          null,
      }))
      .filter((item) => item.isAssigned || showAll)
)

export const getLCBStudentsList = createSelector(
  getAllStudentsList,
  getTestActivitySelector,
  (students, entities) => {
    const testActivitiesByUserId = keyBy(entities, 'studentId')
    return students.filter((s) => !!testActivitiesByUserId[s._id])
  }
)

export const getActiveAssignedStudents = createSelector(
  getLCBStudentsList,
  removedStudentsSelector,
  getEnrollmentStatus,
  (students, removedStudents, enrollments) =>
    students.filter(
      (stud) =>
        !removedStudents.includes(stud._id) && enrollments[stud._id] == 1
    )
)

export const getFirstQuestionEntitiesSelector = createSelector(
  getTestActivitySelector,
  getTestItemsData,
  (uta, itemsData) => {
    const itemsKeyed = keyBy(itemsData, '_id')
    const uqa = get(uta, [0, 'questionActivities'], [])
    const result = uqa.filter((_uqa) => {
      const { testItemId } = _uqa
      const item = itemsKeyed[testItemId]
      if (!item) return false
      if (item.itemLevelScoring) {
        delete itemsKeyed[testItemId]
      }
      return true
    })
    return result
  }
)

export const getTestQuestionActivitiesSelector = createSelector(
  stateTestActivitySelector,
  (state) => {
    if (state.data) {
      return state.data.testQuestionActivities
    }
    return []
  }
)

export const getSortedTestActivitySelector = createSelector(
  getTestActivitySelector,
  getTestQuestionActivitiesSelector,
  getHasRandomQuestionselector,
  getTotalPoints,
  (state, tqa, hasRandomQuest, totalPoints) => {
    const sortedTestActivities =
      state?.sort((a, b) =>
        a?.studentName?.toUpperCase() > b?.studentName?.toUpperCase() ? 1 : -1
      ) || []
    if (hasRandomQuest) {
      const qActivityByUser = groupBy(tqa, 'userId')
      return sortedTestActivities.map((activity) => ({
        ...activity,
        maxScore: totalPoints,
        questionActivities: activity.questionActivities.length
          ? activity.questionActivities
          : qActivityByUser[activity.studentId] || [],
      }))
    }
    return sortedTestActivities
  }
)

export const getGradeBookSelector = createSelector(
  getTestActivitySelector,
  getHasRandomQuestionselector,
  getSortedTestActivitySelector,
  (entities, hasRandomQuest, sortedTestActivities) => {
    if (hasRandomQuest) {
      return {
        ...getAggregateByQuestion(sortedTestActivities),
        questionsOrder: {},
        itemsSummary: [],
      }
    }
    return getAggregateByQuestion(entities)
  }
)

export const notStartedStudentsSelector = createSelector(
  getTestActivitySelector,
  (state) =>
    state.filter(
      (x) =>
        x.UTASTATUS === testActivityStatus.NOT_STARTED &&
        x.isAssigned &&
        x.isEnrolled
    )
)

export const inProgressStudentsSelector = createSelector(
  getTestActivitySelector,
  (state) =>
    state.filter(
      (x) =>
        x.UTASTATUS === testActivityStatus.START && x.isAssigned && x.isEnrolled
    )
)

export const testNameSelector = createSelector(
  stateTestActivitySelector,
  (state) => state.additionalData?.testName
)

export const getCanMarkAssignmentSelector = createSelector(
  getAdditionalDataSelector,
  (state) => get(state, 'canMarkAssignment', false)
)

export const getClassesCanBeMarkedSelector = createSelector(
  getAdditionalDataSelector,
  (state) => get(state, 'classesCanBeMarked', [])
)

export const getMarkAsDoneEnableSelector = createSelector(
  getClassesCanBeMarkedSelector,
  getCurrentClassIdSelector,
  (classes, currentClass) => classes.includes(currentClass)
)

export const getAssignmentStatusSelector = createSelector(
  stateTestActivitySelector,
  (state) => get(state, ['data', 'status'], '')
)

export const getIsSpecificStudents = createSelector(
  getAdditionalDataSelector,
  (state) => get(state, 'specificStudents', false)
)

export const getCanCloseAssignmentSelector = createSelector(
  getAdditionalDataSelector,
  getCurrentClassIdSelector,
  getUserRole,
  getAssignmentStatusSelector,
  (additionalData, currentClass, userRole, status) =>
    additionalData?.canCloseClass?.includes(currentClass) &&
    status !== 'DONE' &&
    status !== 'NOT OPEN' &&
    !(
      additionalData?.closePolicy ===
        assignmentPolicyOptions.POLICY_CLOSE_MANUALLY_BY_ADMIN &&
      userRole === roleuser.TEACHER
    )
)

export const getCanOpenAssignmentSelector = createSelector(
  getAdditionalDataSelector,
  getCurrentClassIdSelector,
  getUserRole,
  (additionalData, currentClass, userRole) =>
    additionalData?.canOpenClass?.includes(currentClass) &&
    !(
      additionalData?.openPolicy ===
        assignmentPolicyOptions.POLICY_OPEN_MANUALLY_BY_ADMIN &&
      userRole === roleuser.TEACHER
    )
)

export const getAssignmentStatusLowerCased = createSelector(
  getAssignmentStatusSelector,
  (status) => status.toLowerCase()
)

export const getDisableMarkAsSubmittedSelector = createSelector(
  getAssignmentStatusLowerCased,
  (status) => ['graded', 'done', 'not open'].includes(status)
)

/**
 *  set disableMarkAbsent if the assignment is not-open AND assignment startDate is ahead of current time
 *  OR student has submitted the assignment
 *  OR the assignment is closed/marked-as-done/passed-due-date
 */
export const getDisableMarkAsAbsentSelector = createSelector(
  getAdditionalDataSelector,
  getAssignmentStatusLowerCased,
  (additionalData, status) =>
    (status === 'not open' &&
      ((additionalData.startDate && additionalData.startDate > Date.now()) ||
        !additionalData.open)) ||
    ['graded', 'done'].includes(status)
)

export const getAssignedBySelector = createSelector(
  getAdditionalDataSelector,
  (state) => get(state, 'assignedBy', {})
)

export const getTestAuthorsSelector = createSelector(
  getAdditionalDataSelector,
  (state) => get(state, 'testAuthors', [])
)

export const isItemVisibiltySelector = createSelector(
  stateTestActivitySelector,
  getAdditionalDataSelector,
  getUserId,
  getAssignedBySelector,
  getUserRole,
  (state, additionalData, userId, assignedBy, role) => {
    const assignmentStatus = state?.data?.status
    const contentVisibility = additionalData?.testContentVisibility
    if (role === roleuser.DISTRICT_ADMIN || role === roleuser.SCHOOL_ADMIN) {
      return true
    }
    // For assigned by user content will be always visible.
    if (userId === assignedBy?._id) {
      return true
    }
    // No key called testContentVisibility ?
    // eslint-disable-next-line no-prototype-builtins
    if (!additionalData?.hasOwnProperty('testContentVisibility')) {
      return true
    }
    // Enable for contentVisibility settings ALWAYS or settings GRADING and assignment status is grading or done.
    return (
      contentVisibility === testContentVisibility.ALWAYS ||
      ([IN_GRADING, DONE].includes(assignmentStatus) &&
        contentVisibility === testContentVisibility.GRADING)
    )
  }
)

export const classListSelector = createSelector(
  getAdditionalDataSelector,
  (state) => state?.classes || []
)

export const getPasswordPolicySelector = createSelector(
  getAdditionalDataSelector,
  (state) => state?.passwordPolicy
)

export const testActivtyLoadingSelector = createSelector(
  stateTestActivitySelector,
  (state) => state.loading
)

export const actionInProgressSelector = createSelector(
  stateTestActivitySelector,
  (state) => state.actionInProgress
)

export const addedStudentsSelector = createSelector(
  stateTestActivitySelector,
  (state) => state.addedStudents
)

export const disabledAddStudentsList = createSelector(
  getTestActivitySelector,
  addedStudentsSelector,
  (testActivities, addedStudents) => {
    const existingStudents = testActivities
      .filter((item) => item.isAssigned && item.enrollmentStatus === 1)
      .map((item) => item.studentId)
    return [...existingStudents, ...addedStudents]
  }
)

export const showPasswordButonSelector = createSelector(
  getAdditionalDataSelector,
  getAssignmentStatusSelector,
  testActivtyLoadingSelector,
  (additionalData, assignmentStatus, isLoading) => {
    const { passwordPolicy } = additionalData || {}
    if (
      !assignmentStatus ||
      assignmentStatus === 'NOT OPEN' ||
      passwordPolicy === test.passwordPolicy.REQUIRED_PASSWORD_POLICY_OFF ||
      isLoading
    ) {
      return false
    }
    if (
      passwordPolicy === test.passwordPolicy.REQUIRED_PASSWORD_POLICY_DYNAMIC ||
      passwordPolicy === test.passwordPolicy.REQUIRED_PASSWORD_POLICY_STATIC
    ) {
      return true
    }
    return false
  }
)

export const getTestItemsDataSelector = createSelector(
  stateTestActivitySelector,
  (state) => get(state, 'data.testItemsData')
)

export const getTestItemsOrderSelector = createSelector(
  stateTestActivitySelector,
  (state) =>
    get(state, 'data.test.testItems', []).reduce((acc, item, idx) => {
      const id = item.itemId || item._id
      acc[id] = idx
      return acc
    }, {})
)

export const getIsShowUnAssignSelector = createSelector(
  getAssignedBySelector,
  getUserRole,
  testActivtyLoadingSelector,
  (assignedBy, role, isLoading) => !isLoading && assignedBy.role === role
)

export const getAssignmentClassIdSelector = createSelector(
  stateTestActivitySelector,
  ({ classId, assignmentId }) => ({ classId, assignmentId })
)

export const showScoreSelector = createSelector(
  stateClassResponseSelector,
  (state) => state.showScore
)

export const getmultiLanguageEnabled = createSelector(
  stateClassResponseSelector,
  (state) => state.data?.multiLanguageEnabled
)

export const getStudentResponseSelector = createSelector(
  stateStudentResponseSelector,
  (state) => state.data
)

export const getStudentResponseLoadingSelector = createSelector(
  stateStudentResponseSelector,
  (state) => state.loading
)

export const getClassStudentResponseSelector = createSelector(
  stateClassStudentResponseSelector,
  (state) => state.data
)

export const getPrintViewLoadingSelector = createSelector(
  stateClassStudentResponseSelector,
  (state) => state.printPreviewLoading
)

export const getFeedbackResponseSelector = createSelector(
  stateFeedbackResponseSelector,
  (state) => state.data
)

export const getStudentQuestionSelector = createSelector(
  stateStudentAnswerSelector,
  getAnswerByQidSelector,
  getScoringTypeSelector,
  getTestItemsDataSelector,
  getEBSRSelector,
  (state, egAnswers, gradingPolicy, testItems, applyEBSR) => {
    if (!isEmpty(state.data)) {
      const data = Array.isArray(state.data) ? state.data : [state.data]
      return data.map((x) => {
        const scoringType = getScoringType(
          x.qid,
          testItems,
          x.testItemId,
          gradingPolicy,
          applyEBSR
        )
        if (!isNullOrUndefined(egAnswers[x.qid])) {
          return { ...x, userResponse: egAnswers[x.qid], scoringType }
        }
        return { ...x, scoringType }
      })
    }
    return []
  }
)

export const getClassQuestionSelector = createSelector(
  stateQuestionAnswersSelector,
  (state) => state.data
)

export const getDynamicVariablesSetIdForViewResponse = (
  state,
  { showMultipleAttempts, studentId }
) => {
  let studentTestActivity = null
  if (!showMultipleAttempts) {
    const testActivities = get(
      state,
      'author_classboard_testActivity.data.testActivities',
      []
    )
    studentTestActivity = testActivities.find(
      ({ userId }) => userId === studentId
    )
  } else {
    studentTestActivity = get(state, 'studentResponse.data.testActivity', {})
  }
  if (isEmpty(studentTestActivity)) {
    return false
  }
  return studentTestActivity.algoVariableSetIds
}

export const getQIdsSelector = createSelector(
  stateTestActivitySelector,
  (state) => {
    const testItemsData = get(state, 'data.testItemsData', [])
    if (testItemsData.length === 0) {
      return []
    }
    const qIds = getAllQids(testItemsData)
    return qIds
  }
)

export const getQLabelsSelector = createSelector(
  stateTestActivitySelector,
  (state) => {
    const testItemsData = get(state, 'data.testItemsData', [])
    return getQuestionLabels(testItemsData)
  }
)

export const getServerTsSelector = createSelector(
  getAdditionalDataSelector,
  (state) => getServerTs(state)
)

export const getBulckAssignedCount = createSelector(
  getAdditionalDataSelector,
  (state) => state?.bulkAssignedCount || 0
)

export const getBulkAssignedCountProcessedCount = createSelector(
  getAdditionalDataSelector,
  (state) => state?.bulkAssignedCountProcessed || 0
)

export const getShowRefreshMessage = createSelector(
  getBulckAssignedCount,
  getBulkAssignedCountProcessedCount,
  getAssignedBySelector,
  getUserRole,
  (bulkAssignedCountProcessed, bulkAssignedCount, assignedBy, role) => {
    if (role === roleuser.TEACHER) {
      return false
    }
    if (assignedBy.role !== roleuser.TEACHER) {
      return bulkAssignedCountProcessed > bulkAssignedCount
    }
    return false
  }
)

export const getShowCorrectItemButton = createSelector(
  getAssignedBySelector,
  getUserRole,
  getIsDocBasedTestSelector,
  getClassResponseSelector,
  getUserIdSelector,
  getTestAuthorsSelector,
  (assignedBy, userRole, isDocBased, _test, userId, testAuthors) => {
    const assignedRole = assignedBy.role
    if (!assignedRole || assignedRole === roleuser.STUDENT || isDocBased) {
      return false
    }
    if (_test.freezeSettings) {
      return testAuthors.some((author) => author._id === userId)
    }
    if (assignedRole === roleuser.TEACHER) {
      return true
    }
    if (
      assignedRole === roleuser.DISTRICT_ADMIN ||
      assignedRole === roleuser.SCHOOL_ADMIN
    ) {
      return (
        userRole === roleuser.DISTRICT_ADMIN ||
        userRole === roleuser.SCHOOL_ADMIN
      )
    }
    return false
  }
)
