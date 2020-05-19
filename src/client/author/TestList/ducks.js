import { createSelector } from "reselect";
import { createAction } from "redux-starter-kit";
import { call, put, all, takeEvery, select } from "redux-saga/effects";
import { message, notification } from "antd";
import produce from "immer";
import { testsApi } from "@edulastic/api";
import { CREATE_TEST_SUCCESS, UPDATE_TEST_SUCCESS } from "../src/constants/actions";
import { getFromLocalStorage } from "@edulastic/api/src/utils/Storage";
import { updateDefaultGradesAction, updateDefaultSubjectAction } from "../../student/Login/ducks";
import { getDefaultGradesSelector, getDefaultSubjectSelector } from "../src/selectors/user";
import { UPDATE_INITIAL_SEARCH_STATE_ON_LOGIN } from "../TestPage/components/AddItems/ducks";
import { cloneDeep, keyBy } from "lodash";

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
export const ADD_TEST_TO_CART = "[tests] add test to cart";
export const REMOVE_TEST_FROM_CART = "[tests] remove test from cart";

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
export const approveOrRejectMultipleTestsRequestAction = createAction(APPROVE_OR_REJECT_MULTIPLE_TESTS_REQUEST);
export const approveOrRejectMultipleTestsSuccessAction = createAction(APPROVE_OR_REJECT_MULTIPLE_TESTS_SUCCESS);
export const addTestToCartAction = createAction(ADD_TEST_TO_CART);
export const removeTestFromCartAction = createAction(REMOVE_TEST_FROM_CART);

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
    yield call(
      notification.error({
        message: errorMessage,
        placement: "bottomLeft",
        duration: 1.5
      })
    );
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
    if (
      payload.status === "published" &&
      (!payload.collections || (payload.collections && !payload.collections.length))
    ) {
      message.error("Test is not associated with any collection.");
      return;
    }
    yield call(testsApi.updateTestStatus, payload);
    yield put(approveOrRejectSingleTestSuccessAction(payload));
    message.success("Test Updated Successfully.");
  } catch (error) {
    console.error(error);
    message.error(error?.data?.message || "Test Update Failed.");
  }
}

function* approveOrRejectMultipleTestsSaga({ payload }) {
  const tests = yield select(getSelectedTestsSelector);
  if (tests.length) {
    try {
      const data = {
        status: payload.status,
        testIds: tests
          .filter(i => {
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
          .map(i => i._id)
      };

      const result = yield call(testsApi.updateBulkTestsStatus, data);
      if (result.nModified === data.testIds.length) {
        yield put(approveOrRejectMultipleTestsSuccessAction(data));
        yield call(message.success, `${data.testIds.length} tests(s) successfully ${payload.status}.`);
      } else {
        yield call(
          message.success,
          `${result.nModified} tests(s) successfully ${payload.status}, ${data.testIds.length -
            result.nModified} tests(s) failed`
        );
      }
    } catch (error) {
      console.error(error);
      message.error(error?.data?.message || `Failed to update Status`);
    }
  }
}

export function* watcherSaga() {
  yield all([
    yield takeEvery(RECEIVE_TESTS_REQUEST, receiveTestsSaga),
    yield takeEvery(CLEAR_TEST_FILTERS, clearAllTestFiltersSaga),
    yield takeEvery(DELETE_TEST_REQUEST, deleteTestSaga),
    yield takeEvery(APPROVE_OR_REJECT_SINGLE_TEST_REQUEST, approveOrRejectSingleTestSaga),
    yield takeEvery(APPROVE_OR_REJECT_MULTIPLE_TESTS_REQUEST, approveOrRejectMultipleTestsSaga)
  ]);
}

export const emptyFilters = {
  questionType: "",
  depthOfKnowledge: "",
  authorDifficulty: "",
  collections: [],
  curriculumId: "",
  status: "",
  standardIds: [],
  grades: [],
  subject: "",
  tags: [],
  searchString: "",
  filter: "ENTIRE_LIBRARY",
  createdAt: ""
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
  loading: false,
  selectedTests: []
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
            if (payload.collections) {
              item.collections = payload.collections;
            }
            return item;
          }
        })
      };
    case ADD_TEST_TO_CART:
      return {
        ...state,
        selectedTests: [...state.selectedTests, cloneDeep(payload)]
      };
    case REMOVE_TEST_FROM_CART:
      return {
        ...state,
        selectedTests: state.selectedTests.filter(o => o._id !== payload._id)
      };
    case APPROVE_OR_REJECT_MULTIPLE_TESTS_SUCCESS:
      const testIdsMap = keyBy(payload.testIds);
      return {
        ...state,
        entities: state.entities.map(t => {
          if (testIdsMap[t._id]) {
            return {
              ...t,
              status: payload.status
            };
          }
          return t;
        }),
        selectedTests: []
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

export const getSelectedTestsSelector = createSelector(
  stateSelector,
  state => state.selectedTests
);
