import { takeEvery, call, put, all, select } from "redux-saga/effects";
import { classBoardApi, testActivityApi, enrollmentApi, classResponseApi } from "@edulastic/api";
import { message } from "antd";
import { createSelector } from "reselect";

import { values as _values, get, keyBy, sortBy, isEmpty, groupBy } from "lodash";

import { test, testActivity } from "@edulastic/constants";
import {
  updateAssignmentStatusAction,
  updateCloseAssignmentsAction,
  updateOpenAssignmentsAction,
  updateStudentActivityAction,
  setIsPausedAction,
  updateRemovedStudentsAction,
  updateClassStudentsAction,
  setCurrentTestActivityIdAction,
  setStudentsGradeBookAction,
  setAllTestActivitiesForStudentAction,
  updateSubmittedStudentsAction,
  receiveTestActivitydAction
} from "../src/actions/classBoard";

import { createFakeData } from "./utils";
import { markQuestionLabel, getQuestionLabels, transformTestItems } from "./Transformer";

import {
  RECEIVE_GRADEBOOK_REQUEST,
  RECEIVE_GRADEBOOK_SUCCESS,
  RECEIVE_GRADEBOOK_ERROR,
  RECEIVE_TESTACTIVITY_REQUEST,
  RECEIVE_TESTACTIVITY_SUCCESS,
  RECEIVE_TESTACTIVITY_ERROR,
  UPDATE_RELEASE_SCORE,
  SET_MARK_AS_DONE,
  OPEN_ASSIGNMENT,
  CLOSE_ASSIGNMENT,
  SAVE_OVERALL_FEEDBACK,
  MARK_AS_ABSENT,
  TOGGLE_PAUSE_ASSIGNMENT,
  REMOVE_STUDENTS,
  FETCH_STUDENTS,
  ADD_STUDENTS,
  GET_ALL_TESTACTIVITIES_FOR_STUDENT,
  MARK_AS_SUBMITTED,
  DOWNLOAD_GRADES_RESPONSES,
  RECEIVE_CLASS_RESPONSE_SUCCESS
} from "../src/constants/actions";
import { isNullOrUndefined } from "util";
import { downloadCSV } from "../Reports/common/util";
import { getUserNameSelector } from "../src/selectors/user";
import { getAllQids } from "../SummaryBoard/Transformer";
import { getUserId } from "../../student/Login/ducks";

const {
  authorAssignmentConstants: {
    assignmentStatus: { IN_GRADING, DONE }
  }
} = testActivity;

const { testContentVisibility } = test;

function* receiveGradeBookSaga({ payload }) {
  try {
    const entities = yield call(classBoardApi.gradebook, payload);

    yield put({
      type: RECEIVE_GRADEBOOK_SUCCESS,
      payload: { entities }
    });
  } catch (err) {
    const errorMessage = "Receive tests is failing";
    yield call(message.error, errorMessage);
    yield put({
      type: RECEIVE_GRADEBOOK_ERROR,
      payload: { error: errorMessage }
    });
  }
}

function* receiveTestActivitySaga({ payload }) {
  try {
    // test, testItemsData, testActivities, studentNames, testQuestionActivities
    const { additionalData, ...gradebookData } = yield call(classBoardApi.testActivity, payload);
    const classResponse = yield call(classResponseApi.classResponse, { ...payload, testId: additionalData.testId });

    yield put({
      type: RECEIVE_CLASS_RESPONSE_SUCCESS,
      payload: classResponse
    });

    const students = get(gradebookData, "students", []);
    // the below methods mutates the gradebookData
    gradebookData.passageData = classResponse.passages;
    gradebookData.testItemsData = classResponse.testItems;
    gradebookData.test = classResponse;
    markQuestionLabel(gradebookData.testItemsData);
    transformTestItems(gradebookData);
    // attach fake data to students for presentation mode.
    const fakeData = createFakeData(students.length);
    gradebookData.students = students.map((student, index) => ({
      ...student,
      ...fakeData[index]
    }));

    yield put({
      type: RECEIVE_TESTACTIVITY_SUCCESS,
      payload: { gradebookData, additionalData }
    });
  } catch (err) {
    console.log("err is", err);
    const errorMessage = "Receive tests is failing";
    yield call(message.error, errorMessage);
    yield put({
      type: RECEIVE_TESTACTIVITY_ERROR,
      payload: { error: errorMessage }
    });
  }
}

