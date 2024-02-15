import { createAction, createReducer } from 'redux-starter-kit'
import { takeLatest, put, call, all, fork, select } from 'redux-saga/effects'
import {
  keyBy as _keyBy,
  isEmpty,
  orderBy,
  keyBy,
  maxBy,
  groupBy,
  get,
} from 'lodash'
import produce from 'immer'
import { push } from 'connected-react-router'

import {
  reportsApi,
  testsApi,
  attchmentApi as attachmentApi,
  assignmentApi,
} from '@edulastic/api'
import {
  questionType,
  testActivityStatus,
  test as testConstants,
  roleuser,
} from '@edulastic/constants'
import { notification } from '@edulastic/common'

import { setTestItemsAction, SET_CURRENT_ITEM } from '../sharedDucks/TestItem'
import {
  setTestActivityAction,
  setPassagesDataAction,
} from '../sharedDucks/ReportsModule/ducks'
import {
  ADD_ITEM_EVALUATION,
  LOAD_ANSWERS,
  LOAD_SCRATCH_PAD,
  REMOVE_ANSWERS,
  SAVE_USER_WORK,
} from '../../assessment/constants/actions'
import {
  receiveTestByIdSuccess,
  getQuestions,
} from '../../author/TestPage/ducks'
import { markQuestionLabel } from '../../assessment/Transformer'
import { loadQuestionsAction } from '../../author/sharedDucks/questions'
import {
  getCurrentUserId,
  transformAssignmentForRedirect,
} from '../Assignments/ducks'
import { getClassIds } from '../Reports/ducks'
import { getUserRole } from '../../author/src/selectors/user'

export const LOAD_TEST_ACTIVITY_REPORT =
  '[studentReports] load testActivity  report'
export const SET_STUDENT_ITEMS = '[studentItems] set Student items'
export const SET_FEEDBACK = '[studentItems] set feedback'
export const SET_TEST_ACTIVITIES =
  '[studentReports] set test all testActivities report'

// actions
export const loadTestActivityReportAction = createAction(
  LOAD_TEST_ACTIVITY_REPORT
)
export const setFeedbackReportAction = createAction(SET_FEEDBACK)
export const setTestActivitiesAction = createAction(SET_TEST_ACTIVITIES)

function* loadAttachmentsFromServer({
  referrerId,
  referrerId2,
  qActId: uqaId,
  qid,
}) {
  try {
    const filterQuery = {
      referrerId,
      referrerId2,
    }
    let { attachments = [] } = yield call(
      attachmentApi.loadAllAttachments,
      filterQuery
    )
    if (attachments.length > 1) {
      attachments = attachments.filter((a) => a.referrerId3 === qid)
    }
    const scratchpadData = {}
    for (const attachment of attachments) {
      const { data = {}, referrerId3 } = attachment
      if (referrerId3 && referrerId3 === qid) {
        scratchpadData[uqaId] = { [referrerId3]: data.scratchpad }
      } else {
        scratchpadData[uqaId] = data.scratchpad
      }
    }
    if (scratchpadData[uqaId]) {
      yield put({ type: SAVE_USER_WORK, payload: scratchpadData })
    }
  } catch (error) {
    console.log('error from attachmentAPI', error)
  }
}

function* getAttachmentsForItems({ testActivityId, testItemsIdArray = [] }) {
  yield all(
    testItemsIdArray.map(({ testItemId, qActId, qid, _id }) =>
      call(loadAttachmentsFromServer, {
        referrerId: testActivityId,
        referrerId2: testItemId,
        qActId: qActId || _id,
        qid,
      })
    )
  )
}

function* loadPassageHighlightFromServer({ referrerId, referrerId2 }) {
  try {
    const { attachments = [] } = yield call(attachmentApi.loadAllAttachments, {
      referrerId,
      referrerId2,
    })
    const passageData = {}
    for (const attachment of attachments) {
      const { data } = attachment
      passageData[referrerId2] = {
        [referrerId]: data,
      }
    }
    yield put({ type: SAVE_USER_WORK, payload: passageData })
  } catch (error) {
    console.log('error from attachmentAPI', error)
  }
}

function* loadPassagesForItems({ testActivityId, passages }) {
  yield all(
    passages.map((passage) =>
      call(loadPassageHighlightFromServer, {
        referrerId: testActivityId,
        referrerId2: passage._id,
      })
    )
  )
}

