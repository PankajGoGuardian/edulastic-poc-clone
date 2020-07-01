import { createSelector } from "reselect";
import { notification } from "@edulastic/common";
import { libraryFilters } from "@edulastic/constants";
import { createAction } from 'redux-starter-kit';
import { call, put, all, takeEvery, select, takeLatest } from "redux-saga/effects";
import { push, replace } from "connected-react-router";
import { testItemsApi, contentErrorApi } from "@edulastic/api";
import { keyBy } from "lodash";
import { getAllTagsSelector } from "../../ducks";
import { DELETE_ITEM_SUCCESS } from "../../../ItemDetail/ducks";
import {
  APPROVE_OR_REJECT_SINGLE_ITEM_SUCCESS,
  APPROVE_OR_REJECT_MULTIPLE_ITEM_SUCCESS
} from "../../../src/constants/actions";
import { UPDATE_TEST_ITEM_LIKE_COUNT } from "../../../ItemList/ducks";

const { SMART_FILTERS } = libraryFilters;

export const filterMenuItems = [
  { icon: "book", filter: SMART_FILTERS.ENTIRE_LIBRARY, path: "all", text: "Entire Library" },
  { icon: "folder", filter: SMART_FILTERS.AUTHORED_BY_ME, path: "by-me", text: "Authored by me" },
  { icon: "share-alt", filter: SMART_FILTERS.SHARED_WITH_ME, path: "shared", text: "Shared with me" },

  // These two filters are to be enabled later so, commented out
  // { icon: "reload", filter: "PREVIOUS", path: "previous", text: "Previously Used" },
  { icon: "heart", filter: SMART_FILTERS.FAVORITES, path: "favourites", text: "My Favorites" }
];

// constants

export const RECEIVE_TEST_ITEMS_REQUEST = "[addItems] receive items request";
export const RECEIVE_TEST_ITEMS_SUCCESS = "[addItems] receive items success";
export const RECEIVE_TEST_ITEMS_ERROR = "[addItems] receive items error";
export const SET_TEST_ITEMS_REQUEST = "[addItems] set items request";
export const REMOVE_TEST_ITEMS_REQUEST = "[addItems] remove items request";
export const SET_TEST_ITEM_REQUEST = "[addItems] set passage item request";
export const CLEAR_SELECTED_ITEMS = "[addItems] clear selected items";
export const GET_ITEMS_SUBJECT_AND_GRADE = "[addItems] get subjects and grades";
export const REPORT_CONTENT_ERROR_REQUEST = "[addItems] report content error request";
export const SET_SEARCH_FILTER_STATE = "[addItems] update search filter state";
export const CLEAR_SEARCH_FILTER_STATE = "[addItems] clear search filter state";
export const UPDATE_INITIAL_SEARCH_STATE_ON_LOGIN = "[addItems] update init search state on login";
export const RESET_PAGE_STATE_ADD_ITEMS = "[addItems] reset page state";
export const SHOW_ADD_PASSAGE_ITEM_MODAL = "[addItems] toggle show add passage item modal";
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

export const removeTestItemsAction = data => ({
  type: REMOVE_TEST_ITEMS_REQUEST,
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

export const updateSearchFilterStateAction = payload => ({
  type: SET_SEARCH_FILTER_STATE,
  payload
});

export const clearFilterStateAction = payload => ({
  type: CLEAR_SEARCH_FILTER_STATE,
  payload
});

export const updateInitSearchStateAction = payload => ({
  type: UPDATE_INITIAL_SEARCH_STATE_ON_LOGIN,
  payload
});

export const resetPageStateAction = createAction(RESET_PAGE_STATE_ADD_ITEMS);

// reducer

export const initalSearchState = {
  subject: [],
  curriculumId: "",
  standardIds: [],
  questionType: "",
  depthOfKnowledge: "",
  authorDifficulty: "",
  collections: [],
  status: "",
  grades: [],
  tags: [],
  authoredByIds: [],
  filter: filterMenuItems[0].filter,
  createdAt: ""
};

const initialState = {
  items: [],
  error: null,
  loading: false,
  page: 1,
  limit: 25,
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
        archivedItems: [],
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
    case REMOVE_TEST_ITEMS_REQUEST:
      return {
        ...state,
        selectedItems: state.selectedItems.filter(i => !payload.includes(i))
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
    case SET_SEARCH_FILTER_STATE:
      return {
        ...state,
        search: { ...payload }
      };
    case CLEAR_SEARCH_FILTER_STATE:
      return {
        ...state,
        search: { ...initalSearchState }
      };
    case UPDATE_INITIAL_SEARCH_STATE_ON_LOGIN:
      return {
        ...state,
        search: {
          ...state.search,
          grades: payload.grades || [],
          subject: payload.subject[0] || ""
        }
      };
    case DELETE_ITEM_SUCCESS: {
      return {
        ...state,
        archivedItems: [...state.archivedItems, payload]
      };
    }
    case APPROVE_OR_REJECT_SINGLE_ITEM_SUCCESS:
      return {
        ...state,
        items: state.items.map(i => {
          if (i._id === payload.itemId) {
            return {
              ...i,
              status: payload.status
            };
          }
          return i;
        })
      };
    case APPROVE_OR_REJECT_MULTIPLE_ITEM_SUCCESS: {
      const itemIdsMap = keyBy(payload.itemIds);
      return {
        ...state,
        items: state.items.map(i => {
          if (itemIdsMap[i._id]) {
            return {
              ...i,
              status: payload.status
            };
          }
          return i;
        }),
        selectedItems: [...state.selectedItems]
      };
    }
    case RESET_PAGE_STATE_ADD_ITEMS:
      return {
        ...state,
        page: 1
      };
    case UPDATE_TEST_ITEM_LIKE_COUNT:
      return {
        ...state,
        items: state.items.map(item => {
          if (item.versionId === payload.versionId) {
            return {
              ...item,
              analytics: [
                {
                  usage: item ?.analytics ?.[0] ?.usage || 0,
                  likes: payload.toggleValue
                    ? (item ?.analytics ?.[0] ?.likes || 0) + 1
                    : (item ?.analytics ?.[0] ?.likes || 1) - 1
                }
              ],
              alreadyLiked: payload.toggleValue
            };
          }
          return item;
        })
      };
    default:
      return state;
  }
};

// saga

function* receiveTestItemsSaga({ payload: { search = {}, page = 1, limit = 10 } }) {
  try {
    const currentLocation = yield select(state => state.router.location.pathname);
    yield put(push(`${currentLocation}?page=${page}`));
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
    notification({ messageKey: "receiveItemFailing" });
    yield put(receiveTestItemsError(errorMessage));
  }
}

function* reportContentErrorSaga({ payload }) {
  try {
    yield call(contentErrorApi.reportContentError, payload);
    notification({ type: "success", messageKey: "issueReportedSuccessfully" });
  } catch (err) {
    console.error(err);
    notification({ messageKey: "failedToReportIssue" });
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