function* releaseScoreSaga({ payload }) {
  try {
    yield call(classBoardApi.releaseScore, payload);
    yield call(message.success, "Successfully updated the release score settings");
  } catch (err) {
    const errorMessage = "Update release score is failed";
    yield call(message.error, errorMessage);
  }
}

function* markAsDoneSaga({ payload }) {
  try {
    yield call(classBoardApi.markAsDone, payload);
    yield put(updateAssignmentStatusAction("DONE"));
    yield call(message.success, "Successfully marked as done");
  } catch (err) {
    if (err && err.status == 422 && err.data && err.data.message) {
      yield call(message.warn, err.data.message);
    } else {
      yield call(message.error, "Mark as done is failed");
    }
  }
}

function* openAssignmentSaga({ payload }) {
  try {
    yield call(classBoardApi.openAssignment, payload);
    yield put(updateOpenAssignmentsAction(payload.classId));
    yield call(message.success, "Success");
  } catch (err) {
    yield call(message.error, "Failed to open");
  }
}

function* closeAssignmentSaga({ payload }) {
  try {
    yield call(classBoardApi.closeAssignment, payload);
    yield put(updateCloseAssignmentsAction(payload.classId));
    yield put(receiveTestActivitydAction(payload.assignmentId, payload.classId));
    yield call(message.success, "Success");
  } catch (err) {
    yield call(message.error, "Failed to close");
  }
}

function* saveOverallFeedbackSaga({ payload }) {
  try {
    yield call(testActivityApi.saveOverallFeedback, payload);
    yield call(message.success, "feedback saved");
  } catch (err) {
    yield call(message.error, "Saving failed");
  }
}

function* markAbsentSaga({ payload }) {
  try {
    yield call(classBoardApi.markAbsent, payload);
    yield put(updateStudentActivityAction(payload.students));
    yield call(message.success, "Successfully marked as absent");
  } catch (err) {
    yield call(message.error, "Mark absent students failed");
  }
}

function* markAsSubmittedSaga({ payload }) {
  try {
    const response = yield call(classBoardApi.markSubmitted, payload);
    yield put(updateSubmittedStudentsAction(response.updatedTestActivities));
    yield call(message.success, "Successfully marked as submitted");
  } catch (err) {
    yield call(message.error, "Mark as submit failed");
  }
}

function* togglePauseAssignment({ payload }) {
  try {
    yield call(classBoardApi.togglePause, payload);
    yield put(setIsPausedAction(payload.value));
    yield call(
      message.success,
      `Assignment ${payload.name} is now ${payload.value ? "paused." : "open and available for students to work."}`
    );
  } catch (e) {
    yield call(message.error, `${payload.value ? "Pause" : "Resume"} assignment failed`);
  }
}

function* fetchStudentsByClassSaga({ payload }) {
  try {
    const { students = [] } = yield call(enrollmentApi.fetch, payload.classId);
    yield put(updateClassStudentsAction(students));
  } catch (err) {
    console.error("Receive students from class failed");
  }
}

function* removeStudentsSaga({ payload }) {
  try {
    const { students } = yield call(classBoardApi.removeStudents, payload);
    yield put(updateRemovedStudentsAction(students));
    yield call(message.success, "Successfully removed");
  } catch (err) {
    yield call(message.error, "Remove students failed");
  }
}

function* addStudentsSaga({ payload }) {
  try {
    const { students = [] } = yield call(classBoardApi.addStudents, payload);
    yield put(setStudentsGradeBookAction(students));
    yield call(message.success, "Successfully added");
  } catch (err) {
    yield call(message.error, "Add students failed");
  }
}

function* getAllTestActivitiesForStudentSaga({ payload }) {
  try {
    const { assignmentId, groupId, studentId } = payload;
    const result = yield call(classBoardApi.testActivitiesForStudent, { assignmentId, groupId, studentId });
    yield put(setAllTestActivitiesForStudentAction(result));
    yield put(setCurrentTestActivityIdAction(""));
  } catch (err) {
    yield call(message.error, "fetching all test activities failed");
  }
}

function* downloadGradesAndResponseSaga({ payload }) {
  try {
    const data = yield call(classBoardApi.downloadGrades, payload);
    const userName = yield select(getUserNameSelector);
    const testName = yield select(testNameSelector);
    const fileName = `${testName}_${userName}.csv`;
    downloadCSV(fileName, data);
  } catch (e) {
    yield call(message.error, e?.data?.message || "Download failed");
  }
}

