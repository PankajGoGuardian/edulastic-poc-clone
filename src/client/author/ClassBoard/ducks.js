import { takeEvery, call, put, all } from "redux-saga/effects";
import { classBoardApi, testActivityApi } from "@edulastic/api";
import { message } from "antd";
import { createSelector } from "reselect";
import { values as _values, get, keyBy } from "lodash";

import {
  setShowScoreAction,
  updateAssignmentStatusAction,
  updateCloseAssignmentsAction,
  updateOpenAssignmentsAction,
  updateStudentActivityAction
} from "../src/actions/classBoard";

import { createFakeData } from "./utils";
import { markQuestionLabel, getQuestionLabels } from "./Transformer";

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
  MARK_AS_ABSENT
} from "../src/constants/actions";

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
    const students = get(gradebookData, "students", []);
    // this method mutates the gradebookData
    markQuestionLabel(gradebookData.testItemsData, gradebookData.test.testItems);
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

    const releaseScore = additionalData.showScore;
    yield put(setShowScoreAction(releaseScore));
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
    const releaseScore = payload.isReleaseScore;
    yield call(classBoardApi.releaseScore, payload);
    yield put(setShowScoreAction(releaseScore));
  } catch (err) {
    const errorMessage = "Update release score is failing";
    yield call(message.error, errorMessage);
  }
}

function* markAsDoneSaga({ payload }) {
  try {
    const response = yield call(classBoardApi.markAsDone, payload);
    yield put(updateAssignmentStatusAction("DONE"));
    yield call(message.success, "Successfully marked as done");
  } catch (err) {
    if (err && err.status == 422) {
      yield call(message.error, err.message);
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

export function* watcherSaga() {
  yield all([
    yield takeEvery(RECEIVE_GRADEBOOK_REQUEST, receiveGradeBookSaga),
    yield takeEvery(RECEIVE_TESTACTIVITY_REQUEST, receiveTestActivitySaga),
    yield takeEvery(UPDATE_RELEASE_SCORE, releaseScoreSaga),
    yield takeEvery(SET_MARK_AS_DONE, markAsDoneSaga),
    yield takeEvery(OPEN_ASSIGNMENT, openAssignmentSaga),
    yield takeEvery(CLOSE_ASSIGNMENT, closeAssignmentSaga),
    yield takeEvery(SAVE_OVERALL_FEEDBACK, saveOverallFeedbackSaga),
    yield takeEvery(MARK_AS_ABSENT, markAbsentSaga)
  ]);
}

export const stateGradeBookSelector = state => state.author_classboard_gradebook;
export const stateTestActivitySelector = state => state.author_classboard_testActivity;

export const getAggregateByQuestion = (entities, studentId) => {
  if (!entities) {
    return {};
  }
  const total = entities.length;
  let submittedEntities = entities.filter(x => x.status === "submitted");
  const activeEntities = entities.filter(
    x => x.status === "inProgress" || (x.status === "submitted") | (x.status === "graded")
  );

  const submittedNumber = submittedEntities.length;
  // TODO: handle absent
  const absentNumber = 0;
  const scores = activeEntities.map(({ score, maxScore }) => score / maxScore).reduce((prev, cur) => prev + cur, 0);
  const submittedScoresAverage = activeEntities.length > 0 ? scores / activeEntities.length : 0;
  // const startedEntities = entities.filter(x => x.status !== "notStarted");
  const questionMap = {};
  if (studentId) {
    entities = entities.filter(x => x.studentId === studentId);
  }

  for (const entity of entities) {
    const { questionActivities } = entity;
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
      barLabel
    } of questionActivities.filter(x => !x.disabled)) {
      let skippedx = false;
      if (!questionMap[_id]) {
        questionMap[_id] = {
          _id,
          qLabel,
          barLabel,
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

      if (graded === false) {
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
  const itemsSummary = _values(questionMap);
  const result = {
    total,
    submittedNumber,
    absentNumber,
    avgScore: submittedScoresAverage,
    itemsSummary
  };
  return result;
};

export const getGradeBookSelector = createSelector(
  stateTestActivitySelector,
  state => getAggregateByQuestion(state.entities)
);

export const getTestActivitySelector = createSelector(
  stateTestActivitySelector,
  state => state.entities
);

export const getAdditionalDataSelector = createSelector(
  stateTestActivitySelector,
  state => state.additionalData
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

export const getTestItemsDataSelector = createSelector(
  stateTestActivitySelector,
  state => get(state, "data.testItemsData")
);

export const getTestItemsOrderSelector = createSelector(
  stateTestActivitySelector,
  state =>
    get(state, "data.test.testItems", []).reduce((acc, id, idx) => {
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
  state => state.data
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

const getAllQids = (testItemIds, testItemsDataKeyed) => {
  let qids = [];
  for (let testItemId of testItemIds) {
    let questions = (testItemsDataKeyed[testItemId].data && testItemsDataKeyed[testItemId].data.questions) || [];
    qids = [...qids, ...questions.map(x => x.id)];
  }
  return qids;
};

export const getQIdsSelector = createSelector(
  stateTestActivitySelector,
  state => {
    const testItemIds = get(state, "data.test.testItems", []);
    const testItemsData = get(state, "data.testItemsData", []);
    if (testItemIds.length === 0 && testItemsData.length === 0) {
      return [];
    }
    const testItemsDataKeyed = keyBy(testItemsData, "_id");
    const qIds = getAllQids(testItemIds, testItemsDataKeyed);
    return qIds;
  }
);

export const getQLabelsSelector = createSelector(
  stateTestActivitySelector,
  state => {
    const testItemIds = get(state, "data.test.testItems", []);
    const testItemsData = get(state, "data.testItemsData", []);
    return getQuestionLabels(testItemsData, testItemIds);
  }
);
