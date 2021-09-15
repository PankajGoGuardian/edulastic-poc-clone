import { put, takeLatest } from 'redux-saga/effects'
import { clearEvaluationAction } from '../../../assessment/actions/evaluation'
import { CHANGE_PREVIEW } from '../constants/actions'
import { RESET_ITEM_SCORE } from '../ItemScore/ducks'

function* resetItemScore() {
  yield put({
    type: RESET_ITEM_SCORE,
  })
  yield put(clearEvaluationAction())
}

export default function* watcherSaga() {
  yield takeLatest(CHANGE_PREVIEW, resetItemScore)
}
