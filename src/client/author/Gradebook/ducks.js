import { message } from "antd";
import { createSlice } from "redux-starter-kit";
import { takeLatest, call, put, select } from "redux-saga/effects";
import { reportsApi, assignmentApi } from "@edulastic/api";

// imported selectors
import { getUserOrgData } from "../src/selectors/user";
import selectsData from "../TestPage/components/common/selectsData";

// transformers & constants
import { getUniqAssessments, STATUS_LIST } from "./transformers";

// slice
const slice = createSlice({
  name: "gradebook",
  initialState: {
    filtersData: {
      assessments: [],
      statusList: [],
      classes: [],
      grades: [],
      subjects: [],
      terms: [],
      testTypes: [],
      groups: []
    },
    loadingFilters: false,
    performanceData: {},
    loadingPerformanceData: false,
    selectedFilters: {
      assessmentIds: [],
      status: "",
      classIds: [],
      grades: [],
      subjects: [],
      termId: "",
      testType: "",
      groupId: ""
    },
    pageDetail: {
      studentPage: 1,
      studentPageSize: 50,
      assignmentPage: 1,
      assignmentPageSize: 10
    },
    countFlag: true
  },
  reducers: {
    fetchStudentPerformanceRequest: state => {
      state.loading = true;
    },
    fetchStudentPerformanceCompleted: (state, { payload }) => {
      state.performanceData = payload;
      state.loadingPerformanceData = false;
    },
    fetchGradebookFiltersRequest: state => {
      state.loadingFilters = true;
    },
    fetchGradebookFiltersCompleted: (state, { payload }) => {
      state.filtersData = payload;
      state.loadingFilters = false;
    },
    setSelectedFilters: (state, { payload }) => {
      state.selectedFilters = payload;
    },
    setPageDetail: (state, { payload }) => {
      state.pageDetail = payload;
    },
    setCountFlag: (state, { payload }) => {
      state.countFlag = payload;
    }
  }
});

// actions & reducer
export const { actions, reducer } = slice;

// sagas
function* fetchStudentPerformanceSaga({ payload }) {
  try {
    const { filters, pageDetail, countFlag } = payload;
    const { assessmentIds, status, classIds, grades, subjects, termId, testType, groupId } = filters;
    const response = yield call(reportsApi.fetchStudentPerformance, {
      assessmentIds: assessmentIds.join(","),
      // status, // TODO: fix this after confirmation on PRD
      classIds: classIds.join(","),
      grades: grades.join(","),
      subjects: subjects.join(","),
      termId,
      testType,
      groupId,
      ...pageDetail,
      countFlag
    });
    yield put(actions.fetchStudentPerformanceCompleted(response));
  } catch (e) {
    yield put(actions.fetchStudentPerformanceCompleted({}));
    yield call(message.error, "Failed to fetch student performance for gradebook");
  }
}

function* fetchGradebookFiltersSaga() {
  try {
    const { classList = [], terms = [] } = yield select(getUserOrgData);
    const { allGrades, allSubjects, testTypes: tTypes } = selectsData;
    // assessments
    const { assignments } = yield call(assignmentApi.fetchTeacherAssignments, { filters: {} });
    const assessments = getUniqAssessments(assignments);
    // classes & groups
    const classes = [],
      groups = [];
    classList
      .filter(c => c.active === 1)
      .forEach(c => {
        c.id = c._id;
        c.type === "class" ? classes.push(c) : groups.push(c);
      });
    // terms
    const termList = [{ id: "", name: "All" }, ...terms.map(t => ({ ...t, id: t._id }))];
    // grades
    const grades = allGrades.map(({ value, text }) => ({ id: value, name: text }));
    // subjects
    const subjects = allSubjects.filter(s => s.value).map(({ value, text }) => ({ id: value, name: text }));
    // testTypes
    const testTypes = tTypes.map(({ value, text }) => ({ id: value, name: text }));
    // status
    const statusList = [{ id: "", name: "All" }, ...STATUS_LIST];
    // set filters data
    const filtersData = { assessments, classes, groups, terms: termList, grades, subjects, testTypes, statusList };
    yield put(actions.fetchGradebookFiltersCompleted(filtersData));
  } catch (e) {
    yield put(actions.fetchGradebookFiltersCompleted({}));
    yield call(message.error, "Failed to fetch filters data for gradebook");
  }
}

export function* watcherSaga() {
  yield takeLatest(actions.fetchStudentPerformanceRequest, fetchStudentPerformanceSaga);
  yield takeLatest(actions.fetchGradebookFiltersRequest, fetchGradebookFiltersSaga);
}

// selectors
export const selectors = {
  loading: state => state?.gradebookReducer?.loadingPerformanceData,
  loadingFilters: state => state?.gradebookReducer?.loadingFilters,
  filtersData: state => state?.gradebookReducer?.filtersData,
  gradebookData: state => state?.gradebookReducer?.performanceData,
  selectedFilters: state => state?.gradebookReducer?.selectedFilters,
  pageDetail: state => state?.gradebookReducer?.pageDetail,
  countFlag: state => state?.gradebookReducer?.countFlag
};
