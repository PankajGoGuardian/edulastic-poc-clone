import { takeEvery, call, put, all, select } from "redux-saga/effects";
import { message } from "antd";
import { get as _get } from "lodash";
import { testItemsApi } from "@edulastic/api";
import { LOCATION_CHANGE, push } from "connected-react-router";
import { evaluateItem } from "../utils/evalution";
import createShowAnswerData from "../utils/showAnswer";

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

import { removeUserAnswerAction } from "../../../assessment/actions/answers";
import { PREVIEW, CLEAR, CHECK } from "../../../assessment/constants/constantsForQuestions";

import { getQuestionsSelector, CHANGE_CURRENT_QUESTION } from "../../sharedDucks/questions";
import { SET_ANSWER } from "../../../assessment/constants/actions";

function* createTestItemSaga({ payload: { data, testFlow, testId } }) {
  try {
    const item = yield call(testItemsApi.create, data);
    yield put({
      type: RECEIVE_ITEM_DETAIL_SUCCESS,
      payload: item
    });

    if (!testFlow) {
      yield put(push(`/author/items/${item._id}/item-detail`));
    } else {
      yield put(push(`/author/tests/${testId}/createItem/${item._id}`));
    }
  } catch (err) {
    console.error(err);
    const errorMessage = "Create item is failed";
    yield call(message.error, errorMessage);
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
    const errorMessage = "Update item is failed";
    yield call(message.error, errorMessage);
    yield put({
      type: UPDATE_TEST_ITEM_ERROR,
      payload: { error: errorMessage }
    });
  }
}

function* evaluateAnswers({ payload }) {
  try {
    // clear previous evaluation
    yield put({
      type: CLEAR_ITEM_EVALUATION
    });

    // url path that the user is at
    const currentPath = yield select(state => _get(state, "router.location.pathname", ""));

    // User is at the question level
    if (payload === "question") {
      const currentQuestionId = yield select(state => _get(state, "authorQuestions.current", ""));

      const answers = yield select(state => _get(state, "answers", []));
      const allQuestions = yield select(state => _get(state, "authorQuestions.byId", []));

      // Add questions that have not been answered
      const answeredAndUnanswered = Object.keys(allQuestions)
        .filter(questionId => questionId === currentQuestionId)
        .reduce((acc, questionId) => {
          if (answers[questionId]) {
            acc[questionId] = answers[questionId];
          } else {
            acc[questionId] = [];
          }

          return acc;
        }, {});

      if (!answers[currentQuestionId]) {
        yield put({
          type: SET_ANSWER,
          payload: {
            id: currentQuestionId,
            data: []
          }
        });
      }
      const questions = yield select(getQuestionsSelector);
      const { evaluation, score, maxScore } = yield evaluateItem(answeredAndUnanswered, questions);
      yield put({
        type: ADD_ITEM_EVALUATION,
        payload: {
          ...evaluation
        }
      });

      message.config({
        maxCount: 1
      });
      const previewMode = yield select(state => _get(state, "view.preview", null));
      if (previewMode === CHECK) {
        message.success(`score: ${score}/${maxScore}`);
      }
    }

    // User is at the item level
    if (currentPath.indexOf("item-detail") !== -1) {
      const oldAnswers = yield select(state => _get(state, "answers", []));
      const entityId = yield select(state => _get(state, "question.entity.data.id", null));
      const allQuestions = yield select(state => _get(state, "authorQuestions.byId", []));
      const { itemLevelScore, itemLevelScoring = false } = yield select(state => state.itemDetail.item);

      const answeredAndUnanswered = Object.keys(allQuestions).reduce((acc, currentId) => {
        acc[currentId] = [];
        return acc;
      }, {});
      const _answeredAndUnanswered = { ...answeredAndUnanswered, ...oldAnswers };

      if (!oldAnswers[entityId]) {
        yield put({
          type: SET_ANSWER,
          payload: {
            id: entityId,
            data: []
          }
        });
      }
      const questions = yield select(getQuestionsSelector);
      const { evaluation, score, maxScore } = yield evaluateItem(
        _answeredAndUnanswered,
        questions,
        itemLevelScoring,
        itemLevelScore
      );

      yield put({
        type: ADD_ITEM_EVALUATION,
        payload: {
          ...evaluation
        }
      });
      message.config({
        maxCount: 1
      });
      const previewMode = yield select(state => _get(state, "view.preview", null));
      if (previewMode === CHECK) {
        message.success(`score: ${score}/${maxScore}`);
      }
    }
  } catch (err) {
    console.error(err);
    const errorMessage = "Answer Evaluation Failed";
    yield call(message.error, errorMessage);
  }
}

function* showAnswers() {
  try {
    yield put({ type: CHECK_ANSWER, payload: { mode: "show" } }); // validate the results first then show it
    const answers = yield select(state => state.answers);
    const validations = yield select(getQuestionsSelector);
    const evaluation = yield createShowAnswerData(validations, answers);

    yield put({
      type: ADD_ITEM_EVALUATION,
      payload: {
        ...evaluation
      }
    });
  } catch (err) {
    console.error(err);
    const errorMessage = "Show Answer Failed";
    yield call(message.error, errorMessage);
  }
}

function* setAnswerSaga({ payload }) {
  try {
    const answers = yield select(state => state.answers);
    const id = yield select(state => _get(state, "question.entity.data.id", {}));
    const { preview, view } = yield select(state => _get(state, "view", {}));

    if ((preview === CLEAR && view === PREVIEW) || payload.view === "edit") {
      yield put(removeUserAnswerAction());
    }

    if (!answers[id]) {
      yield put({
        type: SET_ANSWER,
        payload: {
          id,
          data: []
        }
      });
    }
  } catch (e) {
    console.log("error:", e);
  }
}

function* testItemLocationChangeSaga({ payload }) {
  // when user lands at item-detail route (item level)
  // Clear current on authorQuestions, so we have a clean item/question state every time
  // we rely on this in evaluateAnswers
  if (payload.location.pathname.indexOf("item-detail") !== -1) {
    yield put({
      type: CHANGE_CURRENT_QUESTION,
      payload: ""
    });
  }
}

export default function* watcherSaga() {
  yield all([
    yield takeEvery(CREATE_TEST_ITEM_REQUEST, createTestItemSaga),
    yield takeEvery(UPDATE_TEST_ITEM_REQUEST, updateTestItemSaga),
    yield takeEvery(CHECK_ANSWER, evaluateAnswers),
    yield takeEvery(CHANGE_VIEW, setAnswerSaga),
    yield takeEvery(SHOW_ANSWER, showAnswers),
    yield takeEvery(LOCATION_CHANGE, testItemLocationChangeSaga)
  ]);
}
