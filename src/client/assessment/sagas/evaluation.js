import { takeEvery, put, all, select, call } from "redux-saga/effects";
import { message } from "antd";
import { isEmpty, values } from "lodash";
import { testItemsApi } from "@edulastic/api";

import { getQuestionIds } from "./items";
// actions
import {
  CHECK_ANSWER_EVALUATION,
  ADD_ITEM_EVALUATION,
  CLEAR_ITEM_EVALUATION,
  COUNT_CHECK_ANSWER
} from "../constants/actions";
import { itemQuestionsSelector, answersForCheck } from "../selectors/test";
import { CHANGE_PREVIEW, CHANGE_VIEW } from "../../author/src/constants/actions";

function* evaluateAnswers({ payload: groupId }) {
  try {
    yield put({
      type: CLEAR_ITEM_EVALUATION
    });
    const questionIds = yield select(itemQuestionsSelector);
    const allAnswers = yield select(answersForCheck);
    const answerIds = Object.keys(allAnswers);
    const userResponse = {};
    const testActivityId = yield select(state => state.test && state.test.testActivityId);
    answerIds.forEach(id => {
      if (questionIds.includes(id)) {
        userResponse[id] = allAnswers[id];
      }
    });

    const validResponses = values(userResponse).filter(item => !!item);
    //if user response is empty show toaster msg.
    if (isEmpty(validResponses)) {
      return message.warn("Attempt the question to check answer");
    }
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
    const { evaluations, maxScore, score } = yield call(testItemsApi.evaluation, testItemId, activity);

    yield put({
      type: CHANGE_PREVIEW,
      payload: {
        view: "check"
      }
    });
    yield put({
      type: CHANGE_VIEW,
      payload: {
        view: "preview"
      }
    });

    yield put({
      type: ADD_ITEM_EVALUATION,
      payload: {
        ...evaluations
      }
    });

    yield put({
      type: COUNT_CHECK_ANSWER,
      payload: {
        itemId: testItemId
      }
    });
    message.success(`score: ${score.toFixed()}/${maxScore}`);
  } catch (err) {
    if (err.status === 403) message.error("Check answer limit exceeded for the item");
    else message.error("Check answer failed");
    console.log(err);
  }
}

export default function* watcherSaga() {
  yield all([yield takeEvery(CHECK_ANSWER_EVALUATION, evaluateAnswers)]);
}
