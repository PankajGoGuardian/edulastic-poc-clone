import { createAction, createReducer } from "redux-starter-kit";
import { get } from "lodash";
import { message } from "antd";
import { takeLatest, call, put } from "redux-saga/effects";
import { schoolApi, userApi, settingsApi } from "@edulastic/api";
import { signupSuccessAction } from "../Login/ducks";

// Types
const SEARCH_SCHOOL_REQUEST = "[signup] search school request";
const SEARCH_SCHOOL_SUCCESS = "[signup] search school success";
const SEARCH_SCHOOL_FAILED = "[signup] search school failed";

const SEARCH_DISTRICTS_REQUEST = "[signup] search districts request";
const SEARCH_DISTRICTS_SUCCESS = "[signup] search districts success";
const SEARCH_DISTRICTS_FAILED = "[signup] search districts failed";

const CREATE_SCHOOL_REQUEST = "[signup] create a school request";
const CREATE_SCHOOL_SUCCESS = "[signup] create a school success";
const CREATE_SCHOOL_FAILED = "[signup] create a school failed";

const JOIN_SCHOOL_REQUEST = "[signup] update with school request";
const JOIN_SCHOOL_FAILED = "[signup] update with school failed";

const SAVE_SUBJECTGRADE_REQUEST = "[signup] save with subject and grade request";
const SAVE_SUBJECTGRADE_SUCCESS = "[signup] save with subject and grade success";
const SAVE_SUBJECTGRADE_FAILED = "[signup] save with subject and grade failed";

// Actions
export const searchSchoolRequestAction = createAction(SEARCH_SCHOOL_REQUEST);
export const searchSchoolSuccessAction = createAction(SEARCH_SCHOOL_SUCCESS);
export const searchSchoolFailedAction = createAction(SEARCH_SCHOOL_FAILED);

export const searchDistrictsRequestAction = createAction(SEARCH_DISTRICTS_REQUEST);
export const searchDistrictsSuccessAction = createAction(SEARCH_DISTRICTS_SUCCESS);
export const searchDistrictsFailedAction = createAction(SEARCH_DISTRICTS_FAILED);

export const createSchoolRequestAction = createAction(CREATE_SCHOOL_REQUEST);
export const createSchoolSuccessAction = createAction(CREATE_SCHOOL_SUCCESS);
export const createSchoolFailedAction = createAction(CREATE_SCHOOL_FAILED);

export const joinSchoolRequestAction = createAction(JOIN_SCHOOL_REQUEST);

export const saveSubjectGradeAction = createAction(SAVE_SUBJECTGRADE_REQUEST);

// Reducers
const initialState = {
  isSearching: false,
  schools: [],
  districts: [],
  newSchool: {}
};

const searchSchool = state => {
  state.isSearching = true;
};

const receivedSchools = (state, { payload }) => {
  state.isSearching = false;
  state.schools = payload;
};

const failedSchools = state => {
  state.isSearching = false;
};

const searchDistricts = state => {
  state.isSearching = true;
};

const receivedDistricts = (state, { payload }) => {
  state.isSearching = false;
  state.districts = payload;
};

const failedDistricts = state => {
  state.isSearching = false;
};

const createSchoolSuccess = (state, { payload }) => {
  state.schools.push(payload);
  state.newSchool = payload;
};

export default createReducer(initialState, {
  [SEARCH_SCHOOL_REQUEST]: searchSchool,
  [SEARCH_SCHOOL_SUCCESS]: receivedSchools,
  [SEARCH_SCHOOL_FAILED]: failedSchools,
  [SEARCH_DISTRICTS_REQUEST]: searchDistricts,
  [SEARCH_DISTRICTS_SUCCESS]: receivedDistricts,
  [SEARCH_DISTRICTS_FAILED]: failedDistricts,
  [CREATE_SCHOOL_SUCCESS]: createSchoolSuccess
});

// Sagas
function* searchSchoolSaga({ payload = {} }) {
  try {
    const result = yield call(schoolApi.searchSchool, payload);
    yield put(searchSchoolSuccessAction(result));
  } catch (err) {
    console.error(err);
    yield put(searchSchoolFailedAction());
  }
}

function* searchDistrictsSaga({ payload = {} }) {
  try {
    const result = yield call(schoolApi.searchDistricts, payload);
    const districts = get(result, "data.result", []);
    yield put(searchDistrictsSuccessAction(districts));
  } catch (err) {
    console.error(err);
    yield put(searchDistrictsFailedAction());
  }
}

function* createSchoolSaga({ payload = {} }) {
  try {
    const result = yield call(schoolApi.createSchool, payload);
    yield put(createSchoolSuccessAction(result));
  } catch (err) {
    console.error(err);
    yield put(createSchoolFailedAction());
  }
}

function* joinSchoolSaga({ payload = {} }) {
  try {
    const result = yield call(userApi.updateUser, payload);
    yield put(signupSuccessAction(result));
  } catch (err) {
    yield call(message.error, JOIN_SCHOOL_FAILED);
  }
}

function* saveSubjectGradeSaga({ payload }) {
  try {
    const result = yield call(settingsApi.saveInterestedStandards, payload);
    yield call(message.success, SAVE_SUBJECTGRADE_SUCCESS);
    yield put(signupSuccessAction(result));
  } catch (err) {
    yield call(message.error, SAVE_SUBJECTGRADE_FAILED);
  }
}

export function* watcherSaga() {
  yield takeLatest(SEARCH_SCHOOL_REQUEST, searchSchoolSaga);
  yield takeLatest(SEARCH_DISTRICTS_REQUEST, searchDistrictsSaga);
  yield takeLatest(CREATE_SCHOOL_REQUEST, createSchoolSaga);
  yield takeLatest(JOIN_SCHOOL_REQUEST, joinSchoolSaga);
  yield takeLatest(SAVE_SUBJECTGRADE_REQUEST, saveSubjectGradeSaga);
}
