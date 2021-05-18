import { takeEvery, call, put, all, select } from 'redux-saga/effects'
import { get as _get, round, isEmpty } from 'lodash'
import { testItemsApi } from '@edulastic/api'
import { LOCATION_CHANGE, push } from 'connected-react-router'
import { questionType } from '@edulastic/constants'
import {
  captureSentryException,
  Effects,
  notification,
} from '@edulastic/common'
import * as Sentry from '@sentry/browser'
import { evaluateItem } from '../utils/evalution'
import { hasEmptyAnswers } from '../../utils/answerValidator'

import {
  CREATE_TEST_ITEM_REQUEST,
  CREATE_TEST_ITEM_ERROR,
  RECEIVE_ITEM_DETAIL_SUCCESS,
  UPDATE_TEST_ITEM_REQUEST,
  UPDATE_TEST_ITEM_SUCCESS,
  UPDATE_TEST_ITEM_ERROR,
  SHOW_ANSWER,
  CHECK_ANSWER,
  CLEAR_ITEM_EVALUATION,
  ADD_ITEM_EVALUATION,
  CHANGE_VIEW,
} from '../constants/actions'

import { SET_ITEM_SCORE } from '../ItemScore/ducks'

import { removeUserAnswerAction } from '../../../assessment/actions/answers'
import { resetDictAlignmentsAction } from '../actions/dictionaries'
import {
  PREVIEW,
  CLEAR,
} from '../../../assessment/constants/constantsForQuestions'

import {
  getQuestionsSelector,
  CHANGE_CURRENT_QUESTION,
} from '../../sharedDucks/questions'
import { getQuestionDataSelector } from '../../QuestionEditor/ducks'
import { answersByQId } from '../../../assessment/selectors/test'

function* createTestItemSaga({
  payload: { data, testFlow, testId, newPassageItem = false, testName },
}) {
  try {
    // create a empty item and put it in store.
    let item = {
      _id: 'new',
      rows: [
        {
          tabs: [],
          dimension: '100%',
          widgets: [],
          flowLayout: false,
          content: '',
        },
      ],
      columns: [],
      tags: [],
      status: 'draft',
      createdBy: {},
      maxScore: 0,
      active: 1,
      grades: [],
      subjects: [],
      standards: [],
      curriculums: [],
      data: {
        questions: [],
        resources: [],
      },
      itemLevelScoring: true,
      analytics: [
        {
          usage: 0,
          likes: 0,
        },
      ],
      multipartItem: false,
      isPassageWithQuestions: false,
      canAddMultipleItems: false,
    }

    yield put(resetDictAlignmentsAction())

    // if its a being added from passage, create new
    if (newPassageItem) {
      const hasValidTestId = testId && testId !== 'undefined'
      const params = { ...(hasValidTestId && { testId }) }
      item = yield call(testItemsApi.create, data, params)
    }

    yield put({
      type: RECEIVE_ITEM_DETAIL_SUCCESS,
      payload: item,
    })

    if (!testFlow) {
      yield put(push(`/author/items/${item._id}/item-detail`))
    } else {
      yield put(
        push({
          pathname: `/author/tests/${testId}/createItem/${item._id}`,
          state: { fadeSidebar: true, testName },
        })
      )
    }
  } catch (err) {
    console.error(err)
    captureSentryException(err)
    const errorMessage = 'create item failed'
    notification({ msg: errorMessage })
    yield put({
      type: CREATE_TEST_ITEM_ERROR,
      payload: { error: errorMessage },
    })
  }
}

function* updateTestItemSaga({ payload }) {
  try {
    const item = yield call(testItemsApi.update, payload)
    yield put({
      type: UPDATE_TEST_ITEM_SUCCESS,
      payload: { item },
    })
  } catch (err) {
    console.error(err)
    captureSentryException(err)
    const errorMessage = 'Update item is failed'
    notification({ msg: errorMessage })
    yield put({
      type: UPDATE_TEST_ITEM_ERROR,
      payload: { error: errorMessage },
    })
  }
}

function* evaluateAnswers({ payload }) {
  try {
    const question = yield select(getQuestionDataSelector)
    const item = yield select((state) => state.itemDetail?.item)
    if (question) {
      const hasEmptyAnswer = hasEmptyAnswers(question)

      if (hasEmptyAnswer)
        return notification({ msg: 'Correct answer is not set' })

      // clear previous evaluation
      yield put({
        type: CLEAR_ITEM_EVALUATION,
        payload: question?.type === questionType.MATH,
      })
    }
    if (
      (payload === 'question' || (payload?.mode === 'show' && question)) &&
      !item.isDocBased
    ) {
      const answers = yield select((state) => _get(state, 'answers', []))
      const answersByQids = answersByQId(answers, item._id)
      if (isEmpty(answersByQids)) {
        if (payload?.mode !== 'show') {
          notification({
            type: 'warn',
            messageKey: 'attemptTheQuestonToCheckAnswer',
          })
        }
        return
      }
      const { evaluation, score, maxScore } = yield evaluateItem(
        answersByQids,
        {
          [question?.id]: question,
        },
        undefined,
        undefined,
        item._id,
        item.itemGradingType,
        item.assignPartialCredit
      )

      yield put({
        type: ADD_ITEM_EVALUATION,
        payload: {
          ...evaluation,
        },
      })

      if (payload?.mode !== 'show') {
        // do not re calculate the score in case show answer is clicked
        yield put({
          type: SET_ITEM_SCORE,
          payload: {
            score: round(score, 2),
            maxScore,
            showScore: true,
          },
        })
      }
    } else {
      const answers = yield select((state) => _get(state, 'answers', {}))
      const _item = yield select((state) => state.itemDetail.item)
      const { itemLevelScore = 0, itemLevelScoring = false } = _item || {}
      const questions = yield select(getQuestionsSelector)
      const answersByQids = answersByQId(answers, _item._id)
      if (isEmpty(answersByQids)) {
        if (payload?.mode !== 'show') {
          notification({
            type: 'warn',
            messageKey: 'attemptTheQuestonToCheckAnswer',
          })
        }
        return
      }
      const { evaluation, score, maxScore } = yield evaluateItem(
        answersByQids,
        questions,
        itemLevelScoring,
        itemLevelScore,
        _item._id,
        _item.itemGradingType,
        _item.assignPartialCredit
      )
      yield put({
        type: ADD_ITEM_EVALUATION,
        payload: {
          ...evaluation,
        },
      })
      if (payload?.mode !== 'show') {
        yield put({
          type: SET_ITEM_SCORE,
          payload: {
            score: round(score, 2),
            maxScore,
            showScore: true,
          },
        })
      }
    }
  } catch (err) {
    console.error(err)
    captureSentryException(err)
    const errorMessage =
      err.message ||
      'Expression syntax is incorrect. Please refer to the help docs on what is allowed'
    notification({ msg: errorMessage })
  }
}

function* showAnswers() {
  try {
    yield put({ type: CHECK_ANSWER, payload: { mode: 'show' } }) // validate the results first then show it
    // with check answer itself,it will save evaluation , we dont need this again.
  } catch (err) {
    console.error(err)
    captureSentryException(err)
    const errorMessage = 'Show Answer Failed'
    notification({ msg: errorMessage })
  }
}

function* setAnswerSaga({ payload }) {
  try {
    const { preview, view } = yield select((state) => _get(state, 'view', {}))

    if ((preview === CLEAR && view === PREVIEW) || payload.view === 'edit') {
      yield put(removeUserAnswerAction())
    }
  } catch (e) {
    console.log('error:', e)
    Sentry.captureException(e)
  }
}

function* testItemLocationChangeSaga({ payload }) {
  // when user lands at item-detail route (item level)
  // Clear current on authorQuestions, so we have a clean item/question state every time
  // we rely on this in evaluateAnswers
  const currentItemId = yield select((state) =>
    _get(state, 'itemDetail.item._id')
  )
  if (
    payload.location.pathname.indexOf('item-detail') !== -1 &&
    (payload.location.pathname.split('/')[3] !== currentItemId ||
      !currentItemId)
  ) {
    yield put({
      type: CHANGE_CURRENT_QUESTION,
      payload: '',
    })
  }
}

export default function* watcherSaga() {
  yield all([
    yield takeEvery(CREATE_TEST_ITEM_REQUEST, createTestItemSaga),
    yield Effects.throttleAction(
      process.env.REACT_APP_QA_ENV ? 60000 : 10000,
      UPDATE_TEST_ITEM_REQUEST,
      updateTestItemSaga
    ),
    yield takeEvery(CHECK_ANSWER, evaluateAnswers),
    yield takeEvery(CHANGE_VIEW, setAnswerSaga),
    yield takeEvery(SHOW_ANSWER, showAnswers),
    yield takeEvery(LOCATION_CHANGE, testItemLocationChangeSaga),
  ])
}
