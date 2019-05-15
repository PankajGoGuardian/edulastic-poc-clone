import { createAction, createReducer } from "redux-starter-kit";
import { createSelector } from "reselect";
import { takeEvery, call, put, all } from "redux-saga/effects";
import { schoolApi } from "@edulastic/api";
import { message } from "antd";
import { get } from "lodash";

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

const SET_SCHOOLSACTION_STATUS_ACTION = "[school] set action status";

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

export const setSchoolActionStatusAction = createAction(SET_SCHOOLSACTION_STATUS_ACTION);

//selectors
const stateSchoolsSelector = state => state.schoolsReducer;
export const getSchoolsSelector = createSelector(
  stateSchoolsSelector,
  state => {
    return state.data;
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
  selectedAction: "",
  totalSchoolCount: 0
};

export const reducer = createReducer(initialState, {
  [RECEIVE_SCHOOLS_REQUEST]: state => {
    state.loading = true;
  },
  [RECEIVE_SCHOOLS_SUCCESS]: (state, { payload }) => {
    const schoolsData = [];
    payload.data.map(row => {
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
      school.key = school._id;
      school.city = get(school, "city", "");
      if (school.city == null) school.city = "";
      school.state = get(school, "state", "");
      if (school.state == null) school.state = "";
      school.zip = get(school, "zip", "");
      if (school.zip == null) school.zip = "";
      school.country = get(school, "country", "");
      if (school.country == null) school.country = "";
      school.teachersCount = get(school, "teachersCount", 0);
      school.studentsCount = get(school, "studentsCount", 0);
      school.sectionsCount = get(school, "sectionsCount", 0);
      school.status = get(school, ["status"], 1);
      school.address = get(school, "address", "");
      if (school.address == null) school.address = "";
      schoolsData.push(school);
    });

    state.loading = false;
    state.data = schoolsData;
    state.totalSchoolCount = payload.totalSchools;
  },

  [RECEIVE_SCHOOLS_ERROR]: (state, { payload }) => {
    state.loading = false;
    state.error = payload.error;
  },
  [UPDATE_SCHOOLS_REQUEST]: state => {
    state.updating = true;
  },
  [UPDATE_SCHOOLS_SUCCESS]: (state, { payload }) => {
    const schoolsData = state.data.map(school => {
      if (school._id === payload._id) {
        const newData = {
          name: payload.name,
          ...payload.location
        };
        return { ...school, ...newData };
      } else return school;
    });

    state.update = payload;
    state.updating = false;
    state.data = schoolsData;
    state.selectedAction = "";
  },
  [UPDATE_SCHOOLS_ERROR]: (state, { payload }) => {
    state.updating = false;
    state.updateError = payload.error;
    state.selectedAction = "";
  },
  [CREATE_SCHOOLS_REQUEST]: state => {
    state.creating = true;
  },
  [CREATE_SCHOOLS_SUCCESS]: (state, { payload }) => {
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

    state.creating = false;
    state.create = createdSchoolData;
    state.data = [createdSchoolData, ...state.data].slice(0, 25);
  },
  [CREATE_SCHOOLS_ERROR]: (state, { payload }) => {
    state.createError = payload.error;
    state.creating = false;
  },
  [DELETE_SCHOOLS_REQUEST]: state => {
    state.deleting = true;
  },
  [DELETE_SCHOOLS_SUCCESS]: (state, { payload }) => {
    state.delete = payload;
    state.deleting = false;
    state.data = state.data.filter(school => {
      let nMatchCount = 0;
      payload.map(row => {
        if (row.schoolId === school._id) nMatchCount++;
      });
      if (nMatchCount == 0) return school;
    });
    state.selectedAction = "";
  },
  [DELETE_SCHOOLS_ERROR]: (state, { payload }) => {
    state.deleting = false;
    state.deleteError = payload.error;
    state.selectedAction = "";
  }
});

// sagas
function* receiveSchoolsSaga({ payload }) {
  try {
    const schools = yield call(schoolApi.getSchools, payload);
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
  } catch (err) {
    const errorMessage = "Update School is failing";
    yield call(message.error, errorMessage);
    yield put(updateSchoolsErrorAction({ error: errorMessage }));
  }
}

function* createSchoolsSaga({ payload }) {
  try {
    const createSchool = yield call(schoolApi.createSchool, payload);
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
