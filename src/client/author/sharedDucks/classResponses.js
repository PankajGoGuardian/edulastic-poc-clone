import { delay } from "redux-saga";
import { takeEvery, call, put, all, takeLatest, select } from "redux-saga/effects";
import { classResponseApi, testActivityApi } from "@edulastic/api";
import { message } from "antd";
import { createAction } from "redux-starter-kit";
import {
  RECEIVE_CLASS_RESPONSE_REQUEST,
  RECEIVE_CLASS_RESPONSE_SUCCESS,
  RECEIVE_CLASS_RESPONSE_ERROR,
  RECEIVE_STUDENT_RESPONSE_REQUEST,
  RECEIVE_STUDENT_RESPONSE_SUCCESS,
  RECEIVE_STUDENT_RESPONSE_ERROR,
  RECEIVE_CLASSSTUDENT_RESPONSE_REQUEST,
  RECEIVE_CLASSSTUDENT_RESPONSE_SUCCESS,
  RECEIVE_CLASSSTUDENT_RESPONSE_ERROR,
  RECEIVE_FEEDBACK_RESPONSE_REQUEST,
  RECEIVE_FEEDBACK_RESPONSE_SUCCESS,
  RECEIVE_FEEDBACK_RESPONSE_ERROR,
  RECEIVE_STUDENT_QUESTION_REQUEST,
  RECEIVE_STUDENT_QUESTION_SUCCESS,
  RECEIVE_STUDENT_QUESTION_ERROR,
  RECEIVE_CLASS_QUESTION_REQUEST,
  RECEIVE_CLASS_QUESTION_SUCCESS,
  RECEIVE_CLASS_QUESTION_ERROR,
  RESPONSE_ENTRY_SCORE_SUCCESS,
  UPDATE_STUDENT_TEST_ITEMS
} from "../src/constants/actions";
import { gradebookTestItemAddAction } from "../src/reducers/testActivity";

import { markQuestionLabel, transformGradeBookResponse } from "../ClassBoard/Transformer";
import { setTeacherEditedScore } from "../ExpressGrader/ducks";
import { setCurrentTestActivityIdAction } from "../src/actions/classBoard";
import { hasRandomQuestions } from "../ClassBoard/utils";
// action
export const UPDATE_STUDENT_ACTIVITY_SCORE = "[classResponse] update student activity score";

// action creators
export const updateStudentQuestionActivityScoreAction = createAction(UPDATE_STUDENT_ACTIVITY_SCORE);

function* receiveClassResponseSaga({ payload }) {
  try {
    const classResponse = yield call(classResponseApi.classResponse, payload);
    classResponse.testItems = classResponse.itemGroups.flatMap(itemGroup => itemGroup.items || []);
    markQuestionLabel(classResponse.testItems);
    yield put({
      type: RECEIVE_CLASS_RESPONSE_SUCCESS,
      payload: classResponse
    });
  } catch (err) {
    const errorMessage = "Receive class response is failing";
    yield call(message.error, errorMessage);
    yield put({
      type: RECEIVE_CLASS_RESPONSE_ERROR,
      payload: { error: errorMessage }
    });
  }
}

function* receiveStudentResponseSaga({ payload }) {
  try {
    const studentResponse = yield call(classResponseApi.studentResponse, payload);
    if (hasRandomQuestions(studentResponse.itemGroups)) {
      const { itemGroups } = studentResponse;
      const testItems = itemGroups.flatMap(itemGroup => itemGroup.items || []);
      markQuestionLabel(testItems);
      yield put({
        type: UPDATE_STUDENT_TEST_ITEMS,
        payload: { testItems, itemGroups }
      });
    }

    const originalData = yield select(state => state.author_classboard_testActivity?.data);
    yield put(setCurrentTestActivityIdAction(payload.testActivityId));
    /**
     * transforming questionActivities to support chart/question labels, etc.,
     */
    const transformed = transformGradeBookResponse(
      {
        ...originalData,
        testActivities: [studentResponse.testActivity],
        testQuestionActivities: studentResponse.questionActivities
      },
      true
    );
    const transformedQuestionActivities = transformed.find(x => x.studentId === payload.studentId)?.questionActivities;
    studentResponse.questionActivities = transformedQuestionActivities;

    yield put({
      type: RECEIVE_STUDENT_RESPONSE_SUCCESS,
      payload: studentResponse
    });
  } catch (err) {
    console.log("err is", err);
    const errorMessage = "Receive tests is failing";
    yield call(message.error, errorMessage);
    yield put({
      type: RECEIVE_STUDENT_RESPONSE_ERROR,
      payload: { error: errorMessage }
    });
  }
}

function* receiveClassStudentResponseSaga({ payload }) {
  try {
    const classStudentResponse = [];
    for (let i = 0; i < payload.selectedActivities.length; i++) {
      classStudentResponse.push(
        yield call(classResponseApi.studentResponse, {
          testActivityId: payload.selectedActivities[i],
          groupId: payload.groupId
        })
      );
    }

    yield put({
      type: RECEIVE_CLASSSTUDENT_RESPONSE_SUCCESS,
      payload: classStudentResponse
    });
  } catch (err) {
    const errorMessage = "Receive tests is failing";
    yield call(message.error, errorMessage);
    yield put({
      type: RECEIVE_CLASSSTUDENT_RESPONSE_ERROR,
      payload: { error: errorMessage }
    });
  }
}

