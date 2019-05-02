import { createReducer, createAction } from "redux-starter-kit";
import { createSelector } from "reselect";
import { put, takeEvery, call } from "redux-saga/effects";
import { adminApi } from "@edulastic/api";

// CONSTANTS
export const CLEVER_TABLE_DATA = "[admin] CLEVER_TABLE_DATA";
export const UPDATE_CLEVER = "[admin] UPDATE_CLEVER";

export const TABLE_DATA_SUCCESS = "[admin] TABLE_DATA_SUCCESS";
export const CLEVER_ID_UPDATE_SUCCESS = "[admin] CLEVER_ID_UPDATE_SUCCESS";

// ACTION CREATORS
export const fetchTableData = createAction(CLEVER_TABLE_DATA);
export const updateClever = createAction(UPDATE_CLEVER);
export const cleverIdUpdateAction = createAction(CLEVER_ID_UPDATE_SUCCESS);
export const tableDataSuccessAction = createAction(TABLE_DATA_SUCCESS);

// REDUCERS
const initialState = [];

const setCleverIdSuccess = (state, { payload }) => {
  const recordIndex = state.findIndex(item => item._id === payload.data.district._id);
  state[recordIndex]._source.cleverId = payload.data.district.cleverId;
};

const tableDataReducer = createReducer(initialState, {
  [TABLE_DATA_SUCCESS]: (_, action) => action.payload.data,
  [CLEVER_ID_UPDATE_SUCCESS]: setCleverIdSuccess
});

// SELECTORS
const adminStateSelector = state => state.admin;

export const getTableData = createSelector(
  adminStateSelector,
  ({ tableData }) => tableData
);

// SAGAS
const { searchUpdateDistrict: searchUpdateDistrictApi, updateDistrictCleverId: updateDistrictCleverIdApi } = adminApi;

function* updateCleverRequest({ payload }) {
  try {
    const item = yield call(updateDistrictCleverIdApi, payload);
    if (!item.status) {
      yield put(cleverIdUpdateAction(item));
    }
  } catch (err) {
    console.error(err);
  }
}
function* fetchTableDataGenerator({ payload }) {
  try {
    const item = yield call(searchUpdateDistrictApi, payload);
    yield put(tableDataSuccessAction(item));
  } catch (err) {
    console.error(err);
  }
}

export function* updateCleverId() {
  yield takeEvery(UPDATE_CLEVER, updateCleverRequest);
}

export function* cleverTableData() {
  yield takeEvery(CLEVER_TABLE_DATA, fetchTableDataGenerator);
}

export const sagas = [cleverTableData(), updateCleverId()];

// ALWAYS EXPORT DEFAULT A REDUCER
export default tableDataReducer;