function* checkAssessmentExpiredDetails({
  assignmentId,
  groupId,
  test,
  activities,
}) {
  try {
    let assignment = yield call(assignmentApi.getById, assignmentId)
    const testActivities = isEmpty(activities)
      ? yield call(assignmentApi.fetchTestActivities, assignmentId, groupId)
      : activities
    const userId = yield select(getCurrentUserId)
    const classIds = yield select(getClassIds)
    const reportsGroupedByClassIdentifier = groupBy(
      testActivities,
      'assignmentClassIdentifier'
    )
    const groupedReportsByAssignmentId = groupBy(
      testActivities,
      (item) => `${item.assignmentId}_${item.groupId}`
    )
    assignment = transformAssignmentForRedirect(
      groupId,
      userId,
      classIds,
      reportsGroupedByClassIdentifier,
      groupedReportsByAssignmentId,
      assignment
    )
    const assignmentClass = assignment.class.filter(
      (c) =>
        c.redirect !== true &&
        c._id === groupId &&
        (!c.students.length ||
          (c.students.length && c.students.includes(userId)))
    )
    const userClassList = assignment.class.filter(
      (c) =>
        c._id === groupId &&
        (!c.students.length ||
          (c.students.length && c.students.includes(userId)))
    )
    const { endDate } = maxBy(userClassList, 'endDate') || {}
    let maxAttempts
    if (assignmentClass[0].maxAttempts) {
      maxAttempts = assignmentClass[0].maxAttempts
    } else {
      maxAttempts = test.maxAttempts
    }
    const attempts = testActivities.filter((el) =>
      [testActivityStatus.ABSENT, testActivityStatus.SUBMITTED].includes(
        el.status
      )
    )
    return {
      maxAttempts,
      attempts: attempts.length,
      endDate,
      serverTimeStamp: assignment.ts,
    }
  } catch (e) {
    console.warn('Something went wrong', e)
  }
}

const createQuestionActiviy = (item = {}, question = {}, testActivity = {}) => {
  const qActivity = {
    qid: question.id,
    testActivityId: testActivity._id,
    testItemId: item._id,
    groupId: testActivity.groupId,
    assignedBy: testActivity.assignedBy,
    assignmentId: testActivity.assignmentId,
    autoGrade: item.autoGrade,
    bookmarked: false,
    correct: false,
    districtId: testActivity.districtId,
    evaluation: {},
    graded: item.autoGrade,
    maxScore: item.maxScore,
    qLabel: question.barLabel,
    qType: question.type,
    score: item.autoGrade ? 0 : '',
    scratchPad: { scratchpad: false },
    skipped: item.autoGrade,
    testId: testActivity.testId,
    timeSpent: 0,
  }
  return qActivity
}

function* loadAttachmentsToStore({ referrerId2, data }) {
  // yield console.log()
  const response = yield call(attachmentApi.loadDataFromUrl, data.freeNotesStd)
  const userWork = yield select((state) => state.userWork.present[referrerId2])
  console.log({ data, res: response.data })
  yield put({
    type: SAVE_USER_WORK,
    payload: { [referrerId2]: { ...userWork, freeNotesStd: response.data } },
  })
}

