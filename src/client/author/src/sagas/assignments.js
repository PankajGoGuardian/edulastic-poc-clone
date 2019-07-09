import { takeEvery, takeLatest, call, put, all, select } from "redux-saga/effects";
import { assignmentApi } from "@edulastic/api";
import { message } from "antd";
import { omit, get, set, unset, pickBy, identity } from "lodash";

import {
  RECEIVE_ASSIGNMENTS_REQUEST,
  RECEIVE_ASSIGNMENTS_SUCCESS,
  RECEIVE_ASSIGNMENTS_ERROR,
  FETCH_CURRENT_EDITING_ASSIGNMENT,
  UPDATE_CURRENT_EDITING_ASSIGNMENT,
  UPDATE_RELEASE_SCORE_SETTINGS,
  TOGGLE_RELEASE_GRADE_SETTINGS,
  RECEIVE_ASSIGNMENTS_SUMMARY_REQUEST,
  RECEIVE_ASSIGNMENTS_SUMMARY_SUCCESS,
  RECEIVE_ASSIGNMENTS_SUMMARY_ERROR,
  RECEIVE_ASSIGNMENT_CLASS_LIST_REQUEST,
  RECEIVE_ASSIGNMENT_CLASS_LIST_SUCCESS,
  RECEIVE_ASSIGNMENT_CLASS_LIST_ERROR
} from "../constants/actions";
import { getClassIds } from "../../../student/Reports/ducks";

function* receiveAssignmentClassList({ payload = {} }) {
  try {
    const entities = yield call(assignmentApi.fetchAssignmentsClassList, payload);
    yield put({
      type: RECEIVE_ASSIGNMENT_CLASS_LIST_SUCCESS,
      payload: { entities }
    });
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
    const { districtId = "", filters = {}, filtering } = payload;
    if (get(filters, "subject")) {
      set(filters, "Subject", get(filters, "subject"));
      unset(filters, "subject");
    }

    const classList = yield select(getClassIds);
    if (classList && classList.length) {
      const entities = yield call(assignmentApi.fetchAssignmentsSummary, {
        districtId,
        filters: pickBy(filters, identity)
      });
      yield put({
        type: RECEIVE_ASSIGNMENTS_SUMMARY_SUCCESS,
        payload: { entities, filtering }
      });
    }
  } catch (error) {
    const errorMessage = "Receive tests is failing";
    yield call(message.error, errorMessage);
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
    yield call(message.error, errorMessage);
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

export default function* watcherSaga() {
  yield all([
    yield takeEvery(RECEIVE_ASSIGNMENTS_REQUEST, receiveAssignmentsSaga),
    yield takeLatest(RECEIVE_ASSIGNMENTS_SUMMARY_REQUEST, receiveAssignmentsSummary),
    yield takeEvery(FETCH_CURRENT_EDITING_ASSIGNMENT, receiveAssignmentByIdSaga),
    yield takeLatest(UPDATE_RELEASE_SCORE_SETTINGS, updateAssignmetSaga),
    yield takeEvery(RECEIVE_ASSIGNMENT_CLASS_LIST_REQUEST, receiveAssignmentClassList)
  ]);
}
