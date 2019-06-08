import { createAction, createReducer, createSelector } from "redux-starter-kit";
import { get, pick } from "lodash";
import { message } from "antd";
import { takeLatest, call, put, select } from "redux-saga/effects";
import { schoolApi, userApi, settingsApi, TokenStorage } from "@edulastic/api";
import { signupSuccessAction } from "../Login/ducks";
import { push } from "connected-react-router";
import { getUser } from "../../author/src/selectors/user";
import produce from "immer";

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

const CREATE_AND_JOIN_SCHOOL_REQUEST = "[signup] create and join schoolrequest";

// Selectors

export const saveSubjectGradeloadingSelector = createSelector(
  ["signup.saveSubjectGradeloading"],
  subState => subState
);

export const updateUserWithSchoolLoadingSelector = createSelector(
  ["signup.updateUserWithSchoolLoading"],
  subState => subState
);

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

export const createAndJoinSchoolRequestAction = createAction(CREATE_AND_JOIN_SCHOOL_REQUEST);

// Reducers
const initialState = {
  isSearching: false,
  schools: [],
  districts: [],
  newSchool: {},
  saveSubjectGradeloading: false,
  updateUserWithSchoolLoading: false
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
  state.autocompleteDistricts = payload.map(item => ({
    title: item.districtName,
    key: item.districtId
  }));
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
  [CREATE_SCHOOL_SUCCESS]: createSchoolSuccess,
  [SAVE_SUBJECTGRADE_REQUEST]: (state, { payload }) => {
    state.saveSubjectGradeloading = true;
  },
  [SAVE_SUBJECTGRADE_FAILED]: (state, { payload }) => {
    state.saveSubjectGradeloading = false;
  },
  [JOIN_SCHOOL_REQUEST]: (state, { payload }) => {
    state.updateUserWithSchoolLoading = true;
  },
  [JOIN_SCHOOL_FAILED]: (state, { payload }) => {
    state.updateUserWithSchoolLoading = false;
  }
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

function* createAndJoinSchoolSaga({ payload = {} }) {
  const createSchoolPayload = payload.createSchool;
  const joinSchoolPayload = payload.joinSchool;
  let isCreateSchoolSuccessful = false;
  let result;
  try {
    result = yield call(schoolApi.createSchool, createSchoolPayload);
    yield put(createSchoolSuccessAction(result));
    isCreateSchoolSuccessful = true;
  } catch (err) {
    console.log("err", err);
    yield put(createSchoolFailedAction());
  }

  try {
    if (isCreateSchoolSuccessful) {
      joinSchoolPayload.data = {
        ...joinSchoolPayload.data,
        institutionIds: [result._id],
        districtId: result.districtId
      };
      const _result = yield call(userApi.updateUser, joinSchoolPayload);
      if (_result && _result.token) {
        TokenStorage.storeAccessToken(_result.token, _result._id, _result.role, true);
        TokenStorage.selectAccessToken(_result._id, _result.role);
      }
      const user = pick(_result, [
        "_id",
        "firstName",
        "lastName",
        "email",
        "role",
        "orgData",
        "features",
        "currentSignUpState"
      ]);
      yield put(signupSuccessAction(user));
    }
  } catch (err) {
    console.log("_err", err);
    yield call(message.error, JOIN_SCHOOL_FAILED);
  }
}

function* joinSchoolSaga({ payload = {} }) {
  try {
    const result = yield call(userApi.updateUser, payload);
    if (result && result.token) {
      TokenStorage.storeAccessToken(result.token, result._id, result.role, true);
      TokenStorage.selectAccessToken(result._id, result.role);
    }
    const user = pick(result, [
      "_id",
      "firstName",
      "lastName",
      "email",
      "role",
      "orgData",
      "features",
      "currentSignUpState"
    ]);
    yield put(signupSuccessAction(user));
  } catch (err) {
    yield put({
      type: JOIN_SCHOOL_FAILED,
      payload: {}
    });
    yield call(message.error, JOIN_SCHOOL_FAILED);
  }
}

function* saveSubjectGradeSaga({ payload }) {
  try {
    const result = yield call(settingsApi.saveInterestedStandards, payload) || {};
    yield call(message.success, SAVE_SUBJECTGRADE_SUCCESS);
    const user = yield select(getUser);
    const newUser = produce(user, draft => {
      if (!draft.orgData) {
        draft.orgData = {};
      }
      draft.orgData.interestedCurriculums = result ? result.curriculums : [];
      delete draft.currentSignUpState;
      return draft;
    });
    yield put(signupSuccessAction(newUser));
    yield put(push("/author/manageClass"));
  } catch (err) {
    yield put({
      type: SAVE_SUBJECTGRADE_FAILED,
      payload: {}
    });
    yield call(message.error, SAVE_SUBJECTGRADE_FAILED);
  }
}

export function* watcherSaga() {
  yield takeLatest(SEARCH_SCHOOL_REQUEST, searchSchoolSaga);
  yield takeLatest(SEARCH_DISTRICTS_REQUEST, searchDistrictsSaga);
  yield takeLatest(CREATE_SCHOOL_REQUEST, createSchoolSaga);
  yield takeLatest(JOIN_SCHOOL_REQUEST, joinSchoolSaga);
  yield takeLatest(SAVE_SUBJECTGRADE_REQUEST, saveSubjectGradeSaga);
  yield takeLatest(CREATE_AND_JOIN_SCHOOL_REQUEST, createAndJoinSchoolSaga);
}