export function* watcherSaga() {
  yield all([
    yield takeEvery(RECEIVE_GRADEBOOK_REQUEST, receiveGradeBookSaga),
    yield takeEvery(RECEIVE_TESTACTIVITY_REQUEST, receiveTestActivitySaga),
    yield takeEvery(UPDATE_RELEASE_SCORE, releaseScoreSaga),
    yield takeEvery(SET_MARK_AS_DONE, markAsDoneSaga),
    yield takeEvery(OPEN_ASSIGNMENT, openAssignmentSaga),
    yield takeEvery(CLOSE_ASSIGNMENT, closeAssignmentSaga),
    yield takeEvery(SAVE_OVERALL_FEEDBACK, saveOverallFeedbackSaga),
    yield takeEvery(TOGGLE_PAUSE_ASSIGNMENT, togglePauseAssignment),
    yield takeEvery(MARK_AS_ABSENT, markAbsentSaga),
    yield takeEvery(MARK_AS_SUBMITTED, markAsSubmittedSaga),
    yield takeEvery(REMOVE_STUDENTS, removeStudentsSaga),
    yield takeEvery(FETCH_STUDENTS, fetchStudentsByClassSaga),
    yield takeEvery(GET_ALL_TESTACTIVITIES_FOR_STUDENT, getAllTestActivitiesForStudentSaga),
    yield takeEvery(ADD_STUDENTS, addStudentsSaga),
    yield takeEvery(DOWNLOAD_GRADES_RESPONSES, downloadGradesAndResponseSaga)
  ]);
}

export const stateGradeBookSelector = state => state.author_classboard_gradebook;
export const stateTestActivitySelector = state => state.author_classboard_testActivity;

export const getCurrentTestActivityIdSelector = createSelector(
  stateTestActivitySelector,
  state => state.currentTestActivityId || ""
);

export const getAllTestActivitiesForStudentSelector = createSelector(
  stateTestActivitySelector,
  state => state.allTestActivitiesForStudent || []
);

export const getItemSummary = (entities, questionsOrder, itemsSummary, originalQuestionActivities) => {
  const questionMap = {};
  let testItemsDataKeyed = {};
  let originalQuestionActivitiesKeyed = {};

  if (itemsSummary) {
    testItemsDataKeyed = keyBy(itemsSummary, "_id");
  }

  if (originalQuestionActivities) {
    //originalQuestionActivitiesKeyed = keyBy(originalQuestionActivities, "_id");
    const originalQuestionActivitiesGrouped = groupBy(originalQuestionActivities, "testItemId");
    for (const itemId of Object.keys(originalQuestionActivitiesGrouped)) {
      const item = originalQuestionActivitiesGrouped[itemId];
      const manuallyGradedPresent = originalQuestionActivitiesGrouped[itemId].find(x => x.graded === false);
      /**
       * even if at-least 1 questionActivity with graded false
       * and itemLevelScoring is enabled,
       * then every other questionActivities in the item
       * should be treated as manually gradable
       */
      if (manuallyGradedPresent && originalQuestionActivitiesGrouped[itemId][0].weight > 1) {
        originalQuestionActivitiesGrouped[itemId] = originalQuestionActivitiesGrouped[itemId].map(x => ({
          ...x,
          score: undefined,
          graded: false
        }));
      }
    }

    originalQuestionActivitiesKeyed = keyBy(_values(originalQuestionActivitiesGrouped).flat(), "_id");
  }

  for (const entity of entities) {
    const { questionActivities = [] } = entity;

    for (let {
      _id,
      notStarted,
      skipped,
      correct,
      timeSpent,
      partialCorrect: partiallyCorrect,
      testItemId,
      disabled,
      score,
      maxScore,
      graded,
      qLabel,
      barLabel,
      qid
    } of questionActivities.filter(x => !x.disabled)) {
      let skippedx = false;
      if (!questionMap[_id]) {
        questionMap[_id] = {
          _id,
          qLabel: qLabel,
          barLabel: barLabel,
          itemLevelScoring: false,
          itemId: null,
          attemptsNum: 0,
          avgTimeSpent: 0,
          correctNum: 0,
          skippedNum: 0,
          wrongNum: 0,
          partialNum: 0,
          notStartedNum: 0,
          timeSpent: 0,
          manualGradedNum: 0
        };
      }
      if (testItemId) {
        questionMap[_id].itemLevelScoring = true;
        questionMap[_id].itemId = testItemId;
      }
      if (!notStarted) {
        questionMap[_id].attemptsNum += 1;
      } else {
        if (score > 0) {
          notStarted = false;
        } else {
          questionMap[_id].notStartedNum += 1;
        }
      }

      if (skipped && score === 0) {
        questionMap[_id].skippedNum += 1;
        skippedx = true;
      }
      if (score > 0) {
        skipped = false;
      }

      if (graded === false && !notStarted && !skipped && !score) {
        questionMap[_id].manualGradedNum += 1;
      } else if (score === maxScore && !notStarted && score > 0) {
        questionMap[_id].correctNum += 1;
      } else if (score === 0 && !notStarted && maxScore > 0 && !skippedx) {
        questionMap[_id].wrongNum += 1;
      } else if (score > 0 && score < maxScore) {
        questionMap[_id].partialNum += 1;
      }
      if (timeSpent && !notStarted) {
        questionMap[_id].timeSpent += timeSpent;
      }
    }
  }
  for (const question in questionMap) {
    questionMap[question].avgTimeSpent = questionMap[question].timeSpent / questionMap[question].attemptsNum;
  }
  return sortBy(_values(questionMap), [x => questionsOrder[x._id]]);
};