function* receiveFeedbackResponseSaga({ payload }) {
  yield delay(1000);
  try {
    const {
      testActivityId,
      itemId,
      studentId,
      questionId,
      body: { groupId, score, feedback }
    } = payload;

    const feedbackResponse = yield call(testActivityApi.updateQuestionFeedBack, {
      testActivityId,
      questionId,
      feedback,
      groupId,
      itemId
    });

    yield put({
      type: RECEIVE_FEEDBACK_RESPONSE_SUCCESS,
      payload: feedbackResponse
    });
    yield put({ type: RECEIVE_STUDENT_RESPONSE_REQUEST, payload: { testActivityId, groupId, studentId } });
    yield call(message.success("Feedback successully update"));
  } catch (err) {
    console.error(err);
    const errorMessage = "Receive tests is failing";
    yield call(message.error, errorMessage);
    yield put({
      type: RECEIVE_FEEDBACK_RESPONSE_ERROR,
      payload: { error: errorMessage }
    });
  }
}

function* receiveStudentQuestionSaga({ payload }) {
  try {
    let feedbackResponse;
    if (payload.testItemId) {
      feedbackResponse = yield call(classResponseApi.receiveStudentItemQuestionResponse, payload);
    } else {
      feedbackResponse = yield call(classResponseApi.receiveStudentQuestionResponse, payload);
      const { qid, score, autoGrade } = feedbackResponse || {};
      if (!autoGrade) {
        yield put(setTeacherEditedScore({ [qid]: score }));
      }
    }

    yield put({
      type: RECEIVE_STUDENT_QUESTION_SUCCESS,
      payload: feedbackResponse
    });
  } catch (err) {
    console.error(err);
    const errorMessage = "Receive answer is failing";
    yield call(message.error, errorMessage);
    yield put({
      type: RECEIVE_STUDENT_QUESTION_ERROR,
      payload: { error: errorMessage }
    });
  }
}

function* receiveClassQuestionSaga({ payload }) {
  try {
    let feedbackResponse;
    if (payload.testItemId || payload.itemId) {
      feedbackResponse = yield call(classResponseApi.questionClassItemQuestionResponse, payload);
    } else {
      feedbackResponse = yield call(classResponseApi.questionClassQuestionResponse, payload);
    }
    yield put({
      type: RECEIVE_CLASS_QUESTION_SUCCESS,
      payload: feedbackResponse
    });
  } catch (err) {
    const errorMessage = "Receive answers is failing";
    yield call(message.error, errorMessage);
    yield put({
      type: RECEIVE_CLASS_QUESTION_ERROR,
      payload: { error: errorMessage }
    });
  }
}

function* updateStudentScore({ payload }) {
  try {
    const {
      testActivityId,
      itemId,
      questionId,
      score: score,
      groupId,
      studentId,
      shouldReceiveStudentResponse = false
    } = payload;

    const scoreRes = yield call(testActivityApi.updateResponseEntryAndScore, {
      testActivityId,
      itemId,
      groupId,
      scores: { [questionId]: score }
    });

    const { questionActivities, testActivity } = scoreRes;
    for (const { qid: _id, score, maxScore, testActivityId, graded, skipped } of questionActivities) {
      yield put(gradebookTestItemAddAction([{ testActivityId, _id, score, maxScore, graded, skipped }]));
    }
    yield put({ type: RESPONSE_ENTRY_SCORE_SUCCESS, payload: { questionActivities, testActivity } });

    // should run only when score gets updated
    if (shouldReceiveStudentResponse) {
      yield put({ type: RECEIVE_STUDENT_RESPONSE_REQUEST, payload: { testActivityId, groupId, studentId } });
    }

    yield call(message.success("Score is successfully updated"));
  } catch (e) {
    console.log(e);
    yield call(message.error, "Score updation failed");
  }
}

export function* watcherSaga() {
  yield all([
    yield takeEvery(RECEIVE_CLASS_RESPONSE_REQUEST, receiveClassResponseSaga),
    yield takeEvery(RECEIVE_STUDENT_QUESTION_REQUEST, receiveStudentQuestionSaga),
    yield takeEvery(RECEIVE_CLASSSTUDENT_RESPONSE_REQUEST, receiveClassStudentResponseSaga),
    yield takeEvery(RECEIVE_CLASS_QUESTION_REQUEST, receiveClassQuestionSaga),
    yield takeEvery(RECEIVE_STUDENT_RESPONSE_REQUEST, receiveStudentResponseSaga),
    yield takeLatest(RECEIVE_FEEDBACK_RESPONSE_REQUEST, receiveFeedbackResponseSaga),
    yield takeLatest(UPDATE_STUDENT_ACTIVITY_SCORE, updateStudentScore)
  ]);
}
