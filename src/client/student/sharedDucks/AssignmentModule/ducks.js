import { createAction, createReducer } from "redux-starter-kit";
import { schema } from "normalizr";

import { takeLatest, put, call } from "redux-saga/effects";
import { questionsApi } from "@edulastic/api";
import { cloneDeep } from "lodash";

// assignments schema
export const assignmentSchema = new schema.Entity("assignments", {}, { idAttribute: "_id" });

// types
export const SET_LOADING = "[studentAssignment] fetch assignments";
export const SET_ASSIGNMENTS = "[studentAssignment] set assignments";
export const ADD_ASSIGNMENT_REALTIME = "[studentAssignment] add assignment realtime";

export const SET_ACTIVE_ASSIGNMENT = "[studentAssignments] set active assignment";
export const SET_FILTER = "[studentAssignment] set filter";

export const CHECK_ANSWER = "check answer";
export const ADD_EVALUATION = "add evaluation";
export const RERENDER_ASSIGNMENTS = "[studentAssignments] rerender assignments";
export const REMOVE_ASSIGNMENT = "[studentAssignments] remove assignment";

// action dispatchers
export const setAssignmentsLoadingAction = createAction(SET_LOADING);
export const setAssignmentsAction = createAction(SET_ASSIGNMENTS);
export const setActiveAssignmentAction = createAction(SET_ACTIVE_ASSIGNMENT);
export const setFilterAction = createAction(SET_FILTER);
export const addRealtimeAssignmentAction = createAction(ADD_ASSIGNMENT_REALTIME);
export const rerenderAssignmentsAction = createAction(RERENDER_ASSIGNMENTS);
export const removeAssignmentAction = createAction(REMOVE_ASSIGNMENT);

// initial State
const initialState = {
  isLoading: false,
  byId: {},
  allIds: [],
  error: {},
  isStale: false,
  filter: "all"
};

// reducers

// fetching assignments
const setLoading = state => {
  state.isLoading = true;
};

// load assignments to store
const setAssignments = (state, { payload }) => {
  if (payload.assignmentObj) {
    state.byId = payload.assignmentObj;
  }
  if (payload.allIds) {
    state.allIds = payload.allAssignments;
  }
  state.isLoading = false;
};

// filtering assignments
const setFilter = (state, { payload }) => {
  state.filter = payload;
};

export default createReducer(initialState, {
  [SET_LOADING]: setLoading,
  [SET_ASSIGNMENTS]: setAssignments,
  [ADD_ASSIGNMENT_REALTIME]: (state, { payload: assignment }) => {
    const { _id: assignmentId } = assignment;
    state.byId[assignmentId] = assignment;
    if (!state.allIds.includes(assignmentId)) {
      state.allIds.push(assignmentId);
    }
  },
  [REMOVE_ASSIGNMENT]: (state, { payload }) => {
    delete state.byId[payload];
    state.allIds = state.allIds.filter(x => x !== payload);
  },
  [SET_ACTIVE_ASSIGNMENT]: (state, { payload }) => {
    state.current = payload;
  },
  [SET_FILTER]: setFilter,
  [RERENDER_ASSIGNMENTS]: state => {
    /**
     * one of the few places , using cloneDeep is justified.
     * Just clonning deeply and replacing the value with cloned value would cause the selectors
     * to rerun and cause rerender
     */
    state.byId = cloneDeep(state.byId);
  }
});

function* addEvaluation(action) {
  try {
    const { answer, qid } = action.payload;
    const response = yield call(questionsApi.evaluateAnswer, qid, answer);
    yield put({
      type: ADD_EVALUATION,
      payload: {
        answer: response.answer,
        qid
      }
    });
  } catch (e) {
    console.log("error: ", e);
  }
}

export function* addEvaluationWatcherSaga() {
  yield takeLatest(CHECK_ANSWER, addEvaluation);
}
