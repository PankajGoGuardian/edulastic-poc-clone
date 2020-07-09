import { takeEvery, takeLatest, call, put, select } from "redux-saga/effects";
import { uniq } from "lodash";
import produce from "immer";
import { test as testConstant, roleuser } from "@edulastic/constants";
import { notification } from "@edulastic/common";
import { createAction } from "redux-starter-kit";
import { testItemsApi, attchmentApi, analyticsApi } from "@edulastic/api";
import { setTestItemsAction } from "../TestPage/components/AddItems/ducks";
import {
  setTestDataAction,
  createTestAction,
  getTestEntitySelector,
  getReleaseScorePremiumSelector
} from "../TestPage/ducks";
import { getUserRole } from "../src/selectors/user";
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
export const TOGGLE_TEST_ITEM_LIKE = "[item list] toggle test item like";
export const UPDATE_TEST_ITEM_LIKE_COUNT = "[item list] update test item like count";

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
export const toggleTestItemLikeAction = createAction(TOGGLE_TEST_ITEM_LIKE);
export const updateTestItemLikeCountAction = createAction(UPDATE_TEST_ITEM_LIKE_COUNT);

export function* addItemToCartSaga({ payload }) {
  const { item } = payload;
  const test = yield select(getTestEntitySelector);
  const testItems = test.itemGroups.flatMap(itemGroup => itemGroup.items || []);
  let updatedTestItems = [];
  if (testItems.some(o => o._id === item._id)) {
    updatedTestItems = produce(testItems, draft => {
      draft = draft.filter(x => x._id !== item._id);
      notification({ type: "success", messageKey: "itemRemovedCart" });
      /**
       * returning because no mutation happened
       */
      return draft;
    });
  } else {
    updatedTestItems = produce(testItems, draft => {
      draft.push(item);
      /**
       * not returning here because, muation happened above. that is enough
       */
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
  /**
   * ignore anchor standard grades
   */
  let questionGrades = uniq(
    testItems
      .flatMap(x => x.data.questions)
      .flatMap(x => x.alignment || [])
      .flatMap(x => x.domains)
      .flatMap(x => x.standards)
      .flatMap(x => (x.grades && x.grades < 13 ? x.grades : []))
  );
  if (questionGrades.length === 0) {
    questionGrades = testItems
      .flatMap(item => (item.data && item.data.questions) || [])
      .flatMap(question => (question.grades && question.grades.length < 13 ? question.grades : []));
  }
  const questionSubjects = testItems
    .flatMap(item => (item.data && item.data.questions) || [])
    .flatMap(question => question.subjects || []);
  const grades = testItems.flatMap(item => (item.grades && item.grades < 13 ? item.grades : []));
  /**
   * TODO: test item subjects should not have [[]] as a value, need to fix at item level
   * https://snapwiz.atlassian.net/browse/EV-16263
   */
  const subjects = testItems.flatMap(({ subjects: _subjects = [] }) =>
    _subjects.filter(subject => subject && !Array.isArray(subject))
  );
  const userRole = yield select(getUserRole);
  if (userRole === roleuser.DISTRICT_ADMIN || userRole === roleuser.SCHOOL_ADMIN) {
    test.testType = testConstant.type.COMMON;
    test.freezeSettings = true;
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
    yield call(testItemsApi.publishTestItem, payload);
    yield put({ type: APPROVE_OR_REJECT_SINGLE_ITEM_SUCCESS, payload });
    notification({ type: "success", msg: `Item successfully ${payload.status}.` });
  } catch (e) {
    console.error(e);
    notification({ type: "success", messageKey: "failedToUpdateStatus" });
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
        notification({ type: "success", msg: `${data.itemIds.length} item(s) successfully ${payload.status}.` });
      } else {
        notification({
          type: "success",
          msg: `${result.nModified} item(s) successfully ${payload.status}, ${data.itemIds.length -
            result.nModified} item(s) failed`
        });
      }
    } catch (e) {
      console.error(e);
      notification({ type: "success", messageKey: "failedToUpdateStatus" });
    }
  }
}

export function* submitReviewFeedbackSaga({ payload: { data } }) {
  try {
    const result = yield call(attchmentApi.saveAttachment, data);
    yield put({ type: PREVIEW_FEEDBACK_SUCCESS, payload: result });
  } catch (e) {
    console.error(e);
    notification({ messageKey: "failedToUpdateStatus" });
  }
}

export function* loadScratchPadSaga({ attachmentId }) {
  try {
    const result = yield call(attchmentApi.loadAttachment, attachmentId);
    yield put({ type: LOAD_ITEM_PREVIEW_FEEDBACK_SUCCESS, payload: result });
  } catch (e) {
    notification({ messageKey: "failedToLoadScratchpadData" });
  }
}

export function* toggleTestLikeSaga({ payload }) {
  try {
    yield put(updateTestItemLikeCountAction(payload));
    yield call(analyticsApi.toggleLike, payload);
  } catch (e) {
    console.error(e);
    payload = {
      ...payload,
      toggleValue: !payload.toggleValue
    };
    yield put(updateTestItemLikeCountAction(payload));
  }
}

export function* watcherSaga() {
  yield takeEvery(ADD_ITEM_TO_CART, addItemToCartSaga);
  yield takeLatest(CREATE_TEST_FROM_CART, createTestFromCart);
  yield takeLatest(APPROVE_OR_REJECT_SINGLE_ITEM_REQUEST, approveOrRejectSingleItemSaga);
  yield takeLatest(APPROVE_OR_REJECT_MULTIPLE_ITEM_REQUEST, approveOrRejectMultipleItemSaga);
  yield takeLatest(PREVIEW_FEEDBACK_REQUEST, submitReviewFeedbackSaga);
  yield takeLatest(LOAD_ITEM_PREVIEW_FEEDBACK_REQUEST, loadScratchPadSaga);
  yield takeLatest(TOGGLE_TEST_ITEM_LIKE, toggleTestLikeSaga);
}
