import { createAction, createReducer } from "redux-starter-kit";
import { takeEvery, call, put, all, select } from "redux-saga/effects";
import { createSelector } from "reselect";
import { message, notification } from "antd";

import { testsApi } from "@edulastic/api";

import {
  TOGGLE_DELETE_ASSIGNMENT_MODAL,
  DELETE_ASSIGNMENT_REQUEST,
  DELETE_ASSIGNMENT_REQUEST_SUCCESS,
  DELETE_ASSIGNMENT_REQUEST_FAILED
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
    notification.success({
      message: `Assignment(s) deleted successfully.`,
      placement: "bottomLeft",
      duration: 1.5
    });
  } catch (error) {
    console.log(error);
    message.error("failed to delete");
  }
  yield put(toggleDeleteAssignmentModalAction(false));
}

export function* sharedAssignmentsSaga() {
  yield all([yield takeEvery(DELETE_ASSIGNMENT_REQUEST, deleteAssignmentSaga)]);
}

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //
