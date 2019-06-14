import { createSelector } from "reselect";
import { createAction } from "redux-starter-kit";
import { call, put, all, takeEvery, takeLatest } from "redux-saga/effects";
import { message } from "antd";
import { curriculumSequencesApi, userContextApi } from "@edulastic/api";
import { CREATE_PLAYLISTS_SUCCESS, UPDATE_PLAYLISTS_SUCCESS } from "../src/constants/actions";
import { getFromLocalStorage } from "@edulastic/api/src/utils/Storage";

// types
export const RECEIVE_PLAYLIST_REQUEST = "[playlists] receive list request";
export const RECEIVE_PUBLISHER_REQUEST = "[publishers] receive list request";
export const RECEIVE_PLAYLISTS_SUCCESS = "[playlists] receive list success";
export const RECEIVE_PUBLISHERS_SUCCESS = "[publishers] receive list success";
export const RECEIVE_PLAYLISTS_ERROR = "[playlists] receive list error";
export const UPDATE_RECENT_PLAYLISTS = "[playlists] update recent playlists";
export const UPDATE_LAST_PLAYLIST = "[playlists] update last playlist";
export const RECEIVE_RECENT_PLAYLISTS = "[playlists] receive recent playlists";
export const RECEIVE_LAST_PLAYLIST = "[playlists] receive last playlist";
export const UPDATE_DEFAULT_GRADES = "[playlists] update default grades";
export const UPDATE_DEFAULT_SUBJECT = "[playlists] update default subject";

// actions
export const receivePlaylistsAction = createAction(RECEIVE_PLAYLIST_REQUEST);
export const receivePublishersAction = createAction(RECEIVE_PUBLISHER_REQUEST);

export const receivePlaylistSuccessAction = createAction(RECEIVE_PLAYLISTS_SUCCESS);
export const receivePublishersSuccessAction = createAction(RECEIVE_PUBLISHERS_SUCCESS);

export const receivePlaylistErrorAction = createAction(RECEIVE_PLAYLISTS_ERROR);
export const updateRecentPlayListsAction = createAction(UPDATE_RECENT_PLAYLISTS);
export const updateLastPlayListAction = createAction(UPDATE_LAST_PLAYLIST);
export const receiveRecentPlayListsAction = createAction(RECEIVE_RECENT_PLAYLISTS);
export const receiveLastPlayListAction = createAction(RECEIVE_LAST_PLAYLIST);
export const updateDefaultSubjectAction = createAction(UPDATE_DEFAULT_SUBJECT);
export const updateDefaultGradesAction = createAction(UPDATE_DEFAULT_GRADES);

function* receivePublishersSaga() {
  try {
    const result = yield call(curriculumSequencesApi.searchDistinctPublishers);
    yield put(receivePublishersSuccessAction(result));
  } catch (err) {
    const errorMessage = "Receive publishers is failing";
    yield call(message.error, errorMessage);
  }
}

function* receivePlaylistsSaga({ payload: { search = {}, page = 1, limit = 10 } }) {
  try {
    const result = yield call(curriculumSequencesApi.searchCurriculumSequences, {
      search,
      page,
      limit
    });

    yield put(
      receivePlaylistSuccessAction({
        entities: result.hits.hits,
        count: result.hits.total,
        page,
        limit
      })
    );
  } catch (err) {
    const errorMessage = "Receive tests is failing";
    yield call(message.error, errorMessage);
    yield put(receivePlaylistErrorAction({ error: errorMessage }));
  }
}

function* receiveLastPlayListSaga() {
  try {
    const result = yield call(userContextApi.getLastPlayList);
    yield put(updateLastPlayListAction(result ? result : {}));
  } catch (err) {
    const errorMessage = "Receive last playslist is failing";
    yield call(message.error, errorMessage);
  }
}

function* receiveRecentPlayListsSaga() {
  try {
    const result = yield call(userContextApi.getRecentPlayLists);
    yield put(updateRecentPlayListsAction(result ? result.value : {}));
  } catch (err) {
    const errorMessage = "Receive recent playlist is failing";
    yield call(message.error, errorMessage);
  }
}

export function* watcherSaga() {
  yield all([
    yield takeEvery(RECEIVE_PLAYLIST_REQUEST, receivePlaylistsSaga),
    yield takeEvery(RECEIVE_PUBLISHER_REQUEST, receivePublishersSaga),
    yield takeLatest(RECEIVE_LAST_PLAYLIST, receiveLastPlayListSaga),
    yield takeLatest(RECEIVE_RECENT_PLAYLISTS, receiveRecentPlayListsSaga)
  ]);
}

// reducer
const initialState = {
  entities: [],
  error: null,
  page: 1,
  limit: 20,
  count: 0,
  publishers: [],
  loading: false,
  recentPlayLists: [],
  defaultGrades: getFromLocalStorage("defaultGrades") ? getFromLocalStorage("defaultGrades").split(",") : null,
  defaultSubject: getFromLocalStorage("defaultSubject"),
  lastPlayList: {}
};

export const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case RECEIVE_PLAYLIST_REQUEST:
      return { ...state, loading: true };
    case RECEIVE_PLAYLISTS_SUCCESS:
      return {
        ...state,
        loading: false,
        entities: payload.entities,
        page: payload.page,
        limit: payload.limit,
        count: payload.count
      };
    case RECEIVE_PLAYLISTS_ERROR:
      return { ...state, loading: false, error: payload.error };
    case CREATE_PLAYLISTS_SUCCESS:
    case UPDATE_PLAYLISTS_SUCCESS:
      return {
        ...state,
        entities: [payload.entity, ...state.entities]
      };
    case RECEIVE_PUBLISHERS_SUCCESS:
      return {
        ...state,
        publishers: payload
      };
    case UPDATE_RECENT_PLAYLISTS:
      return {
        ...state,
        recentPlayLists: payload
      };
    case UPDATE_LAST_PLAYLIST:
      return {
        ...state,
        lastPlayList: payload
      };
    case UPDATE_DEFAULT_SUBJECT:
      return {
        ...state,
        defaultSubject: payload
      };
    case UPDATE_DEFAULT_GRADES:
      return {
        ...state,
        defaultGrades: payload
      };
    default:
      return state;
  }
};

// selectors
export const stateSelector = state => state.playlists;

export const getPlaylistsSelector = createSelector(
  stateSelector,
  state => state.entities
);
export const getPlaylistsLoadingSelector = createSelector(
  stateSelector,
  state => state.loading
);
export const getPlaylistsPageSelector = createSelector(
  stateSelector,
  state => state.page
);
export const getPlaylistsLimitSelector = createSelector(
  stateSelector,
  state => state.limit
);
export const getPlaylistsCountSelector = createSelector(
  stateSelector,
  state => state.count
);

export const getCollectionsSelector = createSelector(
  stateSelector,
  state => state.publishers
);

export const getLastPlayListSelector = createSelector(
  stateSelector,
  state => state.lastPlayList
);

export const getRecentPlaylistSelector = createSelector(
  stateSelector,
  state => state.recentPlayLists
);

export const getDefaultGradesSelector = createSelector(
  stateSelector,
  state => state.defaultGrades
);
export const getDefaultSubjectSelector = createSelector(
  stateSelector,
  state => state.defaultSubject
);
