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

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const submitResponseAction = createAction(SUBMIT_RESPONSE);
export const setTeacherEditedScore = createAction(SET_TEACHER_EDITED_SCORE);
export const removeTeacherEditedScoreAction = createAction(REMOVE_TEACHER_EDITED_SCORE);

// -----|-----|-----|-----| ACTIONS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SELECTORS BEGIN |-----|-----|-----|----- //

export const stateSelector = state => state.expressGraderReducer;

export const getTeacherEditedScoreSelector = createSelector(
  stateSelector,
  state => state.teacherEditedScore
);

// -----|-----|-----|-----| SELECTORS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

const initialState = {
  teacherEditedScore: {}
};

export const expressGraderReducer = createReducer(initialState, {
  [SET_TEACHER_EDITED_SCORE]: (state, { payload }) => {
    state.teacherEditedScore = payload;
  },
  [REMOVE_TEACHER_EDITED_SCORE]: (state, { payload }) => {
    state.teacherEditedScore = {};
  }
});

// -----|-----|-----|-----| REDUCER ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SAGAS BEGIN |-----|-----|-----|----- //

function* submitResponse({ payload }) {
  const { testActivityId, itemId, groupId, userResponse, scores } = payload;

  try {
    const scoreRes = yield call(testActivityApi.updateResponseEntryAndScore, {
      testActivityId,
      itemId,
      groupId,
      userResponse,
      scores
    });
    yield call(message.success, "updated response successfully");
    const { questionActivities } = scoreRes;
    console.log("questionActivities", questionActivities);
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
    yield put(removeTeacherEditedScoreAction());
  } catch (e) {
    console.error(e);
    yield call(message.error, "edit response failed");
  }
}

export function* watcherSaga() {
  yield all([yield takeEvery(SUBMIT_RESPONSE, submitResponse)]);
}

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //
