import { createAction, createReducer } from "redux-starter-kit";
import { createSelector } from "reselect";
import { takeEvery, call, put, all } from "redux-saga/effects";
import { userApi } from "@edulastic/api";
import { message } from "antd";

const RECEIVE_SCHOOLADMIN_REQUEST = "[schooladmin] receive data request";
const RECEIVE_SCHOOLADMIN_SUCCESS = "[schooladmin] receive data success";
const RECEIVE_SCHOOLADMIN_ERROR = "[schooladmin] receive data error";
const UPDATE_SCHOOLADMIN_REQUEST = "[schooladmin] update data request";
const UPDATE_SCHOOLADMIN_SUCCESS = "[schooladmin] update data success";
const UPDATE_SCHOOLADMIN_ERROR = "[schooladmin] update data error";
const CREATE_SCHOOLADMIN_REQUEST = "[schooladmin] create data request";
const CREATE_SCHOOLADMIN_SUCCESS = "[schooladmin] create data success";
const CREATE_SCHOOLADMIN_ERROR = "[schooladmin] create data error";
const DELETE_SCHOOLADMIN_REQUEST = "[schooladmin] delete data request";
const DELETE_SCHOOLADMIN_SUCCESS = "[schooladmin] delete data success";
const DELETE_SCHOOLADMIN_ERROR = "[schooladmin] delete data error";

const SET_SCHOOLADMIN_SEARCHNAME = "[schooladmin] set search name";
const SET_SCHOOLADMIN_SETFILTERS = "[schooladmin] set filters";

export const receiveSchoolAdminAction = createAction(RECEIVE_SCHOOLADMIN_REQUEST);
export const receiveSchoolAdminSuccessAction = createAction(RECEIVE_SCHOOLADMIN_SUCCESS);
export const receiveSchoolAdminErrorAction = createAction(RECEIVE_SCHOOLADMIN_ERROR);
export const updateSchoolAdminAction = createAction(UPDATE_SCHOOLADMIN_REQUEST);
export const updateSchoolAdminSuccessAction = createAction(UPDATE_SCHOOLADMIN_SUCCESS);
export const updateSchoolAdminErrorAction = createAction(UPDATE_SCHOOLADMIN_ERROR);
export const createSchoolAdminAction = createAction(CREATE_SCHOOLADMIN_REQUEST);
export const createSchoolAdminSuccessAction = createAction(CREATE_SCHOOLADMIN_SUCCESS);
export const createSchoolAdminErrorAction = createAction(CREATE_SCHOOLADMIN_ERROR);
export const deleteSchoolAdminAction = createAction(DELETE_SCHOOLADMIN_REQUEST);
export const deleteSchoolAdminSuccessAction = createAction(DELETE_SCHOOLADMIN_SUCCESS);
export const deleteSchoolAdminErrorAction = createAction(DELETE_SCHOOLADMIN_ERROR);

export const setSearchNameAction = createAction(SET_SCHOOLADMIN_SEARCHNAME);
export const setFiltersAction = createAction(SET_SCHOOLADMIN_SETFILTERS);

//selectors
const stateSchoolAdminSelector = state => state.schoolAdminReducer;
export const getSchoolAdminSelector = createSelector(
  stateSchoolAdminSelector,
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
        possibleFilterKey = ["firstName", "lastName", "email", "school"];
      }

      const filterSource = searchByNameData.filter(row => {
        if (state.filtersText === "") {
          return row;
        } else {
          if (state.filtersValue === "equals") {
            const equalKeys = possibleFilterKey.filter(key => {
              if (key === "school") {
                if (row[key].length > 0) {
                  for (let i = 0; i < row[key].length; i++) {
                    if (row[key][i] === state.filtersText) return row;
                  }
                }
              } else {
                if (row[key] === state.filtersText) return row;
              }
            });
            if (equalKeys.length > 0) return row;
          } else if (state.filtersValue === "contains" || state.filtersValue === "") {
            const equalKeys = possibleFilterKey.filter(key => {
              if (key === "school") {
                if (row[key].length > 0) {
                  for (let i = 0; i < row[key].length; i++) {
                    if (row[key][i].indexOf(state.filtersText) !== -1) return row;
                  }
                }
              } else {
                if (row[key].toString().indexOf(state.filtersText) !== -1) return row;
              }
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
  data: [],
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
  [RECEIVE_SCHOOLADMIN_REQUEST]: state => {
    state.loading = true;
  },
  [RECEIVE_SCHOOLADMIN_SUCCESS]: (state, { payload }) => {
    const schoolAdminData = [];
    payload.map((row, index) => {
      let schoolAdmin = {};
      schoolAdmin = row;
      schoolAdmin.key = index;
      if (row.hasOwnProperty("_source")) {
        const source = row._source;
        Object.keys(source).map((key, value) => {
          schoolAdmin[key] = source[key];
        });
      }
      delete schoolAdmin._source;
      schoolAdminData.push(schoolAdmin);
    });

    state.loading = false;
    state.data = schoolAdminData;
  },
  [RECEIVE_SCHOOLADMIN_ERROR]: (state, { payload }) => {
    state.loading = false;
    state.error = payload.error;
  },
  [UPDATE_SCHOOLADMIN_REQUEST]: state => {
    state.updating = true;
  },
  [UPDATE_SCHOOLADMIN_SUCCESS]: (state, { payload }) => {
    const schoolAdminData = state.data.map(schoolAdmin => {
      if (schoolAdmin._id === payload._id) {
        const newData = {
          ...payload
        };
        return { ...schoolAdmin, ...newData };
      } else return schoolAdmin;
    });

    (state.update = payload), (state.updating = false), (state.data = schoolAdminData);
  },
  [UPDATE_SCHOOLADMIN_ERROR]: (state, { payload }) => {
    state.updating = false;
    state.updateError = payload.error;
  },
  [CREATE_SCHOOLADMIN_REQUEST]: state => {
    state.creating = true;
  },
  [CREATE_SCHOOLADMIN_SUCCESS]: (state, { payload }) => {
    const createdSchoolAdmin = {
      key: state.data.length,
      _id: payload._id,
      firstName: payload.firstName,
      lastName: payload.lastName,
      role: payload.role,
      email: payload.email,
      institutionIds: payload.institutionIds
    };

    state.creating = false;
    state.create = createdSchoolAdmin;
    state.data = [createdSchoolAdmin, ...state.data];
  },
  [CREATE_SCHOOLADMIN_ERROR]: (state, { payload }) => {
    state.createError = payload.error;
    state.creating = false;
  },
  [DELETE_SCHOOLADMIN_REQUEST]: state => {
    state.deleting = true;
  },
  [DELETE_SCHOOLADMIN_SUCCESS]: (state, { payload }) => {
    (state.delete = payload),
      (state.deleting = false),
      (state.data = state.data.filter(schoolAdmin => {
        let nMatchCount = 0;
        payload.map(row => {
          if (row.userId === schoolAdmin._id) nMatchCount++;
        });
        if (nMatchCount == 0) return schoolAdmin;
      }));
  },
  [DELETE_SCHOOLADMIN_ERROR]: (state, { payload }) => {
    state.deleting = false;
    state.deleteError = payload.error;
  },
  [SET_SCHOOLADMIN_SEARCHNAME]: (state, { payload }) => {
    state.searchName = payload;
  },
  [SET_SCHOOLADMIN_SETFILTERS]: (state, { payload }) => {
    state.filtersColumn = payload.column;
    state.filtersValue = payload.value;
    state.filtersText = payload.text;
  }
});

// sagas
function* receiveSchoolAdminSaga({ payload }) {
  try {
    const schoolAdmin = yield call(userApi.fetchUsers, payload);
    yield put(receiveSchoolAdminSuccessAction(schoolAdmin));
  } catch (err) {
    const errorMessage = "Receive SchoolAdmins is failing!";
    yield call(message.error, errorMessage);
    yield put(receiveSchoolAdminErrorAction({ error: errorMessage }));
  }
}

function* updateSchoolAdminSaga({ payload }) {
  try {
    const updateSchoolAdmin = yield call(userApi.updateUser, payload);
    message.success("School admin updated successfully");
    yield put(updateSchoolAdminSuccessAction(updateSchoolAdmin));
  } catch (err) {
    const errorMessage = "Update SchoolAdmin is failing";
    yield call(message.error, errorMessage);
    yield put(updateSchoolAdminErrorAction({ error: errorMessage }));
  }
}

function* createSchoolAdminSaga({ payload }) {
  try {
    const createSchoolAdmin = yield call(userApi.createUser, payload);
    yield put(createSchoolAdminSuccessAction(createSchoolAdmin));
  } catch (err) {
    const errorMessage = "Create SchoolAdmin is failing";
    yield call(message.error, errorMessage);
    yield put(createSchoolAdminErrorAction({ error: errorMessage }));
  }
}

function* deleteSchoolAdminSaga({ payload }) {
  try {
    for (let i = 0; i < payload.length; i++) {
      yield call(userApi.deleteUser, payload[i]);
    }
    message.success("School admin removed successfully");
    yield put(deleteSchoolAdminSuccessAction(payload));
  } catch (err) {
    const errorMessage = "Delete SchoolAdmin is failing";
    yield call(message.error, errorMessage);
    yield put(deleteSchoolAdminErrorAction({ deleteError: errorMessage }));
  }
}

export function* watcherSaga() {
  yield all([yield takeEvery(RECEIVE_SCHOOLADMIN_REQUEST, receiveSchoolAdminSaga)]);
  yield all([yield takeEvery(UPDATE_SCHOOLADMIN_REQUEST, updateSchoolAdminSaga)]);
  yield all([yield takeEvery(CREATE_SCHOOLADMIN_REQUEST, createSchoolAdminSaga)]);
  yield all([yield takeEvery(DELETE_SCHOOLADMIN_REQUEST, deleteSchoolAdminSaga)]);
}
