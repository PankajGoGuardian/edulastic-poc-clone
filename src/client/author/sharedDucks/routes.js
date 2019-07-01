import { LOCATION_CHANGE } from "connected-react-router";
import { takeEvery, select, put } from "redux-saga/effects";
import { get } from "lodash";
import { togglePresentationModeAction } from "../src/actions/testActivity";

const isAPresentationModePath = path =>
  path.includes("/author/classboard") ||
  path.includes("/author/expressgrader") ||
  path.includes("/author/standardsBasedReport");

// saga for handling methods on route based events.
function* routerWatcherSaga({ payload }) {
  try {
    // while getting out of lcb, expressGrader, SBR pages toggle presentation mode to false.
    const isPresentationMode = yield select(state =>
      get(state, ["author_classboard_testActivity", "presentationMode"], false)
    );
    const newLocation = payload.location.pathname;

    if (isPresentationMode && !isAPresentationModePath(newLocation)) {
      yield put(togglePresentationModeAction(false));
    }
  } catch (e) {
    console.log(e);
  }
}

export function* authorRoutesWatcherSaga() {
  yield takeEvery(LOCATION_CHANGE, routerWatcherSaga);
}
