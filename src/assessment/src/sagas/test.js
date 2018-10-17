import { testItemsApi } from '@edulastic/api';
import { takeEvery, call, all, put } from 'redux-saga/effects';

import { LOAD_TEST, LOAD_TEST_ITEMS } from '../constants/actions';

function* loadTest() {
  try {
    let items = yield call(testItemsApi.getAll);
    items = items.map(item => {
      item.rows = item.rows.map(row => ({
        ...row,
        widgets: row.widgets.map(widget => {
          let referencePopulate = {
            data: null
          };

          if (item.data.questions && item.data.questions.length) {
            referencePopulate = item.data.questions.find(
              q => q.id === widget.reference
            );
          }

          if (
            !referencePopulate &&
            item.data.resources &&
            item.data.resources.length
          ) {
            referencePopulate = item.data.resources.find(
              r => r.id === widget.reference
            );
          }

          return {
            ...widget,
            referencePopulate
          };
        })
      }));

      return item;
    });

    yield put({
      type: LOAD_TEST_ITEMS,
      payload: {
        items
      }
    });
  } catch (err) {
    console.error(err);
  }
}

export default function* watcherSaga() {
  yield all([yield takeEvery(LOAD_TEST, loadTest)]);
}
