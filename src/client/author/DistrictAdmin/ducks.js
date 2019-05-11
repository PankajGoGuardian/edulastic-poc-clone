import { createAction, createReducer } from "redux-starter-kit";
import { createSelector } from "reselect";
import { takeEvery, call, put, all } from "redux-saga/effects";
import { userApi } from "@edulastic/api";
import { message } from "antd";

const RECEIVE_DISTRICTADMIN_REQUEST = "[districtadmin] receive data request";
const RECEIVE_DISTRICTADMIN_SUCCESS = "[districtadmin] receive data success";
const RECEIVE_DISTRICTADMIN_ERROR = "[districtadmin] receive data error";
const UPDATE_DISTRICTADMIN_REQUEST = "[districtadmin] update data request";
const UPDATE_DISTRICTADMIN_SUCCESS = "[districtadmin] update data success";
const UPDATE_DISTRICTADMIN_ERROR = "[districtadmin] update data error";
const CREATE_DISTRICTADMIN_REQUEST = "[districtadmin] create data request";
const CREATE_DISTRICTADMIN_SUCCESS = "[districtadmin] create data success";
const CREATE_DISTRICTADMIN_ERROR = "[districtadmin] create data error";
const DELETE_DISTRICTADMIN_REQUEST = "[districtadmin] delete data request";
const DELETE_DISTRICTADMIN_SUCCESS = "[districtadmin] delete data success";
const DELETE_DISTRICTADMIN_ERROR = "[districtadmin] delete data error";

const SET_DISTRICTADMIN_SEARCHNAME = "[districtadmin] set search name";
const SET_DISTRICTADMIN_SETFILTERS = "[districtadmin] set filters";

export const receiveDistrictAdminAction = createAction(RECEIVE_DISTRICTADMIN_REQUEST);
export const receiveDistrictAdminSuccessAction = createAction(RECEIVE_DISTRICTADMIN_SUCCESS);
export const receiveDistrictAdminErrorAction = createAction(RECEIVE_DISTRICTADMIN_ERROR);
export const updateDistrictAdminAction = createAction(UPDATE_DISTRICTADMIN_REQUEST);
export const updateDistrictAdminSuccessAction = createAction(UPDATE_DISTRICTADMIN_SUCCESS);
export const updateDistrictAdminErrorAction = createAction(UPDATE_DISTRICTADMIN_ERROR);
export const createDistrictAdminAction = createAction(CREATE_DISTRICTADMIN_REQUEST);
export const createDistrictAdminSuccessAction = createAction(CREATE_DISTRICTADMIN_SUCCESS);
export const createDistrictAdminErrorAction = createAction(CREATE_DISTRICTADMIN_ERROR);
export const deleteDistrictAdminAction = createAction(DELETE_DISTRICTADMIN_REQUEST);
export const deleteDistrictAdminSuccessAction = createAction(DELETE_DISTRICTADMIN_SUCCESS);
export const deleteDistrictAdminErrorAction = createAction(DELETE_DISTRICTADMIN_ERROR);

export const setSearchNameAction = createAction(SET_DISTRICTADMIN_SEARCHNAME);
export const setFiltersAction = createAction(SET_DISTRICTADMIN_SETFILTERS);

//selectors
const stateDistrictAdminSelector = state => state.districtAdminReducer;
export const getDistrictAdminSelector = createSelector(
  stateDistrictAdminSelector,
  state => {
    if (state.data.length > 0) {
      let searchByNameData = [];
      if (state.searchName.length > 0) {
        searchByNameData = state.data.filter(row => {
          let name = row.firstName + " " + row.lastName;
          if (name === state.searchName) return row;
        });
      } else {
        searchByNameData = state.data;
      }

      let possibleFilterKey = [];

      if (state.filtersColumn !== "") {
        possibleFilterKey.push(state.filtersColumn);
      } else {
        possibleFilterKey = ["firstName", "lastName", "email"];
      }

      const filterSource = searchByNameData.filter(row => {
        if (state.filtersText === "") {
          return row;
        } else {
          if (state.filtersValue === "equals") {
            const equalKeys = possibleFilterKey.filter(key => {
              if (row[key] === state.filtersText) return row;
            });
            if (equalKeys.length > 0) return row;
          } else if (state.filtersValue === "contains" || state.filtersValue === "") {
            const equalKeys = possibleFilterKey.filter(key => {
              if (row[key].toString().indexOf(state.filtersText) !== -1) return row;
            });
            if (equalKeys.length > 0) return row;
          }
        }
      });
      return filterSource;
    } else {
      return state.data;
    }
  }
);

// reducers
const initialState = {
  data: {},
  loading: false,
  error: null,
  update: {},
  updating: false,
  updateError: null,
  create: { _id: -1 },
  creating: false,
  createError: null,
  delete: null,
  deleting: false,
  deleteError: null,
  searchName: "",
  filtersColumn: "",
  filtersValue: "",
  filtersText: ""
};

