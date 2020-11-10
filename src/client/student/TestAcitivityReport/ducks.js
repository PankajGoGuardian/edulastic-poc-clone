import { createAction, createReducer } from 'redux-starter-kit'
import { takeEvery, put, call, all, fork } from 'redux-saga/effects'
import { keyBy as _keyBy, isEmpty, orderBy, keyBy } from 'lodash'
import produce from 'immer'

import {
  reportsApi,
  testsApi,
  attchmentApi as attachmentApi,
} from '@edulastic/api'
import questionType from '@edulastic/constants/const/questionType'

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
    if (qid) {
      filterQuery.referrerId3 = qid
    }
    const { attachments = [] } = yield call(
      attachmentApi.loadAllAttachments,
      filterQuery
    )
    if (attachments.length > 0) {
      const scratchpadData = {}
      for (const attachment of attachments) {
        const { data = {}, referrerId3 } = attachment
        if (referrerId3 && referrerId3 === qid) {
          scratchpadData[uqaId] = { [referrerId3]: data.scratchpad }
        } else {
          scratchpadData[uqaId] = data.scratchpad
        }
      }
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
      passageData[referrerId2] = data
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
    const { assignmentId } = reports.testActivity
    const activities = yield call(
      reportsApi.fetchReports,
      groupId,
      testId,
      assignmentId
    )
    let testItems = test.itemGroups.flatMap(
      (itemGroup) => itemGroup.items || []
    )
    testItems = markQuestionLabel(testItems)
    const questions = getQuestions(test.itemGroups)
    const questionsWithActivities = questions.map((question) => {
      if (!question.activity) {
        const activity = reports.questionActivities.find(
          (qActivity) => qActivity.qid === question.id
        )
        return {
          ...question,
          activity,
        }
      }
      return question
    })
    const { questionActivities = [] } = reports
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
    const qActsKeysByQid = keyBy(questionActivities, 'qid')
    const _testItems = testItems
      .filter(({ data = {} }) => data.questions?.length)
      .map((item) =>
        produce(item, (draft) => {
          draft.data.questions.forEach((question) => {
            if (qActsKeysByQid[question.id]) {
              question.activity = qActsKeysByQid[question.id]
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
        [item.qid]: item.userResponse,
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

    yield put({
      type: ADD_ITEM_EVALUATION,
      payload: {
        ...questionActivities.reduce((result, item) => {
          result[item.qid] = item.evaluation
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
    console.log(e)
  }
}

// set actions watcherss
export function* watcherSaga() {
  yield all([
    yield takeEvery(LOAD_TEST_ACTIVITY_REPORT, loadTestActivityReport),
  ])
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
