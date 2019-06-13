import { createAction, createReducer } from "redux-starter-kit";
import { createSelector } from "reselect";
import { takeEvery, call, put, all } from "redux-saga/effects";
import { groupApi, userApi } from "@edulastic/api";
import { message } from "antd";
import { keyBy } from "lodash";

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

export const receiveTeacherListAction = createAction(RECEIVE_TEACHERLIST_REQUEST);
export const receiveTeacherListSuccessAction = createAction(RECEIVE_TEACHERLIST_SUCCESS);
export const receiveTeacherListErrorAction = createAction(RECEIVE_TEACHERLIST_ERROR);

// selectors
const stateClassSelector = state => state.classesReducer;
export const getClassListSelector = createSelector(
  stateClassSelector,
  state => state.data
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
  teacherLoading: false,
  teacherList: {},
  teacherError: "",
  totalClassCount: 0
};

export const reducer = createReducer(initialState, {
  [RECEIVE_CLASSLIST_REQUEST]: state => {
    state.loading = true;
  },
  [RECEIVE_CLASSLIST_SUCCESS]: (state, { payload: { hits, total } }) => {
    state.loading = false;
    state.data = keyBy(hits, "_id");
    state.totalClassCount = total;
  },
  [RECEIVE_CLASSLIST_ERROR]: (state, { payload }) => {
    state.loading = false;
    state.error = payload.error;
  },
  [UPDATE_CLASS_REQUEST]: state => {
    state.updating = true;
  },
  [UPDATE_CLASS_SUCCESS]: (state, { payload }) => {
    state.update = payload;
    state.updating = false;
    const sourceObj = {
      _source: {
        ...payload
      }
    };
    state.data[payload._id] = {
      ...state.data[payload._id],
      ...sourceObj
    };
  },
  [UPDATE_CLASS_ERROR]: (state, { payload }) => {
    state.updating = false;
    state.updateError = payload.error;
  },
  [CREATE_CLASS_REQUEST]: state => {
    state.creating = true;
  },
  [CREATE_CLASS_SUCCESS]: (state, { payload }) => {
    // const createdStudent = { key: payload._id, ...payload };
    state.creating = false;
    state.create = payload;
    const createdStudent = {
      [payload._id]: payload
    };
    // here we use the spread operator for the created student, so that the created student
    // appears first in the list
    state.data = { ...createdStudent, ...state.data };
    // state.data[payload._id] = payload;
  },
  [CREATE_CLASS_ERROR]: (state, { payload }) => {
    state.createError = payload.error;
    state.creating = false;
  },
  [DELETE_CLASS_REQUEST]: state => {
    state.deleting = true;
  },
  [DELETE_CLASS_SUCCESS]: (state, { payload }) => {
    state.delete = payload;
    state.deleting = false;
  },
  [DELETE_CLASS_ERROR]: (state, { payload }) => {
    state.deleting = false;
    state.deleteError = payload.error;
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
    const hits = yield call(groupApi.getGroups, payload);
    yield put(receiveClassListSuccessAction(hits));
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
  } catch (err) {
    const errorMessage = "Update Class is failing";
    yield call(message.error, errorMessage);
    yield put(updateClassErrorAction({ error: errorMessage }));
  }
}

function* createClassSaga({ payload }) {
  try {
    const createClass = yield call(groupApi.createGroup, payload);
    yield put(createClassSuccessAction(createClass));
  } catch (err) {
    const errorMessage = "Create Class is failing";
    yield call(message.error, errorMessage);
    yield put(createClassErrorAction({ error: errorMessage }));
  }
}

function* deleteClassSaga({ payload }) {
  try {
    yield call(groupApi.deleteGroup, payload);
    yield put(deleteClassSuccessAction(payload));
    // here after the delete operation is a success,
    // the classes are fetched again to get the latest data
    yield put(
      receiveClassListAction({
        page: 1,
        limit: 25,
        search: {
          active: 1
        },
        districtId: payload.districtId
      })
    );
  } catch (err) {
    const errorMessage = "Delete Class is failing";
    yield call(message.error, errorMessage);
    yield put(deleteClassErrorAction({ deleteError: errorMessage }));
  }
}

function* receiveTeachersListSaga({ payload }) {
  try {
    const { result: teachersList } = yield call(userApi.fetchUsers, payload);
    yield put(receiveTeacherListSuccessAction(teachersList));
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