export const getAggregateByQuestion = (entities, studentId) => {
  if (!entities) {
    return {};
  }
  const total = entities.length;
  let submittedEntities = entities.filter(x => x.status === "submitted");
  const activeEntities = entities.filter(
    x => x.status === "inProgress" || x.status === "submitted" || x.status === "graded"
  );
  let questionsOrder = {};
  if (entities.length > 0) {
    questionsOrder = entities[0].questionActivities.reduce((acc, cur, ind) => {
      acc[cur._id] = ind;
      return acc;
    }, {});
  }
  const submittedNumber = submittedEntities.length;
  // TODO: handle absent
  const absentNumber = 0;
  const scores = activeEntities.map(({ score, maxScore }) => score / maxScore).reduce((prev, cur) => prev + cur, 0);
  const submittedScoresAverage = activeEntities.length > 0 ? scores / activeEntities.length : 0;
  // const startedEntities = entities.filter(x => x.status !== "notStarted");
  if (studentId) {
    entities = entities.filter(x => x.studentId === studentId);
  }

  const itemsSummary = getItemSummary(entities, questionsOrder);
  const result = {
    total,
    submittedNumber,
    absentNumber,
    avgScore: submittedScoresAverage,
    questionsOrder,
    itemsSummary
  };
  return result;
};

export const classStudentsSelector = createSelector(
  stateTestActivitySelector,
  state => state.classStudents.filter(student => student.enrollmentStatus !== "0" && student.status !== 0)
);
export const removedStudentsSelector = createSelector(
  stateTestActivitySelector,
  state => state.removedStudents
);

export const getGradeBookSelector = createSelector(
  stateTestActivitySelector,
  removedStudentsSelector,
  (state, removedStudents) => {
    const entities = state.entities.filter(item => !removedStudents.includes(item.studentId));
    return getAggregateByQuestion(entities);
  }
);

export const getTestActivitySelector = createSelector(
  stateTestActivitySelector,
  removedStudentsSelector,
  (state, removedStudents) => state.entities.filter(item => !removedStudents.includes(item.studentId))
);

export const notStartedStudentsSelector = createSelector(
  getTestActivitySelector,
  state => state.filter(x => x.status === "notStarted")
);

export const inProgressStudentsSelector = createSelector(
  getTestActivitySelector,
  state => state.filter(x => x.status === "inProgress")
);

export const getAdditionalDataSelector = createSelector(
  stateTestActivitySelector,
  state => state.additionalData
);

export const testNameSelector = createSelector(
  stateTestActivitySelector,
  state => state.additionalData.testName
);

export const getCanMarkAssignmentSelector = createSelector(
  getAdditionalDataSelector,
  state => get(state, "canMarkAssignment", false)
);

export const getClassesCanBeMarkedSelector = createSelector(
  getAdditionalDataSelector,
  state => get(state, "classesCanBeMarked", [])
);

export const getCurrentClassIdSelector = createSelector(
  getAdditionalDataSelector,
  state => get(state, "classId", "")
);

export const getMarkAsDoneEnableSelector = createSelector(
  getClassesCanBeMarkedSelector,
  getCurrentClassIdSelector,
  (classes, currentClass) => classes.includes(currentClass)
);

export const getAssignedBySelector = createSelector(
  getAdditionalDataSelector,
  state => get(state, "assignedBy", {})
);

