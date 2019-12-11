import { takeLatest, call, put, all, select } from "redux-saga/effects";
import { push } from "connected-react-router";
import { message } from "antd";
import { maxBy } from "lodash";
import { itemsApi, testItemActivityApi } from "@edulastic/api";
import { assignmentPolicyOptions } from "@edulastic/constants";
import { getCurrentGroupWithAllClasses } from "../../student/Login/ducks";
import {
  RECEIVE_ITEM_REQUEST,
  RECEIVE_ITEM_SUCCESS,
  RECEIVE_ITEM_ERROR,
  RECEIVE_ITEMS_SUCCESS,
  RECEIVE_ITEMS_ERROR,
  SAVE_USER_RESPONSE,
  LOAD_USER_RESPONSE,
  LOAD_ANSWERS,
  CLEAR_USER_WORK
} from "../constants/actions";
import { getPreviousAnswersListSelector } from "../selectors/answers";
import { redirectPolicySelector } from "../selectors/test";

function* receiveItemsSaga() {
  try {
    const items = yield call(itemsApi.receiveItems);

    yield put({
      type: RECEIVE_ITEMS_SUCCESS,
      payload: { items }
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: RECEIVE_ITEMS_ERROR,
      payload: { error: "Receive items is failing" }
    });
  }
}

function* receiveItemSaga({ payload }) {
  try {
    const item = yield call(itemsApi.receiveItemById, payload.id);

    yield put({
      type: RECEIVE_ITEM_SUCCESS,
      payload: { item }
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: RECEIVE_ITEM_ERROR,
      payload: { error: "Receive item by id is failing" }
    });
  }
}

// fetch all questionIds from item
export const getQuestionIds = item => {
  let questions = [];
  item.rows &&
    item.rows.forEach(row => {
      questions = [...questions, ...row.widgets.map(widget => widget.reference)].filter(q => !!q);
    });

  return questions;
};

function* saveUserResponse({ payload }) {
  try {
    const ts = payload.timeSpent || 0;
    const { autoSave, shouldClearUserWork = false } = payload;
    const itemIndex = payload.itemId;
    const assignmentsByIds = yield select(state => state.studentAssignment && state.studentAssignment.byId);
    const assignmentId = yield select(state => state.studentAssignment && state.studentAssignment.current);
    const groupId = payload.groupId || (yield select(getCurrentGroupWithAllClasses));
    let { endDate, class: clazz = [] } = assignmentsByIds[assignmentId] || {};
    if (!endDate && clazz.length) {
      endDate = (maxBy(clazz.filter(cl => cl._id === groupId), "endDate") || {}).endDate;
      if (!endDate) {
        endDate = (maxBy(clazz.filter(cl => cl._id === groupId), "closedDate") || {}).closedDate;
      }
    }
    if (endDate && endDate < Date.now()) {
      yield call(message.error, "Test time ended");
      return yield put(push("/home/assignments"));
    }
    const items = yield select(state => state.test && state.test.items);
    const answers = yield select(state => state.answers);
    const userTestActivityId = yield select(state => state.test && state.test.testActivityId);
    const shuffledOptions = yield select(state => state.shuffledOptions);
    const currentItem = items.length && items[itemIndex];
    if (!userTestActivityId || !currentItem) {
      return;
    }

    const questions = getQuestionIds(currentItem);
    const bookmarked = !!(yield select(state => state.assessmentBookmarks[currentItem._id]));
    const userPrevAnswer = yield select(getPreviousAnswersListSelector);
    const redirectPolicy = yield select(redirectPolicySelector);
    const itemAnswers = {};
    const shuffles = {};
    const timesSpent = {};
    questions.forEach(question => {
      timesSpent[question] = ts / questions.length;
      itemAnswers[question] = answers[question];
      //Redirect flow user hasnt selected new answer for this question.
      // check this only for policy "STUDENT_RESPONSE_AND_FEEDBACK"
      if (
        redirectPolicy === assignmentPolicyOptions.showPreviousAttemptOptions.STUDENT_RESPONSE_AND_FEEDBACK &&
        !answers[question] &&
        !!userPrevAnswer[question]
      ) {
        itemAnswers[question] = userPrevAnswer[question];
      }
      if (shuffledOptions[question]) {
        shuffles[question] = shuffledOptions[question];
      }
    });

    const testItemId = currentItem._id;
    const _userWork = yield select(({ userWork }) => userWork.present[testItemId]);

    const activity = {
      answers: itemAnswers,
      testItemId,
      assignmentId,
      testActivityId: userTestActivityId,
      groupId,
      timesSpent,
      shuffledOptions: shuffles,
      bookmarked
    };

    if (_userWork) {
      activity.userWork = { ..._userWork };
    }

    yield call(testItemActivityApi.create, activity, autoSave);
    if (shouldClearUserWork) {
      /**
       * if we have two assignments one for practice and one for class assignment with same questions
       * need to clear user work in store after we click save and exit button
       * otherwise the store data remains and it is shown in the other assignment
       */
      yield put({
        type: CLEAR_USER_WORK
      });
    }
  } catch (err) {
    console.log(err);
    if (err.status === 403) {
      yield put(push("/home/assignments"));
      yield call(message.error, err.data);
    }
    // yield call(message.error, "Failed saving the Answer");
  }
}

function* loadUserResponse({ payload }) {
  try {
    const itemIndex = payload.itemId;
    const items = yield select(state => state.test && state.test.items);
    const item = items[itemIndex];
    const { answers } = yield call(itemsApi.getUserResponse, item._id);
    console.log("answers are", answers);
    yield put({
      type: LOAD_ANSWERS,
      payload: {
        ...answers
      }
    });
  } catch (e) {
    yield call(message.error, "Failed loading the Answer");
  }
}
export default function* watcherSaga() {
  yield all([
    yield takeLatest(RECEIVE_ITEM_REQUEST, receiveItemSaga),
    yield takeLatest(SAVE_USER_RESPONSE, saveUserResponse),
    yield takeLatest(LOAD_USER_RESPONSE, loadUserResponse)
  ]);
}
