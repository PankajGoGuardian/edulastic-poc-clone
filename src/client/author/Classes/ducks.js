import { createAction, createReducer } from "redux-starter-kit";
import { createSelector } from "reselect";
import { takeEvery, call, put, all } from "redux-saga/effects";
import { groupApi, userApi } from "@edulastic/api";
import { message } from "antd";

const RECEIVE_CLASSLIST_REQUEST = "[class] receive list request";
const RECEIVE_CLASSLIST_SUCCESS = "[class] receive list success";
const RECEIVE_CLASSLIST_ERROR = "[class] receive list error";
const UPDATE_CLASS_REQUEST = "[class] update data request";
const UPDATE_CLASS_SUCCESS = "[class] update data success";
const UPDATE_CLASS_ERROR = "[class] update data error";
const CREATE_CLASS_REQUEST = "[class] create data request";
const CREATE_CLASS_SUCCESS = "[class] create data success";
const CREATE_CLASS_ERROR = "[class] create data error";
const DELETE_CLASS_REQUEST = "[class] delete data request";
const DELETE_CLASS_SUCCESS = "[class] delete data success";
const DELETE_CLASS_ERROR = "[class] delete data error";

const SET_CLASS_SEARCHNAME = "[class] set search name";
const SET_CLASS_SETFILTERS = "[class] set filters";

const RECEIVE_TEACHERLIST_REQUEST = "[teacher] receive data request";
const RECEIVE_TEACHERLIST_SUCCESS = "[teacher] receive data success";
const RECEIVE_TEACHERLIST_ERROR = "[teacher] receive data error";

export const receiveClassListAction = createAction(RECEIVE_CLASSLIST_REQUEST);
export const receiveClassListSuccessAction = createAction(RECEIVE_CLASSLIST_SUCCESS);
export const receiveClassListErrorAction = createAction(RECEIVE_CLASSLIST_ERROR);
export const updateClassAction = createAction(UPDATE_CLASS_REQUEST);
export const updateClassSuccessAction = createAction(UPDATE_CLASS_SUCCESS);
export const updateClassErrorAction = createAction(UPDATE_CLASS_ERROR);
export const createClassAction = createAction(CREATE_CLASS_REQUEST);
export const createClassSuccessAction = createAction(CREATE_CLASS_SUCCESS);
export const createClassErrorAction = createAction(CREATE_CLASS_ERROR);
export const deleteClassAction = createAction(DELETE_CLASS_REQUEST);
export const deleteClassSuccessAction = createAction(DELETE_CLASS_SUCCESS);
export const deleteClassErrorAction = createAction(DELETE_CLASS_ERROR);

export const setSearchNameAction = createAction(SET_CLASS_SEARCHNAME);
export const setFiltersAction = createAction(SET_CLASS_SETFILTERS);

export const receiveTeacherListAction = createAction(RECEIVE_TEACHERLIST_REQUEST);
export const receiveTeacherListSuccessAction = createAction(RECEIVE_TEACHERLIST_SUCCESS);
export const receiveTeacherListErrorAction = createAction(RECEIVE_TEACHERLIST_ERROR);

//selectors
const stateClassSelector = state => state.classesReducer;
export const getClassListSelector = createSelector(
  stateClassSelector,
  state => {
    if (state.data.length > 0) {
      let searchByNameData = [];
      if (state.searchName.length > 0) {
        searchByNameData = state.data.filter(row => row.name === state.searchName);
      } else {
        searchByNameData = state.data;
      }

      let possibleFilterKey = [];

      if (state.filtersColumn !== "") {
        possibleFilterKey.push(state.filtersColumn);
      } else {
        possibleFilterKey = ["name", "code", "teacherName"];
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
              if (row[key] !== undefined) {
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
  filtersText: "",
  teacherLoading: false,
  teacherList: {},
  teacherError: ""
};

export const reducer = createReducer(initialState, {
  [RECEIVE_CLASSLIST_REQUEST]: state => {
    state.loading = true;
  },
  [RECEIVE_CLASSLIST_SUCCESS]: (state, { payload }) => {
    const classList = [];
    for (let i = 0; i < payload.length; i++) {
      let classData = {};
      classData = payload[i];
      classData.key = i;
      if (classData.hasOwnProperty("_source")) {
        const source = classData._source;
        Object.keys(source).map((key, value) => {
          classData[key] = source[key];
        });
      }
      if (state.teacherList.length !== undefined) {
        const teacherData = state.teacherList.filter(item => item._id === classData._source.primaryTeacherId);
        if (teacherData.length > 0) classData.teacherName = teacherData[0].firstName + " " + teacherData[0].lastName;
        else classData.teacherName = "";
      } else {
        classData.teacherName = "";
      }

      delete classData._source;
      classList.push(classData);
    }

    state.loading = false;
    state.data = classList;
  },
  [RECEIVE_CLASSLIST_ERROR]: (state, { payload }) => {
    state.loading = false;
    state.error = payload.error;
  },
  [UPDATE_CLASS_REQUEST]: state => {
    state.updating = true;
  },
  [UPDATE_CLASS_SUCCESS]: (state, { payload }) => {
    const classList = state.data.map(classData => {
      if (classData._id === payload._id) {
        const newData = {
          ...payload
        };
        return { ...classData, ...newData };
      } else return classData;
    });

    (state.update = payload), (state.updating = false), (state.data = classList);
  },
  [UPDATE_CLASS_ERROR]: (state, { payload }) => {
    state.updating = false;
    state.updateError = payload.error;
  },
  [CREATE_CLASS_REQUEST]: state => {
    state.creating = true;
  },
  [CREATE_CLASS_SUCCESS]: (state, { payload }) => {
    const createdStudent = {
      key: state.data.length,
      _id: payload._id,
      firstName: payload.firstName,
      lastName: payload.lastName,
      role: payload.role,
      email: payload.email,
      institutionIds: payload.institutionIds
    };

    state.creating = false;
    state.create = createdStudent;
    state.data = [createdStudent, ...state.data];
  },
  [CREATE_CLASS_ERROR]: (state, { payload }) => {
    state.createError = payload.error;
    state.creating = false;
  },
  [DELETE_CLASS_REQUEST]: state => {
    state.deleting = true;
  },
  [DELETE_CLASS_SUCCESS]: (state, { payload }) => {
    (state.delete = payload),
      (state.deleting = false),
      (state.data = state.data.filter(classData => {
        let nMatchCount = 0;
        for (let i = 0; i < payload.length; i++) {
          if (payload[i].groupId === classData._id) nMatchCount++;
        }
        if (nMatchCount == 0) return classData;
      }));
  },
  [DELETE_CLASS_ERROR]: (state, { payload }) => {
    state.deleting = false;
    state.deleteError = payload.error;
  },
  [SET_CLASS_SEARCHNAME]: (state, { payload }) => {
    state.searchName = payload;
  },
  [SET_CLASS_SETFILTERS]: (state, { payload }) => {
    state.filtersColumn = payload.column;
    state.filtersValue = payload.value;
    state.filtersText = payload.text;
  },
  [RECEIVE_TEACHERLIST_REQUEST]: state => {
    state.teacherLoading = true;
  },
  [RECEIVE_TEACHERLIST_SUCCESS]: (state, { payload }) => {
    const teachersList = [];
    for (let i = 0; i < payload.length; i++) {
      let teacherData = {};
      teacherData = payload[i];
      teacherData.key = i;
      if (teacherData.hasOwnProperty("_source")) {
        const source = teacherData._source;
        Object.keys(source).map((key, value) => {
          teacherData[key] = source[key];
        });
      }
      delete teacherData._source;
      teachersList.push(teacherData);
    }

    if (state.data.length !== undefined) {
      const classList = [];
      state.data.map(classData => {
        const teacherData = teachersList.filter(item => item._id === classData.primaryTeacherId);
        if (teacherData.length > 0) classData.teacherName = teacherData[0].firstName + " " + teacherData[0].lastName;
        else classData.teacherName = "";
        classList.push(classData);
      });
      state.data = classList;
    }

    state.teacherLoading = false;
    state.teacherList = teachersList;
  },
  [RECEIVE_TEACHERLIST_ERROR]: (state, { payload }) => {
    state.teacherLoading = false;
    state.teacherError = payload.error;
  }
});

// sagas
function* receiveClassListSaga({ payload }) {
  try {
    const classList = yield call(groupApi.getGroups, payload);
    const successMessage = "Receive Classes is successed!";
    yield call(message.success, successMessage);
    yield put(receiveClassListSuccessAction(classList.data));
  } catch (err) {
    const errorMessage = "Receive Classes is failing!";
    yield call(message.error, errorMessage);
    yield put(receiveClassListErrorAction({ error: errorMessage }));
  }
}

function* updateClassSaga({ payload }) {
  try {
    const updateClassData = yield call(groupApi.editGroup, payload);
    yield put(updateClassSuccessAction(updateClassData));
    const successMessage = "Update Class is successed!";
    yield call(message.success, successMessage);
  } catch (err) {
    const errorMessage = "Update Class is failing";
    yield call(message.error, errorMessage);
    yield put(updateClassErrorAction({ error: errorMessage }));
  }
}

function* createClassSaga({ payload }) {
  try {
    const createClass = yield call(groupApi.createGroup, payload);
    const successMessage = "Create Class is successed!";
    yield call(message.success, successMessage);
    yield put(createClassSuccessAction(createClass));
  } catch (err) {
    const errorMessage = "Create Class is failing";
    yield call(message.error, errorMessage);
    yield put(createClassErrorAction({ error: errorMessage }));
  }
}

function* deleteClassSaga({ payload }) {
  try {
    for (let i = 0; i < payload.length; i++) {
      yield call(groupApi.deleteGroup, payload[i]);
    }
    const successMessage = "Class Deleted Successfully!";
    yield call(message.success, successMessage);
    yield put(deleteClassSuccessAction(payload));
  } catch (err) {
    const errorMessage = "Delete Class is failing";
    yield call(message.error, errorMessage);
    yield put(deleteClassErrorAction({ deleteError: errorMessage }));
  }
}

function* receiveTeachersListSaga({ payload }) {
  try {
    const teachersList = yield call(userApi.fetchUsers, payload);
    const successMessage = "Receive Teachers is successed!";
    yield call(message.success, successMessage);
    yield put(receiveTeacherListSuccessAction(teachersList.data));
  } catch (err) {
    const errorMessage = "Receive Teachers is failing!";
    yield call(message.error, errorMessage);
    yield put(receiveTeacherListErrorAction({ error: errorMessage }));
  }
}

export function* watcherSaga() {
  yield all([yield takeEvery(RECEIVE_CLASSLIST_REQUEST, receiveClassListSaga)]);
  yield all([yield takeEvery(UPDATE_CLASS_REQUEST, updateClassSaga)]);
  yield all([yield takeEvery(CREATE_CLASS_REQUEST, createClassSaga)]);
  yield all([yield takeEvery(DELETE_CLASS_REQUEST, deleteClassSaga)]);
  yield all([yield takeEvery(RECEIVE_TEACHERLIST_REQUEST, receiveTeachersListSaga)]);
}
