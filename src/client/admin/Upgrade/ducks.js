import { createSlice, createAction } from "redux-starter-kit";
import { createSelector } from "reselect";
import { combineReducers } from "redux";
import { put, takeEvery, call, all } from "redux-saga/effects";
import { adminApi } from "@edulastic/api";
import { message } from "antd";

// ACTIONS
const GET_DISTRICT_DATA = "[admin] GET_DISTRICT_DATA";
const UPGRADE_DISTRICT_SUBSCRIPTION = "[admin] UPGRADE_DISTRICT_SUBSCRIPTION";

// ACTION CREATORS
export const getDistrictDataAction = createAction(GET_DISTRICT_DATA);
export const upgradeDistrictSubscriptionAction = createAction(UPGRADE_DISTRICT_SUBSCRIPTION);

const districtSearchData = createSlice({
  slice: "districtSearchData", // slice is optional, and could be blank ''
  initialState: {},
  reducers: {
    success: (state, { payload }) => payload.data[0]
  }
});

// SELECTORS
const upGradeStateSelector = state => state.admin.upgradeData;

export const getDistrictData = createSelector(
  upGradeStateSelector,
  ({ districtSearchData: districtDataSelect }) => districtDataSelect
);

// REDUCERS
const reducer = combineReducers({
  districtSearchData: districtSearchData.reducer
});

// API's
const { searchUpdateDistrict: searchUpdateDistrictApi, upgradeDistrictApi } = adminApi;

// SAGAS
function* getDistrictDataGenerator({ payload }) {
  try {
    const item = yield call(searchUpdateDistrictApi, payload);
    yield put(districtSearchData.actions.success(item));
  } catch (err) {
    console.error(err);
  }
}

function* upgradeDistrictGenerator({ payload }) {
  try {
    const { result } = yield call(upgradeDistrictApi, payload);
    if (result.success) {
      message.success(result.message);
    }
  } catch (err) {
    console.error(err);
  }
}

function* watcherSaga() {
  yield all([
    yield takeEvery(GET_DISTRICT_DATA, getDistrictDataGenerator),
    yield takeEvery(UPGRADE_DISTRICT_SUBSCRIPTION, upgradeDistrictGenerator)
  ]);
}

export const sagas = [watcherSaga()];

export default reducer;
