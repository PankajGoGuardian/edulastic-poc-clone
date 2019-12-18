import { takeEvery, takeLatest, call, put, select, take, race } from "redux-saga/effects";
import { message } from "antd";
import { uniq } from "lodash";
import produce from "immer";
import { test as testConstant, roleuser } from "@edulastic/constants";
import { setTestItemsAction, showAddPassageItemsModalAction } from "../TestPage/components/AddItems/ducks";
import {
  setTestDataAction,
  createTestAction,
  getTestEntitySelector,
  getReleaseScorePremiumSelector,
  setPassageItemsAction
} from "../TestPage/ducks";
import { getUserRole } from "../src/selectors/user";
import { createAction } from "redux-starter-kit";
import { testItemsApi } from "@edulastic/api";
import {
  APPROVE_OR_REJECT_SINGLE_ITEM_REQUEST,
  APPROVE_OR_REJECT_SINGLE_ITEM_SUCCESS,
  APPROVE_OR_REJECT_MULTIPLE_ITEM_REQUEST,
  APPROVE_OR_REJECT_MULTIPLE_ITEM_SUCCESS
} from "../src/constants/actions";

export const ADD_ITEM_TO_CART = "[item list] add item to cart";
export const CREATE_TEST_FROM_CART = "[item list] create test from cart";

export const addItemToCartAction = item => ({
  type: ADD_ITEM_TO_CART,
  payload: {
    item
  }
});

export const createTestFromCartAction = testName => ({
  type: CREATE_TEST_FROM_CART,
  payload: {
    testName
  }
});

export const approveOrRejectSingleItem = createAction(APPROVE_OR_REJECT_SINGLE_ITEM_REQUEST);
export const approveOrRejectMultipleItem = createAction(APPROVE_OR_REJECT_MULTIPLE_ITEM_REQUEST);

export function* addItemToCartSaga({ payload }) {
  const { item } = payload;
  const test = yield select(getTestEntitySelector);
  const testItems = [...test.testItems];
  let updatedTestItems = [];
  if (testItems.some(o => o._id === item._id)) {
    updatedTestItems = produce(testItems, draft => {
      draft = draft.filter(x => x._id !== item._id);
      message.success("Item removed from cart");
      return draft;
    });
  } else {
    updatedTestItems = produce(testItems, draft => {
      draft = draft.push(item);
      message.success("Item added to cart");
    });
  }
  const userRole = yield select(getUserRole);
  const isReleaseScorePremium = yield select(getReleaseScorePremiumSelector);
  const releaseScore =
    userRole === roleuser.TEACHER && isReleaseScorePremium
      ? testConstant.releaseGradeLabels.WITH_RESPONSE
      : testConstant.releaseGradeLabels.DONT_RELEASE;

  const updatedTest = {
    ...test,
    releaseScore,
    testItems: updatedTestItems
  };

  yield put(setTestItemsAction(updatedTestItems.map(o => o._id)));
  yield put(setTestDataAction(updatedTest));
}

export function* createTestFromCart({ payload: { testName } }) {
  const test = yield select(getTestEntitySelector);
  const questionGrades = test.testItems
    .flatMap(item => (item.data && item.data.questions) || [])
    .flatMap(question => question.grades || []);
  const questionSubjects = test.testItems
    .flatMap(item => (item.data && item.data.questions) || [])
    .flatMap(question => question.subjects || []);
  const grades = test.testItems.flatMap(item => item.grades);
  const subjects = test.testItems.flatMap(item => item.subjects);
  const updatedTest = {
    ...test,
    title: testName,
    grades: uniq([...grades, ...questionGrades]),
    subjects: uniq([...subjects, ...questionSubjects])
  };
  yield call(message.info, "Creating a test with selected items");
  yield put(createTestAction(updatedTest, false, true));
}

export function* approveOrRejectSingleItemSaga({ payload }) {
  try {
    const result = yield call(testItemsApi.publishTestItem, payload);
    yield put({ type: APPROVE_OR_REJECT_SINGLE_ITEM_SUCCESS, payload: payload });
    yield call(message.success, `Item successfully ${payload.status}.`);
  } catch (e) {
    console.error(e);
    yield call(message.success, `Failed to update Status`);
  }
}

export function* approveOrRejectMultipleItemSaga({ payload }) {
  const test = yield select(getTestEntitySelector);
  const { testItems } = test;
  if (testItems.length) {
    try {
      const data = {
        status: payload.status,
        itemIds: testItems.filter(i => {
          if (payload.status === "rejected") {
            if (i.status === "inreview") {
              return true;
            }
          } else if (payload.status === "published") {
            if (i.status === "inreview" || i.status === "rejected") {
              return true;
            }
          }
          return false;
        })
      };
      data.itemIds = data.itemIds.map(i => i._id);

      const result = yield call(testItemsApi.bulkPublishTestItems, data);
      if (result.nModified === data.itemIds.length) {
        yield put({ type: APPROVE_OR_REJECT_MULTIPLE_ITEM_SUCCESS, payload: data });
        yield call(message.success, `${data.itemIds.length} item(s) successfully ${payload.status}.`);
      } else {
        yield call(
          message.success,
          `${result.nModified} item(s) successfully ${payload.status}, ${data.itemIds.length -
            result.nModified} item(s) failed`
        );
      }
    } catch (e) {
      console.error(e);
      yield call(message.success, `Failed to update Status`);
    }
  }
}

export function* watcherSaga() {
  yield takeEvery(ADD_ITEM_TO_CART, addItemToCartSaga);
  yield takeLatest(CREATE_TEST_FROM_CART, createTestFromCart);
  yield takeLatest(APPROVE_OR_REJECT_SINGLE_ITEM_REQUEST, approveOrRejectSingleItemSaga);
  yield takeLatest(APPROVE_OR_REJECT_MULTIPLE_ITEM_REQUEST, approveOrRejectMultipleItemSaga);
}
