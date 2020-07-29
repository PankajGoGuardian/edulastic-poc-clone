import * as moment from "moment";
import { omit, get } from "lodash";
import { notification } from "@edulastic/common";
import { createReducer, createAction } from "redux-starter-kit";
import { createSelector } from "reselect";
import { test as testContants, roleuser } from "@edulastic/constants";
import { assignmentApi, testsApi } from "@edulastic/api";
import { all, call, put, takeEvery, select, takeLatest } from "redux-saga/effects";
import { replace, push } from "connected-react-router";
import { SET_ASSIGNMENT, SET_TEST_DATA, getTestSelector, getTestIdSelector } from "../../ducks";
import { formatAssignment } from "./utils";
import { getUserNameSelector } from "../../../src/selectors/user";
import { getPlaylistEntitySelector } from "../../../PlaylistPage/ducks";
import { getUserRole } from "../../../../student/Login/ducks";
import { toggleDeleteAssignmentModalAction } from "../../../sharedDucks/assignments";
import { updateAssingnmentSettingsAction } from "../../../AssignTest/duck";
// constants
export const SAVE_ASSIGNMENT = "[assignments] save assignment";
export const UPDATE_ASSIGNMENT = "[assignments] update assignment";
export const UPDATE_SET_ASSIGNMENT = "[assignments] update set assingment";
export const FETCH_ASSIGNMENTS = "[assignments] fetch assignments";
export const LOAD_ASSIGNMENTS = "[assignments] load assignments";
export const DELETE_ASSIGNMENT = "[assignments] delete assignment";
export const REMOVE_ASSIGNMENT = "[assignments] remove assignment";
export const SET_CURRENT_ASSIGNMENT = "[assignments] set current editing assignment";
export const SET_ASSIGNMENT_SAVING = "[assignments] set assignment saving state";
export const TOGGLE_CONFIRM_COMMON_ASSIGNMENTS = "[assignments] toggle confirmation common assignments";
export const UPDATE_ASSIGN_FAIL_DATA = "[assignments] update error data";
export const TOGGLE_DUPLICATE_ASSIGNMENT_POPUP = "[assignments] toggle duplicate assignmnts popup";

// actions
export const setAssignmentAction = createAction(SET_ASSIGNMENT);
export const fetchAssignmentsAction = createAction(FETCH_ASSIGNMENTS);
export const setCurrentAssignmentAction = createAction(SET_CURRENT_ASSIGNMENT);
export const saveAssignmentAction = createAction(SAVE_ASSIGNMENT);
export const deleteAssignmentAction = createAction(DELETE_ASSIGNMENT);
export const loadAssignmentsAction = createAction(LOAD_ASSIGNMENTS);
export const removeAssignmentsAction = createAction(REMOVE_ASSIGNMENT);
export const setAssignmentSavingAction = createAction(SET_ASSIGNMENT_SAVING);
export const toggleHasCommonAssignmentsPopupAction = createAction(TOGGLE_CONFIRM_COMMON_ASSIGNMENTS);
export const updateAssignFailDataAction = createAction(UPDATE_ASSIGN_FAIL_DATA);
export const toggleHasDuplicateAssignmentPopupAction = createAction(TOGGLE_DUPLICATE_ASSIGNMENT_POPUP);

const initialState = {
  isLoading: false,
  isAssigning: false,
  hasCommonStudents: false,
  hasDuplicateAssignments: false,
  assignments: [],
  conflictData: {},
  current: "" // id of the current one being edited
};

const setAssignment = (state, { payload }) => {
  state.isLoading = false;
  state.assignments = payload;
};

const addAssignment = (state, { payload }) => {
  let isExisting = false;
  state.isAssigning = false;
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

const setAssignmentIsSaving = (state, { payload }) => {
  state.isAssigning = payload;
};

const setAssignmentFailStatus = (state, { payload }) => {
  state.hasCommonStudents = true;
  state.conflictData = payload;
};

const toggleCommonAssignmentsPopup = (state, { payload }) => {
  state.hasCommonStudents = payload;
};

const toggleHasDuplicateAssignmentsPopup = (state, { payload }) => {
  state.hasDuplicateAssignments = payload;
};

export const reducer = createReducer(initialState, {
  [FETCH_ASSIGNMENTS]: state => {
    state.isLoading = true;
  },
  [LOAD_ASSIGNMENTS]: setAssignment,
  [SET_ASSIGNMENT]: addAssignment,
  [SET_CURRENT_ASSIGNMENT]: setCurrent,
  [REMOVE_ASSIGNMENT]: removeAssignment,
  [SET_ASSIGNMENT_SAVING]: setAssignmentIsSaving,
  [UPDATE_ASSIGN_FAIL_DATA]: setAssignmentFailStatus,
  [TOGGLE_CONFIRM_COMMON_ASSIGNMENTS]: toggleCommonAssignmentsPopup,
  [TOGGLE_DUPLICATE_ASSIGNMENT_POPUP]: toggleHasDuplicateAssignmentsPopup
});

// selectors
const _module = "authorTestAssignments";

export const stateSelector = state => state[_module];

export const getIsloadingAssignmentSelector = createSelector(
  stateSelector,
  state => state.isLoading
);

const currentSelector = createSelector(
  stateSelector,
  state => state.current
);

export const getAssignmentsSelector = createSelector(
  stateSelector,
  state => state.assignments
);
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
      class: []
    };
  }
);

export const getHasCommonStudensSelector = createSelector(
  stateSelector,
  state => state.hasCommonStudents
);

export const getCommonStudentsSelector = createSelector(
  stateSelector,
  state => state.conflictData?.commonStudents || []
);

export const getHasDuplicateAssignmentsSelector = createSelector(
  stateSelector,
  state => state.hasDuplicateAssignments
);

// saga

function* saveAssignment({ payload }) {
  try {
    // Backend doesn't require PARTIAL_CREDIT_IGNORE_INCORRECT
    // Penalty true/false is set to determine the case
    if (payload.scoringType === testContants.evalTypeLabels.PARTIAL_CREDIT_IGNORE_INCORRECT) {
      payload.scoringType = testContants.evalTypeLabels.PARTIAL_CREDIT;
    }

    let testIds;
    yield put(setAssignmentSavingAction(true));
    if (!payload.playlistModuleId && !payload.playlistId) {
      testIds = [yield select(getTestIdSelector)];
    } else {
      const playlist = yield select(getPlaylistEntitySelector);
      testIds = [];
      if (payload.testId) {
        testIds = [payload.testId];
      } else {
        const module = playlist.modules.filter(m => m._id === payload.playlistModuleId);
        if (!module || !(module && module.length)) {
          yield put(setAssignmentSavingAction(false));
          notification({ messageKey: "moduleNotFoundInPlaylist" });
          return;
        }
        module &&
          module[0].data.forEach(dat => {
            if (dat.contentType === "test") {
              testIds.push(dat.contentId);
            }
          });
        if (!testIds.length) {
          yield put(setAssignmentSavingAction(false));
          notification({ messageKey: "noTestInModule" });
          return;
        }
      }
    }
    const test = yield select(getTestSelector);
    if (!testIds || !(testIds && testIds.length)) {
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
      yield put(setAssignmentSavingAction(false));
      return;
    }
    const startDate = payload.startDate && moment(payload.startDate).valueOf();
    const endDate = payload.endDate && moment(payload.endDate).valueOf();
    const dueDate = payload.dueDate && moment(payload.dueDate).valueOf();

    const userRole = yield select(getUserRole);
    const isTestLet = test.testType === testContants.type.TESTLET;
    const testType = isTestLet ? test.testType : get(payload, "testType", test.testType);
    // teacher can not update test content visibility.
    const visibility = payload.testContentVisibility &&
      userRole !== roleuser.TEACHER && { testContentVisibility: payload.testContentVisibility };
    let { class: classes } = payload;
    let containsCanvasClass = false;
    classes = classes.map(c => {
      const { canvasData, ...rest } = c;
      if (canvasData) {
        containsCanvasClass = true;
      }
      return rest;
    });
    const data = testIds.map(testId =>
      omit(
        {
          ...payload,
          startDate,
          endDate,
          dueDate,
          testType,
          ...visibility,
          testId,
          class: classes
        },
        [
          "_id",
          "__v",
          "createdAt",
          "updatedAt",
          "students",
          "scoreReleasedClasses",
          "googleAssignmentIds",
          "allowCommonStudents",
          "removeDuplicates",
          "allowDuplicates"
        ]
      )
    );
    const result = yield call(assignmentApi.create, {
      assignments: data,
      assignedBy,
      allowCommonStudents: !!payload.allowCommonStudents,
      removeDuplicates: !!payload.removeDuplicates,
      allowDuplicates: !!payload.allowDuplicates
    });
    const gSyncStatus = [];
    result.forEach(_data => {
      if (_data.gSyncStatus) gSyncStatus.push(_data.gSyncStatus);
      delete _data.gSyncStatus;
    });
    const assignment = result?.[0] ? formatAssignment(result[0]) : {};
    yield put({ type: SET_ASSIGNMENT, payload: assignment });
    yield put(setAssignmentSavingAction(false));
    yield put(toggleHasCommonAssignmentsPopupAction(false));
    yield put(toggleHasDuplicateAssignmentPopupAction(false));
    const assignmentId = assignment._id;
    if (!assignmentId && !payload.playlistModuleId) {
      yield put(push("/author/assignments"));
    }
    if (payload.playlistModuleId && !payload.testId) {
      notification({ type: "success", messageKey: "PlaylistAssignedSuccessfully" });
    }
    if (gSyncStatus.length) {
      notification({ type: "warn", messageKey: "shareWithGoogleClassroomFailed" });
    }
    const isAdminRole = [roleuser.SCHOOL_ADMIN, roleuser.DISTRICT_ADMIN].includes(userRole);
    if (containsCanvasClass) {
      if (isAdminRole) {
        notification({ type: "success", messageKey: "assignmentsWillBeSharedToCanvasINSometime" });
      } else notification({ type: "success", messageKey: "asignmentSharedTOCanvasClassAlso" });
    }
    if (!assignmentId && !payload.playlistModuleId) return;

    const prevLocState = yield select(state => state.router.location.state);
    // if there are no previous location , by default redirect to tests
    let locationState = { fromText: "TEST LIBRARY", toUrl: "/author/tests" };
    if (prevLocState?.fromText && prevLocState?.toUrl) {
      locationState = prevLocState;
    }
    yield put(
      push({
        pathname: `/author/${payload.playlistModuleId ? "playlists" : "tests"}/${
          payload.playlistModuleId ? payload.playlistId : testIds[0]
        }/assign/${assignmentId}`,
        state: { ...locationState, assignedTestId: payload.testId, playlistModuleId: payload.playlistModuleId }
      })
    );
  } catch (err) {
    console.error("error for save assignment", err);
    // enable button if call fails
    yield put(setAssignmentSavingAction(false));
    if (err.status === 409) {
      if (err.data.commonStudents && err.data.commonStudents.length) {
        return yield put(updateAssignFailDataAction(err.data));
      }
      return yield put(toggleHasDuplicateAssignmentPopupAction(true));
    }
    yield put(toggleHasCommonAssignmentsPopupAction(false));
    yield put(toggleHasDuplicateAssignmentPopupAction(false));
    if (err.status === 403 && err.data.message === "NO_CLASS_FOUND_AFTER_REMOVING_DUPLICATES") {
      yield put(updateAssingnmentSettingsAction({ class: [] }));
      return notification({ msg: "No classes found after removing the duplicates. Select one or more to assign." });
    }
    notification({ msg: err.statusText });
  }
}

