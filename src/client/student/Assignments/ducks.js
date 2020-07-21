import { createAction, createSelector as createSelectorator } from "redux-starter-kit";
import { takeLatest, put, call, all, select } from "redux-saga/effects";
import { values, groupBy, last, partial, maxBy as _maxBy, sortBy } from "lodash";
import { createSelector } from "reselect";
import { normalize } from "normalizr";
import { push } from "connected-react-router";
import { assignmentApi, reportsApi, testActivityApi, testsApi } from "@edulastic/api";
import { test as testConst, assignmentPolicyOptions } from "@edulastic/constants";
import { Effects, notification } from "@edulastic/common";
import { getCurrentSchool, fetchUserAction, getUserRole, getUserId } from "../Login/ducks";

import { getCurrentGroup, getClassIds } from "../Reports/ducks";
// external actions
import {
  assignmentSchema,
  setAssignmentsAction,
  setAssignmentsLoadingAction,
  setActiveAssignmentAction,
  setConfirmationForTimedAssessmentAction
} from "../sharedDucks/AssignmentModule/ducks";

import { setReportsAction, reportSchema } from "../sharedDucks/ReportsModule/ducks";
import { clearOrderOfOptionsInStore } from "../../assessment/actions/assessmentPlayer";

const { COMMON, ASSESSMENT, TESTLET } = testConst.type;
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
export const REDIRECT_TO_DASHBOARD = "[studentAssignments] redirect to dashboard";
// actions
export const fetchAssignmentsAction = createAction(FETCH_ASSIGNMENTS_DATA);
export const startAssignmentAction = createAction(START_ASSIGNMENT);
export const setTestActivityAction = createAction(SET_TEST_ACTIVITY_ID);
export const setResumeAssignment = createAction(SET_RESUME_STATUS);
export const resumeAssignmentAction = createAction(RESUME_ASSIGNMENT);
export const bootstrapAssessmentAction = createAction(BOOTSTRAP_ASSESSMENT);
export const launchAssignmentFromLinkAction = createAction(LAUNCH_ASSIGNMENT_FROM_LINK);
export const redirectToDashboardAction = createAction(REDIRECT_TO_DASHBOARD);

const getAssignmentClassId = (assignment, groupId, classIds) => {
  if (groupId) {
    return groupId;
  }
  const assignmentClassIds = (assignment?.class || []).reduce((acc, cur) => {
    acc.add(cur._id);
    return acc;
  }, new Set());
  return classIds.find(x => assignmentClassIds.has(x));
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
  const classes = assignment?.class || [];
  groupId = getAssignmentClassId(assignment, groupId, classIds);
  const redirects = classes.filter(
    x =>
      x.redirect && ((x.specificStudents && x.students.includes(userId)) || (!x.specificStudents && x._id === groupId))
  );

  assignment.class = assignment.class.map(c => {
    if (!c.redirect) {
      const redirectGroups = redirects.filter(r => r._id === c._id) || [];
      const classMaxAttempts = c.maxAttempts || assignment.maxAttempts || 1;
      c.maxAttempts = classMaxAttempts + redirectGroups.length;
    }
    return c;
  });

  if (redirects.length === 0) {
    return false;
  }

  const dueDate = Math.max(...redirects.map(x => x.endDate));
  const { allowedTime, pauseAllowed } = redirects[redirects.length - 1];
  return { dueDate, allowedTime, pauseAllowed };
};

