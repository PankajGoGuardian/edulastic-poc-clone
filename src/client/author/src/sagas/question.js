import { takeEvery, call, put, all, select } from 'redux-saga/effects';
import { questionsApi } from '@edulastic/api';
import { message } from 'antd';

import { history } from '../../../configureStore';
import {
  RECEIVE_QUESTION_REQUEST,
  RECEIVE_QUESTION_SUCCESS,
  RECEIVE_QUESTION_ERROR,
  SAVE_QUESTION_REQUEST,
  SAVE_QUESTION_SUCCESS,
  SAVE_QUESTION_ERROR
} from '../constants/actions';
import { getQuestionSelector } from '../selectors/question';

import { getItemDetailSelector } from '../selectors/itemDetail';
import { updateItemSaga } from './itemDetail';

function* receiveQuestionSaga({ payload }) {
  try {
    const entity = yield call(questionsApi.getById, payload.id);

    yield put({
      type: RECEIVE_QUESTION_SUCCESS,
      payload: { entity }
    });
  } catch (err) {
    console.error(err);
    const errorMessage = 'Receive question is failing';
    yield call(message.error, errorMessage);
    yield put({
      type: RECEIVE_QUESTION_ERROR,
      payload: { error: errorMessage }
    });
  }
}

function* saveQuestionSaga() {
  try {
    const question = yield select(getQuestionSelector);
    const itemDetail = yield select(getItemDetailSelector);
    const { rowIndex, tabIndex } = history.location.state;
    let entity = null;

    if (question._id) {
      entity = yield call(questionsApi.updateById, question._id, question);
    } else {
      entity = yield call(questionsApi.create, question);

      console.log('itemDetail', itemDetail);

      if (itemDetail) {
        itemDetail.rows[rowIndex].widgets.push({
          widgetType: 'question',
          type: entity.data.type,
          title: 'Multiple choice',
          reference: entity._id,
          tabIndex
        });

        yield call(updateItemSaga, {
          payload: {
            id: itemDetail._id,
            data: itemDetail
          }
        });
      }
    }

    yield put({
      type: SAVE_QUESTION_SUCCESS,
      payload: { entity }
    });

    yield call(message.success, 'Update item by id is success', 'Success');

    if (itemDetail) {
      console.log('itemDetail._id', itemDetail);
      yield call(history.push, {
        pathname: `/author/items/${itemDetail._id}/item-detail`,
        state: {
          backText: 'Back to item list',
          backUrl: '/author/items',
          itemDetail: false
        }
      });
    }
  } catch (err) {
    console.error(err);
    const errorMessage = 'Save question is failing';
    yield call(message.error, errorMessage);
    yield put({
      type: SAVE_QUESTION_ERROR,
      payload: { error: errorMessage }
    });
  }
}

export default function* watcherSaga() {
  yield all([
    yield takeEvery(RECEIVE_QUESTION_REQUEST, receiveQuestionSaga),
    yield takeEvery(SAVE_QUESTION_REQUEST, saveQuestionSaga)
  ]);
}
