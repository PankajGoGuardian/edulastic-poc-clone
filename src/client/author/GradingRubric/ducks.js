import { takeEvery, call, put, all, select } from "redux-saga/effects";
import { push } from "connected-react-router";
import { createSelector } from "reselect";
import { createAction, createReducer } from "redux-starter-kit";
import { rubricsApi } from "@edulastic/api";
import { message } from "antd";

//constants
export const UPDATE_RUBRIC_DATA = "[rubric] update rubric data";
export const SAVE_RUBRIC = "[rubric] save rubric";
export const UPDATE_RUBRIC = "[rubric] update rubric";
export const SEARCH_RUBRICS = "[rubric] search rubrics request";
export const SEARCH_RUBRICS_SUCCESS = "[rubric] search rubric success";
export const SEARCH_RUBRICS_FAILED = "[rubric] search rubric failed";
export const DELETE_RUBRIC_REQUEST = "[rubric] delete rubric request";
export const GET_RUBRIC_BY_ID_REQUEST = "[rubric] get rubric by id request";
export const GET_RUBRIC_BY_ID_SUCCESS = "[rubric] get rubric by id success";

//actions
export const updateRubricDataAction = createAction(UPDATE_RUBRIC_DATA);
export const saveRubricAction = createAction(SAVE_RUBRIC);
export const updateRubricAction = createAction(UPDATE_RUBRIC);
export const searchRubricsRequestAction = createAction(SEARCH_RUBRICS);
export const searchRubricsSuccessAction = createAction(SEARCH_RUBRICS_SUCCESS);
export const searchRubricsFailedAction = createAction(SEARCH_RUBRICS_FAILED);
export const deleteRubricAction = createAction(DELETE_RUBRIC_REQUEST);
export const getRubricByIdRequestAction = createAction(GET_RUBRIC_BY_ID_REQUEST);
export const getRubricByIdSuccessAction = createAction(GET_RUBRIC_BY_ID_SUCCESS);

//reducer
const initialState = {
  searchedList: [],
  currentRubric: null,
  searchingRubrics: false,
  totalSearchedCount: 0,
  saving: false
};

export const reducer = createReducer(initialState, {
  [UPDATE_RUBRIC_DATA]: (state, { payload }) => {
    state.currentRubric = payload;
  },
  [SEARCH_RUBRICS]: state => {
    state.searchingRubrics = true;
  },
  [SEARCH_RUBRICS_SUCCESS]: (state, { payload }) => {
    state.searchingRubrics = false;
    state.searchedList = payload.rubrics;
    state.totalSearchedCount = payload.total;
  },
  [SEARCH_RUBRICS_FAILED]: state => {
    state.searchingRubrics = false;
  },
  [GET_RUBRIC_BY_ID_SUCCESS]: (state, { payload }) => {
    state.currentRubric = payload[0];
  }
});

//sagas
function* saveRubricSaga({ payload }) {
  try {
    const data = yield call(rubricsApi.createRubrics, payload);
    yield put(updateRubricDataAction(data));
    if (payload.status === "draft") yield call(message.success, "Rubric is saved as draft");
    else if (payload.status === "published") yield call(message.success, "Rubric is saved and published");
  } catch (err) {
    yield call(message.error, "Failed to save Rubric");
  }
}

function* updateRubricSaga({ payload }) {
  try {
    const data = yield call(rubricsApi.updateRubricsById, {
      id: payload._id,
      body: payload
    });
    yield put(updateRubricDataAction(data));
    if (payload.status === "draft") yield call(message.success, "Rubric is updated as draft");
    else if (payload.status === "published") yield call(message.success, "Rubric is updated and published");
  } catch (err) {
    yield call(message.error, "Failed to update Rubric");
  }
}

function* searchRubricsSaga({ payload }) {
  try {
    const data = yield call(rubricsApi.getSerchedRubrics, payload);
    console.log("data", data);
    yield put(searchRubricsSuccessAction(data));
  } catch (err) {
    yield put(searchRubricsFailedAction(""));
    yield call(message.error, "Unable to fetch rubrics");
  }
}

function* deleteRubricSaga({ payload }) {
  try {
    yield call(rubricsApi.deleteRuricsById, payload);
    yield call(message.success, "Rubric deleted successfully.");
  } catch (err) {
    console.error(err);
    yield call(message.error, "Failed to delete the rubric.");
  }
}

function* getRubricByIdSaga({ payload }) {
  try {
    const rubric = yield call(rubricsApi.getRubricsById, payload);
    yield put(getRubricByIdSuccessAction(rubric));
  } catch (err) {
    console.error(err);
    yield call(message.error, "Failed to fetch rubric.");
  }
}

export function* watcherSaga() {
  yield all([
    yield takeEvery(SAVE_RUBRIC, saveRubricSaga),
    yield takeEvery(UPDATE_RUBRIC, updateRubricSaga),
    yield takeEvery(SEARCH_RUBRICS, searchRubricsSaga),
    yield takeEvery(DELETE_RUBRIC_REQUEST, deleteRubricSaga),
    yield takeEvery(GET_RUBRIC_BY_ID_REQUEST, getRubricByIdSaga)
  ]);
}

//selectors
export const getStateSelector = state => state.rubricReducer;

export const getCurrentRubricDataSelector = createSelector(
  getStateSelector,
  state => state.currentRubric
);

export const getSearchedRubricsListSelector = createSelector(
  getStateSelector,
  state => state.searchedList
);

export const getSearchingStateSelector = createSelector(
  getStateSelector,
  state => state.searchingRubrics
);

export const getTotalSearchedCountSelector = createSelector(
  getStateSelector,
  state => state.totalSearchedCount
);