export const reducer = createReducer(initialState, {
  [RECEIVE_DISTRICTADMIN_REQUEST]: state => {
    state.loading = true;
  },
  [RECEIVE_DISTRICTADMIN_SUCCESS]: (state, { payload }) => {
    const districtAdminData = [];
    payload.map((row, index) => {
      let districtAdmin = {};
      districtAdmin = row;
      districtAdmin.key = index;
      if (row.hasOwnProperty("_source")) {
        const source = row._source;
        Object.keys(source).map((key, value) => {
          districtAdmin[key] = source[key];
        });
      }
      delete districtAdmin._source;
      districtAdminData.push(districtAdmin);
    });

    state.loading = false;
    state.data = districtAdminData;
  },
  [RECEIVE_DISTRICTADMIN_ERROR]: (state, { payload }) => {
    state.loading = false;
    state.error = payload.error;
  },
  [UPDATE_DISTRICTADMIN_REQUEST]: state => {
    state.updating = true;
  },
  [UPDATE_DISTRICTADMIN_SUCCESS]: (state, { payload }) => {
    const districtAdminData = state.data.map(districtAdmin => {
      if (districtAdmin._id === payload._id) {
        const newData = {
          ...payload
        };
        return { ...districtAdmin, ...newData };
      } else return districtAdmin;
    });

    (state.update = payload), (state.updating = false), (state.data = districtAdminData);
  },
  [UPDATE_DISTRICTADMIN_ERROR]: (state, { payload }) => {
    state.updating = false;
    state.updateError = payload.error;
  },
  [CREATE_DISTRICTADMIN_REQUEST]: state => {
    state.creating = true;
  },
  [CREATE_DISTRICTADMIN_SUCCESS]: (state, { payload }) => {
    const createdDistrictAdmin = {
      key: state.data.length,
      _id: payload._id,
      firstName: payload.firstName,
      lastName: payload.lastName,
      role: payload.role,
      email: payload.email,
      institutionIds: payload.institutionIds
    };

    state.creating = false;
    state.create = createdDistrictAdmin;
    state.data = [createdDistrictAdmin, ...state.data];
  },
  [CREATE_DISTRICTADMIN_ERROR]: (state, { payload }) => {
    state.createError = payload.error;
    state.creating = false;
  },
  [DELETE_DISTRICTADMIN_REQUEST]: state => {
    state.deleting = true;
  },
  [DELETE_DISTRICTADMIN_SUCCESS]: (state, { payload }) => {
    (state.delete = payload),
      (state.deleting = false),
      (state.data = state.data.filter(districtAdmin => {
        let nMatchCount = 0;
        payload.map(row => {
          if (row.userId === districtAdmin._id) nMatchCount++;
        });
        if (nMatchCount == 0) return districtAdmin;
      }));
  },
  [DELETE_DISTRICTADMIN_ERROR]: (state, { payload }) => {
    state.deleting = false;
    state.deleteError = payload.error;
  },
  [SET_DISTRICTADMIN_SEARCHNAME]: (state, { payload }) => {
    state.searchName = payload;
  },
  [SET_DISTRICTADMIN_SETFILTERS]: (state, { payload }) => {
    state.filtersColumn = payload.column;
    state.filtersValue = payload.value;
    state.filtersText = payload.text;
  }
});

// sagas
function* receiveDistrictAdminSaga({ payload }) {
  try {
    const districtAdmin = yield call(userApi.fetchUsers, payload);
    yield put(receiveDistrictAdminSuccessAction(districtAdmin.data));
  } catch (err) {
    const errorMessage = "Receive DistrictAdmins is failing!";
    yield call(message.error, errorMessage);
    yield put(receiveDistrictAdminErrorAction({ error: errorMessage }));
  }
}

function* updateDistrictAdminSaga({ payload }) {
  try {
    const updateDistrictAdmin = yield call(userApi.updateUser, payload);
    yield put(updateDistrictAdminSuccessAction(updateDistrictAdmin));
  } catch (err) {
    const errorMessage = "Update DistrictAdmin is failing";
    yield call(message.error, errorMessage);
    yield put(updateDistrictAdminErrorAction({ error: errorMessage }));
  }
}

function* createDistrictAdminSaga({ payload }) {
  try {
    const createDistrictAdmin = yield call(userApi.createUser, payload);
    yield put(createDistrictAdminSuccessAction(createDistrictAdmin));
  } catch (err) {
    const errorMessage = "Create DistrictAdmin is failing";
    yield call(message.error, errorMessage);
    yield put(createDistrictAdminErrorAction({ error: errorMessage }));
  }
}

function* deleteDistrictAdminSaga({ payload }) {
  try {
    for (let i = 0; i < payload.length; i++) {
      yield call(userApi.deleteUser, payload[i]);
    }
    yield put(deleteDistrictAdminSuccessAction(payload));
  } catch (err) {
    const errorMessage = "Delete DistrictAdmin is failing";
    yield call(message.error, errorMessage);
    yield put(deleteDistrictAdminErrorAction({ deleteError: errorMessage }));
  }
}

export function* watcherSaga() {
  yield all([yield takeEvery(RECEIVE_DISTRICTADMIN_REQUEST, receiveDistrictAdminSaga)]);
  yield all([yield takeEvery(UPDATE_DISTRICTADMIN_REQUEST, updateDistrictAdminSaga)]);
  yield all([yield takeEvery(CREATE_DISTRICTADMIN_REQUEST, createDistrictAdminSaga)]);
  yield all([yield takeEvery(DELETE_DISTRICTADMIN_REQUEST, deleteDistrictAdminSaga)]);
}
