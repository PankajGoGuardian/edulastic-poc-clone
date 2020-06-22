import { takeEvery, call, put, all, select } from "redux-saga/effects";
import { get as _get, round } from "lodash";
import { testItemsApi } from "@edulastic/api";
import { LOCATION_CHANGE, push } from "connected-react-router";
import { questionType } from "@edulastic/constants";
import { Effects, notification } from "@edulastic/common";
import * as Sentry from "@sentry/browser";
import { evaluateItem } from "../utils/evalution";
import { hasEmptyAnswers } from "../../questionUtils";

import {
  CREATE_TEST_ITEM_REQUEST,
  CREATE_TEST_ITEM_ERROR,
  RECEIVE_ITEM_DETAIL_SUCCESS,
  UPDATE_TEST_ITEM_REQUEST,
  UPDATE_TEST_ITEM_SUCCESS,
  UPDATE_TEST_ITEM_ERROR,
  SHOW_ANSWER,
  CHECK_ANSWER,
  CLEAR_ITEM_EVALUATION,
  ADD_ITEM_EVALUATION,
  CHANGE_VIEW
} from "../constants/actions";

import { SET_ITEM_SCORE } from "../ItemScore/ducks";

import { removeUserAnswerAction } from "../../../assessment/actions/answers";
import { resetDictAlignmentsAction } from "../actions/dictionaries";
import { PREVIEW, CLEAR } from "../../../assessment/constants/constantsForQuestions";

import { getQuestionsSelector, CHANGE_CURRENT_QUESTION, getCurrentQuestionSelector } from "../../sharedDucks/questions";

function* createTestItemSaga({ payload: { data, testFlow, testId, newPassageItem = false, testName } }) {
  try {
    // create a empty item and put it in store.
    let item = {
      _id: "new",
      rows: [{ tabs: [], dimension: "100%", widgets: [], flowLayout: false, content: "" }],
      columns: [],
      tags: [],
      status: "draft",
      createdBy: {},
      maxScore: 0,
      active: 1,
      grades: [],
      subjects: [],
      standards: [],
      curriculums: [],
      data: {
        questions: [],
        resources: []
      },
      itemLevelScoring: true,
      analytics: [
        {
          usage: 0,
          likes: 0
        }
      ],
      multipartItem: false,
      isPassageWithQuestions: false,
      canAddMultipleItems: false
    };

    yield put(resetDictAlignmentsAction());

    // if its a being added from passage, create new.
    if (newPassageItem) {
      item = yield call(testItemsApi.create, data);
    }

    yield put({
      type: RECEIVE_ITEM_DETAIL_SUCCESS,
      payload: item
    });

    if (!testFlow) {
      yield put(push(`/author/items/${item._id}/item-detail`));
    } else {
      yield put(
        push({
          pathname: `/author/tests/${testId}/createItem/${item._id}`,
          state: { fadeSidebar: true, testName }
        })
      );
    }
  } catch (err) {
    console.error(err);
    Sentry.captureException(err);
    const errorMessage = "create item failed";
    notification({ msg: errorMessage });
    yield put({
      type: CREATE_TEST_ITEM_ERROR,
      payload: { error: errorMessage }
    });
  }
}

function* updateTestItemSaga({ payload }) {
  try {
    const item = yield call(testItemsApi.update, payload);
    yield put({
      type: UPDATE_TEST_ITEM_SUCCESS,
      payload: { item }
    });
  } catch (err) {
    console.error(err);
    Sentry.captureException(err);
    const errorMessage = "Update item is failed";
    notification({ msg: errorMessage });
    yield put({
      type: UPDATE_TEST_ITEM_ERROR,
      payload: { error: errorMessage }
    });
  }
}

function* evaluateAnswers({ payload }) {
  try {
    const question = yield select(getCurrentQuestionSelector);
    const item = yield select(state => state.itemDetail?.item);
    if (question) {
      const hasEmptyAnswer = hasEmptyAnswers(question);

      if (hasEmptyAnswer) throw new Error("Correct answer is not set");

      // clear previous evaluation
      yield put({
        type: CLEAR_ITEM_EVALUATION,
        payload: question?.type === questionType.MATH
      });
    }
    if ((payload === "question" || (payload?.mode === "show" && question)) && !item.isDocBased) {
      const answers = yield select(state => _get(state, "answers", []));
      const { evaluation, score, maxScore } = yield evaluateItem(answers, {
        [question?.id]: question
      });

      yield put({
        type: ADD_ITEM_EVALUATION,
        payload: {
          ...evaluation
        }
      });

      if (payload?.mode !== "show") {
        // do not re calculate the score in case show answer is clicked
        yield put({
          type: SET_ITEM_SCORE,
          payload: {
            score: round(score, 2),
            maxScore,
            showScore: true
          }
        });
      }
    } else {
      const answers = yield select(state => _get(state, "answers", {}));
      const { itemLevelScore, itemLevelScoring = false } = yield select(state => state.itemDetail.item);
      const questions = yield select(getQuestionsSelector);
      const { evaluation, score, maxScore } = yield evaluateItem(answers, questions, itemLevelScoring, itemLevelScore);
      yield put({
        type: ADD_ITEM_EVALUATION,
        payload: {
          ...evaluation
        }
      });
      if (payload?.mode !== "show") {
        yield put({
          type: SET_ITEM_SCORE,
          payload: {
            score: round(score, 2),
            maxScore,
            showScore: true
          }
        });
      }
    }
  } catch (err) {
    console.error(err);
    Sentry.captureException(err);
    const errorMessage =
      err.message || "Expression syntax is incorrect. Please refer to the help docs on what is allowed";
    notification({ msg: errorMessage });
  }
}

function* showAnswers() {
  try {
    yield put({ type: CHECK_ANSWER, payload: { mode: "show" } }); // validate the results first then show it
    // with check answer itself,it will save evaluation , we dont need this again.
  } catch (err) {
    console.error(err);
    Sentry.captureException(err);
    const errorMessage = "Show Answer Failed";
    notification({ msg: errorMessage });
  }
}

function* setAnswerSaga({ payload }) {
  try {
    const { preview, view } = yield select(state => _get(state, "view", {}));

    if ((preview === CLEAR && view === PREVIEW) || payload.view === "edit") {
      yield put(removeUserAnswerAction());
    }
  } catch (e) {
    console.log("error:", e);
    Sentry.captureException(e);
  }
}

function* testItemLocationChangeSaga({ payload }) {
  // when user lands at item-detail route (item level)
  // Clear current on authorQuestions, so we have a clean item/question state every time
  // we rely on this in evaluateAnswers
  const currentItemId = yield select(state => _get(state, "itemDetail.item._id"));
  if (
    payload.location.pathname.indexOf("item-detail") !== -1 &&
    (payload.location.pathname.split("/")[3] !== currentItemId || !currentItemId)
  ) {
    yield put({
      type: CHANGE_CURRENT_QUESTION,
      payload: ""
    });
  }
}

export default function* watcherSaga() {
  yield all([
    yield takeEvery(CREATE_TEST_ITEM_REQUEST, createTestItemSaga),
    yield Effects.throttleAction(10000, UPDATE_TEST_ITEM_REQUEST, updateTestItemSaga),
    yield takeEvery(CHECK_ANSWER, evaluateAnswers),
    yield takeEvery(CHANGE_VIEW, setAnswerSaga),
    yield takeEvery(SHOW_ANSWER, showAnswers),
    yield takeEvery(LOCATION_CHANGE, testItemLocationChangeSaga)
  ]);
}
