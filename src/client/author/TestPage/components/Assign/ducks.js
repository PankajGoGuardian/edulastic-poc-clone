import * as moment from "moment";
import { omit } from "lodash";
import { createReducer, createAction } from "redux-starter-kit";
import { assignmentApi } from "@edulastic/api";
import { all, call, put, takeEvery, select } from "redux-saga/effects";
import { getTestSelector, getTestIdSelector } from "../../ducks";
import { createSelector } from "reselect";
import { generateClassData, formatAssignment } from "./utils";
import { getStudentsSelector } from "../../../sharedDucks/groups";
// constants

export const SAVE_ASSIGNMENT = "[assignments] save assignment";
export const SET_ASSIGNMENT = "[assignments] set assignment";
export const UPDATE_ASSIGNMENT = "[assignments] update assignment";
export const UPDATE_SET_ASSIGNMENT = "[assignments] update set assingment";
export const FETCH_ASSIGNMENTS = "[assignments] fetch assignments";
export const LOAD_ASSIGNMENTS = "[assignments] load assignments";
export const DELETE_ASSIGNMENT = "[assignments] delete assignment";
export const REMOVE_ASSIGNMENT = "[assignments] remove assignment";
export const SET_CURRENT_ASSIGNMENT = "[assignments] set current editing assignment";

// actions
export const setAssignmentAction = createAction(SET_ASSIGNMENT);
export const fetchAssignmentsAction = createAction(FETCH_ASSIGNMENTS);
export const setCurrentAssignmentAction = createAction(SET_CURRENT_ASSIGNMENT);
export const saveAssignmentAction = createAction(SAVE_ASSIGNMENT);
export const deleteAssignmentAction = createAction(DELETE_ASSIGNMENT);
export const loadAssignmentsActions = createAction(LOAD_ASSIGNMENTS);
export const removeAssignmentsAction = createAction(REMOVE_ASSIGNMENT);

const initialState = {
  isLoading: false,
  assignments: [],
  current: "" // id of the current one being edited
};

const setAssignment = (state, { payload }) => {
  state.isLoading = false;
  state.assignments = payload;
};

const addAssignment = (state, { payload }) => {
  let isExisting = false;
  state.assignments = state.assignments.map(item => {
    if (item._id == payload._id) {
      isExisting = true;
      return payload;
    }
    return item;
  });

  if (!isExisting) {
    state.assignments.push(payload);
  }
};

const setCurrent = (state, { payload }) => {
  state.current = payload;
};

const removeAssignment = (state, { payload }) => {
  state.assignments = state.assignments.filter(item => item._id !== payload);
};

export const reducer = createReducer(initialState, {
  [FETCH_ASSIGNMENTS]: state => {
    state.isLoading = true;
  },
  [LOAD_ASSIGNMENTS]: setAssignment,
  [SET_ASSIGNMENT]: addAssignment,
  [SET_CURRENT_ASSIGNMENT]: setCurrent,
  [REMOVE_ASSIGNMENT]: removeAssignment
});

// selectors
const module = "authorTestAssignments";
const currentSelector = state => state[module].current;

export const getAssignmentsSelector = state => (state[module].isLoading ? [] : state[module].assignments);

export const getCurrentAssignmentSelector = createSelector(
  currentSelector,
  getAssignmentsSelector,

  (current, assignments) => {
    if (current && current !== "new") {
      let assignment = assignments.filter(item => item._id == current)[0];
      return assignment;
    }
    return {
      startDate: moment(),
      endDate: moment(),
      openPolicy: "Automatically on Start Date",
      closePolicy: "Automatically on Due Date",
      class: [],
      specificStudents: false
    };
  }
);
// saga

function* saveAssignment({ payload }) {
  try {
    let classData;
    const studentsList = yield select(getStudentsSelector);
    const testId = yield select(getTestIdSelector);
    classData = generateClassData(payload.class, payload.students, studentsList, payload.specificStudents);

    // if no class is selected dont bother sending a request.
    if (!classData.length) {
      return;
    }

    let startDate = payload.startDate && moment(payload.startDate).valueOf();
    let endDate = payload.endDate && moment(payload.endDate).valueOf();

    let data = omit(
      {
        ...payload,
        class: classData,
        startDate,
        endDate,
        testId
      },
      ["_id", "__v", "createdAt", "updatedAt", "students"]
    );
    let isUpdate = !!payload._id;

    const result = isUpdate
      ? yield call(assignmentApi.update, payload._id, data)
      : yield call(assignmentApi.create, [data]);
    const assignment = isUpdate ? formatAssignment(result) : formatAssignment(result[0]);

    yield put(setAssignmentAction(assignment));
  } catch (err) {
    console.error(err);
  }
}

function* loadAssignments() {
  try {
    const { _id: testId } = yield select(getTestSelector);
    const data = yield call(assignmentApi.fetchAssignments, testId);
    const assignments = data.map(formatAssignment);
    yield put(loadAssignmentsActions(assignments));
  } catch (e) {
    console.error(e);
  }
}

function* deleteAssignment({ payload }) {
  try {
    yield assignmentApi.remove(payload);
    yield put(removeAssignmentsAction(payload));
  } catch (e) {
    console.log(e);
  }
}

export function* watcherSaga() {
  yield all([
    yield takeEvery(SAVE_ASSIGNMENT, saveAssignment),
    yield takeEvery(FETCH_ASSIGNMENTS, loadAssignments),
    yield takeEvery(DELETE_ASSIGNMENT, deleteAssignment)
  ]);
}

// selectors

export const getGroupSelector = state => state.testsAssign;
