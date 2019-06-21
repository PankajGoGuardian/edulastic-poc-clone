import { testActivityApi, testsApi, assignmentApi } from "@edulastic/api";
import { takeEvery, call, all, put, select, take } from "redux-saga/effects";
import { push } from "react-router-redux";
import { keyBy as _keyBy } from "lodash";
import { test as testContants } from "@edulastic/constants";
import { ShuffleChoices } from "../utils/test";
import { getCurrentGroupWithAllClasses } from "../../student/Login/ducks";
import {
  LOAD_TEST,
  LOAD_TEST_ITEMS,
  SET_TEST_ID,
  FINISH_TEST,
  LOAD_PREVIOUS_RESPONSES,
  LOAD_ANSWERS,
  SET_TEST_ACTIVITY_ID,
  LOAD_SCRATCH_PAD,
  SET_TEST_LOADING_STATUS,
  GET_ASSIGNMENT_PASSWORD,
  TEST_ACTIVITY_LOADING
} from "../constants/actions";
import { loadQuestionsAction } from "../actions/questions";
import { setPasswordValidateStatusAction, setPasswordStatusAction } from "../actions/test";
import { setShuffledOptions } from "../actions/shuffledOptions";
import { SET_RESUME_STATUS } from "../../student/Assignments/ducks";

const getQuestions = (testItems = []) => {
  const allQuestions = [];

  testItems.forEach(item => {
    if (item.data) {
      const { questions = [], resources = [] } = item.data;
      allQuestions.push(...questions, ...resources);
    }
  });

  return allQuestions;
};

