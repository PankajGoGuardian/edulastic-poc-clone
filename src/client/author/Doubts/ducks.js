import { createSelector } from 'reselect'
import { createAction, createReducer } from 'redux-starter-kit'
import { call, put, all, takeEvery } from 'redux-saga/effects'
import { assignmentApi } from '@edulastic/api'

export const GET_DOUBTS_REQUEST = '[assignments] get doubts request'
export const GET_DOUBTS_SUCCESS = '[assignments] get doubts success'
export const ANSWER_QUESTION = '[assignments] post question answer'

export const getDoubtsAction = createAction(GET_DOUBTS_REQUEST)
export const getDoubtsSuccess = createAction(GET_DOUBTS_SUCCESS)
export const postAnswerAction = createAction(ANSWER_QUESTION)

export const getDoubtsSelector = createSelector()

const initialState = {
  doubts: [],
  loading: false,
}

const stateCourseSelector = (state) => state.doubtsReducer
export const getDoubtsList = createSelector(
  stateCourseSelector,
  (state) => state.doubts
)

export const getLoading = createSelector(
  stateCourseSelector,
  (state) => state.loading
)

export const reducer = createReducer(initialState, {
  [GET_DOUBTS_REQUEST]: (state) => {
    state.loading = true
  },
  [GET_DOUBTS_SUCCESS]: (state, { payload }) => {
    state.loading = false
    state.doubts = payload
  },
})

function* getDoubts({ payload }) {
  console.log(payload)
  try {
    const response = yield call(assignmentApi.getAssignmentDoubtsApi, payload)
    yield put(getDoubtsSuccess(response))
  } catch (err) {
    console.error(err)
  }
}

function* answerQuestion({ payload }) {
  try {
    const { assignmentId, questionId, ...restPayload } = payload
    yield call(assignmentApi.answerQuestionApi, {
      assignmentId,
      questionId,
      payload: restPayload,
    })
  } catch (err) {
    console.error(err)
  }
}

export function* watcherSaga() {
  yield takeEvery(GET_DOUBTS_REQUEST, getDoubts)
  yield takeEvery(ANSWER_QUESTION, answerQuestion)
}
