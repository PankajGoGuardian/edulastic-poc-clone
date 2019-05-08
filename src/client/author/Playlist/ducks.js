import { createSelector } from "reselect";
import { createAction } from "redux-starter-kit";
import { call, put, all, takeEvery } from "redux-saga/effects";
import { message } from "antd";
import { curriculumSequencesApi } from "@edulastic/api";
import { CREATE_PLAYLISTS_SUCCESS, UPDATE_PLAYLISTS_SUCCESS } from "../src/constants/actions";

// types
export const RECEIVE_PLAYLIST_REQUEST = "[playlists] receive list request";
export const RECEIVE_PLAYLISTS_SUCCESS = "[playlists] receive list success";
export const RECEIVE_PLAYLISTS_ERROR = "[playlists] receive list error";

// actions
export const receivePlaylistsAction = createAction(RECEIVE_PLAYLIST_REQUEST);
export const receivePlaylistSuccessAction = createAction(RECEIVE_PLAYLISTS_SUCCESS);
export const receivePlaylistErrorAction = createAction(RECEIVE_PLAYLISTS_ERROR);

function* receivePlaylistsSaga({ payload: { search = {}, page = 1, limit = 10 } }) {
  try {
    const result = yield call(curriculumSequencesApi.searchCurriculumSequences, {
      search,
      page,
      limit
    });

    yield put(
      receivePlaylistSuccessAction({
        entities: result,
        count: result.length,
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

export function* watcherSaga() {
  yield all([yield takeEvery(RECEIVE_PLAYLIST_REQUEST, receivePlaylistsSaga)]);
}

// reducer
const initialState = {
  entities: [],
  error: null,
  page: 1,
  limit: 20,
  count: 0,
  loading: false
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
    default:
      return state;
  }
};

// selectors
export const stateSelector = state => state.playlist;

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
