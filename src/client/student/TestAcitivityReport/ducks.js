import { createAction, createReducer } from "redux-starter-kit";
import { takeEvery, put, call, all } from "redux-saga/effects";
import { get } from "lodash";
import { reportsApi, testsApi } from "@edulastic/api";
import { setTestItemsAction } from "../sharedDucks/TestItem";
import { setTestActivityAction, setPassagesDataAction } from "../sharedDucks/ReportsModule/ducks";
import { ADD_ITEM_EVALUATION, LOAD_ANSWERS, LOAD_SCRATCH_PAD } from "../../assessment/constants/actions";
import { replaceTestItemsAction } from "../../author/TestPage/ducks";
// types
export const LOAD_TEST_ACTIVITY_REPORT = "[studentReports] load testActivity  report";

export const SET_STUDENT_ITEMS = "[studentItems] set Student items";
export const SET_FEEDBACK = "[studentItems] set feedback";

// actions
export const loadTestActivityReportAction = createAction(LOAD_TEST_ACTIVITY_REPORT);
export const setFeedbackReportAction = createAction(SET_FEEDBACK);

function* loadTestActivityReport({ payload }) {
  try {
    const { testActivityId, groupId, testId } = payload;
    if (!testActivityId) {
      throw new Error("invalid data");
    }

    const [test, reports] = yield all([
      call(testsApi.getById, testId, { data: true, testActivityId, groupId }),
      call(reportsApi.fetchTestActivityReport, testActivityId, groupId)
    ]);

    let count = 0;
    const testItems = get(test, "testItems", []);
    testItems.forEach(item => {
      const questions = get(item, "data.questions", []);
      questions.forEach(q => {
        q.qLabel = `Q${++count}`;
      });
    });

    yield put(
      replaceTestItemsAction({
        ...test,
        testItems
      })
    );
    yield put(setTestActivityAction(reports.testActivity));
    yield put(setFeedbackReportAction(reports.questionActivities));
    yield put(setTestItemsAction(test.testItems));
    yield put(setPassagesDataAction(test.passages || []));

    const { questionActivities = [] } = reports || {};
    let allAnswers = {};
    let userWork = {};
    questionActivities.forEach(item => {
      allAnswers = {
        ...allAnswers,
        [item.qid]: item.userResponse
      };
      // accumulate user work
      if (item.scratchPad) {
        userWork[item.testItemId] = item.scratchPad;
      }
    });

    yield put({
      type: LOAD_SCRATCH_PAD,
      payload: userWork
    });

    yield put({
      type: ADD_ITEM_EVALUATION,
      payload: {
        ...questionActivities.reduce((result, item) => {
          result[item.qid] = item.evaluation;
          return result;
        }, {})
      }
    });

    // load previous responses
    yield put({
      type: LOAD_ANSWERS,
      payload: allAnswers
    });
  } catch (e) {
    console.log(e);
  }
}

// set actions watcherss
export function* watcherSaga() {
  yield all([yield takeEvery(LOAD_TEST_ACTIVITY_REPORT, loadTestActivityReport)]);
}

//reducer

export const setCurrentItemAction = index => ({
  type: SET_CURRENT_ITEM,
  payload: {
    data: index
  }
});

export const setTestFeedbackAction = data => ({
  type: SET_FEEDBACK,
  payload: {
    data: data
  }
});

const initialState = null;
export default createReducer(initialState, {
  [SET_FEEDBACK]: (_, { payload }) => payload
});
