import { takeEvery, all, put, select } from 'redux-saga/effects'
import {
  CHANGE_PREVIEW,
  CLEAR_ANSWERS,
  REMOVE_ANSWERS,
  SET_ANSWER,
} from '../constants/actions'

function* resetView() {
  const currentView = yield select((state) => state.view?.preview)

  if (currentView !== 'clear')
    yield put({
      type: CHANGE_PREVIEW,
      payload: {
        view: 'clear',
      },
    })
}

function* clearAnswers() {
  yield put({
    type: REMOVE_ANSWERS,
  })

  yield put({
    type: CHANGE_PREVIEW,
    payload: {
      view: 'clear',
    },
  })
}

export default function* watcherSaga() {
  yield all([
    yield takeEvery(CLEAR_ANSWERS, clearAnswers),
    yield takeEvery(SET_ANSWER, resetView),
  ])
}
