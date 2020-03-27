import { delay } from "redux-saga";
import { takeEvery, call, put, all, takeLatest, select, fork } from "redux-saga/effects";
import { classResponseApi, testActivityApi, attchmentApi as attachmentApi } from "@edulastic/api";
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
import { LOAD_SCRATCH_PAD, SAVE_USER_WORK } from "../../assessment/constants/actions";
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

function* loadAttachmentsFromServer(filter) {
  try {
    const { referrerId, referrerId2, uqaId } = filter;
    // perf optimisation
    // call the api only if data is not present in the store
    const { attachments = [] } = yield call(attachmentApi.loadAllAttachments, { referrerId, referrerId2 });
    const scratchpadData = {};
    for (const attachment of attachments) {
      const { data } = attachment;
      scratchpadData[uqaId] = data.scratchpad;
    }
    yield put({ type: SAVE_USER_WORK, payload: scratchpadData });
  } catch (error) {
    console.error("error from attachmentAPI", error);
  }
}

function* getAttachmentsForItems({ testActivityId, testItemsIdArray = [] }) {
  yield all(
    testItemsIdArray.map(({ testItemId, uqaId }) =>
      call(loadAttachmentsFromServer, { referrerId: testActivityId, referrerId2: testItemId, uqaId })
    )
  );
}

function* receiveStudentResponseSaga({ payload }) {
  try {
    const studentResponse = yield call(classResponseApi.studentResponse, payload);
    const { questionActivities = [] } = studentResponse;
    const scratchpadUsedItems = questionActivities
      .filter(activity => activity.qType === "highlightImage" && activity?.scratchPad?.scratchpad === true)
      .map(activity => ({ uqaId: activity._id, testItemId: activity.testItemId }));

    yield fork(getAttachmentsForItems, {
      testActivityId: payload.testActivityId,
      testItemsIdArray: scratchpadUsedItems
    });
    const originalData = yield select(state => state.author_classboard_testActivity?.data);
    // AUTOSELECT group will have different questions for every student
    // hence update the items from student response api
    if (hasRandomQuestions(originalData.test.itemGroups)) {
      const itemGroups = originalData.test.itemGroups.map(group => ({
        ...group,
        items: studentResponse.itemGroups[group._id] || []
      }));
      const testItems = itemGroups.flatMap(itemGroup => itemGroup.items || []);
      markQuestionLabel(testItems);
      originalData.test.itemGroups = itemGroups;
      originalData.test.testItems = testItems;
      originalData.testItemsData = testItems;
      yield put({
        type: UPDATE_STUDENT_TEST_ITEMS,
        payload: { testItems, itemGroups }
      });
      yield put(setCurrentTestActivityIdAction(payload.testActivityId));
    }
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

    const userWork = {};

    transformedQuestionActivities.forEach(item => {
      if (item.scratchPad) {
        const newUserWork = { ...item.scratchPad };
        userWork[item.testItemId] = newUserWork;
      }
    });
    if (Object.keys(userWork).length > 0) {
      yield put({
        type: LOAD_SCRATCH_PAD,
        payload: userWork
      });
    }

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
      body: { groupId, feedback }
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
    yield put({
      type: RECEIVE_STUDENT_RESPONSE_REQUEST,
      payload: { testActivityId, groupId, studentId }
    });
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
    const scratchpadUsedItems = feedbackResponse
      .filter(activity => activity.qType === "highlightImage" && activity?.scratchPad?.scratchpad === true)
      .map(activity => ({
        uqaId: activity._id,
        testItemId: activity.testItemId,
        testActivityId: activity.testActivityId
      }));
    for (const item of scratchpadUsedItems) {
      yield fork(getAttachmentsForItems, {
        testActivityId: item.testActivityId,
        testItemsIdArray: [item]
      });
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
      score,
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
    let gradeBookTestItemAddPayload = [];
    for (const {
      qid: _id,
      score: _score,
      maxScore,
      testActivityId: _testActivityId,
      graded,
      skipped
    } of questionActivities) {
      gradeBookTestItemAddPayload.push({
        testActivityId: _testActivityId,
        _id,
        score: _score,
        maxScore,
        graded,
        skipped
      });
    }

    yield put(gradebookTestItemAddAction(gradeBookTestItemAddPayload));
    yield put({
      type: RESPONSE_ENTRY_SCORE_SUCCESS,
      payload: { questionActivities, testActivity }
    });

    // should run only when score gets updated
    if (shouldReceiveStudentResponse) {
      yield put({
        type: RECEIVE_STUDENT_RESPONSE_REQUEST,
        payload: { testActivityId, groupId, studentId }
      });
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
