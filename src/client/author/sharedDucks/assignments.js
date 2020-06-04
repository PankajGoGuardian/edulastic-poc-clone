import { createAction } from "redux-starter-kit";
import { takeEvery, call, put, all } from "redux-saga/effects";
import { push } from "connected-react-router";
import { createSelector } from "reselect";
import { message } from "antd";
import { notification } from "@edulastic/common";

import { testsApi } from "@edulastic/api";

import {
  TOGGLE_DELETE_ASSIGNMENT_MODAL,
  DELETE_ASSIGNMENT_REQUEST,
  DELETE_ASSIGNMENT_REQUEST_SUCCESS
} from "../src/constants/actions";

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const toggleDeleteAssignmentModalAction = createAction(TOGGLE_DELETE_ASSIGNMENT_MODAL);
export const deleteAssignmentRequestAction = createAction(DELETE_ASSIGNMENT_REQUEST);
export const deleteAssignmentRequestSuccessAction = createAction(DELETE_ASSIGNMENT_REQUEST_SUCCESS);

// -----|-----|-----|-----| ACTIONS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SELECTORS BEGIN |-----|-----|-----|----- //

export const stateSelector = state => state.author_assignments;

export const getToggleDeleteAssignmentModalState = createSelector(
  stateSelector,
  state => state.toggleDeleteAssignmentModalState
);

// -----|-----|-----|-----| SELECTORS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SAGAS BEGIN |-----|-----|-----|----- //

function* deleteAssignmentSaga({ payload }) {
  try {
    const result = yield call(testsApi.deleteAssignments, payload);
    const { deletedIds } = result;
    yield put(deleteAssignmentRequestSuccessAction(deletedIds));
    yield put(push("/"));
    yield put(push("/author/assignments"));
    yield call(notification, { type: "success", messageKey: "AssignmentDelete" });
  } catch (error) {
    console.log(error);
    notification({ messageKey:"failedToDelete" });
  }
  yield put(toggleDeleteAssignmentModalAction(false));
}

export function* sharedAssignmentsSaga() {
  yield all([yield takeEvery(DELETE_ASSIGNMENT_REQUEST, deleteAssignmentSaga)]);
}

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //
