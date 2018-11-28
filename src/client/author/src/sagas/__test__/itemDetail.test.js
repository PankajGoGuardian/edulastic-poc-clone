import fetchMock from 'fetch-mock';
import { call, put } from 'redux-saga/effects';
import { testItemsApi } from '@edulastic/api';

import * as actions from '../../actions/itemDetail';
import * as types from '../../constants/actions';

import configureStore from '../../../../configureStore';
import sagaHelper from './main';

const store = configureStore();

describe('Receive Item Action', () => {
  afterEach(() => {
    fetchMock.restore();
  });

  it('creates RECEIVE_ITEM_DETAIL_SUCCESS when fetching item has been done', () => {
    fetchMock.getOnce('/api/testitem/1', {
      body: { },
      headers: { 'content-type': 'application/json' }
    });

    const expectedActions = {
      type: types.RECEIVE_ITEM_DETAIL_REQUEST,
      payload: { id: 1, params: {} }
    };

    expect(store.dispatch(actions.getItemDetailByIdAction(1, {}))).toEqual(expectedActions);
  });
});

function* testItemSaga() {
  const item = yield call(testItemsApi.getById, 1, {});
  yield put(actions.getItemDetailByIdAction(item.id, {}));
}

describe('When testing a Saga that manipulates data', () => {
  const it = sagaHelper(testItemSaga());

  it('should have called the mock API first, which returns some data', (result) => {
    expect(result).toEqual(call(testItemsApi.getById, 1, {}));
    return { id: 1, title: 'foo' };
  });

  it('and then trigger an action with the transformed data we got from the API', (result) => {
    expect(result).toEqual(put(actions.getItemDetailByIdAction(1, {})));
  });

  it('and then nothing', (result) => {
    expect(result).toBeUndefined();
  });
});
