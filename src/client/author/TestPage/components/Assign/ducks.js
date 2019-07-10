import * as moment from "moment";
import { omit, get, keyBy } from "lodash";
import { message } from "antd";
import { createReducer, createAction } from "redux-starter-kit";
import { createSelector } from "reselect";
import { assignmentApi, testsApi } from "@edulastic/api";
import { all, call, put, takeEvery, select } from "redux-saga/effects";
import { replace, push } from "connected-react-router";
import { SET_ASSIGNMENT, SET_TEST_DATA, getTestSelector, getTestIdSelector } from "../../ducks";
import { formatAssignment } from "./utils";
import { getUserNameSelector } from "../../../src/selectors/user";
import { getPlaylistEntitySelector } from "../../../PlaylistPage/ducks";
import { getUserRole } from "../../../../student/Login/ducks";
// constants
export const SAVE_ASSIGNMENT = "[assignments] save assignment";
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
export const loadAssignmentsAction = createAction(LOAD_ASSIGNMENTS);
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
    if (item._id === payload._id) {
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

export const getAssignmentsSelector = state => state[module].assignments;
export const getCurrentAssignmentSelector = createSelector(
  currentSelector,
  getAssignmentsSelector,
  (current, assignments) => {
    if (current && current !== "new") {
      const assignment = assignments.filter(item => item._id === current)[0];
      return assignment;
    }
    return {
      startDate: moment(),
      endDate: moment().add("days", 7),
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
    let testIds;
    if (!payload.playlistModuleId && !payload.playlistId) {
      testIds = [yield select(getTestIdSelector)];
    } else {
      const playlist = yield select(getPlaylistEntitySelector);
      testIds = [];
      if (payload.testId) {
        testIds = [payload.testId];
      } else {
        const module = playlist.modules.filter(module => module._id === payload.playlistModuleId);
        if (!module || !(module && module.length)) {
          return message.error("Module not found in playlist");
        }
        module &&
          module[0].data.forEach(dat => {
            testIds.push(dat.contentId);
          });
        if (!testIds.length) {
          return message.error("No test in module");
        }
      }
    }
    if (!testIds || !(testIds && testIds.length)) {
      const test = yield select(getTestSelector);
      const entity = yield call(testsApi.create, test);
      testIds = [entity._id];
      yield put({
        type: SET_TEST_DATA,
        payload: {
          data: entity
        }
      });
      yield put(replace(`/author/tests/${entity._id}`));
    }
    const assignedBy = yield select(getUserNameSelector);
    // if no class is selected dont bother sending a request.
    if (!payload.class.length) {
      return;
    }
    const startDate = payload.startDate && moment(payload.startDate).valueOf();
    const endDate = payload.endDate && moment(payload.endDate).valueOf();

    const isUpdate = !!payload._id;
    let updateTestActivities = false;

    // if updating, and releaseScore changes,remove the class level settings :D
    if (isUpdate) {
      const currentData = yield select(getCurrentAssignmentSelector);

      if (currentData.releaseScore === payload.releaseScore) {
        const { scoreReleasedClasses: releasedClasses, googleAssignmentIds } = currentData;
        payload.class = payload.class.map(item => {
          if (releasedClasses.includes(item._id)) {
            item.releaseScore = "SCORE_ONLY";
          }
          if (googleAssignmentIds[item._id]) {
            item.googleId = googleAssignmentIds[item._id];
          }
          return item;
        });
      } else {
        updateTestActivities = true;
      }
    }
    let userRole = yield select(getUserRole);
    const testType = get(payload, "testType", "assessment");
    let data = [];
    data = testIds.map(testId =>
      omit(
        {
          ...payload,
          startDate,
          endDate,
          testType: userRole !== "teacher" && testType === "assessment" ? "common assessment" : testType,
          testId
        },
        ["_id", "__v", "createdAt", "updatedAt", "students", "scoreReleasedClasses", "googleAssignmentIds"]
      )
    );
    const result = isUpdate
      ? yield call(assignmentApi.update, payload._id, { ...data, updateTestActivities })
      : yield call(assignmentApi.create, { assignments: data, assignedBy });
    const assignment = isUpdate ? formatAssignment(result) : formatAssignment(result[0]);
    const successMessage = `Assign ${payload.playlistModuleId ? "module" : "test"} is successed!`;
    yield call(message.success, successMessage);
    yield put(setAssignmentAction(assignment));
    yield put(
      push(
        `/author/${payload.playlistModuleId ? "playlists" : "tests"}/${
          payload.playlistModuleId ? payload.playlistId : testIds[0]
        }/assign`
      )
    );
  } catch (err) {
    if (err.status === 409) {
      return yield call(message.error, err.data.message);
    }
    console.error(err);
  }
}

function* loadAssignments({ payload }) {
  try {
    let testId;
    if (!payload) {
      const { _id } = yield select(getTestSelector);
      testId = _id;
    } else {
      testId = payload;
    }

    // test is not yet created!
    if (!testId) {
      return;
    }

    const data = yield call(assignmentApi.fetchAssignments, testId);
    const assignments = data.map(formatAssignment);
    yield put(loadAssignmentsAction(assignments));
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
