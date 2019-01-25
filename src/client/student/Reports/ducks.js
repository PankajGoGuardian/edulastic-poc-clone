import { createAction } from 'redux-starter-kit';
import { takeEvery, put, call, all } from 'redux-saga/effects';
import { values, groupBy } from 'lodash';
import { createSelector } from 'reselect';
import { normalize } from 'normalizr';
import { assignmentApi, reportsApi } from '@edulastic/api';

// external actions
import {
  assignmentSchema,
  setAssignmentsAction,
  setAssignmentsLoadingAction
} from '../sharedDucks/AssignmentModule/ducks';
import {
  setReportsAction,
  reportSchema
} from '../sharedDucks/ReportsModule/ducks';

// types
export const FETCH_ASSIGNMENTS_DATA = '[studentAssignments] fetch assignments';

// actions
export const fetchAssignmentsAction = createAction(FETCH_ASSIGNMENTS_DATA);

// sagas
// fetch and load assignments and reports for the student
function* fetchAssignments() {
  try {
    yield put(setAssignmentsLoadingAction());
    const [assignments, reports] = yield all([
      call(assignmentApi.fetchAssigned),
      call(reportsApi.fetchReports)
    ]);

    // normalize assignments
    const {
      result: allAssignments,
      entities: { assignments: assignmentObj }
    } = normalize(assignments, [assignmentSchema]);

    yield put(setAssignmentsAction({ allAssignments, assignmentObj }));

    // normalize reports
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

export const getAssignmentsSelector = createSelector(
  assignmentsSelector,
  reportsSelector,
  (assignmentsObj, reportsObj) => {
    // group reports by assignmentsID
    let groupedReports = groupBy(values(reportsObj), 'assignmentId');
    let assignments = values(assignmentsObj)
      .sort((a, b) => a.createdAt > b.createdAt)
      .map(assignment => ({
        ...assignment,
        reports: groupedReports[assignment._id] || []
      }))
      .filter(assignment => {
        // either user has ran out of attempts
        // or assigments is past dueDate
        let maxAttempts = (assignment.test && assignment.test.maxAttempt) || 5;
        let attempts = (assignment.reports && assignment.reports.length) || 0;
        return (
          maxAttempts <= attempts || new Date(assignment.endDate) < new Date()
        );
      });

    return assignments;
  }
);
