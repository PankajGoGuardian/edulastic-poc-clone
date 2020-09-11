import { createSelector } from "reselect";
import { createAction } from "redux-starter-kit";
import { call, put, all, takeEvery, select } from "redux-saga/effects";
import { push } from "connected-react-router";
import { get } from "lodash";
import { testItemsApi, passageApi, groupApi } from "@edulastic/api";
import { notification, MeetFirebase } from "@edulastic/common";
import * as Sentry from "@sentry/browser";
import { meetBroadcast } from "@edulastic/common/src/MeetFirebase";
import { updateTestAndNavigateAction, receiveTestByIdAction } from "../../../../TestPage/ducks";
import { toggleBroadcastSummaryAction } from "../../../../SchoolAdmin/ducks";

export const SET_QUESTIONS_IN_PASSAGE = "[testItemPreview] set questions to passage";
export const ADD_PASSAGE = "[testItemPreview] add passage to item";
export const SET_ITEM_PREVIEW_DATA = "[testItemPreview] set data";
export const CLEAR_ITEM_PREVIEW = "[testItemPreview] clear item preview";
export const DUPLICATE_TESTITEM_PREVIEW_REQUEST = "[testItemPreview] duplicate request";

export const BROADCAST_QUESTION = '[extension] broadcast question';

export const setQuestionsForPassageAction = createAction(SET_QUESTIONS_IN_PASSAGE);
export const addPassageAction = createAction(ADD_PASSAGE);
export const clearPreviewAction = createAction(CLEAR_ITEM_PREVIEW);
export const setPrevewItemAction = createAction(SET_ITEM_PREVIEW_DATA);
export const duplicateTestItemPreviewRequestAction = createAction(DUPLICATE_TESTITEM_PREVIEW_REQUEST);

export const broadcastQuestionAction = createAction(BROADCAST_QUESTION);

export const stateSelector = state => state.testItemPreview;
export const getPassageSelector = createSelector(
  stateSelector,
  state => state.passage
);

export const getItemDetailSelectorForPreview = (state, id, page) => {
  let testItems = [];
  const testItemPreview = get(state, "testItemPreview.item", {});
  if (testItemPreview && testItemPreview.data) {
    return get(state, "testItemPreview.item");
  }
  if (page === "addItems" || page === "itemList") {
    testItems = get(state, "testsAddItems.items", []);
  } else if (page === "review") {
    testItems = state.tests.entity.itemGroups.flatMap(itemGroup => itemGroup.items || []) || [];
  } else {
    console.warn("unknown page type ", page);
  }
  const item = testItems.find(x => x._id === id);
  if (item?.multipartItem) {
    // markQuestionLabel([item]);
  }
  return item || undefined;
};

// reducer

const initialState = {
  item: null,
  passage: null
};

export function reducer(state = initialState, { type, payload }) {
  switch (type) {
    case SET_QUESTIONS_IN_PASSAGE: {
      return {
        ...state,
        item: {
          ...payload,
          data: {
            ...state.item.data,
            questions: payload.data.questions
          }
        }
      };
    }
    case ADD_PASSAGE: {
      return { ...state, item: { ...state.item, passageId: payload._id }, passage: payload };
    }
    case SET_ITEM_PREVIEW_DATA:
      return { ...state, item: payload };
    case CLEAR_ITEM_PREVIEW:
      return initialState;
    default:
      return state;
  }
}

function* duplicateItemRequestSaga({ payload }) {
  try {
    notification({type:"info",msg:"Cloning items...", duration:3});
    const { data, testId, test, isTest, regradeFlow, duplicateWholePassage, currentItem } = payload;
    const { passage } = payload;
    const itemId = data.id;
    let duplicatedItem = {};
    if (passage) {
      // Current item selected in preview modal or all test items based on duplicateWholePassage (flag)
      const testItemsToDuplicate = duplicateWholePassage ? passage.testItems : currentItem ? [currentItem] : [];
      // To duplicate passage we require passageId and testItemsIds
      const duplicatedPassage = yield call(passageApi.duplicate, {
        passageId: passage?._id,
        testItemIds: testItemsToDuplicate,
        testId
      });
      if(duplicateWholePassage && testId){
        yield put(receiveTestByIdAction(testId,true));
        notification({ msg:`${testItemsToDuplicate.length} items added to test`, type:"success" });
        return;
      }
      
      // using first item to show when redirected to itemDetails page
      duplicatedItem._id = duplicatedPassage?.testItems?.[0];
    } else {
      duplicatedItem = yield call(testItemsApi.duplicateTestItem, itemId);
    }
    const isEditEnable = yield select(state => get(state, "tests.editEnable"));
    if (isTest && !(test.status === "draft" || isEditEnable)) {
      return yield put(
        push({
          pathname: `/author/items/${duplicatedItem._id}/item-detail`,
          state: { testAuthoring: false, testId }
        })
      );
    }
    if (isTest) {
      yield put(
        updateTestAndNavigateAction({
          pathname: `/author/tests/${testId}/editItem/${duplicatedItem._id}`,
          fadeSidebar: true,
          regradeFlow,
          previousTestId: test.previousTestId,
          testId,
          isDuplicating: true,
          passage
        })
      );
    } else {
      yield put(push(`/author/items/${duplicatedItem._id}/item-detail`));
    }
  } catch (e) {
    Sentry.captureException(e);
    console.error("duplicateItemrequest error - ", e);
    notification({ messageKey: "duplicationItemError" });
  }
}

function* broadcastQuestion({payload}){
  try {
    const { meetingID, item, classId } = payload;

    if(!meetingID || !item || !classId) throw new Error('Insuficient Payload Data...');

    const districtId = yield select(state => state?.user?.user?.orgData?.districtIds?.[0]);
    if(!districtId) throw new Error('DistrictId could not be retrieved');

    const students = yield call(groupApi.fetchStudentsByGroupId, {districtId, groupIds: [classId]}) ||  [];
    
    yield all(
      students
      .filter(({studentId}) => studentId)
      .map(({studentId}) => call(meetBroadcast, {meetingID, classId, userId: studentId, questionItem: item }))
    );

    yield put(toggleBroadcastSummaryAction(true));
    notification({ type:"success", messageKey: "broadcastSuccess" });
  } catch (e) {
    Sentry.captureException(e);
    console.error("Broadcast error - ", e);
    notification({ messageKey: "broadcastError" });
  }
}

export function* watcherSaga() {
  yield all([
    yield takeEvery(DUPLICATE_TESTITEM_PREVIEW_REQUEST, duplicateItemRequestSaga),
    yield takeEvery(BROADCAST_QUESTION, broadcastQuestion)
  ]);
}