export const isItemVisibiltySelector = createSelector(
  stateTestActivitySelector,
  getAdditionalDataSelector,
  getUserId,
  getAssignedBySelector,
  (state, additionalData, userId, assignedBy) => {
    const assignmentStatus = state?.data?.status;
    const contentVisibility = additionalData?.testContentVisibility;
    //For assigned by user content will be always visible.
    if (userId === assignedBy?._id) {
      return true;
    }
    //No key called testContentVisibility ?
    if (!additionalData?.hasOwnProperty("testContentVisibility")) {
      return true;
    }
    // Enable for contentVisibility settings ALWAYS or settings GRADING and assignment status is grading or done.
    return (
      contentVisibility === testContentVisibility.ALWAYS ||
      ([IN_GRADING, DONE].includes(assignmentStatus) && contentVisibility === testContentVisibility.GRADING)
    );
  }
);

export const classListSelector = createSelector(
  getAdditionalDataSelector,
  state => state?.classes || []
);

export const testActivtyLoadingSelector = createSelector(
  stateTestActivitySelector,
  state => state.loading
);

export const getTestItemsDataSelector = createSelector(
  stateTestActivitySelector,
  state => get(state, "data.testItemsData")
);

export const getTestItemsOrderSelector = createSelector(
  stateTestActivitySelector,
  state =>
    get(state, "data.test.testItems", []).reduce((acc, item, idx) => {
      const id = item.itemId || item._id;
      acc[id] = idx;
      return acc;
    }, {})
);

export const getAssignmentClassIdSelector = createSelector(
  stateTestActivitySelector,
  ({ classId, assignmentId }) => ({ classId, assignmentId })
);

export const stateClassResponseSelector = state => state.classResponse;
export const stateStudentResponseSelector = state => state.studentResponse;
export const stateClassStudentResponseSelector = state => state.classStudentResponse;
export const stateFeedbackResponseSelector = state => state.feedbackResponse;
export const stateStudentAnswerSelector = state => state.studentQuestionResponse;
export const stateExpressGraderAnswerSelector = state => state.answers;
export const stateQuestionAnswersSelector = state => state.classQuestionResponse;

export const getClassResponseSelector = createSelector(
  stateClassResponseSelector,
  state => state.data
);

export const showScoreSelector = createSelector(
  stateClassResponseSelector,
  state => state.showScore
);

export const getStudentResponseSelector = createSelector(
  stateStudentResponseSelector,
  state => state.data
);

export const getClassStudentResponseSelector = createSelector(
  stateClassStudentResponseSelector,
  state => state.data
);

export const getFeedbackResponseSelector = createSelector(
  stateFeedbackResponseSelector,
  state => state.data
);

export const getStudentQuestionSelector = createSelector(
  stateStudentAnswerSelector,
  stateExpressGraderAnswerSelector,
  (state, egAnswers) => {
    if (!isEmpty(state.data)) {
      const data = Array.isArray(state.data) ? state.data : [state.data];
      return data.map(x => {
        if (!isNullOrUndefined(egAnswers[x.qid])) {
          return { ...x, userResponse: egAnswers[x.qid] };
        } else {
          return x;
        }
      });
    } else {
      return [];
    }
  }
);

export const getClassQuestionSelector = createSelector(
  stateQuestionAnswersSelector,
  state => state.data
);

export const stateTestQuestionActivitiesSelector = state => state.author_classboard_testActivity;

export const getTestQuestionActivitiesSelector = createSelector(
  stateTestQuestionActivitiesSelector,
  state => {
    if (state.data) {
      return state.data.testQuestionActivities;
    }
    return [];
  }
);

export const getDynamicVariablesSetIdForViewResponse = (state, studentId) => {
  const testActivities = get(state, "author_classboard_testActivity.data.testActivities", []);
  const studentTestActivity = testActivities.find(x => x.userId === studentId);
  if (!studentTestActivity) {
    return false;
  }
  return studentTestActivity.algoVariableSetIds;
};

export const getQIdsSelector = createSelector(
  stateTestActivitySelector,
  state => {
    const testItemsData = get(state, "data.test.testItems", []);
    if (testItemsData.length === 0) {
      return [];
    }
    const qIds = getAllQids(testItemsData);
    return qIds;
  }
);

export const getQLabelsSelector = createSelector(
  stateTestActivitySelector,
  state => {
    const testItemsData = get(state, "data.test.testItems", []);
    return getQuestionLabels(testItemsData);
  }
);
