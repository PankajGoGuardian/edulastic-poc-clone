import { createAction, createReducer } from "redux-starter-kit";
import { takeEvery, call, put, all, select } from "redux-saga/effects";
import { message } from "antd";
import { testActivityApi, attchmentApi as attachmentApi } from "@edulastic/api";
import { createSelector } from "reselect";
import { gradebookTestItemAddAction } from "../src/reducers/testActivity";
import { SAVE_USER_WORK } from "../../assessment/constants/actions";
import { updateScratchpadAction } from "../../common/ducks/scratchpad";

export const SUBMIT_RESPONSE = "[expressGraderAnswers] submit";

// Score
export const SET_TEACHER_EDITED_SCORE = "[score] set teacher edited score";
export const REMOVE_TEACHER_EDITED_SCORE = "[score] remove teacher edited score";
export const GET_TEACHER_EDITED_SCORE = "[score] get teacher edited score";

export const REQUEST_SCRATCH_PAD_REQUEST = "[scratchpad] load request";
export const REQUEST_SCRATCH_PAD_SUCCESS = "[scratchpad] load success";
export const REQUEST_SCRATCH_PAD_ERROR = "[scratchpad] load error";
export const TOGGLE_SCORE_MODE = "[expressgrader] toggle score/response";
export const DISABLE_SCORE_MODE = "[expressgrader] enable score mode";
export const SUBMIT_RESPONSE_COMPLETED = "[expressgrade] completed submitting";

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const submitResponseAction = createAction(SUBMIT_RESPONSE);
export const setTeacherEditedScore = createAction(SET_TEACHER_EDITED_SCORE);
export const removeTeacherEditedScoreAction = createAction(REMOVE_TEACHER_EDITED_SCORE);
export const requestScratchPadAction = createAction(REQUEST_SCRATCH_PAD_REQUEST);
export const scratchPadLoadSuccessAction = createAction(REQUEST_SCRATCH_PAD_SUCCESS);
export const scratchPadLoadErrorAction = createAction(REQUEST_SCRATCH_PAD_ERROR);
export const toggleScoreModeAction = createAction(TOGGLE_SCORE_MODE);
export const disableScoreModeAction = createAction(DISABLE_SCORE_MODE);
export const submitResponseCompletedAction = createAction(SUBMIT_RESPONSE_COMPLETED);

// -----|-----|-----|-----| ACTIONS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SELECTORS BEGIN |-----|-----|-----|----- //

export const stateSelector = state => state.expressGraderReducer;

export const getTeacherEditedScoreSelector = createSelector(
  stateSelector,
  state => state.teacherEditedScore
);

export const getScratchpadLoadingSelector = createSelector(
  stateSelector,
  state => state.scratchPadLoading
);

export const getIsScoringCompletedSelector = createSelector(
  stateSelector,
  state => state.isScoring
);
// -----|-----|-----|-----| SELECTORS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

const initialState = {
  teacherEditedScore: {},
  scratchPadLoading: false,
  scoreMode: false,
  isScoring: false
};

export const expressGraderReducer = createReducer(initialState, {
  [SET_TEACHER_EDITED_SCORE]: (state, { payload }) => {
    state.teacherEditedScore = payload;
  },
  [REMOVE_TEACHER_EDITED_SCORE]: (state, { payload }) => {
    state.teacherEditedScore = {};
  },
  [REQUEST_SCRATCH_PAD_REQUEST]: state => {
    state.scratchPadLoading = true;
  },
  [REQUEST_SCRATCH_PAD_SUCCESS]: state => {
    state.scratchPadLoading = false;
  },
  [REQUEST_SCRATCH_PAD_ERROR]: state => {
    state.scratchPadLoading = false;
  },
  [TOGGLE_SCORE_MODE]: state => {
    state.scoreMode = !state.scoreMode;
  },
  [DISABLE_SCORE_MODE]: state => {
    state.scoreMode = false;
  },
  [SUBMIT_RESPONSE]: state => {
    state.isScoring = true;
  },
  [SUBMIT_RESPONSE_COMPLETED]: state => {
    state.isScoring = false;
  }
});

// -----|-----|-----|-----| REDUCER ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SAGAS BEGIN |-----|-----|-----|----- //

function* submitResponse({ payload }) {
  const { testActivityId, itemId, groupId, userResponse, scores } = payload;

  try {
    yield put(removeTeacherEditedScoreAction());
    const scoreRes = yield call(testActivityApi.updateResponseEntryAndScore, {
      testActivityId,
      itemId,
      groupId,
      userResponse,
      scores
    });
    yield call(message.success, "updated response successfully");
    const { questionActivities } = scoreRes;
    yield put(
      gradebookTestItemAddAction(
        questionActivities.map(({ qid: _id, score, maxScore, testActivityId, ...question }) => ({
          testActivityId,
          score,
          maxScore,
          ...question,
          _id
        }))
      )
    );
  } catch (e) {
    console.error(e);
    yield call(message.error, "edit response failed");
  } finally {
    yield put(submitResponseCompletedAction());
  }
}

function* scratchPadLoadSaga({ payload }) {
  try {
    const { testActivityId, testItemId, qActId, callback } = payload;
    const userWork = yield select(state => state.userWork.present);
    if (!userWork[qActId] && testActivityId && testItemId) {
      yield put(updateScratchpadAction({ loading: true }));
      const { attachments = [] } = yield call(attachmentApi.loadAllAttachments, {
        referrerId: testActivityId,
        referrerId2: testItemId
      });
      const scratchpadData = {};
      for (const attachment of attachments) {
        const { data } = attachment;
        scratchpadData[qActId] = data.scratchpad;
      }
      yield put({ type: SAVE_USER_WORK, payload: scratchpadData });
      yield put(updateScratchpadAction({ loading: false }));
    }

    if (callback) {
      yield call(callback);
    }
  } catch (e) {
    console.error(e);
    yield call(message.error, "Loading scratchPad failed");
    yield put(scratchPadLoadErrorAction());
  }
}

export function* watcherSaga() {
  yield all([
    yield takeEvery(SUBMIT_RESPONSE, submitResponse),
    yield takeEvery(REQUEST_SCRATCH_PAD_REQUEST, scratchPadLoadSaga)
  ]);
}

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //
