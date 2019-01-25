import { createAction, createReducer } from 'redux-starter-kit';
import { takeEvery, takeLatest, put, call, all,select } from 'redux-saga/effects';
import { values, groupBy } from 'lodash';
import { createSelector } from 'reselect';
import { normalize } from 'normalizr';
import { push } from 'react-router-redux';
import { getCurrentClass } from '../Login/ducks';
import { assignmentApi, reportsApi, testActivityApi } from '@edulastic/api';

// external actions
import {
  assignmentSchema,
  setAssignmentsAction,
  setAssignmentsLoadingAction,
  setActiveAssignmentAction
} from '../sharedDucks/AssignmentModule/ducks';
import {
  setReportsAction,
  reportSchema
} from '../sharedDucks/ReportsModule/ducks';

// types
export const FETCH_ASSIGNMENTS_DATA = '[studentAssignments] fetch assignments';
export const START_ASSIGNMENT = '[studentAssignments] start assignments';
export const SET_TEST_ACTIVITY_ID = '[test] add test activity id';
export const RESUME_ASSIGNMENT = '[studentAssignments] resume assignments';

// actions
export const fetchAssignmentsAction = createAction(FETCH_ASSIGNMENTS_DATA);
export const startAssignmentAction = createAction(START_ASSIGNMENT);
export const setTestActivityAction = createAction(SET_TEST_ACTIVITY_ID);
export const resumeAssignmentAction = createAction(RESUME_ASSIGNMENT);

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
      throw new Error('insufficient data');
    }
    yield put(setActiveAssignmentAction(assignmentId));
    const groupId = yield select(getCurrentClass);
    const groupType = 'class';
    const { _id: testActivityId } = yield testActivityApi.create({
      assignmentId,
      groupId,
      groupType
    });
    // set Activity id
    yield put(setTestActivityAction({ testActivityId }));
    yield put(push(`/student/test/${testId}`));

    // TODO:load previous responses if resume!!
  } catch (e) {
    console.log(e);
  }
}

/*
 * resume assignment
 */
function* resumeAssignment({ payload }) {
  try {
    const { assignmentId, testActivityId, testId } = payload;
    if (!assignmentId || !testId || !testActivityId) {
      throw new Error('insufficient data');
    }
    yield put(setActiveAssignmentAction(assignmentId));

    yield put(setTestActivityAction({ testActivityId }));
    yield put(push(`/student/test/${testId}`));
  } catch (e) {
    console.log(e);
  }
}

// set actions watcherss
export function* watcherSaga() {
  yield all([
    yield takeLatest(FETCH_ASSIGNMENTS_DATA, fetchAssignments),
    yield takeLatest(START_ASSIGNMENT, startAssignment),
    yield takeLatest(RESUME_ASSIGNMENT, resumeAssignment)
  ]);
}

// selectors
const assignmentsSelector = state => state.studentAssignment.byId;
const reportsSelector = state => state.studentReport.byId;

export const getAssignmentsSelector = createSelector(
  assignmentsSelector,
  reportsSelector,
  (assignmentsObj, reportsObj) => {
    let groupedReports = groupBy(values(reportsObj), 'assignmentId');
    let assignments = values(assignmentsObj)
      .sort((a, b) => a.createdAt > b.createdAt)
      .map(assignment => ({
        ...assignment,
        reports: groupedReports[assignment._id] || []
      }))
      .filter(assignment => {
        // max attempts should be less than total attempts made
        // and end Dtae should be greateer than current one :)
        let maxAttempts = (assignment.test && assignment.test.maxAttempts) || 5;
        let attempts = (assignment.reports && assignment.reports.length) || 0;
        return (
          maxAttempts >= attempts && new Date(assignment.endDate) > new Date()
        );
      });
    return assignments;
  }
);
