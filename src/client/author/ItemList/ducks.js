import { takeEvery, takeLatest, call, put, select, take, race } from "redux-saga/effects";
import { message } from "antd";
import { uniq, get } from "lodash";
import produce from "immer";
import { test as testConstant, roleuser } from "@edulastic/constants";
import { notification } from "@edulastic/common";
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
import { testItemsApi, attchmentApi } from "@edulastic/api";
import {
  APPROVE_OR_REJECT_SINGLE_ITEM_REQUEST,
  APPROVE_OR_REJECT_SINGLE_ITEM_SUCCESS,
  APPROVE_OR_REJECT_MULTIPLE_ITEM_REQUEST,
  APPROVE_OR_REJECT_MULTIPLE_ITEM_SUCCESS
} from "../src/constants/actions";

export const ADD_ITEM_TO_CART = "[item list] add item to cart";
export const CREATE_TEST_FROM_CART = "[item list] create test from cart";

export const PREVIEW_FEEDBACK_REQUEST = "[item list] preview item reject feedback request";
export const PREVIEW_FEEDBACK_SUCCESS = "[item list] preview item reject feedback success";
export const PREVIEW_FEEDBACK_FAILURE = "[item list] preview item reject feedback failure";
export const LOAD_ITEM_PREVIEW_FEEDBACK_REQUEST = "[item list] preview item feedback data request";
export const LOAD_ITEM_PREVIEW_FEEDBACK_SUCCESS = "[item list] preview item feedback data success";
export const LOAD_ITEM_PREVIEW_FEEDBACK_FAILURE = "[item list] preview item feedback data failure";

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
export const submitReviewFeedbackAction = createAction(PREVIEW_FEEDBACK_REQUEST);
export const loadScratchPadAction = createAction(LOAD_ITEM_PREVIEW_FEEDBACK_REQUEST);

export function* addItemToCartSaga({ payload }) {
  const { item } = payload;
  const test = yield select(getTestEntitySelector);
  const testItems = test.itemGroups.flatMap(itemGroup => itemGroup.items || []);
  let updatedTestItems = [];
  if (testItems.some(o => o._id === item._id)) {
    updatedTestItems = produce(testItems, draft => {
      draft = draft.filter(x => x._id !== item._id);
      notification({ type: "success", messageKey: "itemRemovedCart" });
      return draft;
    });
  } else {
    updatedTestItems = produce(testItems, draft => {
      draft = draft.push(item);
      notification({ type: "success", messageKey: "itemAddedCart" });
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
    itemGroups: [
      {
        ...test.itemGroups[0],
        items: updatedTestItems
      }
    ]
  };

  yield put(setTestItemsAction(updatedTestItems.map(o => o._id)));
  yield put(setTestDataAction(updatedTest));
}

export function* createTestFromCart({ payload: { testName } }) {
  const test = yield select(getTestEntitySelector);
  const testItems = test.itemGroups.flatMap(itemGroup => itemGroup.items || []);
  const questionGrades = testItems
    .flatMap(item => (item.data && item.data.questions) || [])
    .flatMap(question => question.grades || []);
  const questionSubjects = testItems
    .flatMap(item => (item.data && item.data.questions) || [])
    .flatMap(question => question.subjects || []);
  const grades = testItems.flatMap(item => item.grades);
  const subjects = testItems.flatMap(item => item.subjects);
  const userRole = yield select(getUserRole);
  if (userRole === roleuser.DISTRICT_ADMIN || userRole === roleuser.SCHOOL_ADMIN) {
    test.testType = testConstant.type.COMMON;
  }
  const updatedTest = {
    ...test,
    title: testName,
    grades: uniq([...grades, ...questionGrades]),
    subjects: uniq([...subjects, ...questionSubjects])
  };
  notification({ type: "info", messageKey: "Creatingatestwithselecteditems" });
  yield put(createTestAction(updatedTest, false, true));
}

export function* approveOrRejectSingleItemSaga({ payload }) {
  try {
    const result = yield call(testItemsApi.publishTestItem, payload);
    yield put({ type: APPROVE_OR_REJECT_SINGLE_ITEM_SUCCESS, payload: payload });
    notification({ type: "success", msg:`Item successfully ${payload.status}.`});
  } catch (e) {
    console.error(e);
    notification({ type: "success", messageKey:"failedToUpdateStatus"});
  }
}

export function* approveOrRejectMultipleItemSaga({ payload }) {
  const test = yield select(getTestEntitySelector);
  const { itemGroups } = test;
  const testItems = itemGroups.flatMap(itemGroup => itemGroup.items);
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
        notification({ type: "success", msg: `${data.itemIds.length} item(s) successfully ${payload.status}.`});
      } else {
        notification({ type: "success", msg: `${result.nModified} item(s) successfully ${payload.status}, ${data.itemIds.length -
          result.nModified} item(s) failed`});
      }
    } catch (e) {
      console.error(e);
      notification({ type: "success", messageKey:"failedToUpdateStatus"});
    }
  }
}

export function* submitReviewFeedbackSaga({ payload: { status, data } }) {
  try {
    const result = yield call(attchmentApi.saveAttachment, data);
    yield put({ type: PREVIEW_FEEDBACK_SUCCESS, payload: result });
  } catch (e) {
    console.error(e);
    yield call(message.error, `Failed to update Status`);
  }
}

export function* loadScratchPadSaga({ attachmentId }) {
  try {
    const result = yield call(attchmentApi.loadAttachment, attachmentId);
    yield put({ type: LOAD_ITEM_PREVIEW_FEEDBACK_SUCCESS, payload: result });
  } catch (e) {
    yield call(message.error, "Failed to load scratchpad data");
  }
}

export function* watcherSaga() {
  yield takeEvery(ADD_ITEM_TO_CART, addItemToCartSaga);
  yield takeLatest(CREATE_TEST_FROM_CART, createTestFromCart);
  yield takeLatest(APPROVE_OR_REJECT_SINGLE_ITEM_REQUEST, approveOrRejectSingleItemSaga);
  yield takeLatest(APPROVE_OR_REJECT_MULTIPLE_ITEM_REQUEST, approveOrRejectMultipleItemSaga);
  yield takeLatest(PREVIEW_FEEDBACK_REQUEST, submitReviewFeedbackSaga);
  yield takeLatest(LOAD_ITEM_PREVIEW_FEEDBACK_REQUEST, loadScratchPadSaga);
}
