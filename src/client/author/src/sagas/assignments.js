import { takeEvery, takeLatest, call, put, all, select } from "redux-saga/effects";
import { push } from "connected-react-router";
import { assignmentApi } from "@edulastic/api";
import { message } from "antd";
import { omit, get, set, unset, pickBy, identity } from "lodash";
import { notification } from "@edulastic/common";

import {
  RECEIVE_ASSIGNMENTS_REQUEST,
  RECEIVE_ASSIGNMENTS_SUCCESS,
  RECEIVE_ASSIGNMENTS_ERROR,
  FETCH_CURRENT_ASSIGNMENT,
  FETCH_CURRENT_EDITING_ASSIGNMENT,
  UPDATE_CURRENT_EDITING_ASSIGNMENT,
  UPDATE_RELEASE_SCORE_SETTINGS,
  TOGGLE_RELEASE_GRADE_SETTINGS,
  RECEIVE_ASSIGNMENTS_SUMMARY_REQUEST,
  RECEIVE_ASSIGNMENTS_SUMMARY_SUCCESS,
  RECEIVE_ASSIGNMENTS_SUMMARY_ERROR,
  RECEIVE_ASSIGNMENT_CLASS_LIST_REQUEST,
  RECEIVE_ASSIGNMENT_CLASS_LIST_SUCCESS,
  RECEIVE_ASSIGNMENT_CLASS_LIST_ERROR,
  SYNC_ASSIGNMENT_WITH_GOOGLE_CLASSROOM_REQUEST,
  SYNC_ASSIGNMENT_WITH_GOOGLE_CLASSROOM_SUCCESS,
  SYNC_ASSIGNMENT_WITH_GOOGLE_CLASSROOM_ERROR
} from "../constants/actions";
import { getUserRole } from "../selectors/user";

function* receiveAssignmentClassList({ payload = {} }) {
  try {
    const entities = yield call(assignmentApi.fetchAssignmentsClassList, payload);
    yield put({
      type: RECEIVE_ASSIGNMENT_CLASS_LIST_SUCCESS,
      payload: { entities }
    });
    /**
     * Entities will come empty only when we unassign the assignments from all the entities
     * as a bulk action performed by DA/SA. In that scenario we are routing to author
     * assignments page from advanced assignments page.
     */
    if (entities?.assignments?.length === 0) {
      yield put(push("/author/assignments"));
    }
  } catch (error) {
    const errorMessage = "Receive class list failing";
    yield call(message.error, errorMessage);
    yield put({
      type: RECEIVE_ASSIGNMENT_CLASS_LIST_ERROR,
      payload: { error: errorMessage }
    });
  }
}

function* receiveAssignmentsSummary({ payload = {} }) {
  try {
    // filtering should be false otherwise it will reset the current page to 1
    const { districtId = "", filters = {}, sort } = payload;
    if (get(filters, "subject")) {
      set(filters, "Subject", get(filters, "subject"));
      unset(filters, "subject");
    }
    const userRole = yield select(getUserRole);
    if (userRole === "district-admin" || userRole === "school-admin") {
      const folder = yield select(state => get(state, "folder.entity"), {});
      const entities = yield call(assignmentApi.fetchAssignmentsSummary, {
        districtId,
        filters: { ...pickBy(filters, identity), folderId: folder._id },
        sort
      });
      // handle zero assignments for current filter result
      if (entities) {
        yield put({
          type: RECEIVE_ASSIGNMENTS_SUMMARY_SUCCESS,
          payload: { entities: entities.result, total: entities.total }
        });
      } else {
        yield put({
          type: RECEIVE_ASSIGNMENTS_SUMMARY_SUCCESS,
          payload: { entities: [], total: 0 }
        });
      }
    }
  } catch (error) {
    const errorMessage = "Receive tests is failing";
    notification({ messageKey: "receiveTestFailing" });
    yield put({
      type: RECEIVE_ASSIGNMENTS_SUMMARY_ERROR,
      payload: { error: errorMessage }
    });
  }
}

