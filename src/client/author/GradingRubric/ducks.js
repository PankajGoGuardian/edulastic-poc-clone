import { takeEvery, call, put, all } from "redux-saga/effects";
import { createSelector } from "reselect";
import { createAction, createReducer } from "redux-starter-kit";
import { rubricsApi } from "@edulastic/api";
import { message } from "antd";
import { notification } from "@edulastic/common";
import { setRubricIdAction } from "../sharedDucks/questions";
import { setItemLevelScoreFromRubricAction } from "../ItemDetail/ducks";

// constants
export const UPDATE_RUBRIC_DATA = "[rubric] update rubric data";
export const SAVE_RUBRIC = "[rubric] save rubric";
export const UPDATE_RUBRIC = "[rubric] update rubric";
export const SEARCH_RUBRICS = "[rubric] search rubrics request";
export const SEARCH_RUBRICS_SUCCESS = "[rubric] search rubric success";
export const SEARCH_RUBRICS_FAILED = "[rubric] search rubric failed";
export const DELETE_RUBRIC_REQUEST = "[rubric] delete rubric request";
export const GET_RUBRIC_BY_ID_REQUEST = "[rubric] get rubric by id request";
export const GET_RUBRIC_BY_ID_SUCCESS = "[rubric] get rubric by id success";
export const ADD_RUBRIC_TO_RECENTLY_USED = "[rubric] add rubric to recently used";
export const UPDATE_RUBRIC_IN_RECENTLY_USED_LIST = "[rubric] update rubric in recently used list";
export const SET_RECENTLY_USED_LIST = "[rubric] set recently used list";

// actions
export const updateRubricDataAction = createAction(UPDATE_RUBRIC_DATA);
export const saveRubricAction = createAction(SAVE_RUBRIC);
export const updateRubricAction = createAction(UPDATE_RUBRIC);
export const searchRubricsRequestAction = createAction(SEARCH_RUBRICS);
export const searchRubricsSuccessAction = createAction(SEARCH_RUBRICS_SUCCESS);
export const searchRubricsFailedAction = createAction(SEARCH_RUBRICS_FAILED);
export const deleteRubricAction = createAction(DELETE_RUBRIC_REQUEST);
export const getRubricByIdRequestAction = createAction(GET_RUBRIC_BY_ID_REQUEST);
export const getRubricByIdSuccessAction = createAction(GET_RUBRIC_BY_ID_SUCCESS);
export const addRubricToRecentlyUsedAction = createAction(ADD_RUBRIC_TO_RECENTLY_USED);
export const updateRubricInRecentlyUsedAction = createAction(UPDATE_RUBRIC_IN_RECENTLY_USED_LIST);
export const setRecentlyUsedList = createAction(SET_RECENTLY_USED_LIST);

// reducer
const initialState = {
  searchedList: [],
  currentRubric: null,
  searchingRubrics: false,
  totalSearchedCount: 0
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
  },
  [SET_RECENTLY_USED_LIST]: (state, { payload }) => {
    state.recentlyUsedRubrics = payload;
  }
});

// sagas
function* saveRubricSaga({ payload }) {
  try {
    const data = yield call(rubricsApi.createRubrics, payload.rubricData);
    yield put(updateRubricDataAction(data));
    yield put(
      setRubricIdAction({
        metadata: { _id: data._id, name: data.name },
        maxScore: payload.maxScore
      })
    );
    yield put(addRubricToRecentlyUsedAction(data));
    yield put(setItemLevelScoreFromRubricAction(false));
    if (payload.rubricData.status === "draft") notification({ type: "success", messageKey:"rubricIsSavedAsDraft"});
    else if (payload.rubricData.status === "published")notification({ type: "success", messageKey:"rubricIsSavedAndSpublished"});
  } catch (err) {
    notification({ messageKey:"failedToSaveRubric"});
  }
}

