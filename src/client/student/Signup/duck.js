import { createAction, createReducer } from "redux-starter-kit";
import { takeLatest, call, put } from "redux-saga/effects";
import { schoolApi } from "@edulastic/api";
import { get } from "lodash";

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
    const result = yield call(schoolApi.createSchool, { body: payload });
    yield put(createSchoolSuccessAction(result));
  } catch (err) {
    console.error(err);
    yield put(createSchoolFailedAction());
  }
}

export function* watcherSaga() {
  yield takeLatest(SEARCH_SCHOOL_REQUEST, searchSchoolSaga);
  yield takeLatest(SEARCH_DISTRICTS_REQUEST, searchDistrictsSaga);
  yield takeLatest(CREATE_SCHOOL_REQUEST, createSchoolSaga);
}
