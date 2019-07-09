import { createAction, createReducer, createSelector } from "redux-starter-kit";
import { get, pick } from "lodash";
import { message } from "antd";
import { takeLatest, call, put, select } from "redux-saga/effects";
import { schoolApi, userApi, settingsApi, TokenStorage } from "@edulastic/api";
import { signupSuccessAction } from "../Login/ducks";
import { push } from "connected-react-router";
import { getUser } from "../../author/src/selectors/user";
import produce from "immer";

import { userPickFields } from "../../common/utils/static/user";

// Types
const SEARCH_SCHOOL_REQUEST = "[signup] search school request";
const SEARCH_SCHOOL_SUCCESS = "[signup] search school success";
const SEARCH_SCHOOL_FAILED = "[signup] search school failed";

const SEARCH_SCHOOL_BY_DISTRICT_REQUEST = "[signup] search school by district request";
const SEARCH_SCHOOL_BY_DISTRICT_SUCCESS = "[signup] search school by district success";
const SEARCH_SCHOOL_BY_DISTRICT_FAILED = "[signup] search school by district failed";

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

export const GET_DISTRICT_BY_SHORT_NAME_AND_ORG_TYPE_REQUEST =
  "[signup] get district by short name and org type request";
export const GET_DISTRICT_BY_SHORT_NAME_AND_ORG_TYPE_SUCCESS =
  "[signup] get district by short name and org type request success";
export const GET_PUBLIC_DISTRICT_POLICY_SUCCESS = "[signup] get public district policy request success";

const CHECK_DISTRICT_POLICY_REQUEST = "[signup] check district policy request";
const CHECK_DISTRICT_POLICY_SUCCESS = "[signup] check district policy success";
const CHECK_DISTRICT_POLICY_FAILED = "[signup] check district policy failed";

// Selectors
export const saveSubjectGradeloadingSelector = createSelector(
  ["signup.saveSubjectGradeloading"],
  subState => subState
);

export const updateUserWithSchoolLoadingSelector = createSelector(
  ["signup.updateUserWithSchoolLoading"],
  subState => subState
);

export const signupDistrictPolicySelector = createSelector(
  ["signup.districtPolicy"],
  subState => subState
);

export const signupGeneralSettingsSelector = createSelector(
  ["signup.generalSettings"],
  subState => subState
);

// Actions
export const searchSchoolRequestAction = createAction(SEARCH_SCHOOL_REQUEST);
export const searchSchoolSuccessAction = createAction(SEARCH_SCHOOL_SUCCESS);
export const searchSchoolFailedAction = createAction(SEARCH_SCHOOL_FAILED);

export const searchSchoolByDistrictRequestAction = createAction(SEARCH_SCHOOL_BY_DISTRICT_REQUEST);
export const searchSchoolByDistrictSuccessAction = createAction(SEARCH_SCHOOL_BY_DISTRICT_SUCCESS);
export const searchSchoolByDistrictFailedAction = createAction(SEARCH_SCHOOL_BY_DISTRICT_FAILED);

export const searchDistrictsRequestAction = createAction(SEARCH_DISTRICTS_REQUEST);
export const searchDistrictsSuccessAction = createAction(SEARCH_DISTRICTS_SUCCESS);
export const searchDistrictsFailedAction = createAction(SEARCH_DISTRICTS_FAILED);

export const createSchoolRequestAction = createAction(CREATE_SCHOOL_REQUEST);
export const createSchoolSuccessAction = createAction(CREATE_SCHOOL_SUCCESS);
export const createSchoolFailedAction = createAction(CREATE_SCHOOL_FAILED);

export const joinSchoolRequestAction = createAction(JOIN_SCHOOL_REQUEST);

export const saveSubjectGradeAction = createAction(SAVE_SUBJECTGRADE_REQUEST);

export const createAndJoinSchoolRequestAction = createAction(CREATE_AND_JOIN_SCHOOL_REQUEST);
export const getOrgDetailsByShortNameAndOrgTypeAction = createAction(GET_DISTRICT_BY_SHORT_NAME_AND_ORG_TYPE_REQUEST);

export const checkDistrictPolicyRequestAction = createAction(CHECK_DISTRICT_POLICY_REQUEST);
export const checkDistrictPolicySuccessAction = createAction(CHECK_DISTRICT_POLICY_SUCCESS);
export const checkDistrictPolicyFailedAction = createAction(CHECK_DISTRICT_POLICY_FAILED);

