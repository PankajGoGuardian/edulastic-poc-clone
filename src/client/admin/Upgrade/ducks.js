import { createSlice, createAction } from "redux-starter-kit";
import { createSelector } from "reselect";
import { combineReducers } from "redux";
import { put, takeEvery, call, all } from "redux-saga/effects";
import { adminApi } from "@edulastic/api";
import { message } from "antd";

// ACTIONS
const GET_DISTRICT_DATA = "[admin-upgrade] GET_DISTRICT_DATA";
const UPGRADE_DISTRICT_SUBSCRIPTION = "[admin-upgrade] UPGRADE_DISTRICT_SUBSCRIPTION";
const UPGRADE_USER_SUBSCRIPTION = "[admin-upgrade] UPGRADE_USER_SUBSCRIPTION";
const SEARCH_USERS_BY_EMAIL_IDS = "[admin-upgrade] SEARCH_USERS_BY_EMAIL_IDS";

// ACTION CREATORS
export const getDistrictDataAction = createAction(GET_DISTRICT_DATA);
export const upgradeDistrictSubscriptionAction = createAction(UPGRADE_DISTRICT_SUBSCRIPTION);
export const upgradeUserSubscriptionAction = createAction(UPGRADE_USER_SUBSCRIPTION);
export const searchUsersByEmailIdAction = createAction(SEARCH_USERS_BY_EMAIL_IDS);

// SLICE's
const manageSubscriptionsBydistrict = createSlice({
  slice: "manageSubscriptionsBydistrict", // slice is optional, and could be blank ''
  initialState: {},
  reducers: {
    success: (state, { payload }) => payload.data[1]
  }
});

const manageSubscriptionsByUsers = createSlice({
  slice: "manageSubscriptionsByUsers", // slice is optional, and could be blank ''
  initialState: {
    validEmailIdsList: null,
    subscriptionData: {}
  },
  reducers: {
    success: (state, { payload }) => {
      state.subscriptionData = payload;
    },
    searchEmailIdsSuccess: (state, { payload }) => {
      state.validEmailIdsList = payload.data;
    }
  }
});

// SELECTORS
const upGradeStateSelector = state => state.admin.upgradeData;

export const getDistrictDataSelector = createSelector(
  upGradeStateSelector,
  ({ districtSearchData }) => districtSearchData
);

export const getUsersDataSelector = createSelector(
  upGradeStateSelector,
  ({ manageUsers }) => manageUsers
);

// REDUCERS
const reducer = combineReducers({
  districtSearchData: manageSubscriptionsBydistrict.reducer,
  manageUsers: manageSubscriptionsByUsers.reducer
});

// API's
const {
  searchUpdateDistrict: searchUpdateDistrictApi,
  manageSubscription: manageSubscriptionApi,
  searchUsersByEmailIds: searchUsersByEmailIdsApi
} = adminApi;

// SAGAS
function* getDistrictData({ payload }) {
  try {
    const item = yield call(searchUpdateDistrictApi, payload);
    yield put(manageSubscriptionsBydistrict.actions.success(item));
  } catch (err) {
    console.error(err);
  }
}

function* upgradeDistrict({ payload }) {
  try {
    const item = yield call(manageSubscriptionApi, payload);
    if (item.result.success) {
      message.success(item.result.message);
    }
  } catch (err) {
    console.error(err);
  }
}

function* upgradeUserData({ payload }) {
  try {
    const { result } = yield call(manageSubscriptionApi, payload);
    if (result.success) {
      message.success(result.message);
      yield put(manageSubscriptionsByUsers.actions.success(result.subscriptionResult));
    } else {
      message.error(result.message);
    }
  } catch (err) {
    console.error(err);
  }
}

function* searchUsersByEmailIds({ payload }) {
  try {
    const item = yield call(searchUsersByEmailIdsApi, payload);
    if (item.result) {
      yield put(manageSubscriptionsByUsers.actions.searchEmailIdsSuccess(item.result));
    }
  } catch (err) {
    console.error(err);
  }
}

function* watcherSaga() {
  yield all([
    yield takeEvery(GET_DISTRICT_DATA, getDistrictData),
    yield takeEvery(UPGRADE_DISTRICT_SUBSCRIPTION, upgradeDistrict),
    yield takeEvery(UPGRADE_USER_SUBSCRIPTION, upgradeUserData),
    yield takeEvery(SEARCH_USERS_BY_EMAIL_IDS, searchUsersByEmailIds)
  ]);
}

export const sagas = [watcherSaga()];

export default reducer;
