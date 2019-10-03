import { takeLatest, call, all, select } from "redux-saga/effects";
import { testItemActivityApi } from "@edulastic/api";
import { getCurrentGroupWithAllClasses } from "../../student/Login/ducks";
import { SAVE_TEST_LEVEL_USER_WORK } from "../constants/actions";

function* saveTestletState() {
  try {
    const userTestActivityId = yield select(state => state.test && state.test.testActivityId);
    const _testUserWork = yield select(({ testUserWork }) => testUserWork[userTestActivityId]);
    const groupId = yield select(getCurrentGroupWithAllClasses);
    if (_testUserWork && userTestActivityId) {
      yield call(testItemActivityApi.updateUserWorkTestLevel, {
        testActivityId: userTestActivityId,
        groupId,
        userWork: _testUserWork
      });
    }
  } catch (error) {
    console.log(error);
  }
}

export default function* watcherSaga() {
  yield all([yield takeLatest(SAVE_TEST_LEVEL_USER_WORK, saveTestletState)]);
}
