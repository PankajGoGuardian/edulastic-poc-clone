import { createSelector } from "reselect";
import { message } from "antd";
import { call, put, all, takeEvery, select, takeLatest } from "redux-saga/effects";
import { testItemsApi, contentErrorApi } from "@edulastic/api";
import { keyBy } from "lodash";
import { getAllTagsSelector } from "../../ducks";
import { DELETE_ITEM_SUCCESS } from "../../../ItemDetail/ducks";

// constants

export const RECEIVE_TEST_ITEMS_REQUEST = "[addItems] receive items request";
export const RECEIVE_TEST_ITEMS_SUCCESS = "[addItems] receive items success";
export const RECEIVE_TEST_ITEMS_ERROR = "[addItems] receive items error";
export const SET_TEST_ITEMS_REQUEST = "[addItems] set items request";
export const SET_TEST_ITEM_REQUEST = "[addItems] set passage item request";
export const CLEAR_SELECTED_ITEMS = "[addItems] clear selected items";
export const GET_ITEMS_SUBJECT_AND_GRADE = "[addItems] get subjects and grades";
export const REPORT_CONTENT_ERROR_REQUEST = "[addItems] report content error request";
// actions

export const receiveTestItemsSuccess = (items, count, page, limit) => ({
  type: RECEIVE_TEST_ITEMS_SUCCESS,
  payload: {
    items,
    count,
    page,
    limit
  }
});

export const receiveTestItemsError = error => ({
  type: RECEIVE_TEST_ITEMS_ERROR,
  payload: {
    error
  }
});

export const receiveTestItemsAction = (search, page, limit) => ({
  type: RECEIVE_TEST_ITEMS_REQUEST,
  payload: {
    search,
    page,
    limit
  }
});

export const setTestItemsAction = data => ({
  type: SET_TEST_ITEMS_REQUEST,
  payload: data
});
export const setItemFromPassageAction = data => ({
  type: SET_TEST_ITEM_REQUEST,
  payload: data
});

export const clearSelectedItemsAction = () => ({
  type: CLEAR_SELECTED_ITEMS
});

export const getItemsSubjectAndGradeAction = data => ({
  type: GET_ITEMS_SUBJECT_AND_GRADE,
  payload: data
});

export const reportContentErrorAction = data => ({
  type: REPORT_CONTENT_ERROR_REQUEST,
  payload: data
});

export const initalSearchState = {
  subject: "",
  curriculumId: "",
  standardIds: [],
  questionType: "",
  depthOfKnowledge: "",
  authorDifficulty: "",
  collectionName: "",
  status: "",
  grades: [],
  tags: [],
  filter: "ENTIRE_LIBRARY"
};

// reducer

const initialState = {
  items: [],
  error: null,
  loading: false,
  page: 1,
  limit: 10,
  count: 0,
  selectedItems: [],
  itemsSubjectAndGrade: {
    subjects: [],
    grades: []
  },
  search: { ...initalSearchState },
  archivedItems: []
};

export const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case RECEIVE_TEST_ITEMS_REQUEST:
      return { ...state, loading: true };
    case RECEIVE_TEST_ITEMS_SUCCESS:
      return {
        ...state,
        loading: false,
        items: payload.items,
        count: payload.count,
        page: payload.page,
        limit: payload.limit
      };
    case RECEIVE_TEST_ITEMS_ERROR:
      return { ...state, loading: false, error: payload.error };
    case SET_TEST_ITEMS_REQUEST:
      return {
        ...state,
        selectedItems: payload
      };
    case SET_TEST_ITEM_REQUEST:
      return {
        ...state,
        selectedItems: [...state.selectedItems, payload]
      };
    case CLEAR_SELECTED_ITEMS:
      return {
        ...state,
        selectedItems: [],
        itemsSubjectAndGrade: {
          subjects: [],
          grades: []
        }
      };
    case GET_ITEMS_SUBJECT_AND_GRADE:
      return {
        ...state,
        itemsSubjectAndGrade: payload
      };
    case DELETE_ITEM_SUCCESS: {
      return {
        ...state,
        archivedItems: [...state.archivedItems, payload]
      };
    }
    default:
      return state;
  }
};

// saga

function* receiveTestItemsSaga({ payload: { search = {}, page = 1, limit = 10 } }) {
  try {
    const allTagsData = yield select(state => getAllTagsSelector(state, "testitem"));
    const allTagsKeyById = keyBy(allTagsData, "_id");
    const { tags = [] } = search;
    const searchTags = tags.map(tag => allTagsKeyById[tag].tagName || "");
    const { items, count } = yield call(testItemsApi.getAll, {
      search: { ...search, tags: searchTags },
      page,
      limit
    });
    yield put(receiveTestItemsSuccess(items, count, page, limit));
  } catch (err) {
    const errorMessage = "Receive items is failing";
    yield call(message.error, errorMessage);
    yield put(receiveTestItemsError(errorMessage));
  }
}

function* reportContentErrorSaga({ payload }) {
  try {
    yield call(contentErrorApi.reportContentError, payload);
    yield call(message.success, "Issue reported successfully.");
  } catch (err) {
    console.error(err);
    yield call(message.error, "Failed to report issue.");
  }
}

export function* watcherSaga() {
  yield all([
    yield takeEvery(RECEIVE_TEST_ITEMS_REQUEST, receiveTestItemsSaga),
    yield takeLatest(REPORT_CONTENT_ERROR_REQUEST, reportContentErrorSaga)
  ]);
}

// selectors

export const stateTestItemsSelector = state => state.testsAddItems;

export const getArchivedItemsSelector = createSelector(
  stateTestItemsSelector,
  state => state.archivedItems
);

export const getTestItemsSelector = createSelector(
  stateTestItemsSelector,
  state => state.items.filter(item => !state.archivedItems.includes(item._id))
);

export const getPopStateSelector = createSelector(
  stateTestItemsSelector,
  state => state.showPopUp
);

export const getTestItemsLoadingSelector = createSelector(
  stateTestItemsSelector,
  state => state.loading
);

export const getTestsItemsCountSelector = createSelector(
  stateTestItemsSelector,
  state => state.count - state.archivedItems.length
);

export const getTestsItemsLimitSelector = createSelector(
  stateTestItemsSelector,
  state => state.limit
);

export const getTestsItemsPageSelector = createSelector(
  stateTestItemsSelector,
  state => state.page
);

export const getSelectedItemSelector = createSelector(
  stateTestItemsSelector,
  state => state.selectedItems
);

export const getItemsSubjectAndGradeSelector = createSelector(
  stateTestItemsSelector,
  state => state.itemsSubjectAndGrade
);

export const getPassageConfirmModalStateSelector = createSelector(
  stateTestItemsSelector,
  state => state.showPassageConfirmModal
);

export const getSearchFilterStateSelector = createSelector(
  stateTestItemsSelector,
  state => state.search
);
