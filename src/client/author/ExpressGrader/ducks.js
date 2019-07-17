import { createAction } from "redux-starter-kit";
import { takeEvery, call, put, all, select } from "redux-saga/effects";
import { message } from "antd";
import { testActivityApi } from "@edulastic/api";
import { gradebookTestItemAddAction } from "../src/reducers/testActivity";

export const SUBMIT_RESPONSE = "[expressGraderAnswers] submit";

export const submitResponseAction = createAction(SUBMIT_RESPONSE);

function* submitResponse({ payload }) {
  const { testActivityId, itemId, groupId, userResponse } = payload;

  try {
    const scoreRes = yield call(testActivityApi.updateResponseEntryAndScore, {
      testActivityId,
      itemId,
      groupId,
      userResponse
    });
    yield call(message.success, "updated response successfully");
    const { questionActivities } = scoreRes;
    yield put(
      gradebookTestItemAddAction(
        questionActivities.map(({ qid: _id, score, maxScore, testActivityId }) => ({
          testActivityId,
          _id,
          score,
          maxScore
        }))
      )
    );
  } catch (e) {
    console.error(e);
    yield call(message.error, "edit response failed");
  }
}

export function* watcherSaga() {
  yield all([yield takeEvery(SUBMIT_RESPONSE, submitResponse)]);
}
