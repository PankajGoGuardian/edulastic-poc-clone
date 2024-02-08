import { takeEvery, call, put, all } from 'redux-saga/effects'
import { testItemsApi } from '@edulastic/api'
import { captureSentryException, notification } from '@edulastic/common'
import { keyBy as _keyBy, get } from 'lodash'

import {
  RECEIVE_ITEM_DETAIL_REQUEST,
  RECEIVE_ITEM_DETAIL_SUCCESS,
  RECEIVE_ITEM_DETAIL_ERROR,
  UPDATE_ITEM_DETAIL_REQUEST,
  UPDATE_ITEM_DETAIL_SUCCESS,
  UPDATE_ITEM_DETAIL_ERROR,
} from '../constants/actions'
import { loadQuestionsAction } from '../../sharedDucks/questions'

function* receiveItemSaga({ payload }) {
  try {
    const data = yield call(testItemsApi.getById, payload.id, payload.params)
    let questions =
      [
        ...get(data, 'data.questions', []),
        ...get(data, 'data.resources', []),
      ] || []
    questions = _keyBy(questions, 'id')
    yield put({
      type: RECEIVE_ITEM_DETAIL_SUCCESS,
      payload: data,
    })
    yield put(loadQuestionsAction(questions))
  } catch (err) {
    console.log('err is', err)
    captureSentryException(err)
    const errorMessage = 'Unable to retrieve the item.'
    notification({ type: 'error', msg: errorMessage })
    yield put({
      type: RECEIVE_ITEM_DETAIL_ERROR,
      payload: { error: errorMessage },
    })
  }
}

export function* updateItemSaga({ payload }) {
  try {
    if (!payload.keepData) {
      // avoid data part being put into db
      delete payload.data.data
    }

    const item = yield call(testItemsApi.updateById, payload.id, payload.data)

    yield put({
      type: UPDATE_ITEM_DETAIL_SUCCESS,
      payload: { item },
    })
    notification({ type: 'success', messageKey: 'itemSavedSuccess' })
  } catch (err) {
    console.error(err)
    captureSentryException(err)
    const errorMessage = 'Unable to save the item.'
    notification({ type: 'error', msg: errorMessage })
    yield put({
      type: UPDATE_ITEM_DETAIL_ERROR,
      payload: { error: errorMessage },
    })
  }
}

export default function* watcherSaga() {
  yield all([
    takeEvery(RECEIVE_ITEM_DETAIL_REQUEST, receiveItemSaga),
    takeEvery(UPDATE_ITEM_DETAIL_REQUEST, updateItemSaga),
  ])
}
