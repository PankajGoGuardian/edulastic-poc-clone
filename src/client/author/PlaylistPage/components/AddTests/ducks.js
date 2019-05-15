import { createSelector } from "reselect";
import { message } from "antd";
import { call, put, all, takeEvery } from "redux-saga/effects";
import { testItemsApi, tes } from "@edulastic/api";

// constants

export const RECEIVE_TESTS_REQUEST = "[addTests] receive tests request";
export const RECEIVE_TESTS_SUCCESS = "[addTests] receive tests success";
export const RECEIVE_TESTS_ERROR = "[addTests] receive tests error";
export const SET_TESTS_REQUEST = "[addTests] set tests request";
export const CLEAR_SELECTED_TESTS = "[addTests] clear selected tests";
export const GET_TESTS_SUBJECT_AND_GRADE = "[addTests] get subjects and grades";
// actions

export const receiveTestItemsSuccess = (items, count, page, limit) => ({
  type: RECEIVE_TESTS_SUCCESS,
  payload: {
    items,
    count,
    page,
    limit
  }
});

export const receiveTestItemsError = error => ({
  type: RECEIVE_TESTS_ERROR,
  payload: {
    error
  }
});

export const receiveTestsAction = (search, page, limit) => ({
  type: RECEIVE_TESTS_REQUEST,
  payload: {
    search,
    page,
    limit
  }
});

export const setTestItemsAction = data => ({
  type: SET_TESTS_REQUEST,
  payload: { data }
});

export const clearSelectedItemsAction = () => ({
  type: CLEAR_SELECTED_TESTS
});

export const getItemsSubjectAndGradeAction = data => ({
  type: GET_TESTS_SUBJECT_AND_GRADE,
  payload: data
});

// reducer

const initialState = {
  items: [],
  error: null,
  loading: false,
  page: 1,
  limit: 10,
  count: 0,
  selectedItems: {
    data: []
  },
  itemsSubjectAndGrade: {
    subjects: [],
    grades: []
  }
};

const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case RECEIVE_TESTS_REQUEST:
      return { ...state, loading: true };
    case RECEIVE_TESTS_SUCCESS:
      return {
        ...state,
        loading: false,
        items: payload.items,
        count: payload.count,
        page: payload.page,
        limit: payload.limit
      };
    case RECEIVE_TESTS_ERROR:
      return { ...state, loading: false, error: payload.error };
    case SET_TESTS_REQUEST:
      return {
        ...state,
        selectedItems: payload
      };
    case CLEAR_SELECTED_TESTS:
      return {
        ...state,
        selectedItems: [],
        itemsSubjectAndGrade: {
          subjects: [],
          grades: []
        }
      };
    case GET_TESTS_SUBJECT_AND_GRADE:
      return {
        ...state,
        itemsSubjectAndGrade: payload
      };
    default:
      return state;
  }
};

// saga

function* receiveTestItemsSaga({ payload: { search = {}, page = 1, limit = 10 } }) {
  try {
    const { items, count } = yield call(testItemsApi.getAll, {
      search,
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

export function* watcherSaga() {
  yield all([yield takeEvery(RECEIVE_TEST_ITEMS_REQUEST, receiveTestItemsSaga)]);
}

// selectors

export const stateTestItemsSelector = state => state.testsAddItems;

export const getTestItemsSelector = createSelector(
  stateTestItemsSelector,
  state => state.items
);

export const getTestItemsLoadingSelector = createSelector(
  stateTestItemsSelector,
  state => state.loading
);

export const getTestsItemsCountSelector = createSelector(
  stateTestItemsSelector,
  state => state.count
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

export default reducer;