function* loadTestActivityReport({ payload }) {
  try {
    const { testActivityId, groupId, testId } = payload
    yield put(setFeedbackReportAction(null))
    yield put(setTestActivitiesAction([]))
    if (!testActivityId) {
      throw new Error('invalid data')
    }
    yield put({
      type: REMOVE_ANSWERS,
    })
    const [test, reports] = yield all([
      call(testsApi.getByIdMinimal, testId, {
        data: true,
        isReport: true,
        testActivityId,
        groupId,
      }),
      call(reportsApi.fetchTestActivityReport, testActivityId, groupId),
    ])
    console.log({ reports, test })
    if (reports.testActivity && reports.testActivity.isPaused) {
      yield put(push(`/home/grades`))
      return notification({
        type: 'warn',
        messageKey: 'studentAssignmentPaused',
      })
    }

    reports.questionActivities = reports.questionActivities.map((qa) => {
      if (qa.autoGrade === false && qa.score === undefined) {
        return {
          ...qa,
          graded: false,
        }
      }
      return qa
    })

    const { assignmentId, releaseScore } = reports.testActivity
    const activities = yield call(
      reportsApi.fetchReports,
      groupId,
      testId,
      assignmentId
    )
    if (releaseScore === testConstants.releaseGradeLabels.WITH_ANSWERS) {
      const { attempts, maxAttempts, endDate, serverTimeStamp } = yield call(
        checkAssessmentExpiredDetails,
        {
          assignmentId,
          groupId,
          test,
          activities,
        }
      )
      if (attempts < maxAttempts) {
        reports.testActivity.releaseScore =
          testConstants.releaseGradeLabels.WITH_RESPONSE
      }
      if (endDate <= serverTimeStamp) {
        reports.testActivity.releaseScore = releaseScore
      }
    }
    let testItems = test.itemGroups.flatMap(
      (itemGroup) => itemGroup.items || []
    )
    testItems = markQuestionLabel(testItems)
    const questions = getQuestions(test.itemGroups)
    const questionsWithActivities = questions.map((question) => {
      if (!question.activity) {
        const activity = reports.questionActivities.find(
          (qActivity) =>
            qActivity.qid === question.id &&
            qActivity.testItemId === question.testItemId
        )
        return {
          ...question,
          activity,
        }
      }
      return question
    })
    const { questionActivities = [], testActivity = {} } = reports
    const { passages = [] } = test
    const scratchpadUsedItems = questionActivities.filter((activity) => {
      const { scratchPad: { scratchpad = false } = {}, qType } = activity
      return qType === questionType.HIGHLIGHT_IMAGE && scratchpad === true
    })

    yield fork(getAttachmentsForItems, {
      testActivityId: payload.testActivityId,
      testItemsIdArray: scratchpadUsedItems,
    })

    if (!isEmpty(passages)) {
      yield fork(loadPassagesForItems, {
        testActivityId,
        passages,
      })
    }

    const qActsKeysByQid = keyBy(
      questionActivities,
      (uqa) => `${uqa.testItemId}_${uqa.qid}`
    )
    const _testItems = testItems
      .filter(({ data = {} }) => data.questions?.length)
      .map((item) =>
        produce(item, (draft) => {
          draft.data.questions.forEach((question) => {
            if (qActsKeysByQid[`${item._id}_${question.id}`]) {
              question.activity = qActsKeysByQid[`${item._id}_${question.id}`]
            } else {
              const uqa = createQuestionActiviy(item, question, testActivity)
              reports.questionActivities.push(uqa)
              question.activity = uqa
            }
          })
        })
      )

    yield put(loadQuestionsAction(_keyBy(questionsWithActivities, 'id')))
    yield put(receiveTestByIdSuccess(test))
    yield put(setTestActivityAction(reports.testActivity))
    yield put(setFeedbackReportAction(reports.questionActivities))
    yield put(setTestItemsAction(_testItems))
    yield put(setPassagesDataAction(test.passages || []))

    let testActivities = (activities || []).map((x) => ({
      activiyId: x._id,
      createdAt: x.createdAt,
      startDate: x.startDate,
    }))
    testActivities = orderBy(testActivities, ['startDate'], ['asc'])
    yield put(setTestActivitiesAction(testActivities))

    const userWork = {}
    let allAnswers = {}

    questionActivities.forEach((item) => {
      allAnswers = {
        ...allAnswers,
        [`${item.testItemId}_${item.qid}`]: item.userResponse,
      }
      if (item.scratchPad) {
        const newUserWork = { ...item.scratchPad }
        userWork[item.testItemId] = newUserWork
      }
    })

    if (Object.keys(userWork).length > 0) {
      yield put({
        type: LOAD_SCRATCH_PAD,
        payload: userWork,
      })
    }

    if (test.isDocBased) {
      const referrerId = get(reports, ['testActivity', '_id'])
      const referrerId2 = get(reports, [
        'testActivity',
        'itemsToDeliverInGroup',
        0,
        'items',
        0,
      ])
      const response = yield attachmentApi.loadAllAttachments({
        referrerId,
        referrerId2,
        type: 'doc-annotations',
      })
      yield all(
        (response.attachments || []).map(({ data }) =>
          fork(loadAttachmentsToStore, { referrerId2, data })
        )
      )
    }

    yield put({
      type: ADD_ITEM_EVALUATION,
      payload: {
        ...questionActivities.reduce((result, item) => {
          result[`${item.testItemId}_${item.qid}`] = item.evaluation
          return result
        }, {}),
      },
    })

    // load previous responses
    yield put({
      type: LOAD_ANSWERS,
      payload: allAnswers,
    })
  } catch (e) {
    const role = yield select(getUserRole)
    if (e.status === 404 && role === roleuser.STUDENT) {
      yield put(push(`/home/grades`))
      return notification({
        msg:
          e?.response?.data?.message || 'No active Assignments/Activity found',
      })
    }
    return notification({
      msg: e?.response?.data?.message || 'Something went wrong',
    })
  }
}

// set actions watcherss
export function* watcherSaga() {
  yield all([takeLatest(LOAD_TEST_ACTIVITY_REPORT, loadTestActivityReport)])
}

// reducer

export const setCurrentItemAction = (index) => ({
  type: SET_CURRENT_ITEM,
  payload: {
    data: index,
  },
})

export const setTestFeedbackAction = (data) => ({
  type: SET_FEEDBACK,
  payload: {
    data,
  },
})

const initialState = []
export default createReducer(initialState, {
  [SET_FEEDBACK]: (_, { payload }) => payload,
})

export const getfeedbackSelector = (state) => state.testFeedback

export const testActivitiesReducer = createReducer([], {
  [SET_TEST_ACTIVITIES]: (_, { payload }) => payload,
})