function* updateRubricSaga({ payload }) {
  try {
    const data = yield call(rubricsApi.updateRubricsById, {
      id: payload.rubricData._id,
      body: payload.rubricData
    });
    yield put(updateRubricDataAction(data));
    yield put(
      setRubricIdAction({
        metadata: { _id: payload.rubricData._id, name: payload.rubricData.name },
        maxScore: payload.maxScore
      })
    );
    yield put(addRubricToRecentlyUsedAction(payload.rubricData));
    yield put(updateRubricInRecentlyUsedAction(data));
    if (payload.status === "draft") notification({ type: "success", messageKey:"rubricUpdatedAsDraft"});
    else if (payload.status === "published") notification({ type: "success", messageKey:"rubricUpdatedAndSPublished"});
  } catch (err) {
     notification({ messageKey:"failedToUpdateRubric"});
  }
}

function* searchRubricsSaga({ payload }) {
  try {
    const data = yield call(rubricsApi.getSerchedRubrics, payload);
    yield put(searchRubricsSuccessAction(data));
  } catch (err) {
    yield put(searchRubricsFailedAction(""));
     notification({ messageKey:"UnableToreachRubric"});
  }
}

function* deleteRubricSaga({ payload }) {
  try {
    yield call(rubricsApi.deleteRuricsById, payload);
    notification({ type: "success", messageKey:"rubricDeletedSuccessfully"});
  } catch (err) {
    console.error(err);
     notification({ messageKey:"failedToDeleteTheRubric"});
  }
}

function* getRubricByIdSaga({ payload }) {
  try {
    const rubric = yield call(rubricsApi.getRubricsById, payload);
    yield put(getRubricByIdSuccessAction(rubric));
  } catch (err) {
    console.error(err);
    notification({ messageKey:"failedToFetchRubric"});
  }
}

function* addRubricToRecentlyUsedSaga({ payload }) {
  let localStoredRubrics = localStorage.getItem("recentlyUsedRubrics");
  if (localStoredRubrics) {
    localStoredRubrics = JSON.parse(localStoredRubrics);
    const isAlreadyPresent = localStoredRubrics.find(r => r._id === payload._id);
    if (!isAlreadyPresent) localStoredRubrics = [...localStoredRubrics, payload];
  } else {
    localStoredRubrics = [payload];
  }
  localStorage.setItem("recentlyUsedRubrics", JSON.stringify(localStoredRubrics));
}

function* updateRubricInRecentlyUsedSaga({ payload }) {
  let localStoredRubrics = localStorage.getItem("recentlyUsedRubrics");
  if (localStoredRubrics) {
    localStoredRubrics = JSON.parse(localStoredRubrics);
    let updatedList = localStoredRubrics.filter(r => r._id !== payload._id);
    if (updatedList.length < localStoredRubrics.length) {
      updatedList = [...updatedList, payload];
      localStorage.setItem("recentlyUsedRubrics", JSON.stringify(updatedList));
      yield put(setRecentlyUsedList(updatedList));
    }
  }
}

export function* watcherSaga() {
  yield all([
    yield takeEvery(SAVE_RUBRIC, saveRubricSaga),
    yield takeEvery(UPDATE_RUBRIC, updateRubricSaga),
    yield takeEvery(SEARCH_RUBRICS, searchRubricsSaga),
    yield takeEvery(DELETE_RUBRIC_REQUEST, deleteRubricSaga),
    yield takeEvery(GET_RUBRIC_BY_ID_REQUEST, getRubricByIdSaga),
    yield takeEvery(ADD_RUBRIC_TO_RECENTLY_USED, addRubricToRecentlyUsedSaga),
    yield takeEvery(UPDATE_RUBRIC_IN_RECENTLY_USED_LIST, updateRubricInRecentlyUsedSaga)
  ]);
}

// selectors
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

export const getRecentlyUsedRubricsSelector = () => {
  const localStoredRubrics = localStorage.getItem("recentlyUsedRubrics");
  if (localStoredRubrics) return JSON.parse(localStoredRubrics);
  else return [];
};
