import { takeEvery, call, put, all } from "redux-saga/effects";
import { classBoardApi } from "@edulastic/api";
import { message } from "antd";
import { createSelector } from "reselect";
import { values as _values, get, keyBy } from "lodash";

import { setShowScoreAction } from "../src/actions/classBoard";

import {
  RECEIVE_GRADEBOOK_REQUEST,
  RECEIVE_GRADEBOOK_SUCCESS,
  RECEIVE_GRADEBOOK_ERROR,
  RECEIVE_TESTACTIVITY_REQUEST,
  RECEIVE_TESTACTIVITY_SUCCESS,
  RECEIVE_TESTACTIVITY_ERROR,
  UPDATE_RELEASE_SCORE
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
    yield put({
      type: RECEIVE_TESTACTIVITY_SUCCESS,
      payload: { gradebookData, additionalData }
    });

    const releaseScore = additionalData.showScore;
    yield put(setShowScoreAction(releaseScore));
  } catch (err) {
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

export function* watcherSaga() {
  yield all([
    yield takeEvery(RECEIVE_GRADEBOOK_REQUEST, receiveGradeBookSaga),
    yield takeEvery(RECEIVE_TESTACTIVITY_REQUEST, receiveTestActivitySaga),
    yield takeEvery(UPDATE_RELEASE_SCORE, releaseScoreSaga)
  ]);
}

export const stateGradeBookSelector = state => state.author_classboard_gradebook;
export const stateTestActivitySelector = state => state.author_classboard_testActivity;

export const getGradeBookSelector = createSelector(
  stateTestActivitySelector,
  state => {
    const { entities } = state;
    const total = entities.length;
    const submittedEntities = entities.filter(x => x.status === "submitted");
    const submittedNumber = submittedEntities.length;
    // TODO: handle absent
    const absentNumber = 0;
    const submittedScores = submittedEntities
      .map(({ score, maxScore }) => score / maxScore)
      .reduce((prev, cur) => prev + cur, 0);
    const submittedScoresAverage = submittedNumber > 0 ? submittedScores / submittedNumber : 0;
    // const startedEntities = entities.filter(x => x.status !== "notStarted");
    const questionMap = {};
    for (const entity of entities) {
      const { questionActivities } = entity;
      for (const { _id, notStarted, skipped, correct, timeSpent, partiallyCorrect } of questionActivities) {
        if (!questionMap[_id]) {
          questionMap[_id] = {
            _id,
            attemptsNum: 0,
            avgTimeSpent: 0,
            correctNum: 0,
            skippedNum: 0,
            wrongNum: 0,
            partialNum: 0,
            notStartedNum: 0,
            timeSpent: 0
          };
        }
        if (!notStarted) {
          questionMap[_id].attemptsNum += 1;
        } else {
          questionMap[_id].notStartedNum += 1;
        }

        if (skipped) {
          questionMap[_id].skippedNum += 1;
        }

        if (correct) {
          questionMap[_id].correctNum += 1;
        }

        if (!correct && !notStarted) {
          questionMap[_id].wrongNum += 1;
        }

        if (partiallyCorrect) {
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
  }
);
export const getTestActivitySelector = createSelector(
  stateTestActivitySelector,
  state => state.entities
);

export const getAdditionalDataSelector = createSelector(
  stateTestActivitySelector,
  state => state.additionalData
);

export const getTestItemsDataSelector = createSelector(
  stateTestActivitySelector,
  state => get(state, "data.testItemsData")
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
    console.log("qid state", state);
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
