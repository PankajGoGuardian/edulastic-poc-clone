import { takeEvery, call, put, all, select } from "redux-saga/effects";
import { createAction } from "redux-starter-kit";

import { receiveClassStudentResponseAction } from "../../author/src/actions/classBoard";

import { getTestActivitySelector, getAdditionalDataSelector, receiveTestActivitySaga } from "../ClassBoard/ducks";

export const FETCH_PRINT_PREVIEW_ESSENTIALS = "[printPreview] fetch print preview essentials";

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const fetchPrintPreviewEssentialsAction = createAction(FETCH_PRINT_PREVIEW_ESSENTIALS);

// -----|-----|-----|-----| ACTIONS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SAGAS BEGIN |-----|-----|-----|----- //

function* fetchPrintPreviewEssentials({ payload }) {
  const { assignmentId, classId: groupId, selectedStudents } = payload;
  try {
    const _payload = { assignmentId, classId: groupId };
    yield call(receiveTestActivitySaga, { payload: _payload });

    const testActivity = yield select(getTestActivitySelector);
    const additionalData = yield select(getAdditionalDataSelector);

    const { testId, classId } = additionalData;

    let selectedActivities = testActivity.filter(
      item => selectedStudents.includes(item.studentId) && item.testActivityId
    );
    selectedActivities = selectedActivities.map(item => item.testActivityId);

    yield put(receiveClassStudentResponseAction({ selectedActivities, groupId: classId }));
  } catch (error) {
    console.error(error);
  }
}

export function* printPreviewSaga() {
  yield all([yield takeEvery(FETCH_PRINT_PREVIEW_ESSENTIALS, fetchPrintPreviewEssentials)]);
}

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //
