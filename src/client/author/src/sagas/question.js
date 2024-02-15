import { takeEvery, call, put, all, select } from 'redux-saga/effects'
import { questionsApi, testItemsApi } from '@edulastic/api'
import { captureSentryException, notification } from '@edulastic/common'
import { get } from 'lodash'
import * as Sentry from '@sentry/browser'
import { history } from '../../../configureStore'
import {
  RECEIVE_QUESTION_REQUEST,
  RECEIVE_QUESTION_SUCCESS,
  RECEIVE_QUESTION_ERROR,
  SAVE_QUESTION_REQUEST,
  SAVE_QUESTION_ERROR,
  LOAD_QUESTION,
  UPDATE_ITEM_DETAIL_SUCCESS,
} from '../constants/actions'
import {
  getCurrentQuestionSelector,
  getQuestionsArraySelector,
  changeCurrentQuestionAction,
} from '../../sharedDucks/questions'
import { getItemDetailSelector } from '../selectors/itemDetail'

function* receiveQuestionSaga({ payload }) {
  try {
    const entity = yield call(questionsApi.getById, payload.id)

    yield put({
      type: RECEIVE_QUESTION_SUCCESS,
      payload: { entity },
    })
  } catch (err) {
    console.error(err)
    captureSentryException(err)
    const errorMessage = 'Unable to retrieve the question.'
    notification({ type: 'error', msg: errorMessage })
    yield put({
      type: RECEIVE_QUESTION_ERROR,
      payload: { error: errorMessage },
    })
  }
}

export const getQuestionIds = (item) => {
  const { rows = [] } = item
  let questionIds = []
  rows.forEach((entry) => {
    const qIds = (entry.widgets || []).map((w) => w.reference)
    questionIds = [...questionIds, ...qIds]
  })

  return questionIds
}

function* saveQuestionSaga() {
  try {
    const question = yield select(getCurrentQuestionSelector)
    const itemDetail = yield select(getItemDetailSelector)
    let currentQuestionIds = getQuestionIds(itemDetail)
    const { rowIndex, tabIndex } = history.location.state || {}
    const { id } = question

    const entity = {
      ...question,
      firstMount: false,
    }

    if (itemDetail && itemDetail.rows) {
      const isNew =
        currentQuestionIds.filter((item) => item === id).length === 0

      // if a new question add question
      if (isNew) {
        itemDetail.rows[rowIndex].widgets.push({
          widgetType: 'question',
          type: entity.type,
          title: 'Multiple choice',
          reference: id,
          tabIndex,
        })
      }
    }

    currentQuestionIds = getQuestionIds(itemDetail)
    const allQuestions = yield select(getQuestionsArraySelector)
    const currentQuestions = allQuestions.filter((q) =>
      currentQuestionIds.includes(q.id)
    )
    const data = {
      ...itemDetail,
      data: {
        questions: currentQuestions,
      },
    }

    const item = yield call(testItemsApi.updateById, itemDetail._id, data)
    yield put({
      type: UPDATE_ITEM_DETAIL_SUCCESS,
      payload: { item },
    })

    notification({ type: 'success', messageKey: 'itemSavedSuccess' })
    if (itemDetail) {
      const currentRouteState = yield select((state) =>
        get(state, 'router.location.state', {})
      )
      const stateToFollow =
        currentRouteState.testAuthoring === false
          ? { testAuthoring: false, testId: currentRouteState.testId }
          : {}
      const { isTestFlow, previousTestId, regradeFlow } = yield select(
        (state) => state.router?.location?.state || {}
      )
      yield call(history.push, {
        pathname: `/author/items/${itemDetail._id}/item-detail`,
        state: {
          backText: 'Back to item bank',
          backUrl: '/author/items',
          itemDetail: false,
          ...stateToFollow,
        },
      })
    }
  } catch (err) {
    console.error(err)
    captureSentryException(err)
    const errorMessage = 'Unable to save the question.'
    notification({ type: 'error', messageKey: 'saveQuestionFailing' })
    yield put({
      type: SAVE_QUESTION_ERROR,
      payload: { error: errorMessage },
    })
  }
}

function* loadQuestionSaga({ payload }) {
  try {
    const { data, rowIndex } = payload
    const { pathname } = history.location.pathname

    yield put(changeCurrentQuestionAction(data.reference))
    yield call(history.push, {
      pathname: `/author/questions/edit/${data.type}`,
      state: {
        backText: 'question edit',
        backUrl: pathname,
        rowIndex,
      },
    })
  } catch (e) {
    console.error(e)
    Sentry.captureException(e)
    const errorMessage = 'Unable to load the question.'
    notification({ type: 'error', msg: errorMessage })
  }
}

export default function* watcherSaga() {
  yield all([
    takeEvery(RECEIVE_QUESTION_REQUEST, receiveQuestionSaga),
    takeEvery(SAVE_QUESTION_REQUEST, saveQuestionSaga),
    takeEvery(LOAD_QUESTION, loadQuestionSaga),
  ])
}
