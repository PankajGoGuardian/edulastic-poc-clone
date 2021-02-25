import { createAction, createReducer } from 'redux-starter-kit'
import { createSelector } from 'reselect'
import { get, isEmpty, keyBy, keys, values } from 'lodash'
import { questionType } from '@edulastic/constants'
import { takeEvery, put, all, select } from 'redux-saga/effects'
import { getQuestionsByIdSelector } from '../selectors/questions'
import { getAnswersListSelector } from '../selectors/answers'
import { evaluateItem } from '../../author/src/utils/evalution'
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

// sagas
function* evaluateTestItemSaga({ payload }) {
  try {
    const { currentItem, timeSpent, callback } = payload
    const testItems = yield select((state) => state.test.items)
    const testItem = testItems[currentItem]
    const allQuestionsById = yield select(getQuestionsByIdSelector)
    const answers = yield select(getAnswersListSelector)

    const testItemId = get(testItem, '_id', '')
    const itemLevelScore = get(testItem, 'itemLevelScore', 0)
    const itemLevelScoring = get(testItem, 'itemLevelScore', false)
    const questions = get(testItem, 'rows', [])
      .flatMap((x) => x?.widgets)
      .filter((x) => !isEmpty(x) && x.widgetType === 'question')
      .reduce((acc, curr) => [...acc, curr.reference], [])
      .map((qid) => allQuestionsById[qid])
    const qById = keyBy(questions, 'id')
    const answersByQids = answersByQId(answers, testItem._id)
    const { evaluation, score, maxScore } = yield evaluateItem(
      answersByQids,
      qById,
      itemLevelScoring,
      itemLevelScore,
      testItem._id
    )
    const previewUserWork = yield select(
      ({ userWork }) => userWork.present[testItemId]
    )

    const activities = questions.map((q) => {
      const activity = {
        qid: q.id,
        maxScore,
        timeSpent,
        testItemId,
        graded: true,
        notStarted: false,
        score: answers[`${testItemId}_${q.id}`] ? score : 0,
        skipped:
          isEmpty(answers[`${testItemId}_${q.id}`]) &&
          !defaultManualGradedType.includes(q.type),
        pendingEvaluation:
          isEmpty(evaluation) || defaultManualGradedType.includes(q.type),
        qLabel: isEmpty(q.qSubLabel)
          ? q.barLabel
          : `${q.barLabel}.${q.qSubLabel}`,
        evaluation: evaluation[`${testItemId}_${q.id}`],
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
          [testItemId]: { score },
        },
      },
    })

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
