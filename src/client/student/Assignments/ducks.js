import { createAction, createSelector as createSelectorator } from "redux-starter-kit";
import { takeLatest, put, call, all, select } from "redux-saga/effects";
import { values, groupBy, last, partial, maxBy as _maxBy, sortBy } from "lodash";
import { createSelector } from "reselect";
import { normalize } from "normalizr";
import { push } from "connected-react-router";
import { assignmentApi, reportsApi, testActivityApi, testsApi } from "@edulastic/api";
import { test as testConst, assignmentPolicyOptions } from "@edulastic/constants";
import { getCurrentSchool, fetchUser, getUserRole } from "../Login/ducks";

import { getCurrentGroup, getClassIds } from "../Reports/ducks";
// external actions
import {
  assignmentSchema,
  setAssignmentsAction,
  setAssignmentsLoadingAction,
  setActiveAssignmentAction
} from "../sharedDucks/AssignmentModule/ducks";

import { setReportsAction, reportSchema } from "../sharedDucks/ReportsModule/ducks";

const { COMMON, ASSESSMENT } = testConst.type;
const { POLICY_AUTO_ON_STARTDATE, POLICY_AUTO_ON_DUEDATE } = assignmentPolicyOptions;
// constants
export const FILTERS = {
  ALL: "all",
  NOT_STARTED: "notStarted",
  IN_PROGRESS: "inProgress"
};

export const getCurrentUserId = createSelectorator(["user.user._id"], r => r);

// types
export const FETCH_ASSIGNMENTS_DATA = "[studentAssignments] fetch assignments";
export const START_ASSIGNMENT = "[studentAssignments] start assignments";
export const SET_TEST_ACTIVITY_ID = "[test] add test activity id";
export const SET_RESUME_STATUS = "[test] set resume status";
export const RESUME_ASSIGNMENT = "[studentAssignments] resume assignments";
export const BOOTSTRAP_ASSESSMENT = "[assessment] bootstrap";
export const LAUNCH_ASSIGNMENT_FROM_LINK = "[studentAssignemnts] launch assignment from link";
// actions
export const fetchAssignmentsAction = createAction(FETCH_ASSIGNMENTS_DATA);
export const startAssignmentAction = createAction(START_ASSIGNMENT);
export const setTestActivityAction = createAction(SET_TEST_ACTIVITY_ID);
export const setResumeAssignment = createAction(SET_RESUME_STATUS);
export const resumeAssignmentAction = createAction(RESUME_ASSIGNMENT);
export const bootstrapAssessmentAction = createAction(BOOTSTRAP_ASSESSMENT);
export const launchAssignmentFromLinkAction = createAction(LAUNCH_ASSIGNMENT_FROM_LINK);

const getAssignmentClassId = (assignment, groupId, classIds) => {
  if (groupId) {
    return groupId;
  } else {
    const assignmentClassIds = (assignment.class || []).reduce((acc, cur) => {
      acc.add(cur._id);
      return acc;
    }, new Set());
    return classIds.find(x => assignmentClassIds.has(x));
  }
};

/**
 * get current redirect status of the assignment
 * @param {Object} assignment
 * @param {string} groupId
 * @param {string} userId
 * @param {string[]} classIds
 */
export const getRedirect = (assignment, groupId, userId, classIds) => {
  /**
   * @type {Object[]}
   */
  const classes = assignment.class || [];
  groupId = getAssignmentClassId(assignment, groupId, classIds);
  const redirects = classes.filter(
    x =>
      x.redirect && ((x.specificStudents && x.students.includes(userId)) || (!x.specificStudents && x._id === groupId))
  );

  if (redirects.length === 0) {
    return false;
  }
  const attempts = redirects.length;

  const dueDate = Math.max.apply(Math, redirects.map(x => x.endDate));

  return { attempts, dueDate };
};

export const transformAssignmentForRedirect = (groupId, userId, classIds, assignment) => {
  const redirect = getRedirect(assignment, groupId, userId, classIds);
  if (!redirect) {
    return assignment;
  }

  let maxAttempts = (assignment && assignment.maxAttempts) || 1;
  let { endDate } = assignment;
  endDate = redirect.dueDate;
  maxAttempts += redirect.attempts;
  return { ...assignment, endDate, maxAttempts, redir: true };
};

// sagas
// fetch and load assignments and reports for the student
function* fetchAssignments({ payload }) {
  try {
    yield put(setAssignmentsLoadingAction());
    const groupId = yield select(getCurrentGroup);
    const userId = yield select(getCurrentUserId);
    const classIds = yield select(getClassIds);
    const [assignments, reports] = yield all([
      call(assignmentApi.fetchAssigned, payload),
      call(reportsApi.fetchReports, groupId)
    ]);
    //transform to handle redirect
    const transformFn = partial(transformAssignmentForRedirect, groupId, userId, classIds);
    const assignmentsProcessed = assignments.map(transformFn);

    // normalize reports
    const {
      result: allReports,
      entities: { reports: reportsObj }
    } = normalize(reports, [reportSchema]);

    yield put(setReportsAction({ allReports, reportsObj }));
    // normalize assignments
    const {
      result: allAssignments,
      entities: { assignments: assignmentObj }
    } = normalize(assignmentsProcessed, [assignmentSchema]);

    yield put(setAssignmentsAction({ allAssignments, assignmentObj }));
  } catch (e) {
    console.log(e);
  }
}

/*
 * start assingment
 */
function* startAssignment({ payload }) {
  try {
    const { assignmentId, testId, testType } = payload;
    if (!assignmentId || !testId) {
      throw new Error("insufficient data");
    }

    yield put(setActiveAssignmentAction(assignmentId));
    const groupId = yield select(getCurrentGroup);
    const assignmentsById = yield select(assignmentsSelector);
    const assignment = assignmentsById[assignmentId];
    const classIds = yield select(getClassIds);
    const actualGroupId = getAssignmentClassId(assignment, groupId, classIds);
    console.warn("actualgroupId", actualGroupId);
    const institutionId = yield select(getCurrentSchool);
    const groupType = "class";
    const { _id: testActivityId } = yield testActivityApi.create({
      assignmentId,
      groupId: actualGroupId,
      institutionId,
      groupType,
      testId
    });
    // set Activity id
    yield put(push(`/student/${testType === COMMON ? ASSESSMENT : testType}/${testId}/uta/${testActivityId}/qid/0`));

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
    const { assignmentId, testActivityId, testId, testType } = payload;
    if (!assignmentId || !testId || !testActivityId) {
      throw new Error("insufficient data");
    }
    yield put(setActiveAssignmentAction(assignmentId));
    yield put(setResumeAssignment(true));
    yield put(push(`/student/${testType === COMMON ? ASSESSMENT : testType}/${testId}/uta/${testActivityId}/qid/0`));
  } catch (e) {
    console.log(e);
  }
}

/**
 * for loading deeplinking assessment created for SEB. But can be used for others
 * @param {{payload: {assignmentId: string, testActivityId?: string, testId:string,testType:string}}} param
 */
function* bootstrapAssesment({ payload }) {
  try {
    const { testType, assignmentId, testActivityId, testId } = payload;
    yield fetchUser();
    if (testActivityId) {
      yield put(resumeAssignmentAction({ testType, assignmentId, testActivityId, testId }));
    } else {
      yield put(startAssignmentAction({ testType, assignmentId, testId }));
    }
  } catch (e) {
    console.log(e);
  }
}

// launch assignment
function* launchAssignment({ payload }) {
  try {
    const role = yield select(getUserRole);
    const { assignmentId, groupId } = payload;
    if (role === "student") {
      const [assignment, testActivities] = yield Promise.all([
        assignmentApi.getById(assignmentId),
        assignmentApi.fetchTestActivities(assignmentId, groupId)
      ]);
      const lastActivity = _maxBy(testActivities, "createdAt");
      const { testId, testType = "assessment" } = assignment;

      if (lastActivity && lastActivity.status === 0) {
        yield put(resumeAssignmentAction({ testId, testType, assignmentId, testActivityId: lastActivity._id }));
      } else {
        let maxAttempt;
        if (assignment.maxAttempts) {
          maxAttempt = assignment.maxAttempts;
        } else {
          const test = yield call(testsApi.getById, testId);
          maxAttempt = test.maxAttempts;
        }

        if (maxAttempt > testActivities.length) {
          yield put(startAssignmentAction({ testId, assignmentId, testType }));
        } else {
          yield put(push(`/home/reports`));
        }
      }
    } else {
      yield put(push(`/author/classboard/${assignmentId}/${groupId}`));
    }
  } catch (e) {
    console.log(e);
  }
}

// set actions watcherss
export function* watcherSaga() {
  yield all([
    yield takeLatest(FETCH_ASSIGNMENTS_DATA, fetchAssignments),
    yield takeLatest(START_ASSIGNMENT, startAssignment),
    yield takeLatest(RESUME_ASSIGNMENT, resumeAssignment),
    yield takeLatest(BOOTSTRAP_ASSESSMENT, bootstrapAssesment),
    yield takeLatest(LAUNCH_ASSIGNMENT_FROM_LINK, launchAssignment)
  ]);
}

// selectors
export const assignmentsSelector = state => state.studentAssignment.byId;
const reportsSelector = state => state.studentReport.byId;

