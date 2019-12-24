import { createSelector } from "reselect";
import { createAction } from "redux-starter-kit";
import { call, put, all, takeEvery, select } from "redux-saga/effects";
import { message } from "antd";
import produce from "immer";
import { testsApi } from "@edulastic/api";
import { CREATE_TEST_SUCCESS, UPDATE_TEST_SUCCESS } from "../src/constants/actions";
import { getFromLocalStorage } from "@edulastic/api/src/utils/Storage";
import { updateDefaultGradesAction, updateDefaultSubjectAction } from "../../student/Login/ducks";
import { getDefaultGradesSelector, getDefaultSubjectSelector } from "../src/selectors/user";
import { UPDATE_INITIAL_SEARCH_STATE_ON_LOGIN } from "../TestPage/components/AddItems/ducks";

export const filterMenuItems = [
  { icon: "book", filter: "ENTIRE_LIBRARY", path: "all", text: "Entire Library" },
  { icon: "folder", filter: "AUTHORED_BY_ME", path: "by-me", text: "Authored by me" },
  { icon: "share-alt", filter: "SHARED_WITH_ME", path: "shared", text: "Shared with me" },
  { icon: "copy", filter: "CO_AUTHOR", path: "co-author", text: "I am a Co-Author" }

  // These two filters are to be enabled later so, commented out
  // { icon: "reload", filter: "PREVIOUS", path: "previous", text: "Previously Used" },
  // { icon: "heart", filter: "FAVORITES", path: "favourites", text: "My Favorites" }
];

// types
export const RECEIVE_TESTS_REQUEST = "[tests] receive list request";
export const RECEIVE_TESTS_SUCCESS = "[tests] receive list success";
export const RECEIVE_TESTS_ERROR = "[tests] receive list error";
export const UPDATE_TEST_FILTER = "[tests] update test search filter";
export const UPDATE_ALL_TEST_FILTERS = "[tests] update all test filters";
export const CLEAR_TEST_FILTERS = "[tests] clear test filters";
export const DELETE_TEST_REQUEST = "[tests] delete test request";
export const DELETE_TEST_REQUEST_SUCCESS = "[tests] delete test request success";
export const APPROVE_OR_REJECT_SINGLE_TEST_REQUEST = "[tests] approve or reject single test request";
export const APPROVE_OR_REJECT_SINGLE_TEST_SUCCESS = "[tests] approve or reject single test success";
export const APPROVE_OR_REJECT_MULTIPLE_TESTS_REQUEST = "[tests] approve or reject multiple tests request";
export const APPROVE_OR_REJECT_MULTIPLE_TESTS_SUCCESS = "[tests] approve or reject multiple tests success";

// actions
export const receiveTestsAction = createAction(RECEIVE_TESTS_REQUEST);
export const receiveTestSuccessAction = createAction(RECEIVE_TESTS_SUCCESS);
export const receiveTestErrorAction = createAction(RECEIVE_TESTS_ERROR);
export const updateTestSearchFilterAction = createAction(UPDATE_TEST_FILTER);
export const updateAllTestSearchFilterAction = createAction(UPDATE_ALL_TEST_FILTERS);
export const clearTestFiltersAction = createAction(CLEAR_TEST_FILTERS);
export const deleteTestRequestAction = createAction(DELETE_TEST_REQUEST);
export const deleteTestRequestSuccessAction = createAction(DELETE_TEST_REQUEST_SUCCESS);
export const approveOrRejectSingleTestRequestAction = createAction(APPROVE_OR_REJECT_SINGLE_TEST_REQUEST);
export const approveOrRejectSingleTestSuccessAction = createAction(APPROVE_OR_REJECT_SINGLE_TEST_SUCCESS);

function* receiveTestsSaga({ payload: { search = {}, page = 1, limit = 10 } }) {
  try {
    const { items, count } = yield call(testsApi.getAll, {
      search,
      page,
      limit
    });

    yield put(
      receiveTestSuccessAction({
        entities: items,
        count,
        page,
        limit
      })
    );
  } catch (err) {
    const errorMessage = "Receive tests is failing";
    yield call(message.error, errorMessage);
    yield put(receiveTestErrorAction({ error: errorMessage }));
  }
}

