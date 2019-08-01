import { createSelector } from "reselect";
import { createAction, createReducer } from "redux-starter-kit";
import { userApi } from "@edulastic/api";
import { call, put, all, takeEvery } from "redux-saga/effects";
import { message } from "antd";
import { isEmpty } from "lodash";

// constants

export const FETCH_USERS = "[test] fetch all users";
export const UPDATE_USERS_LIST = "[test] update users list";
export const LOADING_USER_LIST = "[test] loading users list";

export const SEARCH_USER_REQUEST = "[user] search users request";
export const SEARCH_USER_SUCCESS = "[user] search users success";
export const SEARCH_USER_FAILS = "[user] search users fails";

// actions

export const fetchUsersListAction = createAction(FETCH_USERS);

export const updateUsersListAction = createAction(UPDATE_USERS_LIST);

export const getFetchingAction = createAction(LOADING_USER_LIST);

export const searchUserRequestAction = createAction(SEARCH_USER_REQUEST);
export const searchUserSuccessAction = createAction(SEARCH_USER_SUCCESS);
export const searchUserFailAction = createAction(SEARCH_USER_FAILS);

// reducer

const initialState = {
  usersList: [],
  fetching: false,
  searching: false,
  searchResult: {}
};

const setUserListReducer = (state, { payload }) => ({
  ...state,
  usersList: payload.data,
  fetching: false
});

const setLoadingStateReducer = (state, { payload }) => ({
  ...state,
  fetching: payload
});

export default createReducer(initialState, {
  [UPDATE_USERS_LIST]: setUserListReducer,
  [LOADING_USER_LIST]: setLoadingStateReducer,
  [SEARCH_USER_REQUEST]: state => ({
    ...state,
    searching: true,
    searchResult: {}
  }),
  [SEARCH_USER_SUCCESS]: (state, { payload }) => {
    return {
      ...state,
      searching: false,
      searchResult: payload
    };
  },
  [SEARCH_USER_FAILS]: state => {
    return {
      ...state,
      searching: false
    };
  }
});

function* fetchAllUsersSaga({ payload }) {
  try {
    yield put(getFetchingAction(true));
    const { result: userList } = yield call(userApi.fetchUsersForShare, payload);
    yield put(updateUsersListAction(userList));
  } catch (e) {
    const errorMessage = "Search failed";
    yield call(message.error, errorMessage);
  }
}

function* searchUserSaga({ payload }) {
  try {
    const result = yield call(userApi.checkUser, payload);
    if (!isEmpty(result)) {
      yield put(searchUserSuccessAction(result[0]));
      yield call(message.error, "Email already exist");
    }
  } catch (e) {
    const errorMessage = "Search failed";
    yield call(message.error, errorMessage);
    yield put(searchUserFailAction());
  }
}

export function* watcherSaga() {
  yield all([yield takeEvery(FETCH_USERS, fetchAllUsersSaga)]);
  yield all([yield takeEvery(SEARCH_USER_REQUEST, searchUserSaga)]);
}
// selectors

export const stateSelector = state => state.authorUserList;

export const getUsersListSelector = createSelector(
  stateSelector,
  state => state.usersList
);

export const getFetchingSelector = createSelector(
  stateSelector,
  state => state.fetching
);
export const getSearchingSelector = createSelector(
  stateSelector,
  state => state.searching
);
export const getSearchResultSelector = createSelector(
  stateSelector,
  state => state.searchResult
);