export const filterSelector = state => state.studentAssignment.filter;

/**
 *
 * @param {*} assignment
 * @param {*} currentGroup
 * BOTH OPEN AND CLOSE ARE MANUAL
 *  When both are manual endDate and startDate will not present in class object, hence use open and closed flags along with openDate and closedDate
 * Once assignment is open no need to check for the startDate as it is opened manually by author but check for closedDate or closed variable
 * ONLY OPEN MANUAL
 *  In this case endDate will be present but we shouldn't display the assignment until open variable is true. Also hide when end date passed
 * ONLY CLOSE MANUAL
 *  Close manual can display assignment by checking the startDate is less than current date and close when closed in class object is true
 *
 */
export const isLiveAssignment = (assignment, currentGroup, classIds) => {
  // max attempts should be less than total attempts made
  // and end Dtae should be greateer than current one :)
  let maxAttempts = (assignment && assignment.maxAttempts) || 1;
  let attempts = (assignment.reports && assignment.reports.length) || 0;
  let lastAttempt = last(assignment.reports) || {};
  let { endDate, class: groups = [] } = assignment;
  //when attempts over no need to check for any other condition to hide assignment from assignments page
  if (maxAttempts <= attempts && (lastAttempt.status !== 0 || lastAttempt.status === 2)) return false;
  if (!endDate) {
    endDate = (_maxBy(groups.filter(cl => (currentGroup ? cl._id === currentGroup : true)) || [], "endDate") || {})
      .endDate;
    const currentClass =
      groups.find(cl => (currentGroup ? cl._id === currentGroup : classIds.find(x => x === cl._id))) || {};
    if (!endDate) {
      // IF POLICIES MANUAL OPEN AND MANUAL CLOSE
      if (assignment.openPolicy !== POLICY_AUTO_ON_STARTDATE && assignment.closePolicy !== POLICY_AUTO_ON_DUEDATE) {
        return !currentClass.closed;
      }
      // IF MANUAL OPEN AND AUTO CLOSE
      if (assignment.openPolicy !== POLICY_AUTO_ON_STARTDATE) {
        const isLive = !currentClass.closed || currentClass.endDate > Date.now();
        return isLive;
      }
      // IF MANUAL CLOSE AND AUTO OPEN
      if (assignment.openPolicy !== POLICY_AUTO_ON_DUEDATE) {
        const isLive =
          currentClass.startDate < Date.now() && (!currentClass.closed || currentClass.closedDate > Date.now());
        return isLive;
      }
    }
  }
  return endDate > Date.now();
};

const statusFilter = filterType => assignment => {
  let attempts = (assignment.reports && assignment.reports.length) || 0;
  switch (filterType) {
    case FILTERS.NOT_STARTED:
      return attempts === 0;
    case FILTERS.IN_PROGRESS:
      return attempts > 0;
    default:
      return true;
  }
};

const assignmentSortBy = assignment => {
  const attempts = (assignment.reports && assignment.reports.length) || 0;
  const status = attempts === 0 ? 1 : 2;

  if (!assignment.class) {
    return 999999;
  }

  const dueDate = assignment.dueDate || (_maxBy(assignment.class, "endDate") || {}).endDate;
  return status * 1000 + ((dueDate || 0) - new Date());
};

const assignmentSortByDueDate = (groupedReports, assignment) => {
  const reports = groupedReports[assignment._id] || [];
  const attempted = !!(reports && reports.length);
  const lastAttempt = last(reports) || {};
  const resume = lastAttempt.status == 0;
  let result = 0;
  if (resume) {
    result = 3;
  } else {
    if (!attempted) {
      result = 2;
    } else {
      result = 1;
    }
  }
  const dueDate = assignment.dueDate || (_maxBy(assignment.class, "endDate") || {}).endDate;

  const dueDateDiff = (dueDate - new Date()) / (1000 * 60 * 60 * 24);
  const sortOrder = result * 10000 + dueDateDiff;
  return sortOrder;
};

export const getAssignmentsSelector = createSelector(
  assignmentsSelector,
  reportsSelector,
  filterSelector,
  getCurrentGroup,
  getClassIds,
  (assignmentsObj, reportsObj, filter, currentGroup, classIds) => {
    // group reports by assignmentsID
    let groupedReports = groupBy(values(reportsObj), "assignmentId");
    let assignments = values(assignmentsObj)
      .map(assignment => ({
        ...assignment,
        reports: groupedReports[assignment._id] || []
      }))
      .filter(assignment => isLiveAssignment(assignment, currentGroup, classIds))
      .filter(statusFilter(filter));

    return sortBy(assignments, [partial(assignmentSortByDueDate, groupedReports)]);
  }
);