function* clearAllTestFiltersSaga() {
  try {
    yield put(updateDefaultGradesAction([]));
    yield put(updateDefaultSubjectAction(""));

    const testFilters = yield select(getTestsFilterSelector);
    const defaultGrades = yield select(getDefaultGradesSelector);
    const defaultSubject = yield select(getDefaultSubjectSelector);
    const limit = yield select(getTestsLimitSelector);

    const searchFilters = {
      ...testFilters,
      grades: defaultGrades,
      subject: defaultSubject
    };
    yield put(receiveTestsAction({ page: 1, limit, search: searchFilters }));
  } catch (err) {
    console.error(err);
  }
}

function* deleteTestSaga({ payload }) {
  try {
    yield call(testsApi.deleteTest, payload);
    yield put(deleteTestRequestSuccessAction(payload));
    message.success("Test Deleted Successfully.");
  } catch (error) {
    console.error(error);
    // 403 means dont have permission
    message.error(error?.data?.message || "You don't have access to delete this test.");
  }
}

function* approveOrRejectSingleTestSaga({ payload }) {
  try {
    yield call(testsApi.updateTestStatus, payload);
    yield put(approveOrRejectSingleTestSuccessAction(payload));
    message.success("Test Updated Successfully.");
  } catch (error) {
    console.error(error);
    message.error(error?.data?.message || "Test Update Failed.");
  }
}

export function* watcherSaga() {
  yield all([
    yield takeEvery(RECEIVE_TESTS_REQUEST, receiveTestsSaga),
    yield takeEvery(CLEAR_TEST_FILTERS, clearAllTestFiltersSaga),
    yield takeEvery(DELETE_TEST_REQUEST, deleteTestSaga),
    yield takeEvery(APPROVE_OR_REJECT_SINGLE_TEST_REQUEST, approveOrRejectSingleTestSaga)
  ]);
}

export const emptyFilters = {
  questionType: "",
  depthOfKnowledge: "",
  authorDifficulty: "",
  collectionName: "",
  curriculumId: "",
  status: "",
  standardIds: [],
  grades: [],
  subject: "",
  tags: [],
  searchString: "",
  filter: "ENTIRE_LIBRARY"
};

// reducer
const initialState = {
  entities: [],
  filters: {
    ...emptyFilters
  },
  error: null,
  page: 1,
  limit: 20,
  count: 0,
  loading: false
};

export const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case RECEIVE_TESTS_REQUEST:
      return { ...state, loading: true };
    case RECEIVE_TESTS_SUCCESS:
      return {
        ...state,
        loading: false,
        entities: payload.entities,
        page: payload.page,
        limit: payload.limit,
        count: payload.count
      };
    case RECEIVE_TESTS_ERROR:
      return { ...state, loading: false, error: payload.error };
    case CREATE_TEST_SUCCESS:
    case UPDATE_TEST_SUCCESS:
      return {
        ...state,
        entities: [payload.entity, ...state.entities]
      };
    case UPDATE_TEST_FILTER: {
      const testListState = produce(state, draft => {
        draft.filters[payload.key] = payload.value;
      });
      return testListState;
    }
    case UPDATE_ALL_TEST_FILTERS:
      return {
        ...state,
        filters: payload
      };

    case CLEAR_TEST_FILTERS:
      return {
        ...state,
        filters: {
          ...emptyFilters
        }
      };
    case UPDATE_INITIAL_SEARCH_STATE_ON_LOGIN:
      return {
        ...state,
        filters: {
          ...emptyFilters,
          grades: payload.grades || [],
          subject: payload.subject[0] || ""
        }
      };
    case DELETE_TEST_REQUEST_SUCCESS:
      return {
        ...state,
        entities: state.entities.filter(item => item._id !== payload)
      };
    case APPROVE_OR_REJECT_SINGLE_TEST_SUCCESS:
      return {
        ...state,
        entities: state.entities.map(item => {
          if (item._id !== payload.testId) {
            return item;
          } else {
            item.status = payload.status;
            return item;
          }
        })
      };
    default:
      return state;
  }
};

// selectors
export const stateSelector = state => state.testList;

export const getTestsSelector = createSelector(
  stateSelector,
  state => state.entities
);
export const getTestsLoadingSelector = createSelector(
  stateSelector,
  state => state.loading
);
export const getTestsPageSelector = createSelector(
  stateSelector,
  state => state.page
);
export const getTestsLimitSelector = createSelector(
  stateSelector,
  state => state.limit
);
export const getTestsCountSelector = createSelector(
  stateSelector,
  state => state.count
);

export const getTestsFilterSelector = createSelector(
  stateSelector,
  state => state.filters
);
