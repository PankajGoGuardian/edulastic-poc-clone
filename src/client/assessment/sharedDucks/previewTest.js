import { createAction, createReducer } from 'redux-starter-kit'
import { createSelector } from 'reselect'
import { get, groupBy, isEmpty, keyBy, keys, values } from 'lodash'
import { takeEvery, put, all, select, call } from 'redux-saga/effects'

import { testItemsApi } from '@edulastic/api'
import { questionType } from '@edulastic/constants'

import { getQuestionsByIdSelector } from '../selectors/questions'
import { getAnswersListSelector } from '../selectors/answers'
import {
  answersByQId,
  getItemGroupsByExcludingItemsSelector,
  getItemsSelector,
} from '../selectors/test'
import { clearHintUsageAction } from '../actions/userInteractions'
import { getCurrentLanguage } from '../../common/components/LanguageSelector/duck'
import {
  getFormattedItemGroupsToDeliver,
  getitemGroupToDeliverObject,
} from '../utils/previewTest'

const defaultManualGradedType = questionType.manuallyGradableQn

// constants
export const EVALUATE_CURRENT_ANSWERS =
  '[test preview] evaluate current test item for preview'
export const UPDATE_PREVIEW_TEST_ACTIVITIES =
  '[test preview] update question activities for preview'
export const FINISHED_PREVIEW_TEST = '[test preview] finished test preview'

// actions
export const evaluateCurrentAnswersForPreviewAction = createAction(
  EVALUATE_CURRENT_ANSWERS
)
export const finishedPreviewTestAction = createAction(FINISHED_PREVIEW_TEST)

// selectors
export const previewTestStateSelector = (state) => state.previewTest
export const previewTestActivitySelector = createSelector(
  previewTestStateSelector,
  getItemsSelector,
  (previewTest, testItems) => {
    const itemScores = values(previewTest.itemScores)
    const maxScore = testItems.reduce((acc, curr) => acc + curr.maxScore, 0)
    const score = itemScores.reduce((acc, curr) => acc + curr.score, 0)
    return { maxScore, score }
  }
)
export const previewTestQuestionActivities = createSelector(
  previewTestStateSelector,
  getQuestionsByIdSelector,
  (previewTest, questionsById) => {
    const mergedActivities = keys(questionsById)
      .map((qId) => {
        if (previewTest.questionActivities[qId]) {
          return previewTest.questionActivities[qId]
        }
        return null
      })
      .filter((x) => !!x)
    return mergedActivities
  }
)

export const itemsToDeliverInGroupSelector = createSelector(
  previewTestQuestionActivities,
  getItemGroupsByExcludingItemsSelector,
  (questionActivities, itemGroupsToDeliver) => {
    itemGroupsToDeliver = !isEmpty(itemGroupsToDeliver)
      ? itemGroupsToDeliver
      : []

    if (isEmpty(questionActivities)) {
      return getFormattedItemGroupsToDeliver(itemGroupsToDeliver)
    }

    const questionActivitiesGroupedByItemId = groupBy(
      questionActivities,
      'testItemId'
    )

    const updatedItemGroupsToDeliver = itemGroupsToDeliver.map((itemGroup) => {
      const itemGroupObject = getitemGroupToDeliverObject(itemGroup)
      const { items = [] } = itemGroupObject
      let skippedCount = 0
      let attemptedCount = 0
      ;(items || []).forEach((itemId) => {
        const questionActivitiesForItem =
          questionActivitiesGroupedByItemId?.[itemId] || []
        if (questionActivitiesForItem?.length) {
          const isSkipped = questionActivitiesForItem.every(
            (qActivity) => !!qActivity?.skipped
          )
          const isAttempted = questionActivitiesForItem.some(
            (qActivity) => !qActivity?.skipped
          )
          if (isSkipped) {
            skippedCount += 1
          }
          if (isAttempted) {
            attemptedCount += 1
          }
        }
      })
      const isSectionCompleted =
        attemptedCount + skippedCount === items.length ? 1 : 0
      const updatedItemGroup = {
        ...itemGroupObject,
        skipped: skippedCount,
        attempted: attemptedCount,
        status: isSectionCompleted,
      }
      return updatedItemGroup
    })

    return updatedItemGroupsToDeliver
  }
)

// reducer
const initialState = {
  questionActivities: {},
  itemScores: {},
}

const updateQuestionActivities = (state, { payload }) => ({
  ...state,
  itemScores: { ...state.itemScores, ...payload.itemScores },
  questionActivities: { ...state.questionActivities, ...payload.activities },
})

const finishedPreview = () => initialState

export default createReducer(initialState, {
  [UPDATE_PREVIEW_TEST_ACTIVITIES]: updateQuestionActivities,
  [FINISHED_PREVIEW_TEST]: finishedPreview,
})

