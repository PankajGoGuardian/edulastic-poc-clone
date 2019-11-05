import { createAction, createSelector as createSelectorator } from "redux-starter-kit";
import { takeEvery, put, call, all, select } from "redux-saga/effects";
import { values, groupBy, last, maxBy } from "lodash";
import { createSelector } from "reselect";
import { normalize } from "normalizr";
import { assignmentApi, reportsApi } from "@edulastic/api";

// external actions
import {
  assignmentSchema,
  setAssignmentsAction,
  setAssignmentsLoadingAction
} from "../sharedDucks/AssignmentModule/ducks";
import { setReportsAction, reportSchema } from "../sharedDucks/ReportsModule/ducks";
import { testActivity as testActivityConstants } from "@edulastic/constants";

// constants
export const getCurrentGroup = createSelectorator(["user.user.orgData.defaultClass"], r => r);

export const getClassIds = createSelectorator(["user.user.orgData.classList"], cls => (cls || []).map(cl => cl._id));

export const FILTERS = {
  ALL: "all",
  SUBMITTED: "submitted",
  GRADED: "graded",
  MISSED: "missed"
};

// types
export const FETCH_ASSIGNMENTS_DATA = "[studentAssignments] fetch assignments";

// actions
export const fetchAssignmentsAction = createAction(FETCH_ASSIGNMENTS_DATA);

// sagas
// fetch and load assignments and reports for the student
function* fetchAssignments({ payload }) {
  try {
    const groupId = yield select(getCurrentGroup);
    yield put(setAssignmentsLoadingAction());
    const [assignments, reports] = yield all([
      call(assignmentApi.fetchAssigned, payload),
      call(reportsApi.fetchReports, groupId)
    ]);

    // normalize assignments
    const {
      result: allAssignments,
      entities: { assignments: assignmentObj }
    } = normalize(assignments, [assignmentSchema]);

    yield put(setAssignmentsAction({ allAssignments, assignmentObj }));

    // normalize reportsx``
    const {
      result: allReports,
      entities: { reports: reportsObj }
    } = normalize(reports, [reportSchema]);

    yield put(setReportsAction({ allReports, reportsObj }));
  } catch (e) {
    console.log(e);
  }
}

// set actions watcherss
export function* watcherSaga() {
  yield all([yield takeEvery(FETCH_ASSIGNMENTS_DATA, fetchAssignments)]);
}

// selectors

const assignmentsSelector = state => state.studentAssignment.byId;
const reportsSelector = state => state.studentReport.byId;
export const filterSelector = state => state.studentReport.filter;

const isReport = (assignment, currentGroup, classIds) => {
  // either user has ran out of attempts
  // or assignments is past dueDate
  const maxAttempts = (assignment && assignment.maxAttempts) || 1;
  const attempts = (assignment.reports && assignment.reports.length) || 0;
  let { endDate, class: groups = [] } = assignment;
  if (!endDate) {
    endDate = (maxBy(groups.filter(cl => (currentGroup ? cl._id === currentGroup : true)) || [], "endDate") || {})
      .endDate;
    if (!endDate) {
      // IF POLICIES ARE MANUAL CLOSE UNTIL AUTHOR REDIRECT END DATE WILL BE undefined
      const currentClass =
        groups.find(cl => (currentGroup ? cl._id === currentGroup : classIds.find(x => x === cl._id))) || {};
      return currentClass.closed;
    }
  }
  const isExpired = maxAttempts <= attempts || new Date(endDate) < new Date();
  return isExpired;
};

const statusFilter = filterType => assignment => {
  const lastAttempt = last(assignment.reports) || {};
  const isSubmitted = (assignment.reports.length === 1 && lastAttempt.status === 1) || assignment.reports.length > 1;
  const isAbsent = lastAttempt.status === 2 || !assignment.reports.length;
  const isGraded = lastAttempt.graded == testActivityConstants.studentAssignmentConstants.assignmentStatus.GRADED;
  switch (filterType) {
    case FILTERS.MISSED:
      return isAbsent;
    case FILTERS.SUBMITTED:
      return isSubmitted && !isGraded;
    case FILTERS.GRADED:
      return isGraded;
    default:
      return true;
  }
};

export const getAllAssignmentsSelector = createSelector(
  assignmentsSelector,
  reportsSelector,

  getCurrentGroup,
  getClassIds,
  (assignmentsObj, reportsObj, currentGroup, classIds) => {
    // group reports by assignmentsID
    const groupedReports = groupBy(values(reportsObj), "assignmentId");
    const assignments = values(assignmentsObj)
      .sort((a, b) => a.createdAt > b.createdAt)
      .map(assignment => ({
        ...assignment,
        reports:
          (groupedReports[assignment._id] && groupedReports[assignment._id].filter(item => item.status !== 0)) || []
      }))
      .filter(assignment => isReport(assignment, currentGroup, classIds));

    return assignments;
  }
);

export const getAssignmentsSelector = createSelector(
  getAllAssignmentsSelector,
  filterSelector,
  (assignments, filter) => assignments.filter(statusFilter(filter))
);

export const assignmentsCountByFilerNameSelector = createSelector(
  getAllAssignmentsSelector,
  assignments => {
    let MISSED = 0,
      SUBMITTED = 0,
      GRADED = 0;
    assignments.forEach(assignment => {
      const lastAttempt = last(assignment.reports) || {};
      const isSubmitted =
        (assignment.reports.length === 1 && lastAttempt.status === 1) || assignment.reports.length > 1;
      const isAbsent = lastAttempt.status === 2 || !assignment.reports.length;
      const isGraded = lastAttempt.graded == testActivityConstants.studentAssignmentConstants.assignmentStatus.GRADED;
      if (isAbsent) {
        MISSED++;
      } else if (isSubmitted && !isGraded) {
        SUBMITTED++;
      } else if (isGraded) {
        GRADED++;
      }
    });
    return {
      ALL: assignments.length,
      MISSED,
      SUBMITTED,
      GRADED
    };
  }
);