// Reducers
const initialState = {
  isSearching: false,
  schools: [],
  districts: [],
  newSchool: {},
  saveSubjectGradeloading: false,
  updateUserWithSchoolLoading: false,
  checkingPolicy: false,
  checkDistrictPolicy: true
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

const searchSchoolsByDistrict = state => {
  state.isSearching = true;
};

const receivedSchoolsByDistrict = (state, { payload }) => {
  state.isSearching = false;
  if (payload && payload.data) {
    state.schools = payload.data.map(item => {
      return {
        schoolId: item._id,
        schoolName: item._source.name,
        districtName: get(item, "_source.district.name", ""),
        districtId: item._source.districtId || get(item, "_source.district._id", ""),
        address: get(item, "_source.location", {})
      };
    });
  } else {
    state.schools = [];
  }
};

const failedSchoolsByDistrict = state => {
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
  payload = {
    ...payload,
    address: { ...payload.location },
    schoolName: payload.name,
    schoolId: payload._id,
    districtName: payload.district ? payload.district.name : ""
  };

  state.schools.push(payload);
  state.newSchool = payload;
};

export default createReducer(initialState, {
  [SEARCH_SCHOOL_REQUEST]: searchSchool,
  [SEARCH_SCHOOL_SUCCESS]: receivedSchools,
  [SEARCH_SCHOOL_FAILED]: failedSchools,
  [SEARCH_SCHOOL_BY_DISTRICT_REQUEST]: searchSchoolsByDistrict,
  [SEARCH_SCHOOL_BY_DISTRICT_SUCCESS]: receivedSchoolsByDistrict,
  [SEARCH_SCHOOL_BY_DISTRICT_FAILED]: failedSchoolsByDistrict,
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
  },
  [GET_DISTRICT_BY_SHORT_NAME_AND_ORG_TYPE_SUCCESS]: (state, { payload }) => {
    state.generalSettings = payload;
  },
  [GET_PUBLIC_DISTRICT_POLICY_SUCCESS]: (state, { payload }) => {
    state.districtPolicy = payload;
  },
  [CHECK_DISTRICT_POLICY_REQUEST]: (state, { payload }) => {
    state.checkingPolicy = true;
  },
  [CHECK_DISTRICT_POLICY_SUCCESS]: (state, { payload }) => {
    state.checkingPolicy = false;
    state.checkDistrictPolicy = payload;
  },
  [CHECK_DISTRICT_POLICY_FAILED]: (state, { payload }) => {
    state.checkingPolicy = false;
    state.checkDistrictPolicy = {};
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

function* searchSchoolByDistricySaga({ payload = {} }) {
  try {
    const result = yield call(schoolApi.getSchools, payload);
    yield put(searchSchoolByDistrictSuccessAction(result));
  } catch (err) {
    console.error(err);
    yield put(searchSchoolByDistrictFailedAction());
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
      const user = pick(_result, userPickFields);
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
    const user = pick(result, userPickFields);
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
  let isSaveSubjectGradeSuccessful = false;
  try {
    const result = yield call(settingsApi.saveInterestedStandards, payload) || {};
    yield call(message.success, SAVE_SUBJECTGRADE_SUCCESS);
    isSaveSubjectGradeSuccessful = true;

    const user = yield select(getUser);
    const newUser = produce(user, draft => {
      if (!draft.orgData) {
        draft.orgData = {};
      }
      draft.orgData.interestedCurriculums = result ? result.curriculums : [];
      delete draft.currentSignUpState;
      return draft;
    });
    // setting user in store to put orgData in store
    yield put(signupSuccessAction(newUser));
  } catch (err) {
    yield put({
      type: SAVE_SUBJECTGRADE_FAILED,
      payload: {}
    });
    yield call(message.error, SAVE_SUBJECTGRADE_FAILED);

    const errMsg = get(err, "data.message", "");
    if (errMsg === "Settings already exist") {
      isSaveSubjectGradeSuccessful = true;
    }
  }

  try {
    if (isSaveSubjectGradeSuccessful) {
      const user = yield select(getUser);
      const data = {
        email: user.email,
        districtId: user.orgData.districtId,
        currentSignUpState: "DONE",
        institutionIds: user.orgData.institutionIds
      };
      const _result = yield call(userApi.updateUser, { data, userId: user._id });
      const finalUser = {
        ..._result,
        features: user.features
      };
      // setting user in store to put updated currentSignupState in store
      yield put(signupSuccessAction(finalUser));
    }
  } catch (err) {
    console.log("_err", err);
    yield call(message.error, "Failed to update user please try again.");
  }
}

function* getOrgDetailsByShortNameAndOrgTypeSaga({ payload }) {
  try {
    const result = yield call(settingsApi.getOrgDetailsByShortNameAndOrgType, payload.data);
    const { generalSettings, districtPolicy } = result;
    if (generalSettings) {
      yield put({ type: GET_DISTRICT_BY_SHORT_NAME_AND_ORG_TYPE_SUCCESS, payload: generalSettings });
    } else {
      throw payload.error.message;
    }
    if (districtPolicy) {
      yield put({ type: GET_PUBLIC_DISTRICT_POLICY_SUCCESS, payload: districtPolicy });
    } else {
      throw payload.error.message;
    }
  } catch (e) {
    yield call(message.error, payload.error.message);
    yield put(push("/login"));
  }
}

function* checkDistrictPolicyRequestSaga({ payload }) {
  try {
    const result = yield call(userApi.validateDistrictPolicy, payload.data);
    yield put(checkDistrictPolicySuccessAction(result));
  } catch (e) {
    console.log("e", e);
    yield put(checkDistrictPolicyFailedAction());
    yield call(message.error, payload.error.message);
  }
}

export function* watcherSaga() {
  yield takeLatest(SEARCH_SCHOOL_REQUEST, searchSchoolSaga);
  yield takeLatest(SEARCH_SCHOOL_BY_DISTRICT_REQUEST, searchSchoolByDistricySaga);
  yield takeLatest(SEARCH_DISTRICTS_REQUEST, searchDistrictsSaga);
  yield takeLatest(CREATE_SCHOOL_REQUEST, createSchoolSaga);
  yield takeLatest(JOIN_SCHOOL_REQUEST, joinSchoolSaga);
  yield takeLatest(SAVE_SUBJECTGRADE_REQUEST, saveSubjectGradeSaga);
  yield takeLatest(CREATE_AND_JOIN_SCHOOL_REQUEST, createAndJoinSchoolSaga);
  yield takeLatest(GET_DISTRICT_BY_SHORT_NAME_AND_ORG_TYPE_REQUEST, getOrgDetailsByShortNameAndOrgTypeSaga);
  yield takeLatest(CHECK_DISTRICT_POLICY_REQUEST, checkDistrictPolicyRequestSaga);
}