function* receiveAssignmentsSaga({ payload = {} }) {
  try {
    const { groupId, filters = {} } = payload;
    const entities = yield call(assignmentApi.fetchTeacherAssignments, { groupId, filters });
    yield put({
      type: RECEIVE_ASSIGNMENTS_SUCCESS,
      payload: { entities }
    });
  } catch (err) {
    const errorMessage = "Receive tests is failing";
    notification({ messageKey: "receiveTestFailing" });
    yield put({
      type: RECEIVE_ASSIGNMENTS_ERROR,
      payload: { error: errorMessage }
    });
  }
}

function* receiveAssignmentByIdSaga({ payload }) {
  try {
    const data = yield call(assignmentApi.fetchAssignments, payload.testId);
    const getCurrent = data.filter(item => item._id === payload.assignmentId);
    yield put({
      type: UPDATE_CURRENT_EDITING_ASSIGNMENT,
      payload: getCurrent[0]
    });
    yield put({
      type: TOGGLE_RELEASE_GRADE_SETTINGS,
      payload: true
    });
  } catch (e) {
    yield put({
      type: UPDATE_CURRENT_EDITING_ASSIGNMENT,
      payload: {}
    });
    console.error(e);
  }
}

function* receiveAssignmentByAssignmentIdSaga({ payload }) {
  try {
    const data = yield call(assignmentApi.getById, payload);
    yield put({
      type: UPDATE_CURRENT_EDITING_ASSIGNMENT,
      payload: data
    });
  } catch (e) {
    yield put({
      type: UPDATE_CURRENT_EDITING_ASSIGNMENT,
      payload: {}
    });
    console.error(e);
  }
}

function* updateAssignmetSaga({ payload }) {
  try {
    const data = omit(
      {
        ...payload,
        updateTestActivities: true
      },
      ["_id", "__v", "createdAt", "updatedAt", "students", "scoreReleasedClasses", "termId", "reportKey"]
    );
    yield call(assignmentApi.update, payload._id, data);
    yield put({
      type: TOGGLE_RELEASE_GRADE_SETTINGS,
      payload: false
    });
    yield put({
      type: UPDATE_CURRENT_EDITING_ASSIGNMENT,
      payload: data
    });
    const successMessage = "Successfully updated release score settings";
    yield call(message.success, successMessage);
  } catch (e) {
    const errorMessage = "Update release score settings is failing";
    yield put({
      type: TOGGLE_RELEASE_GRADE_SETTINGS,
      payload: false
    });
    yield call(message.error, errorMessage);
    console.error(e);
  }
}

function* syncAssignmentWithGoogleClassroomSaga({ payload = {} }) {
  try {
    yield call(message.success, "Sharing assignment is in progress");
    yield call(assignmentApi.syncWithGoogleClassroom, payload);
    yield put({
      type: SYNC_ASSIGNMENT_WITH_GOOGLE_CLASSROOM_SUCCESS
    });
    yield call(message.success, "Assignment is shared with Google Classroom successfully");
  } catch (error) {
    const errorMessage =
      error?.data?.message || "Assignment failed to share with google classroom. Please try after sometime.";
    yield put({
      type: SYNC_ASSIGNMENT_WITH_GOOGLE_CLASSROOM_ERROR
    });
    yield call(message.error, errorMessage);
  }
}

export default function* watcherSaga() {
  yield all([
    yield takeEvery(RECEIVE_ASSIGNMENTS_REQUEST, receiveAssignmentsSaga),
    yield takeLatest(RECEIVE_ASSIGNMENTS_SUMMARY_REQUEST, receiveAssignmentsSummary),
    yield takeEvery(FETCH_CURRENT_EDITING_ASSIGNMENT, receiveAssignmentByIdSaga),
    yield takeEvery(FETCH_CURRENT_ASSIGNMENT, receiveAssignmentByAssignmentIdSaga),
    yield takeLatest(UPDATE_RELEASE_SCORE_SETTINGS, updateAssignmetSaga),
    yield takeEvery(RECEIVE_ASSIGNMENT_CLASS_LIST_REQUEST, receiveAssignmentClassList),
    yield takeEvery(SYNC_ASSIGNMENT_WITH_GOOGLE_CLASSROOM_REQUEST, syncAssignmentWithGoogleClassroomSaga)
  ]);
}
