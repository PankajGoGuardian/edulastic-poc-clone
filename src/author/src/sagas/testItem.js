import { takeEvery, call, put, all, select } from 'redux-saga/effects';
import { NotificationManager } from 'react-notifications';
import { testItemsApi } from '@edulastic/api';
import { evaluateItem } from '../utils/evalution';
import createShowAnswerData from '../utils/showAnswer';

import {
  CREATE_TEST_ITEM_REQUEST,
  CREATE_TEST_ITEM_ERROR,
  CREATE_TEST_ITEM_SUCCESS,
  UPDATE_TEST_ITEM_REQUEST,
  UPDATE_TEST_ITEM_SUCCESS,
  UPDATE_TEST_ITEM_ERROR,
  SHOW_ANSWER,
  CHECK_ANSWER,
  ADD_ITEM_EVALUATION,
} from '../constants/actions';
import { history } from '../../../configureStore';
import { getItemDetailValidationSelector } from '../selectors/itemDetail';

function* createTestItemSaga({ payload }) {
  try {
    const item = yield call(testItemsApi.create, payload);
    yield put({
      type: CREATE_TEST_ITEM_SUCCESS,
      payload: { item: item.data },
    });
    yield call(history.push, `/author/items/${item.id}/item-detail`);
  } catch (err) {
    console.error(err);
    const errorMessage = 'Create item is failed';
    NotificationManager.error(errorMessage, 'Error');
    yield put({
      type: CREATE_TEST_ITEM_ERROR,
      payload: { error: errorMessage },
    });
  }
}

function* updateTestItemSaga({ payload }) {
  try {
    const item = yield call(testItemsApi.update, payload);
    yield put({
      type: UPDATE_TEST_ITEM_SUCCESS,
      payload: { item },
    });
  } catch (err) {
    console.error(err);
    const errorMessage = 'Update item is failed';
    NotificationManager.error(errorMessage, 'Error');
    yield put({
      type: UPDATE_TEST_ITEM_ERROR,
      payload: { error: errorMessage },
    });
  }
}

function* evaluateAnswers() {
  try {
    const validations = yield select(getItemDetailValidationSelector);
    const answers = yield select(state => state.answers);
    const evaluation = evaluateItem(answers, validations);
    yield put({
      type: ADD_ITEM_EVALUATION,
      payload: {
        ...evaluation,
      },
    });
  } catch (err) {
    console.log(err);
    const errorMessage = 'Answer Evaluation Failed';
    NotificationManager.error(errorMessage, 'Error');
  }
}

function* showAnswers() {
  try {
    const validations = yield select(getItemDetailValidationSelector);
    const answers = yield select(state => state.answers);
    const evaluation = createShowAnswerData(validations, answers);
    yield put({
      type: ADD_ITEM_EVALUATION,
      payload: {
        ...evaluation,
      },
    });
  } catch (err) {
    console.log(err);
    const errorMessage = 'Show Answer Failed';
    NotificationManager.error(errorMessage, 'Error');
  }
}

export default function* watcherSaga() {
  yield all([
    yield takeEvery(CREATE_TEST_ITEM_REQUEST, createTestItemSaga),
    yield takeEvery(UPDATE_TEST_ITEM_REQUEST, updateTestItemSaga),
    yield takeEvery(CHECK_ANSWER, evaluateAnswers),
    yield takeEvery(SHOW_ANSWER, showAnswers),
  ]);
}
