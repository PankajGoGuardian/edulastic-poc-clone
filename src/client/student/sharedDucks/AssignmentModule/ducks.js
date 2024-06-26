import { createAction, createReducer } from "redux-starter-kit";
import { schema } from "normalizr";

import { takeLatest, put, call } from "redux-saga/effects";
import { questionsApi } from "@edulastic/api";
import { cloneDeep } from "lodash";

// assignments schema
export const assignmentSchema = new schema.Entity("assignments", {}, { idAttribute: "_id" });

// types
export const SET_LOADING = "[studentAssignment] fetch assignments loading";
export const SET_ASSIGNMENTS = "[studentAssignment] set assignments";
export const ADD_ASSIGNMENT_REALTIME = "[studentAssignment] add assignment realtime";

export const SET_ACTIVE_ASSIGNMENT = "[studentAssignments] set active assignment";
export const SET_FILTER = "[studentAssignment] set filter";

export const CHECK_ANSWER = "check answer";
export const ADD_EVALUATION = "add evaluation";
export const RERENDER_ASSIGNMENTS = "[studentAssignments] rerender assignments";
export const REMOVE_ASSIGNMENT = "[studentAssignments] remove assignment";
export const REGRADE_ASSIGNMENT_REALTIME = "[studentAssessmentPlayer] regrade assessment realtime";
export const UPDATE_REALTIME_ASSIGNMENT_TEST_ID = "[studentAssignments] update test id real time";
export const SET_CONFIRMATION_FOR_TIMED_ASSIGNMENT = "[studentAssignments] set ready for timed assignment";
export const CLEAR_REGRADE_ASSIGNMENT = "[studentAssignments] clear regrade assignment";
export const SHOW_TEST_INSTRUCTION = "[studentAssignments] show student test instruction";
export const SET_ACTIVITY_CREATING = "[studentAssignments] set test activity creating";
export const TOGGLE_UTA_TIME_UPDATE_REQUIRED = "[studentAssignments] toggle - uta time update required";

// action dispatchers
export const setAssignmentsLoadingAction = createAction(SET_LOADING);
export const setAssignmentsAction = createAction(SET_ASSIGNMENTS);
export const setActiveAssignmentAction = createAction(SET_ACTIVE_ASSIGNMENT);
export const setFilterAction = createAction(SET_FILTER);
export const addRealtimeAssignmentAction = createAction(ADD_ASSIGNMENT_REALTIME);
export const rerenderAssignmentsAction = createAction(RERENDER_ASSIGNMENTS);
export const removeAssignmentAction = createAction(REMOVE_ASSIGNMENT);
export const regradedRealtimeAssignmentAction = createAction(REGRADE_ASSIGNMENT_REALTIME);
export const updateTestIdRealTimeAction = createAction(UPDATE_REALTIME_ASSIGNMENT_TEST_ID);
export const setConfirmationForTimedAssessmentAction = createAction(SET_CONFIRMATION_FOR_TIMED_ASSIGNMENT);
export const clearRegradeAssignmentAction = createAction(CLEAR_REGRADE_ASSIGNMENT);
export const showTestInstructionsAction = createAction(SHOW_TEST_INSTRUCTION);
export const setIsActivityCreatingAction = createAction(SET_ACTIVITY_CREATING);
export const utaStartTimeUpdateRequired = createAction(TOGGLE_UTA_TIME_UPDATE_REQUIRED);

// initial State
const initialState = {
  isLoading: false,
  byId: {},
  allIds: [],
  error: {},
  isStale: false,
  filter: "all",
  showInstruction: false,
  assignment: {},
  loadAssignment: {
    assignmentId: "",
    isLoading: false
  },
  updateUtaTimeType: null
};

// reducers

// fetching assignments
const setLoading = state => {
  state.isLoading = true;
};

const setConfirmationForTimedAssessment = (state, { payload }) => {
  state.unconfirmedTimedAssignment = payload;
};

// load assignments to store
const setAssignments = (state, { payload }) => {
  if (payload.assignmentObj) {
    state.byId = payload.assignmentObj;
  }
  if (payload.allAssignments) {
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
  [SET_CONFIRMATION_FOR_TIMED_ASSIGNMENT]: setConfirmationForTimedAssessment,
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
  },
  [REGRADE_ASSIGNMENT_REALTIME]: (state, { payload }) => {
    state.regradedAssignment = payload;
  },
  [CLEAR_REGRADE_ASSIGNMENT]: state => {
    delete state.regradedAssignment;
  },
  [UPDATE_REALTIME_ASSIGNMENT_TEST_ID]: (state, { payload }) => {
    const { newTestId, oldTestId, assignmentId } = payload;
    if (
      state.byId[assignmentId] &&
      state.byId[assignmentId].testId !== newTestId &&
      state.byId[assignmentId].testId === oldTestId
    ) {
      state.byId[assignmentId] = {
        ...state.byId[assignmentId],
        testId: newTestId
      };
    }
  },
  [SHOW_TEST_INSTRUCTION]: (state, { payload }) => {
    state.showInstruction = payload.showInstruction;
    state.assignment = payload.assignment;
  },
  [SET_ACTIVITY_CREATING]: (state, { payload }) => {
    state.loadAssignment.assignmentId = payload.assignmentId;
    state.loadAssignment.isLoading = payload.isLoading;
  },
  [TOGGLE_UTA_TIME_UPDATE_REQUIRED]: (state, { payload }) => {
    state.updateUtaTimeType = payload;
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
