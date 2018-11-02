import { takeEvery, all, put } from 'redux-saga/effects';
import { CHANGE_PREVIEW, SET_ANSWER } from '../constants/actions';

function* resetView() {
  yield put({
    type: CHANGE_PREVIEW,
    payload: {
      view: 'clear',
    },
  });
}

export default function* watcherSaga() {
  yield all([yield takeEvery(SET_ANSWER, resetView)]);
}
