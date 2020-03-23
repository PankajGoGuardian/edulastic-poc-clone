import { createAction, createReducer } from "redux-starter-kit";
import { takeEvery, put, call, all, fork } from "redux-saga/effects";
import { keyBy as _keyBy } from "lodash";
import { reportsApi, testsApi, attchmentApi as attachmentApi } from "@edulastic/api";
import { setTestItemsAction, SET_CURRENT_ITEM } from "../sharedDucks/TestItem";
import { setTestActivityAction, setPassagesDataAction } from "../sharedDucks/ReportsModule/ducks";
import {
  ADD_ITEM_EVALUATION,
  LOAD_ANSWERS,
  LOAD_SCRATCH_PAD,
  REMOVE_ANSWERS
} from "../../assessment/constants/actions";
import { receiveTestByIdSuccess, getQuestions } from "../../author/TestPage/ducks";
import { markQuestionLabel } from "../../assessment/Transformer";
import { loadQuestionsAction } from "../../author/sharedDucks/questions";
import { REQUEST_SCRATCH_PAD_SUCCESS } from "../../assessment/reducers/userWork";

export const LOAD_TEST_ACTIVITY_REPORT = "[studentReports] load testActivity  report";
export const SET_STUDENT_ITEMS = "[studentItems] set Student items";
export const SET_FEEDBACK = "[studentItems] set feedback";

// actions
export const loadTestActivityReportAction = createAction(LOAD_TEST_ACTIVITY_REPORT);
export const setFeedbackReportAction = createAction(SET_FEEDBACK);

function* loadAttachmentsFromServer(filter) {
  try {
    const { attachments = [] } = yield call(attachmentApi.loadAllAttachments, filter);
    for (const attachment of attachments) {
      const { data: scratchPad, referrerId2: testItemId } = attachment;
      yield put({ type: REQUEST_SCRATCH_PAD_SUCCESS, payload: { scratchPad, testItemId } });
    }
  } catch (error) {
    console.log("error from attachmentAPI", error);
  }
}

function* getAttachmentsForItems({ testActivityId, testItemsIdArray = [] }) {
  yield all(
    testItemsIdArray.map(testItemId =>
      call(loadAttachmentsFromServer, { referrerId: testActivityId, referrerId2: testItemId })
    )
  );
}

function* loadTestActivityReport({ payload }) {
  try {
    const { testActivityId, groupId, testId } = payload;
    yield put(setFeedbackReportAction(null));
    if (!testActivityId) {
      throw new Error("invalid data");
    }
    yield put({
      type: REMOVE_ANSWERS
    });
    const [test, reports] = yield all([
      call(testsApi.getByIdMinimal, testId, { data: true, testActivityId, groupId }),
      call(reportsApi.fetchTestActivityReport, testActivityId, groupId)
    ]);
    const testItems = test.itemGroups.flatMap(itemGroup => itemGroup.items || []);
    markQuestionLabel(testItems);
    const questions = getQuestions(test.itemGroups);
    const questionsWithActivities = questions.map(question => {
      if (!question.activity) {
        const activity = reports.questionActivities.find(qActivity => qActivity.qid === question.id);
        return {
          ...question,
          activity
        };
      }
      return question;
    });
    const { questionActivities = [] } = reports;
    const scratchpadUsedItems = questionActivities.reduce((items, activity) => {
      if (activity?.scratchPad?.scratchpad || false) {
        items.push(activity.testItemId);
      }
      return items;
    }, []);
    yield fork(getAttachmentsForItems, {
      testActivityId: payload.testActivityId,
      testItemsIdArray: scratchpadUsedItems
    });

    yield put(loadQuestionsAction(_keyBy(questionsWithActivities, "id")));
    yield put(receiveTestByIdSuccess(test));
    yield put(setTestActivityAction(reports.testActivity));
    yield put(setFeedbackReportAction(reports.questionActivities));
    yield put(setTestItemsAction(testItems));
    yield put(setPassagesDataAction(test.passages || []));

    const userWork = {};
    let allAnswers = {};

    questionActivities.forEach(item => {
      allAnswers = {
        ...allAnswers,
        [item.qid]: item.userResponse
      };
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

// reducer

export const setCurrentItemAction = index => ({
  type: SET_CURRENT_ITEM,
  payload: {
    data: index
  }
});

export const setTestFeedbackAction = data => ({
  type: SET_FEEDBACK,
  payload: {
    data
  }
});

const initialState = null;
export default createReducer(initialState, {
  [SET_FEEDBACK]: (_, { payload }) => payload
});

export const getfeedbackSelector = state => state.testFeedback;