function* loadAssignments({ payload }) {
  try {
    let testId;
    let regradeAssignments = false;
    if (!payload) {
      const { _id } = yield select(getTestSelector);
      testId = _id;
    } else if (typeof payload === "object") {
      testId = payload.testId;
      regradeAssignments = payload.regradeAssignments;
    } else {
      testId = payload;
    }

    // test is not yet created!
    if (!testId) {
      return;
    }
    // fetch assignments is for getting user assignments and regrade assignments is for getting org level assignments.
    const getAssignmentsApi = regradeAssignments
      ? assignmentApi.fetchRegradeAssignments
      : assignmentApi.fetchAssignments;
    const data = yield call(getAssignmentsApi, testId);
    const assignments = data.map(formatAssignment);
    yield put(loadAssignmentsAction(assignments));
  } catch (e) {
    console.error(e);
  }
}

function* deleteAssignment({ payload }) {
  try {
    yield assignmentApi.remove(payload);
    yield put(push("/author/assignments"));
    notification({ type: "success", messageKey: "AssignmentDelete" });
  } catch (error) {
    console.log(error);
    notification({ messageKey: "failedToDelete" });
  }
  yield put(toggleDeleteAssignmentModalAction(false));
}

export function* watcherSaga() {
  yield all([
    yield takeLatest(SAVE_ASSIGNMENT, saveAssignment),
    yield takeEvery(FETCH_ASSIGNMENTS, loadAssignments),
    yield takeEvery(DELETE_ASSIGNMENT, deleteAssignment)
  ]);
}

// selectors

export const getGroupSelector = state => state.testsAssign;