function* loadTest({ payload }) {
  try {
    yield put({
      type: SET_TEST_LOADING_STATUS,
      payload: true
    });
    yield put({
      type: TEST_ACTIVITY_LOADING,
      payload: true
    });
    yield put(setPasswordValidateStatusAction(false));

    const { testActivityId, testId, preview = false, demo = false } = payload;
    yield put({
      type: SET_TEST_ID,
      payload: {
        testId
      }
    });

    const groupId = yield select(getCurrentGroupWithAllClasses);
    // if !preivew, need to load previous responses as well!
    const getTestActivity = !preview ? call(testActivityApi.getById, testActivityId, groupId) : false;
    const testRequest = !demo
      ? call(testsApi.getById, testId, { validation: true, data: true, groupId, testActivityId })
      : call(testsApi.getPublicTest, testId);
    const [testActivity] = yield all([getTestActivity]);
    if (!preview) {
      let passwordValidated = !testActivity.assignmentSettings.requirePassword;
      if (passwordValidated) {
        yield put(setPasswordValidateStatusAction(true));
      }
      yield put({
        type: TEST_ACTIVITY_LOADING,
        payload: false
      });
      while (!passwordValidated) {
        const { payload } = yield take(GET_ASSIGNMENT_PASSWORD);
        const response = yield call(assignmentApi.validateAssignmentPassword, {
          assignmentId: testActivity.testActivity.assignmentId,
          password: payload
        });
        if (response === "successful") {
          passwordValidated = true;
        } else if (response === "unsuccessful") {
          yield put(setPasswordStatusAction("You have entered an invalid password"));
        } else {
          yield put(setPasswordStatusAction("validation failed"));
        }
      }
      yield put(setPasswordStatusAction(""));
    }

    const [test] = yield all([testRequest]);
    const questions = getQuestions(test.testItems);
    yield put(loadQuestionsAction(_keyBy(questions, "id")));

    let { testItems } = test;

    const settings = {
      calcType:
        (testActivity && testActivity.testActivity.calcType) || test.calcType || testContants.calculatorTypes.NONE,
      maxAnswerChecks:
        (testActivity && testActivity.assignmentSettings && testActivity.assignmentSettings.maxAnswerChecks) || 0,
      requirePassword:
        (testActivity && testActivity.assignmentSettings && testActivity.assignmentSettings.requirePassword) || false
    };
    const answerCheckByItemId = {};
    (testActivity.questionActivities || []).map(item => {
      answerCheckByItemId[item.testItemId] = item.answerChecksUsedForItem;
    });

    // if testActivity is present.
    if (!preview) {
      let allAnswers = {};

      const { testActivity: activity, questionActivities = [] } = testActivity;
      // if questions are shuffled !!!
      if (activity.shuffleQuestions) {
        const itemsByKey = _keyBy(testItems, "_id");
        testItems = (activity.shuffledTestItems || []).map(id => itemsByKey[id]).filter(item => !!item);
      }

      let shuffles;
      if (activity.shuffleAnswers) {
        [testItems, shuffles] = ShuffleChoices(testItems, questionActivities);
        yield put(setShuffledOptions(shuffles));
      }

      yield put({
        type: SET_TEST_ACTIVITY_ID,
        payload: { testActivityId }
      });

      let lastAttemptedQuestion = questionActivities[0] || {};

      const scratchPadData = {};
      questionActivities.forEach(item => {
        allAnswers = {
          ...allAnswers,
          [item.qid]: item.userResponse
        };
        if (item.scratchPad) {
          scratchPadData[item.testItemId] = item.scratchPad;
        }
        if (item.updatedAt > lastAttemptedQuestion.updatedAt) {
          lastAttemptedQuestion = item;
        }
      });

      if (Object.keys(scratchPadData).length) {
        yield put({
          type: LOAD_SCRATCH_PAD,
          payload: scratchPadData
        });
      }

      // get currentItem index;
      let lastAttendedQuestion = 0;
      if (lastAttemptedQuestion && lastAttemptedQuestion.testItemId) {
        test.testItems.forEach((item, index) => {
          if (item._id === lastAttemptedQuestion.testItemId) {
            lastAttendedQuestion = index;
          }
        });
      }
      if (lastAttendedQuestion !== test.testItems.length - 1) {
        lastAttendedQuestion++;
      }
      // load previous responses
      yield put({
        type: LOAD_ANSWERS,
        payload: allAnswers
      });

      // only load from previous attempted if resuming from assignments page
      const loadFromLast = yield select(state => state.test && state.test.resume);

      // move to last attended question
      if (loadFromLast) {
        yield put(push(`${lastAttendedQuestion}`));
        yield put({
          type: SET_RESUME_STATUS,
          payload: false
        });
      }
    }

    // test items are put into store after shuffling questions sometimes..
    // hence dont frigging move this, and this better stay at the end!
    yield put({
      type: LOAD_TEST_ITEMS,
      payload: {
        items: testItems,
        title: test.title,
        annotations: test.annotations,
        docUrl: test.docUrl,
        settings,
        answerCheckByItemId
      }
    });
    yield put(setPasswordValidateStatusAction(true));

    yield put({
      type: SET_TEST_LOADING_STATUS,
      payload: false
    });
  } catch (err) {
    console.error(err);
  }
}

// load users previous responses for a particular test
function* loadPreviousResponses() {
  try {
    const testActivityId = yield select(state => state.test && state.test.testActivityId);
    const answers = yield testActivityApi.previousResponses(testActivityId);
    yield put({
      type: LOAD_ANSWERS,
      payload: { ...answers }
    });
  } catch (err) {
    console.log(err);
  }
}

function* submitTest() {
  try {
    const testActivityId = yield select(state => state.test && state.test.testActivityId);
    const groupId = yield select(getCurrentGroupWithAllClasses);
    if (testActivityId === "test") {
      return;
    }
    yield testActivityApi.submit(testActivityId, groupId);
    yield put(push("/home/reports"));
  } catch (err) {
    console.log(err);
  }
}

export default function* watcherSaga() {
  yield all([
    yield takeEvery(LOAD_TEST, loadTest),
    yield takeEvery(FINISH_TEST, submitTest),
    yield takeEvery(LOAD_PREVIOUS_RESPONSES, loadPreviousResponses)
  ]);
}
