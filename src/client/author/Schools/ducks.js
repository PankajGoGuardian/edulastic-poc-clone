import { createAction, createReducer } from "redux-starter-kit";
import { createSelector } from "reselect";
import { takeEvery, call, put, all } from "redux-saga/effects";
import { schoolApi } from "@edulastic/api";
import { message } from "antd";

const RECEIVE_SCHOOLS_REQUEST = "[school] receive data request";
const RECEIVE_SCHOOLS_SUCCESS = "[school] receive data success";
const RECEIVE_SCHOOLS_ERROR = "[school] receive data error";
const UPDATE_SCHOOLS_REQUEST = "[school] update data request";
const UPDATE_SCHOOLS_SUCCESS = "[school] update data success";
const UPDATE_SCHOOLS_ERROR = "[school] update data error";
const CREATE_SCHOOLS_REQUEST = "[school] create data request";
const CREATE_SCHOOLS_SUCCESS = "[school] create data success";
const CREATE_SCHOOLS_ERROR = "[school] create data error";
const DELETE_SCHOOLS_REQUEST = "[school] delete data request";
const DELETE_SCHOOLS_SUCCESS = "[school] delete data success";
const DELETE_SCHOOLS_ERROR = "[school] delete data error";

export const receiveSchoolsAction = createAction(RECEIVE_SCHOOLS_REQUEST);
export const receiveSchoolsSuccessAction = createAction(RECEIVE_SCHOOLS_SUCCESS);
export const receiveSchoolsErrorAction = createAction(RECEIVE_SCHOOLS_ERROR);
export const updateSchoolsAction = createAction(UPDATE_SCHOOLS_REQUEST);
export const updateSchoolsSuccessAction = createAction(UPDATE_SCHOOLS_SUCCESS);
export const updateSchoolsErrorAction = createAction(UPDATE_SCHOOLS_ERROR);
export const createSchoolsAction = createAction(CREATE_SCHOOLS_REQUEST);
export const createSchoolsSuccessAction = createAction(CREATE_SCHOOLS_SUCCESS);
export const createSchoolsErrorAction = createAction(CREATE_SCHOOLS_ERROR);
export const deleteSchoolsAction = createAction(DELETE_SCHOOLS_REQUEST);
export const deleteSchoolsSuccessAction = createAction(DELETE_SCHOOLS_SUCCESS);
export const deleteSchoolsErrorAction = createAction(DELETE_SCHOOLS_ERROR);

//selectors
const stateSchoolsSelector = state => state.schoolsReducer;
export const getSchoolsSelector = createSelector(
  stateSchoolsSelector,
  state => state.data
);

export const getSchoolsLoadingSelector = createSelector(
  stateSchoolsSelector,
  state => state.loading
);

export const getUpdateSchoolSelector = createSelector(
  stateSchoolsSelector,
  state => state.update
);

export const getSchoolUpdatingSelector = createSelector(
  stateSchoolsSelector,
  state => state.updating
);

export const getCreatedSchoolSelector = createSelector(
  stateSchoolsSelector,
  state => state.create
);

export const getSchoolCreatingSelector = createSelector(
  stateSchoolsSelector,
  state => state.creating
);

export const getDeletedSchoolSelector = createSelector(
  stateSchoolsSelector,
  state => state.delete
);

export const getSchoolDeletingSelector = createSelector(
  stateSchoolsSelector,
  state => state.deleting
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
  deleteError: null
};

const receiveSchoolsRequest = state => ({
  ...state,
  loading: true
});

const receiveSchoolsSuccess = (state, { payload }) => {
  const schoolsData = [];
  payload.map(row => {
    let school = {};
    school = row;

    school["districtId"] = row._source.districtId;
    school.name = row._source.name;

    if (row._source.hasOwnProperty("location")) {
      const location = row._source.location;
      Object.keys(location).map((key, value) => {
        school[key] = location[key];
      });
    }
    delete school._source;
    schoolsData.push(school);
  });

  return {
    ...state,
    loading: false,
    data: schoolsData
  };
};

const receiveSchoolsError = (state, { payload }) => ({
  ...state,
  loading: false,
  error: payload.error
});

const updateSchoolRequest = state => ({
  ...state,
  updating: true
});

const updateSchoolSuccess = (state, { payload }) => {
  const schoolsData = state.data.map(school => {
    if (school._id === payload._id) {
      const newData = {
        name: payload.name,
        ...payload.location
      };
      return { ...school, ...newData };
    } else return school;
  });

  return {
    ...state,
    update: payload,
    updating: false,
    data: schoolsData
  };
};

const updateSchoolError = (state, { payload }) => ({
  ...state,
  updateError: payload.error,
  updating: false
});

const createSchoolRequest = state => ({
  ...state,
  creating: true
});

const createSchoolSuccess = (state, { payload }) => {
  const createdSchoolData = {
    _id: payload._id,
    name: payload.name,
    districtId: payload.districtId,
    address: payload.location.address,
    city: payload.location.city,
    state: payload.location.state,
    country: payload.location.country,
    zip: payload.location.zip,
    teachersCount: 0,
    studentsCount: 0,
    sectionsCount: 0
  };

  return {
    ...state,
    creating: false,
    create: createdSchoolData,
    data: [createdSchoolData, ...state.data]
  };
};

const createSchoolError = (state, { payload }) => ({
  ...state,
  createError: payload.error,
  creating: false
});

const deleteSchoolRequest = state => ({
  ...state,
  deleting: true
});

const deleteSchoolSuccess = (state, { payload }) => ({
  ...state,
  delete: payload,
  deleting: false,
  data: state.data.filter(school => {
    let nMatchCount = 0;
    payload.map(row => {
      if (row.schoolId === school._id) nMatchCount++;
    });
    if (nMatchCount == 0) return school;
  })
});

const deleteSchoolError = (state, { payload }) => ({
  ...state,
  deleteError: payload.error,
  deleting: false
});

export const reducer = createReducer(initialState, {
  [RECEIVE_SCHOOLS_REQUEST]: receiveSchoolsRequest,
  [RECEIVE_SCHOOLS_SUCCESS]: receiveSchoolsSuccess,
  [RECEIVE_SCHOOLS_ERROR]: receiveSchoolsError,
  [UPDATE_SCHOOLS_REQUEST]: updateSchoolRequest,
  [UPDATE_SCHOOLS_SUCCESS]: updateSchoolSuccess,
  [UPDATE_SCHOOLS_ERROR]: updateSchoolError,
  [CREATE_SCHOOLS_REQUEST]: createSchoolRequest,
  [CREATE_SCHOOLS_SUCCESS]: createSchoolSuccess,
  [CREATE_SCHOOLS_ERROR]: createSchoolError,
  [DELETE_SCHOOLS_REQUEST]: deleteSchoolRequest,
  [DELETE_SCHOOLS_SUCCESS]: deleteSchoolSuccess,
  [DELETE_SCHOOLS_ERROR]: deleteSchoolError
});

// sagas
function* receiveSchoolsSaga({ payload }) {
  try {
    const schools = yield call(schoolApi.getSchools, payload);
    const successMessage = "Receive Schools is successed!";
    yield call(message.success, successMessage);
    yield put(receiveSchoolsSuccessAction(schools));
  } catch (err) {
    const errorMessage = "Receive Schools is failing!";
    yield call(message.error, errorMessage);
    yield put(receiveSchoolsErrorAction({ error: errorMessage }));
  }
}

function* updateSchoolsSaga({ payload }) {
  try {
    const updateSchool = yield call(schoolApi.updateSchool, payload);
    yield put(updateSchoolsSuccessAction(updateSchool));
    const successMessage = "Update School is successed!";
    yield call(message.success, successMessage);
  } catch (err) {
    const errorMessage = "Update School is failing";
    yield call(message.error, errorMessage);
    yield put(updateSchoolsErrorAction({ error: errorMessage }));
  }
}

function* createSchoolsSaga({ payload }) {
  try {
    const createSchool = yield call(schoolApi.createSchool, payload);
    const successMessage = "Create School is successed!";
    yield call(message.success, successMessage);
    yield put(createSchoolsSuccessAction(createSchool));
  } catch (err) {
    const errorMessage = "Create School is failing";
    yield call(message.error, errorMessage);
    yield put(createSchoolsErrorAction({ error: errorMessage }));
  }
}

function* deleteSchoolsSaga({ payload }) {
  try {
    for (let i = 0; i < payload.length; i++) {
      yield call(schoolApi.deleteSchool, payload[i]);
    }
    const successMessage = "School Deleted Successfully!";
    yield call(message.success, successMessage);
    yield put(deleteSchoolsSuccessAction(payload));
  } catch (err) {
    const errorMessage = "Delete School is failing";
    yield call(message.error, errorMessage);
    yield put(deleteSchoolsErrorAction({ deleteError: errorMessage }));
  }
}

export function* watcherSaga() {
  yield all([yield takeEvery(RECEIVE_SCHOOLS_REQUEST, receiveSchoolsSaga)]);
  yield all([yield takeEvery(UPDATE_SCHOOLS_REQUEST, updateSchoolsSaga)]);
  yield all([yield takeEvery(CREATE_SCHOOLS_REQUEST, createSchoolsSaga)]);
  yield all([yield takeEvery(DELETE_SCHOOLS_REQUEST, deleteSchoolsSaga)]);
}
