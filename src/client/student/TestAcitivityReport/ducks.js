import { createAction, createReducer } from "redux-starter-kit";
import { takeEvery, put, call, all, select } from "redux-saga/effects";
import { reportsApi, testsApi } from "@edulastic/api";
import { setTestItemsAction } from "../sharedDucks/TestItem";
import { getReportByIdSelector } from "../sharedDucks/ReportsModule/ducks";
import { push } from "react-router-redux";
import { SET_ANSWER, LOAD_ANSWERS } from "../../assessment/constants/actions";
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
    const { testActivityId, groupId } = payload;
    if (!testActivityId) {
      throw new Error("invalid data");
    }
    const data = yield select(getReportByIdSelector(testActivityId));
    if (!data || !data.testId) {
      yield put(push("/home/reports"));
      return;
    }

    const [test, reports] = yield all([
      call(testsApi.getById, data.testId, { data: true }),
      call(reportsApi.fetchTestActivityReport, testActivityId, groupId)
    ]);
    yield put(replaceTestItemsAction(test.testItems));
    yield put(setFeedbackReportAction(reports.questionActivities));
    yield put(setTestItemsAction(test.testItems));

    const { questionActivities = [] } = reports || {};
    let allAnswers = {};
    questionActivities.forEach(item => {
      allAnswers = {
        ...allAnswers,
        [item.qid]: item.userResponse
      };
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
