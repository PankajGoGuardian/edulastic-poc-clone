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

export const ADD_ITEM_TO_CART = "[item list] add item to cart";
export const CREATE_TEST_FROM_CART = "[item list] create test from cart";
export const ADD_PASSAGE_ITEMS_TO_TEST = "[item list] add passage items to test?";
export const CLOSE_PASSAGE_ITEMS_MODAL = "[item list] close passage items modal";
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

export const addPassageItemsToTestAction = createAction(ADD_PASSAGE_ITEMS_TO_TEST);
export const closeAddPassageItemsModalAction = createAction(CLOSE_PASSAGE_ITEMS_MODAL);
export function* addItemToCartSaga({ payload }) {
  const { item } = payload;
  const test = yield select(getTestEntitySelector);
  const testItems = [...test.testItems];
  let updatedTestItems = [];
  if (testItems.some(o => o._id === item._id)) {
    updatedTestItems = produce(testItems, draft => {
      draft = draft.filter(x => x._id !== item._id);
      return draft;
    });
  } else {
    if (item.passageId) {
      const passageItems = yield call(testItemsApi.getPassageItems, item.passageId);
      yield put(setPassageItemsAction(passageItems));
      yield put(showAddPassageItemsModalAction(true));
      const { addPassageItems, closeModal } = yield race({
        addPassageItems: take(ADD_PASSAGE_ITEMS_TO_TEST),
        closeModal: take(CLOSE_PASSAGE_ITEMS_MODAL)
      });

      if (closeModal) {
        yield put(showAddPassageItemsModalAction(false));
        return;
      }

      updatedTestItems = addPassageItems.payload ? [...updatedTestItems, ...passageItems] : [...updatedTestItems, item];
      yield put(showAddPassageItemsModalAction(false));
    } else {
      updatedTestItems = produce(testItems, draft => {
        draft = draft.push(item);
      });
    }
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

export function* watcherSaga() {
  yield takeEvery(ADD_ITEM_TO_CART, addItemToCartSaga);
  yield takeLatest(CREATE_TEST_FROM_CART, createTestFromCart);
}