function* evaluateQuestionsSaga({
  answersByQids,
  testItemId,
  testId,
  questions,
  answers,
  timeSpent = 0,
  hintsUsedInItem,
  preferredLanguage = 'en',
}) {
  const res = yield testItemsApi.evaluateAsStudent(testItemId, {
    answers: answersByQids,
    testId,
    replaceVariable: true,
    hintsUsedInItem,
    preferredLanguage,
  })

  const previewUserWork = yield select(
    ({ userWork }) => userWork.present[testItemId]
  )
  const activities = questions.map((q, i) => {
    const { score, maxScore, evaluation, graded } = res[i] || {}
    const isManuallyGradable = defaultManualGradedType.includes(q.type)
    const isSkipped = isEmpty(answers[`${testItemId}_${q.id}`])
    const activity = {
      qid: q.id,
      maxScore,
      timeSpent,
      testItemId,
      graded,
      notStarted: false,
      score: score || 0,
      skipped: isSkipped,
      pendingEvaluation:
        !isSkipped && (isEmpty(evaluation) || isManuallyGradable),
      qLabel: isEmpty(q.qSubLabel)
        ? q.barLabel
        : `${q.barLabel}.${q.qSubLabel}`,
      evaluation,
    }
    if (previewUserWork) {
      activity.userWork = previewUserWork
    }
    return activity
  })
  yield put({
    type: UPDATE_PREVIEW_TEST_ACTIVITIES,
    payload: {
      activities: keyBy(activities, (a) => `${a.testItemId}_${a.qid}`),
      itemScores: {
        [testItemId]: {
          score: res.reduce(
            (accumulator, { score = 0 }) => accumulator + score,
            0
          ),
        },
      },
    },
  })
}

function* createTestActiviesForSkippedQuestions({
  answers,
  testItems,
  allQuestionsById,
  testId,
}) {
  const previewQuestionActivities = yield select(previewTestQuestionActivities)
  for (const testItem of testItems) {
    const testItemId = get(testItem, '_id', '')
    const questions = get(testItem, 'rows', [])
      .flatMap((x) => x?.widgets)
      .filter((x) => !isEmpty(x) && x.widgetType === 'question')
      .reduce((acc, curr) => [...acc, curr.reference], [])
      .map((qid) => allQuestionsById[`${testItemId}_${qid}`])
    // const qById = keyBy(questions, 'id')
    const answersByQids = answersByQId(answers, testItemId)
    // on Submit evaluate for empty answer one time
    if (
      isEmpty(answersByQids) &&
      !questions.some(({ id }) =>
        previewQuestionActivities.some(({ qid }) => qid === id)
      )
    ) {
      yield call(evaluateQuestionsSaga, {
        answersByQids,
        testItemId,
        testId,
        questions,
        answers,
      })
    }
  }
}

// sagas
function* evaluateTestItemSaga({ payload }) {
  try {
    const { currentItem, timeSpent, callback, isLastQuestion = false } = payload
    const testItems = yield select(getItemsSelector)
    const testItem = testItems[currentItem]
    const allQuestionsById = yield select(getQuestionsByIdSelector)
    const answers = yield select(getAnswersListSelector)
    const preferredLanguage = yield select(getCurrentLanguage)

    const testItemId = get(testItem, '_id', '')
    const questions = get(testItem, 'rows', [])
      .flatMap((x) => x?.widgets)
      .filter((x) => !isEmpty(x) && x.widgetType === 'question')
      .reduce((acc, curr) => [...acc, curr.reference], [])
      .map((qid) => allQuestionsById[`${testItem._id}_${qid}`])
    // const qById = keyBy(questions, 'id')
    const answersByQids = answersByQId(answers, testItem._id)

    const test = yield select((state) => get(state, 'tests.entity', {}))
    const userInteractions = yield select(
      ({ userInteractions: _userInteractions }) => _userInteractions[testItemId]
    )
    const hintClickEvent = (obj) => obj.event === 'HintClicked'
    const hintsUsedInItem = (userInteractions || [])
      .filter(hintClickEvent)
      .reduce((acc, curr) => {
        const { hintId, id: qId } = curr
        if (hintId) {
          acc[qId] = acc[qId] || []
          acc[qId].push(hintId)
        }
        return acc
      }, {})

    yield call(evaluateQuestionsSaga, {
      answersByQids,
      testItemId,
      testId: test._id || payload.testId,
      questions,
      answers,
      timeSpent,
      hintsUsedInItem,
      preferredLanguage,
    })
    // onSubmit preview test evaluate all skipped question
    if (isLastQuestion) {
      yield call(createTestActiviesForSkippedQuestions, {
        answers,
        testItems,
        allQuestionsById,
        testId: test._id || payload.testId,
      })
      yield put(clearHintUsageAction())
    }
    if (typeof callback === 'function') {
      callback()
    }
  } catch (error) {
    console.log(error)
  }
}

export function* previewTestsSaga() {
  yield all([yield takeEvery(EVALUATE_CURRENT_ANSWERS, evaluateTestItemSaga)])
}