export const transformAssignmentForRedirect = (groupId, userId, classIds, assignment) => {
  const redirect = getRedirect(assignment, groupId, userId, classIds);
  if (!redirect) {
    return assignment;
  }

  let { endDate } = assignment;
  endDate = redirect.dueDate;
  return {
    ...assignment,
    endDate,
    redir: true,
    ...(redirect.allowedTime ? { allowedTime: redirect.allowedTime } : {}),
    ...(redirect.pauseAllowed !== undefined ? { pauseAllowed: redirect.pauseAllowed } : {})
  };
};

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
export const isLiveAssignment = (assignment, classIds) => {
  // max attempts should be less than total attempts made
  // and end Dtae should be greateer than current one :)
  const maxAttempts = (assignment && assignment.maxAttempts) || 1;
  const attempts = (assignment.reports && assignment.reports.length) || 0;
  const lastAttempt = last(assignment.reports) || {};
  // eslint-disable-next-line
  let { endDate, class: groups = [], classId: currentGroup } = assignment;
  // when attempts over no need to check for any other condition to hide assignment from assignments page
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
  const attempts = (assignment.reports && assignment.reports.length) || 0;
  switch (filterType) {
    case FILTERS.NOT_STARTED:
      return attempts === 0;
    case FILTERS.IN_PROGRESS:
      return attempts > 0;
    default:
      return true;
  }
};

const assignmentSortByDueDate = (groupedReports, assignment) => {
  const reports = groupedReports[assignment._id] || [];
  const attempted = !!(reports && reports.length);
  const lastAttempt = last(reports) || {};
  const resume = lastAttempt.status == 0;
  let result = 0;
  if (resume) {
    result = 3;
  } else if (!attempted) {
    result = 2;
  } else {
    result = 1;
  }
  const dueDate = assignment.dueDate || (_maxBy(assignment.class, "endDate") || {}).endDate;

  const dueDateDiff = (dueDate - new Date()) / (1000 * 60 * 60 * 24);
  const sortOrder = result * 10000 + dueDateDiff;
  return sortOrder;
};

export const getAllAssignmentsSelector = createSelector(
  assignmentsSelector,
  reportsSelector,
  getCurrentGroup,
  getClassIds,
  getUserId,
  (assignmentsObj, reportsObj, currentGroup, classIds, currentUserId) => {
    // group reports by assignmentsID
    const groupedReports = groupBy(values(reportsObj), item => `${item.assignmentId}_${item.groupId}`);
    const assignments = values(assignmentsObj)
      .flatMap(assignment => {
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
          maxAttempts: clazz.maxAttempts,
          classId: clazz._id,
          reports: groupedReports[`${assignment._id}_${clazz._id}`] || [],
          ...(clazz.allowedTime && !assignment.redir ? { allowedTime: clazz.allowedTime } : {}),
          ...(clazz.pauseAllowed !== undefined && !assignment.redir ? { pauseAllowed: clazz.pauseAllowed } : {})
        }));
      })
      .filter(assignment => isLiveAssignment(assignment, classIds));

    return sortBy(assignments, [partial(assignmentSortByDueDate, groupedReports)]);
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
    let IN_PROGRESS = 0;
    let NOT_STARTED = 0;
    assignments.forEach(assignment => {
      const attempts = (assignment.reports && assignment.reports.length) || 0;
      if (attempts === 0) {
        NOT_STARTED++;
      } else if (attempts > 0) {
        IN_PROGRESS++;
      }
    });
    return {
      ALL: assignments.length,
      NOT_STARTED,
      IN_PROGRESS
    };
  }
);

// sagas
// fetch and load assignments and reports for the student
function* fetchAssignments() {
  try {
    yield put(setAssignmentsLoadingAction());
    const groupId = yield select(getCurrentGroup);
    const userId = yield select(getCurrentUserId);
    const classIds = yield select(getClassIds);
    const [assignments, reports] = yield all([
      call(assignmentApi.fetchAssigned, groupId),
      call(reportsApi.fetchReports, groupId)
    ]);
    // transform to handle redirect
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
    yield put(setConfirmationForTimedAssessmentAction(null));
    const { assignmentId, testId, testType, classId, isPlaylist = false, studentRecommendation } = payload;
    if (!isPlaylist && !studentRecommendation) {
      if (!assignmentId || !testId) throw new Error("insufficient data");
    } else if (!testId) throw new Error("insufficient data");

    /**
     * need to clear the preserved order of options because,
     * if we are taking up a new assignement having same questions
     * it will fetch the same order from store
     *
     * nothing breaking, just clean up
     */
    yield put(clearOrderOfOptionsInStore());

    if (assignmentId) yield put(setActiveAssignmentAction(assignmentId));

    // const groupId = yield select(getCurrentGroup);
    // const assignmentsById = yield select(assignmentsSelector);
    // const assignment = assignmentsById[assignmentId];
    // const classIds = yield select(getClassIds);
    // const actualGroupId = getAssignmentClassId(assignment, groupId, classIds);

    const institutionId = yield select(getCurrentSchool);
    const groupType = "class";
    let testActivityId = null;
    if (studentRecommendation) {
      const { _id } = yield testActivityApi.create({
        groupId: classId,
        institutionId,
        groupType,
        testId,
        studentRecommendationId: studentRecommendation._id
      });
      testActivityId = _id;
    } else if (isPlaylist && !assignmentId) {
      const { _id } = yield testActivityApi.create({
        playlistModuleId: isPlaylist.moduleId,
        playlistId: isPlaylist.playlistId,
        groupId: classId,
        institutionId,
        groupType,
        testId
      });
      testActivityId = _id;
    } else {
      const { _id } = yield testActivityApi.create({
        assignmentId,
        groupId: classId,
        institutionId,
        groupType,
        testId
      });
      testActivityId = _id;
    }

    // set Activity id
    if (testType !== TESTLET) {
      if (studentRecommendation) {
        yield put(
          push({
            pathname: `/student/${
              testType === COMMON ? ASSESSMENT : testType
            }/${testId}/class/${classId}/uta/${testActivityId}/qid/0`,
            state: {
              playlistRecommendationsFlow: true,
              playlistId: studentRecommendation.playlistId
            }
          })
        );
      } else if (isPlaylist) {
        yield put(
          push({
            pathname: `/student/${
              testType === COMMON ? ASSESSMENT : testType
            }/${testId}/class/${classId}/uta/${testActivityId}/qid/0`,
            state: {
              playlistAssignmentFlow: true,
              playlistId: isPlaylist.playlistId
            }
          })
        );
      } else {
        yield put(
          push(
            `/student/${
              testType === COMMON ? ASSESSMENT : testType
            }/${testId}/class/${classId}/uta/${testActivityId}/qid/0`
          )
        );
      }
    } else {
      yield put(push(`/student/${testType}/${testId}/class/${classId}/uta/${testActivityId}`));
    }

    // TODO:load previous responses if resume!!
  } catch (err) {
    const { status, data = {} } = err;
    console.error(err);
    if (status === 403 && data.message) {
      notification({ msg: data.message });
    }
  }
}

/*
 * resume assignment
 */
function* resumeAssignment({ payload }) {
  try {
    const { assignmentId, testActivityId, testId, testType, classId, isPlaylist, studentRecommendation } = payload;

    if (!isPlaylist && !studentRecommendation) {
      if (!assignmentId || !testId || !testActivityId) throw new Error("insufficient data");
    } else if (!testId || !testActivityId) throw new Error("insufficient data");

    /**
     * need to clear the preserved order of options because,
     * if we are resuming a different assignement but having same questions
     * it will fetch the same order from store
     *
     * nothing breaking, but just cleanup
     */
    yield put(clearOrderOfOptionsInStore());

    if (assignmentId) {
      yield put(setActiveAssignmentAction(assignmentId));
      yield put(setResumeAssignment(true));
    }

    // get the class id for the assignment
    // const groupId = yield select(getCurrentGroup);
    // const assignmentsById = yield select(assignmentsSelector);
    // const assignment = assignmentsById[assignmentId];
    // const classIds = yield select(getClassIds);
    // const actualGroupId = getAssignmentClassId(assignment, groupId, classIds);
    if (studentRecommendation) {
      yield put(
        push({
          pathname: `/student/${testType}/${testId}/class/${classId}/uta/${testActivityId}/qid/0`,
          state: {
            playlistRecommendationsFlow: true,
            playlistId: studentRecommendation.playlistId
          }
        })
      );
    } else if (testType !== TESTLET) {
      if (isPlaylist) {
        yield put(
          push({
            pathname: `/student/${
              testType === COMMON ? ASSESSMENT : testType
            }/${testId}/class/${classId}/uta/${testActivityId}/qid/0`,
            state: {
              playlistAssignmentFlow: true,
              playlistId: isPlaylist.playlistId
            }
          })
        );
      } else {
        yield put(
          push(
            `/student/${
              testType === COMMON ? ASSESSMENT : testType
            }/${testId}/class/${classId}/uta/${testActivityId}/qid/0`
          )
        );
      }
    } else {
      yield put(push(`/student/${testType}/${testId}/class/${classId}/uta/${testActivityId}`));
    }
  } catch (e) {
    console.log(e);
  }
}

/**
 * for loading deeplinking assessment created for SEB. But can be used for others
 * @param {{payload: {assignmentId: string, testActivityId?: string, testId:string,testType:string, groupId: string}}} param
 */
function* bootstrapAssesment({ payload }) {
  try {
    const { testType, assignmentId, testActivityId, testId, classId } = payload;
    yield put(fetchUserAction());
    if (testActivityId) {
      yield put(resumeAssignmentAction({ testType, assignmentId, testActivityId, testId, classId }));
    } else {
      yield put(startAssignmentAction({ testType, assignmentId, testId, classId }));
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
      // eslint-disable-next-line
      let [assignment, testActivities] = yield Promise.all([
        assignmentApi.getById(assignmentId),
        assignmentApi.fetchTestActivities(assignmentId, groupId)
      ]);
      const userId = yield select(getCurrentUserId);
      const classIds = yield select(getClassIds);
      assignment = transformAssignmentForRedirect(groupId, userId, classIds, assignment);
      const lastActivity = _maxBy(testActivities, "createdAt");
      const { testId, testType = "assessment", resume, timedAssignment } = assignment;

      if (lastActivity && lastActivity.status === 0) {
        yield put(
          resumeAssignmentAction({
            testId,
            testType,
            assignmentId,
            testActivityId: lastActivity._id,
            classId: groupId
          })
        );
      } else {
        let maxAttempt;
        if (assignment.maxAttempts) {
          maxAttempt = assignment.maxAttempts;
        } else {
          const test = yield call(testsApi.getByIdMinimal, testId);
          maxAttempt = test.maxAttempts;
        }

        if (maxAttempt > testActivities.length) {
          if (!resume && timedAssignment) {
            yield put(setConfirmationForTimedAssessmentAction(assignment));
            return;
          }
          yield put(startAssignmentAction({ testId, assignmentId, testType, classId: groupId }));
        } else {
          yield put(push(`/home/grades`));
        }
      }
    } else {
      yield put(push(`/author/classboard/${assignmentId}/${groupId}`));
    }
  } catch (e) {
    console.log(e);
  }
}

function* redirectToDashboard() {
  yield put(setConfirmationForTimedAssessmentAction(null));
  notification({msg: "Redirecting to the student dashboard"});
  yield put(push('/home/assignments'));
}

// set actions watcherss
export function* watcherSaga() {
  yield all([
    yield takeLatest(FETCH_ASSIGNMENTS_DATA, fetchAssignments),
    yield Effects.throttleAction(10000, START_ASSIGNMENT, startAssignment),
    yield takeLatest(RESUME_ASSIGNMENT, resumeAssignment),
    yield takeLatest(BOOTSTRAP_ASSESSMENT, bootstrapAssesment),
    yield takeLatest(LAUNCH_ASSIGNMENT_FROM_LINK, launchAssignment),
    yield takeLatest(REDIRECT_TO_DASHBOARD, redirectToDashboard)
  ]);
}
