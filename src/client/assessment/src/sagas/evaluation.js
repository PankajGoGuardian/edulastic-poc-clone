import { takeEvery, put, all, select } from 'redux-saga/effects';

import { testItemsApi } from '@edulastic/api';
// actions
import {
  CHECK_ANSWER,
  ADD_ITEM_EVALUATION,
  CHANGE_PREVIEW
} from '../constants/actions';

function* evaluateAnswers() {
  const answers = yield select(state => state.answers);
  const { items, currentItem } = yield select(state => state.test);
  const { id } = items[currentItem];
  const result = yield testItemsApi.evaluate(id, { answers });
  yield put({
    type: ADD_ITEM_EVALUATION,
    payload: {
      ...result.result
    }
  });
  yield put({
    type: CHANGE_PREVIEW,
    payload: {
      view: 'check'
    }
  });
}

export default function* watcherSaga() {
  yield all([yield takeEvery(CHECK_ANSWER, evaluateAnswers)]);
}
