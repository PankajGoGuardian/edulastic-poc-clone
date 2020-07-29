import { createReducer, createAction, createSelector as createSelectorator } from "redux-starter-kit";
import { takeLatest, put, call, all, select } from "redux-saga/effects";
import { values, groupBy, get, partial } from "lodash";
import { normalize } from "normalizr";
import { createSelector } from "reselect";
import { assignmentApi, reportsApi, testsApi } from "@edulastic/api";
import { notification } from "@edulastic/common";
import { push } from "connected-react-router";
import { getCurrentGroup, getClassIds } from "../student/Reports/ducks";
import { getUserId } from "../student/Login/ducks";
import { transformAssignmentForRedirect } from "../student/Assignments/ducks";
import { assignmentSchema } from "../student/sharedDucks/AssignmentModule/ducks";

import { reportSchema } from "../student/sharedDucks/ReportsModule/ducks";

const FETCH_PUBLIC_TEST = "[test] fetch publicly shared test";
const FETCH_PUBLIC_TEST_SUCCESS = "[test] success fetch publicly shared test";
const FETCH_PUBLIC_TEST_FAILURE = "[test] failed fetch publicly shared test ";
const FETCH_ASSIGNMENTS_DATA_BY_TEST = "[studentAssignments] fetch assignments by test";
const FETCH_ASSIGNMENTS_DATA_BY_TEST_SUCCESS = "[studentAssignments] fetch assignments by test success";

export const fetchTestAction = createAction(FETCH_PUBLIC_TEST);
export const fetchAssignmentsByTestAction = createAction(FETCH_ASSIGNMENTS_DATA_BY_TEST);

// selector
const getCurrentUserId = createSelectorator(["user.user._id"], r => r);
const reportsSelector = state => get(state, "publicTest.assignments.reportsObj", {});
export const assignmentsSelector = state => get(state, "publicTest.assignments.assignmentObj", {});

// create separate assignment for each class belongs to current student
export const getAllAssignmentsSelector = createSelector(
  assignmentsSelector,
  reportsSelector,
  getCurrentGroup,
  getClassIds,
  getUserId,
  (assignmentsObj, reportsObj, currentGroup, classIds, currentUserId) => {
    const groupedReports = groupBy(values(reportsObj), item => `${item.assignmentId}_${item.groupId}`);
    const assignments = values(assignmentsObj).flatMap(assignment => {
      // no redirected classes and no class filter or class ID match the filter and student belongs to the class
      /**
       * And also if assigned to specific students
       * (or when students added later to assignment),
       * then check for whether the current userId exists
       * in the students array of the class
       */
      const allClassess = assignment.class.filter(
        clazz =>
          clazz.redirect !== true &&
          (!currentGroup || currentGroup === clazz._id) &&
          ((classIds.includes(clazz._id) && !clazz.specificStudents) ||
            (clazz.specificStudents && clazz.students.includes(currentUserId)))
      );
      return allClassess.map(clazz => ({
        ...assignment,
        classId: clazz._id,
        reports: groupedReports[`${assignment._id}_${clazz._id}`] || [],
        ...(clazz.allowedTime && !assignment.redir ? { allowedTime: clazz.allowedTime } : {}),
        ...(clazz.pauseAllowed !== undefined && !assignment.redir ? { pauseAllowed: clazz.pauseAllowed } : {})
      }));
    });
    return assignments;
  }
);

const initialState = {
  loading: false
};

// reducers
export const publicTestReducer = createReducer(initialState, {
  [FETCH_PUBLIC_TEST]: state => {
    state.loading = true;
  },
  [FETCH_PUBLIC_TEST_SUCCESS]: (state, { payload }) => {
    state.loading = false;
    state.test = payload.test;
  },
  [FETCH_PUBLIC_TEST_FAILURE]: state => {
    state.loading = false;
    state.error = true;
  },
  [FETCH_ASSIGNMENTS_DATA_BY_TEST]: state => {
    state.loadingAssignments = true;
  },
  [FETCH_ASSIGNMENTS_DATA_BY_TEST_SUCCESS]: (state, { payload }) => {
    state.assignments = payload;
    state.loadingAssignments = false;
  }
});

// sagas
function* fetchPublicTest({ payload }) {
  const { testId, ...params } = payload;
  try {
    const test = yield call(testsApi.getPublicTest, testId, params);
    yield put({ type: FETCH_PUBLIC_TEST_SUCCESS, payload: { test } });
  } catch (err) {
    yield put({ type: FETCH_PUBLIC_TEST_FAILURE, payload: err });
  }
}

// fetch all assignments for specific test assigned to a student
function* fetchAssignmentsByTest({ payload }) {
  try {
    const { testId } = payload;
    const groupId = yield select(getCurrentGroup);
    const userId = yield select(getCurrentUserId);
    const classIds = yield select(getClassIds);
    const [assignments, reports] = yield all([
      call(assignmentApi.fetchAssigned, groupId, testId),
      call(reportsApi.fetchReports, groupId, testId)
    ]);

    // transform to handle redirect
    const transformFn = partial(transformAssignmentForRedirect, groupId, userId, classIds);
    const assignmentsProcessed = assignments.map(transformFn);

    // normalize reports
    const {
      entities: { reports: reportsObj }
    } = normalize(reports, [reportSchema]);

    // normalize assignments
    const {
      result: allAssignments,
      entities: { assignments: assignmentObj }
    } = normalize(assignmentsProcessed, [assignmentSchema]);

    yield put({ type: FETCH_ASSIGNMENTS_DATA_BY_TEST_SUCCESS, payload: { allAssignments, assignmentObj, reportsObj } });
  } catch (e) {
    notification({ type: "warn", messageKey: "redirectingToStudentDshboard" });
    yield put(push("/home/assignments"));
  }
}

export function* watcherSaga() {
  yield takeLatest(FETCH_PUBLIC_TEST, fetchPublicTest);
  yield takeLatest(FETCH_ASSIGNMENTS_DATA_BY_TEST, fetchAssignmentsByTest);
}
