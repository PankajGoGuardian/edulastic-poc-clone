import { createAction, createReducer } from 'redux-starter-kit'
import { createSelector } from 'reselect'
import { get, isEmpty, keyBy, keys, values } from 'lodash'
import { takeEvery, put, all, select, call } from 'redux-saga/effects'

import { testItemsApi } from '@edulastic/api'
import { questionType } from '@edulastic/constants'

import { getQuestionsByIdSelector } from '../selectors/questions'
import { getAnswersListSelector } from '../selectors/answers'
import { answersByQId } from '../selectors/test'

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
  (state) => state.test.items,
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
}) {
  const res = yield testItemsApi.evaluateAsStudent(testItemId, {
    answers: answersByQids,
    testId,
  })

  const previewUserWork = yield select(
    ({ userWork }) => userWork.present[testItemId]
  )
  const activities = questions.map((q, i) => {
    const { score, maxScore, evaluation } = res[i] || {}
    const isManuallyGradable = defaultManualGradedType.includes(q.type)
    const isSkipped =
      isEmpty(answers[`${testItemId}_${q.id}`]) && !isManuallyGradable
    const activity = {
      qid: q.id,
      maxScore,
      timeSpent,
      testItemId,
      graded: true,
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
      activities: keyBy(activities, 'qid'),
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
      .map((qid) => allQuestionsById[qid])
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
    const testItems = yield select((state) => state.test.items)
    const testItem = testItems[currentItem]
    const allQuestionsById = yield select(getQuestionsByIdSelector)
    const answers = yield select(getAnswersListSelector)

    const testItemId = get(testItem, '_id', '')
    const questions = get(testItem, 'rows', [])
      .flatMap((x) => x?.widgets)
      .filter((x) => !isEmpty(x) && x.widgetType === 'question')
      .reduce((acc, curr) => [...acc, curr.reference], [])
      .map((qid) => allQuestionsById[qid])
    // const qById = keyBy(questions, 'id')
    const answersByQids = answersByQId(answers, testItem._id)

    const test = yield select((state) => get(state, 'tests.entity', {}))

    yield call(evaluateQuestionsSaga, {
      answersByQids,
      testItemId,
      testId: test._id || payload.testId,
      questions,
      answers,
      timeSpent,
    })
    // onSubmit preview test evaluate all skipped question
    if (isLastQuestion) {
      yield call(createTestActiviesForSkippedQuestions, {
        answers,
        testItems,
        allQuestionsById,
        testId: test._id || payload.testId,
      })
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
