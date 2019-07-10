import { takeEvery, put, all, select, call } from "redux-saga/effects";
import { message } from "antd";
import { testItemsApi } from "@edulastic/api";
import { getCurrentGroup } from "../../student/Login/ducks";

import { getQuestionIds } from "./items";
// actions
import {
  CHECK_ANSWER_EVALUATION,
  ADD_ITEM_EVALUATION,
  CLEAR_ITEM_EVALUATION,
  CHANGE_PREVIEW,
  COUNT_CHECK_ANSWER
} from "../constants/actions";
import { itemQuestionsSelector, answersForCheck } from "../selectors/test";

function* evaluateAnswers() {
  try {
    yield put({
      type: CLEAR_ITEM_EVALUATION
    });

    const questionIds = yield select(itemQuestionsSelector);
    const allAnswers = yield select(answersForCheck);
    const answerIds = Object.keys(allAnswers);
    const userResponse = {};
    const groupId = yield select(getCurrentGroup);
    const testActivityId = yield select(state => state.test && state.test.testActivityId);
    answerIds.forEach(id => {
      if (questionIds.includes(id)) {
        userResponse[id] = allAnswers[id];
      }
    });

    const { items, currentItem } = yield select(state => state.test);
    const testItemId = items[currentItem]._id;
    const shuffledOptions = yield select(state => state.shuffledOptions);
    const questions = getQuestionIds(items[currentItem]);
    const shuffles = {};
    questions.forEach(question => {
      if (shuffledOptions[question]) {
        shuffles[question] = shuffledOptions[question];
      }
    });
    const userWork = yield select(({ userWork }) => userWork.present[testItemId]);
    const activity = {
      answers: userResponse,
      groupId,
      testActivityId,
      //TODO Need to pick as per the bookmark button status
      reviewLater: false,
      shuffledOptions: shuffles
      //TODO timeSpent:{}
    };
    if (userWork) activity.userWork = userWork;
    const result = yield call(testItemsApi.evaluation, testItemId, activity);

    yield put({
      type: CHANGE_PREVIEW,
      payload: {
        view: "check"
      }
    });

    yield put({
      type: ADD_ITEM_EVALUATION,
      payload: {
        ...result
      }
    });

    yield put({
      type: ADD_ITEM_EVALUATION,
      payload: {
        ...result.evaluations
      }
    });
    yield put({
      type: COUNT_CHECK_ANSWER,
      payload: {
        itemId: testItemId
      }
    });
    const msg = `score: ${+result.score.toFixed(2)} / ${result.maxScore}`;
    yield call(message.success, msg, 0.5);
  } catch (err) {
    if (err.status === 403) message.error("Check answer limit exceeded for the item");
    else message.error("Check answer failed");
    console.log(err);
  }
}

export default function* watcherSaga() {
  yield all([yield takeEvery(CHECK_ANSWER_EVALUATION, evaluateAnswers)]);
}
