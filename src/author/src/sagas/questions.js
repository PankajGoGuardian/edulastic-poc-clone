import { takeEvery, call, put, all, select } from 'redux-saga/effects';
import { questionsApi } from '@edulastic/api';

import { history } from '../../../configureStore';

import {
  CREATE_QUESTION_REQUEST,
  CREATE_QUESTION_SUCCESS,
  CREATE_QUESTION_ERROR,
} from '../constants/actions';
import { getItemDetailSelector } from '../selectors/itemDetail';
import { updateItemDetailByIdAction } from '../actions/itemDetail';

function* createQuestionSaga({ payload }) {
  try {
    const { rowIndex, tabIndex } = history.location.state;
    const question = yield call(questionsApi.create, payload);

    yield put({
      type: CREATE_QUESTION_SUCCESS,
      payload: { question },
    });

    const itemDetail = yield select(getItemDetailSelector);
    itemDetail.rows[rowIndex].widgets.push({
      widgetType: question.widgetType,
      type: question.data.type,
      title: 'Multiple choice',
      reference: question.id,
      tabIndex,
    });

    yield put(updateItemDetailByIdAction(itemDetail.id, itemDetail));

    yield call(history.push, {
      pathname: history.location.state.backUrl,
      state: {
        backText: 'Back to item list',
        backUrl: '/author/items',
        itemDetail: false,
      },
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: CREATE_QUESTION_ERROR,
      payload: { error: 'Create question is failing' },
    });
  }
}

export default function* watcherSaga() {
  yield all([yield takeEvery(CREATE_QUESTION_REQUEST, createQuestionSaga)]);
}
