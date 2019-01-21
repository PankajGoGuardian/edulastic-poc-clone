import { createAction } from 'redux-starter-kit';
import { takeEvery, takeLatest, put, call, all } from 'redux-saga/effects';
import { values, groupBy } from 'lodash';
import { createSelector } from 'reselect';
import { normalize } from 'normalizr';
import { push } from 'react-router-redux';
import { assignmentApi, reportsApi, testActivityApi } from '@edulastic/api';

// external actions
import {
  assignmentSchema,
  setAssignmentsAction,
  setAssignmentsLoadingAction
} from '../AssignmentModule/ducks';
import { setReportsAction, reportSchema } from '../ReportsModule/ducks';

// types
export const FETCH_ASSIGNMENTS_DATA = '[studentAssignments] fetch assignments';
export const START_ASSIGNMENT = '[studentAssignments] start assignments';
export const SET_TEST_ACTIVITY_ID = '[test] add test activity id';

// actions
export const fetchAssignmentsAction = createAction(FETCH_ASSIGNMENTS_DATA);
export const startAssignmentAction = createAction(START_ASSIGNMENT);
export const setTestActivityAction = createAction(SET_TEST_ACTIVITY_ID);

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

/*
 * start assingment
 */
function* startAssignment({ payload }) {
  try {
    const { assignmentId, testId } = payload;
    if (!assignmentId || !testId) {
      throw new Error('invalid data');
    }

    const { _id: testActivityId } = yield testActivityApi.create({
      assignmentId
    });
    // set Activity id
    yield put(setTestActivityAction({ testActivityId }));
    yield put(push(`/student/test/${testId}`));

    // TODO:load previous responses if resume!!
  } catch (e) {
    console.log(e);
  }
}

// set actions watcherss
export function* watcherSaga() {
  yield all([
    yield takeLatest(FETCH_ASSIGNMENTS_DATA, fetchAssignments),
    yield takeLatest(START_ASSIGNMENT, startAssignment)
  ]);
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
      .filter(({ endDate }) => new Date(endDate) > new Date())
      .sort((a, b) => a.createdAt > b.createdAt)
      .map(assignment => ({
        ...assignment,
        reports: groupedReports[assignment._id] || []
      }))
      .filter(assignment => {
        // allowed attempts should be greater
        let maxAttempts = assignment.test && assignment.test.maxAttempts;
        return maxAttempts > assignment.reports.length;
      });
    return assignments;
  }
);
