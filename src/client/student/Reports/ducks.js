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

const isReport = (assignment, classIds) => {
  // either user has ran out of attempts
  // or assignments is past dueDate
  const maxAttempts = (assignment && assignment.maxAttempts) || 1;
  const attempts = (assignment.reports && assignment.reports.length) || 0;
  let { endDate, class: groups = [], classId: currentGroup } = assignment;
  if (!endDate) {
    endDate = (maxBy(groups.filter(cl => (currentGroup ? cl._id === currentGroup : true)) || [], "endDate") || {})
      .endDate;
    if (!endDate) {
      // IF POLICIES ARE MANUAL CLOSE UNTIL AUTHOR REDIRECT END DATE WILL BE undefined
      const currentClass =
        groups.find(cl => (currentGroup ? cl._id === currentGroup : classIds.find(x => x === cl._id))) || {};
      if (currentClass.closed !== undefined) return currentClass.closed;
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
    const groupedReports = groupBy(values(reportsObj), item => `${item.assignmentId}_${item.groupId}`);
    const assignments = values(assignmentsObj)
      .flatMap(assignment => {
        //no redirected classes and no class filter or class ID match the filter and student belongs to the class
        const allClassess = assignment.class.filter(
          clazz =>
            clazz.redirect !== true && (!currentGroup || currentGroup === clazz._id) && classIds.includes(clazz._id)
        );
        return allClassess.map(clazz => ({
          ...assignment,
          classId: clazz._id,
          reports: groupedReports[`${assignment._id}_${clazz._id}`]?.filter(item => item.status !== 0) || []
        }));
      })
      .filter(assignment => isReport(assignment, classIds));

    return assignments.sort((a, b) => {
      const a_report = a.reports.find(report => !report.archived);
      const b_report = b.reports.find(report => !report.archived);
      return b_report?.endDate - a_report?.endDate;
    });
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
