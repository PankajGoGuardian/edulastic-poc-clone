import { takeEvery, call, put, all, select } from 'redux-saga/effects'
import {
  classBoardApi,
  testActivityApi,
  enrollmentApi,
  classResponseApi,
  canvasApi,
  utilityApi,
} from '@edulastic/api'
import { createSelector } from 'reselect'
import { push } from 'connected-react-router'
import { values as _values, get, keyBy, sortBy, isEmpty, groupBy } from 'lodash'
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
} from '../src/actions/classBoard'

import { createFakeData, hasRandomQuestions } from './utils'

import {
  markQuestionLabel,
  getQuestionLabels,
  transformTestItems,
  transformGradeBookResponse,
} from './Transformer'

import {
  RECEIVE_GRADEBOOK_REQUEST,
  RECEIVE_GRADEBOOK_SUCCESS,
  RECEIVE_GRADEBOOK_ERROR,
  RECEIVE_TESTACTIVITY_REQUEST,
  RECEIVE_TESTACTIVITY_SUCCESS,
  RECEIVE_TESTACTIVITY_ERROR,
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
} from '../src/constants/actions'

import { downloadCSV } from '../Reports/common/util'
import { getUserNameSelector } from '../src/selectors/user'
import { getAllQids } from '../SummaryBoard/Transformer'
import { getUserId, getUserRole } from '../../student/Login/ducks'
import {
  setAddedStudentsAction,
  setLcbActionProgress,
  setProgressStatusAction,
  updateServerTimeAction,
} from '../src/reducers/testActivity'
import { getServerTs } from '../../student/utils'
import { setShowCanvasShareAction } from '../src/reducers/gradeBook'

const {
  authorAssignmentConstants: {
    assignmentStatus: { IN_GRADING, DONE },
  },
} = testActivity

const { testContentVisibility } = test

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
  try {
    // test, testItemsData, testActivities, studentNames, testQuestionActivities
    const { additionalData, ...gradebookData } = yield call(
      classBoardApi.testActivity,
      payload
    )
    if (!additionalData.recentTestActivitiesGrouped) {
      /**
       * resetting attempts data if not recieved from response
       */
      additionalData.recentTestActivitiesGrouped = {}
    }
    const classResponse = yield call(classResponseApi.classResponse, {
      ...payload,
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
    markQuestionLabel(testItems)
    yield put({
      type: RECEIVE_CLASS_RESPONSE_SUCCESS,
      payload: { ...classResponse, testItems },
    })

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
        })
        return studentActivityData.find(
          (sa) => sa.studentId === studentData.studentId
        )
      })
    } else {
      entities = transformGradeBookResponse({
        ...gradebookData,
        ts: additionalData.ts,
      })
    }

    yield put({
      type: RECEIVE_TESTACTIVITY_SUCCESS,
      payload: { gradebookData, additionalData, entities },
    })
  } catch (err) {
    console.log('err is', err)
    const msg = 'Unable to retrieve test activity.'
    notification({ type: 'error', messageKey: 'receiveTestFailing' })
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
    const {
      data: { message: errorMessage },
    } = err.response
    if (errorMessage === 'Assignment does not exist anymore') {
      yield put(redirectToAssignmentsAction(''))
    }
    yield call(notification, {
      msg: err.response.data?.message || 'Failed to open',
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

export function* watcherSaga() {
  yield all([
    yield takeEvery(RECEIVE_GRADEBOOK_REQUEST, receiveGradeBookSaga),
    yield takeEvery(RECEIVE_TESTACTIVITY_REQUEST, receiveTestActivitySaga),
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

const getTestItemsData = createSelector(
  stateTestActivitySelector,
  (state) => state?.data?.testItemsData || []
)

export const getClassResponseSelector = createSelector(
  stateClassResponseSelector,
  (state) => state.data
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
  (_test) => hasRandomQuestions(_test?.itemGroups || [])
)

export const getTotalPoints = createSelector(
  getClassResponseSelector,
  (_test) => _test?.summary?.totalPoints
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
      } = _activity

      let { notStarted, skipped } = _activity

      let skippedx = false
      if (!questionMap[_id]) {
        questionMap[_id] = {
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
        }
      }
      if (testItemId) {
        questionMap[_id].itemLevelScoring = true
        questionMap[_id].itemId = testItemId
      }
      if (!notStarted) {
        questionMap[_id].attemptsNum += 1
      } else if (score > 0) {
        notStarted = false
      } else {
        questionMap[_id].notStartedNum += 1
      }

      if (skipped && score === 0) {
        questionMap[_id].skippedNum += 1
        skippedx = true
      }
      if (score > 0) {
        skipped = false
      }

      if (
        (graded === false && !notStarted && !skipped && !score) ||
        pendingEvaluation
      ) {
        questionMap[_id].manualGradedNum += 1
      } else if (score === maxScore && !notStarted && score > 0) {
        questionMap[_id].correctNum += 1
      } else if (score === 0 && !notStarted && maxScore > 0 && !skippedx) {
        questionMap[_id].wrongNum += 1
      } else if (score > 0 && score < maxScore) {
        questionMap[_id].partialNum += 1
      }
      if (timeSpent && !notStarted) {
        questionMap[_id].timeSpent += timeSpent
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
  const total = entities.length
  const submittedEntities = entities.filter(
    (x) => x.UTASTATUS === testActivityStatus.SUBMITTED
  )
  const activeEntities = entities.filter(
    (x) =>
      x.UTASTATUS === testActivityStatus.START ||
      x.UTASTATUS === testActivityStatus.SUBMITTED
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
  const submittedScoresAverage =
    activeEntities.length > 0 ? scores / activeEntities.length : 0
  // const startedEntities = entities.filter(x => x.status !== "notStarted");
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

export const getCurrentClassIdSelector = createSelector(
  getAdditionalDataSelector,
  (state) => get(state, 'classId', '')
)

export const getRedirectedDatesSelector = createSelector(
  getAdditionalDataSelector,
  (state) => get(state, 'redirectedDates', {})
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
      .filter((item) => (item.isAssigned && item.isEnrolled) || showAll)
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
  (state) => state.filter((x) => x.UTASTATUS === testActivityStatus.NOT_STARTED)
)

export const inProgressStudentsSelector = createSelector(
  getTestActivitySelector,
  (state) => state.filter((x) => x.UTASTATUS === testActivityStatus.START)
)

export const testNameSelector = createSelector(
  stateTestActivitySelector,
  (state) => state.additionalData.testName
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
    additionalData?.canOpenClass.includes(currentClass) &&
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

export const getFeedbackResponseSelector = createSelector(
  stateFeedbackResponseSelector,
  (state) => state.data
)

export const getStudentQuestionSelector = createSelector(
  stateStudentAnswerSelector,
  stateExpressGraderAnswerSelector,
  (state, egAnswers) => {
    if (!isEmpty(state.data)) {
      const data = Array.isArray(state.data) ? state.data : [state.data]
      return data.map((x) => {
        if (!isNullOrUndefined(egAnswers[x.qid])) {
          return { ...x, userResponse: egAnswers[x.qid] }
        }
        return x
      })
    }
    return []
  }
)

export const getClassQuestionSelector = createSelector(
  stateQuestionAnswersSelector,
  (state) => state.data
)

export const getDynamicVariablesSetIdForViewResponse = (state, studentId) => {
  const testActivities = get(
    state,
    'author_classboard_testActivity.data.testActivities',
    []
  )
  const studentTestActivity = testActivities.find((x) => x.userId === studentId)
  if (!studentTestActivity) {
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
