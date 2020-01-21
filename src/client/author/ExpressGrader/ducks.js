import { createAction, createReducer } from "redux-starter-kit";
import { takeEvery, call, put, all, select } from "redux-saga/effects";
import { message } from "antd";
import { testActivityApi } from "@edulastic/api";
import { gradebookTestItemAddAction } from "../src/reducers/testActivity";
import { createSelector } from "reselect";

export const SUBMIT_RESPONSE = "[expressGraderAnswers] submit";

// Score
export const SET_TEACHER_EDITED_SCORE = "[score] set teacher edited score";
export const REMOVE_TEACHER_EDITED_SCORE = "[score] remove teacher edited score";
export const GET_TEACHER_EDITED_SCORE = "[score] get teacher edited score";

export const REQUEST_SCRATCH_PAD_REQUEST = "[scratchpad] load request";
export const REQUEST_SCRATCH_PAD_SUCCESS = "[scratchpad] load success";
export const REQUEST_SCRATCH_PAD_ERROR = "[scratchpad] load error";

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const submitResponseAction = createAction(SUBMIT_RESPONSE);
export const setTeacherEditedScore = createAction(SET_TEACHER_EDITED_SCORE);
export const removeTeacherEditedScoreAction = createAction(REMOVE_TEACHER_EDITED_SCORE);
export const requestScratchPadAction = createAction(REQUEST_SCRATCH_PAD_REQUEST);
export const scratchPadLoadSuccessAction = createAction(REQUEST_SCRATCH_PAD_SUCCESS);
export const scratchPadLoadErrorAction = createAction(REQUEST_SCRATCH_PAD_ERROR);

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
// -----|-----|-----|-----| SELECTORS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

const initialState = {
  teacherEditedScore: {},
  scratchPadLoading: false
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

function* scratchPadLoadSaga({ payload: questActivityId }) {
  try {
    const { scratchPad, testItemId } = yield call(testActivityApi.getScratchpad, questActivityId);
    yield put(scratchPadLoadSuccessAction({ scratchPad, testItemId }));
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
