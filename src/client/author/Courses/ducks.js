import { createAction, createReducer } from "redux-starter-kit";
import { createSelector } from "reselect";
import { takeEvery, call, put, all } from "redux-saga/effects";
import { courseApi } from "@edulastic/api";
import { message } from "antd";

const RECEIVE_COURSE_REQUEST = "[course] receive data request";
const RECEIVE_COURSE_SUCCESS = "[course] receive data success";
const RECEIVE_COURSE_ERROR = "[course] receive data error";
const UPDATE_COURSE_REQUEST = "[course] update data request";
const UPDATE_COURSE_SUCCESS = "[course] update data success";
const UPDATE_COURSE_ERROR = "[course] update data error";
const CREATE_COURSE_REQUEST = "[course] create data request";
const CREATE_COURSE_SUCCESS = "[course] create data success";
const CREATE_COURSE_ERROR = "[course] create data error";
const DEACTIVATE_COURSE_REQUEST = "[course] deactivate data request";
const DEACTIVATE_COURSE_SUCCESS = "[course] deactivate data success";
const DEACTIVATE_COURSE_ERROR = "[course] deactivate data error";
const UPLOAD_COURSE_CSV_REQUEST = "[course] upload CSV request";
const UPLOAD_COURSE_CSV_SUCCESS = "[course] upload CSV success";
const UPLOAD_COURSE_CSV_ERROR = "[course] upload CSV error";

const SET_COURSE_SEARCHNAME = "[course] set search name";
const SET_COURSE_SETFILTERS = "[course] set filters";
const SET_COURSE_SHOWACTIVE = "[course] set show active";

export const receiveCourseListAction = createAction(RECEIVE_COURSE_REQUEST);
export const receiveCourseListSuccessAction = createAction(RECEIVE_COURSE_SUCCESS);
export const receiveCourseListErrorAction = createAction(RECEIVE_COURSE_ERROR);
export const updateCourseAction = createAction(UPDATE_COURSE_REQUEST);
export const updateCourseSuccessAction = createAction(UPDATE_COURSE_SUCCESS);
export const updateCourseErrorAction = createAction(UPDATE_COURSE_ERROR);
export const createCourseAction = createAction(CREATE_COURSE_REQUEST);
export const createCourseSuccessAction = createAction(CREATE_COURSE_SUCCESS);
export const createCourseErrorAction = createAction(CREATE_COURSE_ERROR);
export const deactivateCourseAction = createAction(DEACTIVATE_COURSE_REQUEST);
export const deactivateCourseSuccessAction = createAction(DEACTIVATE_COURSE_SUCCESS);
export const deactivateCourseErrorAction = createAction(DEACTIVATE_COURSE_ERROR);
export const uploadCSVAction = createAction(UPLOAD_COURSE_CSV_REQUEST);
export const uploadCSVSuccessAction = createAction(UPLOAD_COURSE_CSV_SUCCESS);
export const uploadCSVErrorAction = createAction(UPLOAD_COURSE_CSV_ERROR);

export const setSearchNameAction = createAction(SET_COURSE_SEARCHNAME);
export const setFiltersAction = createAction(SET_COURSE_SETFILTERS);
export const setShowActiveCourseAction = createAction(SET_COURSE_SHOWACTIVE);
//selectors
const stateCourseSelector = state => state.coursesReducer;
export const getCourseListSelector = createSelector(
  stateCourseSelector,
  state => {
    if (state.data.length > 0) {
      let courseList = [];
      if (state.showActiveCourse) courseList = state.data.filter(row => row.active == 1);
      else courseList = state.data;

      let searchByNameData = [];
      if (state.searchName.length > 0) {
        searchByNameData = courseList.filter(row => {
          if (row.name === state.searchName) return row;
        });
      } else {
        searchByNameData = courseList;
      }

      let possibleFilterKey = [];

      if (state.filtersColumn !== "") {
        possibleFilterKey.push(state.filtersColumn);
      } else {
        possibleFilterKey = ["name", "number"];
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
  uploadCSV: {},
  uploadingCSV: false,
  uploadCSVError: null,
  searchName: "",
  filtersColumn: "",
  filtersValue: "",
  filtersText: "",
  showActiveCourse: true
};

export const reducer = createReducer(initialState, {
  [RECEIVE_COURSE_REQUEST]: state => {
    state.loading = true;
  },
  [RECEIVE_COURSE_SUCCESS]: (state, { payload }) => {
    state.loading = false;
    payload.map((row, index) => {
      row.key = index;
    });
    state.data = payload;
  },
  [RECEIVE_COURSE_ERROR]: (state, { payload }) => {
    state.loading = false;
    state.error = payload.error;
  },
  [UPDATE_COURSE_REQUEST]: state => {
    state.updating = true;
  },
  [UPDATE_COURSE_SUCCESS]: (state, { payload }) => {
    const courseData = state.data.map(course => {
      if (course._id === payload._id) {
        const newData = {
          ...payload
        };
        return { ...course, ...newData };
      } else return course;
    });

    (state.update = payload), (state.updating = false), (state.data = courseData);
  },
  [UPDATE_COURSE_ERROR]: (state, { payload }) => {
    state.updating = false;
    state.updateError = payload.error;
  },
  [CREATE_COURSE_REQUEST]: state => {
    state.creating = true;
  },
  [CREATE_COURSE_SUCCESS]: (state, { payload }) => {
    state.creating = false;
    state.create = payload;
    payload.key = state.data.length;
    state.data = [payload, ...state.data];
  },
  [CREATE_COURSE_ERROR]: (state, { payload }) => {
    state.createError = payload.error;
    state.creating = false;
  },
  [DEACTIVATE_COURSE_REQUEST]: state => {
    state.deleting = true;
  },
  [DEACTIVATE_COURSE_SUCCESS]: (state, { payload }) => {
    state.delete = payload;
    state.deleting = false;
    state.data = state.data.filter(course => {
      let nMatchCount = 0;
      payload.map(row => {
        if (row.id === course._id) nMatchCount++;
      });
      if (nMatchCount == 0) return course;
    });
  },
  [DEACTIVATE_COURSE_ERROR]: (state, { payload }) => {
    state.deleting = false;
    state.deleteError = payload.error;
  },
  [UPLOAD_COURSE_CSV_REQUEST]: state => {
    state.uploadingCSV = true;
  },
  [UPLOAD_COURSE_CSV_SUCCESS]: (state, { payload }) => {
    state.uploadingCSV = false;
    state.uploadCSV = payload;
  },
  [UPLOAD_COURSE_CSV_ERROR]: (state, { payload }) => {
    state.uploadingCSV = false;
    state.uploadCSVError = payload.error;
  },
  [SET_COURSE_SEARCHNAME]: (state, { payload }) => {
    state.searchName = payload;
  },
  [SET_COURSE_SETFILTERS]: (state, { payload }) => {
    state.filtersColumn = payload.column;
    state.filtersValue = payload.value;
    state.filtersText = payload.text;
  },
  [SET_COURSE_SHOWACTIVE]: (state, { payload }) => {
    state.showActiveCourse = payload;
  }
});

// sagas
function* receiveCourseListSaga({ payload }) {
  try {
    const course = yield call(courseApi.fetchCourse, payload);
    const successMessage = "Receive Courses is successed!";
    yield call(message.success, successMessage);
    yield put(receiveCourseListSuccessAction(course));
  } catch (err) {
    const errorMessage = "Receive Course is failing!";
    yield call(message.error, errorMessage);
    yield put(receiveCourseListErrorAction({ error: errorMessage }));
  }
}

function* updateCourseSaga({ payload }) {
  try {
    const updateCourse = yield call(courseApi.editCourse, payload);
    yield put(updateCourseSuccessAction(updateCourse));
    const successMessage = "Update Course is successed!";
    yield call(message.success, successMessage);
  } catch (err) {
    const errorMessage = "Update Course is failing";
    yield call(message.error, errorMessage);
    yield put(updateCourseErrorAction({ error: errorMessage }));
  }
}

function* createCourseSaga({ payload }) {
  try {
    const saveCourse = yield call(courseApi.saveCourse, payload);
    const successMessage = "Save Course is successed!";
    yield call(message.success, successMessage);
    yield put(createCourseSuccessAction(saveCourse));
  } catch (err) {
    const errorMessage = "Create Course is failing";
    yield call(message.error, errorMessage);
    yield put(createCourseErrorAction({ error: errorMessage }));
  }
}

function* deactivateCourseSaga({ payload }) {
  try {
    yield call(courseApi.deactivateCourse, payload);
    const successMessage = "Deactivate Course Successfully!";
    yield call(message.success, successMessage);
    yield put(deactivateCourseSuccessAction(payload));
  } catch (err) {
    const errorMessage = "Deactivate course is failing";
    yield call(message.error, errorMessage);
    yield put(deactivateCourseErrorAction({ deleteError: errorMessage }));
  }
}
function* uploadCourseCSVSaga({ payload }) {
  try {
    const uploadCSV = yield call(courseApi.uploadcCSV, payload);
    const successMessage = "CSV Uploaded Successfully!";
    yield call(message.success, successMessage);
    yield put(uploadCSVSuccessAction(uploadCSV));
  } catch (err) {
    const errorMessage = "CSV uploading is failing";
    yield call(message.error, errorMessage);
    yield put(deactivateCourseErrorAction({ deleteError: errorMessage }));
  }
}

export function* watcherSaga() {
  yield all([yield takeEvery(RECEIVE_COURSE_REQUEST, receiveCourseListSaga)]);
  yield all([yield takeEvery(UPDATE_COURSE_REQUEST, updateCourseSaga)]);
  yield all([yield takeEvery(CREATE_COURSE_REQUEST, createCourseSaga)]);
  yield all([yield takeEvery(DEACTIVATE_COURSE_REQUEST, deactivateCourseSaga)]);
  yield all([yield takeEvery(UPLOAD_COURSE_CSV_REQUEST, uploadCourseCSVSaga)]);
}
