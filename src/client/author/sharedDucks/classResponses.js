import { delay } from "redux-saga";
import { takeEvery, call, put, all, takeLatest } from "redux-saga/effects";
import { classResponseApi, testActivityApi } from "@edulastic/api";
import { message } from "antd";

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
  RECEIVE_CLASS_QUESTION_ERROR
} from "../src/constants/actions";

function* receiveClassResponseSaga({ payload }) {
  try {
    const classResponse = yield call(classResponseApi.classResponse, payload);

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

    yield put({
      type: RECEIVE_STUDENT_RESPONSE_SUCCESS,
      payload: studentResponse
    });
  } catch (err) {
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
      questionId,
      body: { groupId, score, feedback }
    } = payload;

    const [scoreRes, feedbackResponse] = yield all([
      call(testActivityApi.updateResponseEntryAndScore, {
        testActivityId,
        itemId,
        groupId,
        scores: { [questionId]: score }
      }),
      call(testActivityApi.updateQuestionFeedBack, { testActivityId, questionId, feedback, groupId })
    ]);

    yield put({ type: RECEIVE_STUDENT_RESPONSE_REQUEST, payload: { testActivityId, groupId } });

    yield put({
      type: RECEIVE_FEEDBACK_RESPONSE_SUCCESS,
      payload: feedbackResponse
    });
  } catch (err) {
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
    }

    yield put({
      type: RECEIVE_STUDENT_QUESTION_SUCCESS,
      payload: feedbackResponse
    });
  } catch (err) {
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
    if (payload.testItemId) {
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

export function* watcherSaga() {
  yield all([
    yield takeEvery(RECEIVE_CLASS_RESPONSE_REQUEST, receiveClassResponseSaga),
    yield takeEvery(RECEIVE_STUDENT_QUESTION_REQUEST, receiveStudentQuestionSaga),
    yield takeEvery(RECEIVE_CLASSSTUDENT_RESPONSE_REQUEST, receiveClassStudentResponseSaga),
    yield takeEvery(RECEIVE_CLASS_QUESTION_REQUEST, receiveClassQuestionSaga),
    yield takeEvery(RECEIVE_STUDENT_RESPONSE_REQUEST, receiveStudentResponseSaga),
    yield takeLatest(RECEIVE_FEEDBACK_RESPONSE_REQUEST, receiveFeedbackResponseSaga)
  ]);
}
