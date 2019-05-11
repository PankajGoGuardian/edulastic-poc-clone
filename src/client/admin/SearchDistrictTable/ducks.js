import { createReducer, createAction } from "redux-starter-kit";
import { createSelector } from "reselect";
import { put, takeEvery, call, all } from "redux-saga/effects";
import { adminApi } from "@edulastic/api";
import { message } from "antd";

// CONSTANTS
export const CLEVER_TABLE_DATA = "[admin] CLEVER_TABLE_DATA";
export const UPDATE_CLEVER = "[admin] UPDATE_CLEVER";
export const DELETE_DISTRICT_ID = "[admin] DELETE_DISTRICT_ID";
export const GET_USERS_DATA = "[admin] GET_USERS_DATA";
export const SET_USERS_LOADING = "[admin] SET_USERS_LOADING";

export const TABLE_DATA_SUCCESS = "[admin] TABLE_DATA_SUCCESS";
export const CLEVER_ID_UPDATE_SUCCESS = "[admin] CLEVER_ID_UPDATE_SUCCESS";
export const DELETE_DISTRICT_ID_SUCCESS = "[admin] DELETE_DISTRICT_ID_SUCCESS";
export const GET_USERS_DATA_SUCCESS = "[admin] GET_USERS_DATA_SUCCESS";

// ACTION CREATORS
export const fetchTableData = createAction(CLEVER_TABLE_DATA);
export const updateClever = createAction(UPDATE_CLEVER);
export const deleteDistrictId = createAction(DELETE_DISTRICT_ID);
export const getUsersDataAction = createAction(GET_USERS_DATA);
export const setUsersLoadingAction = createAction(SET_USERS_LOADING);

export const cleverIdUpdateAction = createAction(CLEVER_ID_UPDATE_SUCCESS);
export const tableDataSuccessAction = createAction(TABLE_DATA_SUCCESS);
export const deleteDistrictIdSuccess = createAction(DELETE_DISTRICT_ID_SUCCESS);
export const getUsersDataSuccess = createAction(GET_USERS_DATA_SUCCESS);

// REDUCERS
const initialState = [];

const setCleverIdSuccess = (state, { payload }) => {
  const recordIndex = state.findIndex(item => item._id === payload.districtId);
  state[recordIndex]._source.cleverId = payload.cleverId;
};

const tableDataReducer = createReducer(initialState, {
  [TABLE_DATA_SUCCESS]: (_, action) => action.payload.data,
  [CLEVER_ID_UPDATE_SUCCESS]: setCleverIdSuccess,
  [DELETE_DISTRICT_ID_SUCCESS]: (state, { payload }) => {
    const recordIndex = state.findIndex(item => item._id === payload.districtId);
    state[recordIndex]._source.status = 0;
  },
  [GET_USERS_DATA_SUCCESS]: (state, { payload: { index, ...rest } }) => {
    state[index].users.data = rest;
    state[index].users.loading = false;
  },
  [SET_USERS_LOADING]: (state, { payload: index }) => {
    state[index].users = {
      loading: true
    };
  }
});

// SELECTORS
const adminStateSelector = state => state.admin;

export const getTableData = createSelector(
  adminStateSelector,
  ({ tableData }) => tableData
);

// SAGAS
const {
  searchUpdateDistrict: searchUpdateDistrictApi,
  updateDistrictCleverId: updateDistrictCleverIdApi,
  deleteDistrictApi,
  getUsersDataApi
} = adminApi;

function* updateCleverRequest({ payload }) {
  try {
    const item = yield call(updateDistrictCleverIdApi, payload);
    if (item.data.success) {
      yield put(cleverIdUpdateAction(item.data));
    } else {
      message.error(item.data.message, 5);
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

function* fetchDeleteDistrictIdRequest({ payload }) {
  try {
    const item = yield call(deleteDistrictApi, payload);
    if (item.data.success) {
      message.success(`${item.data.districtId} successfully deleted`);
      yield put(deleteDistrictIdSuccess(item.data));
    }
  } catch (err) {
    console.error(err);
  }
}

function* getUsersDataSaga({ payload: { districtId, index } }) {
  try {
    yield put(setUsersLoadingAction(index));
    const item = yield call(getUsersDataApi, districtId);
    yield put(getUsersDataSuccess({ ...item.data, index }));
  } catch (err) {
    console.error(err);
  }
}

export function* watcherSaga() {
  yield all([
    yield takeEvery(CLEVER_TABLE_DATA, fetchTableDataGenerator),
    yield takeEvery(UPDATE_CLEVER, updateCleverRequest),
    yield takeEvery(DELETE_DISTRICT_ID, fetchDeleteDistrictIdRequest),
    yield takeEvery(GET_USERS_DATA, getUsersDataSaga)
  ]);
}

export const sagas = [watcherSaga()];

// ALWAYS EXPORT DEFAULT A REDUCER
export default tableDataReducer;
