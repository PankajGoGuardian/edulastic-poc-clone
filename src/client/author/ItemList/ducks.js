import { takeEvery, takeLatest, call, put, select } from "redux-saga/effects";
import { xor } from "lodash";
import { message } from "antd";

import { setTestItemsAction } from "../TestPage/components/AddItems/ducks";
import { setTestDataAction, createTestAction, getTestEntitySelector } from "../TestPage/ducks";

export const ADD_ITEM_TO_CART = "[item list] add item to cart";
export const CREATE_TEST_FROM_CART = "[item list] create test from cart";

export const addItemToCartAction = itemId => ({
  type: ADD_ITEM_TO_CART,
  payload: {
    itemId
  }
});

export const createTestFromCartAction = testName => ({
  type: CREATE_TEST_FROM_CART,
  payload: {
    testName
  }
});

export function* addItemToCartSaga({ payload }) {
  const { itemId } = payload;
  const test = yield select(getTestEntitySelector);
  const testItems = [...test.testItems];

  const updatedTestItems = xor(testItems, [itemId]);

  const updatedTest = {
    ...test,
    testItems: updatedTestItems
  };

  yield put(setTestItemsAction(updatedTestItems));
  yield put(setTestDataAction(updatedTest));
}

export function* createTestFromCart({ payload: { testName = "Author Test" } }) {
  const test = yield select(getTestEntitySelector);

  const updatedTest = {
    ...test,
    title: testName
  };

  yield call(message.info, "Creating a test with selected items");
  yield put(createTestAction(updatedTest, true));
}

export function* watcherSaga() {
  yield takeEvery(ADD_ITEM_TO_CART, addItemToCartSaga);
  yield takeLatest(CREATE_TEST_FROM_CART, createTestFromCart);
}
