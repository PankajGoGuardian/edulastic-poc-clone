import { createSelector } from "reselect";
import { createAction } from "redux-starter-kit";
import { call, put, all, takeEvery, takeLatest, select } from "redux-saga/effects";
import { message } from "antd";
import { notification } from "@edulastic/common";
import { curriculumSequencesApi, userContextApi } from "@edulastic/api";
import { CREATE_PLAYLISTS_SUCCESS, UPDATE_PLAYLISTS_SUCCESS } from "../src/constants/actions";
import { getFromLocalStorage } from "@edulastic/api/src/utils/Storage";
import { UPDATE_INITIAL_SEARCH_STATE_ON_LOGIN } from "../TestPage/components/AddItems/ducks";

export const filterMenuItems = [
  { icon: "book", filter: "ENTIRE_LIBRARY", path: "all", text: "Entire Library" },
  { icon: "folder", filter: "AUTHORED_BY_ME", path: "by-me", text: "Authored by me" },
  { icon: "share-alt", filter: "SHARED_WITH_ME", path: "shared", text: "Shared with me" },
  { icon: "copy", filter: "CO_AUTHOR", path: "co-author", text: "I am a Co-Author" }

  // These two filters are to be enabled later so, commented out
  // { icon: "reload", filter: "PREVIOUS", path: "previous", text: "Previously Used" },
  // { icon: "heart", filter: "FAVORITES", path: "favourites", text: "My Favorites" }
];

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
export const UPDATE_PLAYLIST_FILTER = "[playlists] update playlist search filter";
export const UPDATE_ALL_PLAYLIST_FILTERS = "[playlists] update all playlist filters";
export const CLEAR_PLAYLIST_FILTERS = "[playlists] clear playlist filters";
export const SELECT_PLAYLIST = "[playlists] check playlist";

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
export const updatePlaylistSearchFilterAction = createAction(UPDATE_PLAYLIST_FILTER);
export const updateAllPlaylistSearchFilterAction = createAction(UPDATE_ALL_PLAYLIST_FILTERS);
export const clearPlaylistFiltersAction = createAction(CLEAR_PLAYLIST_FILTERS);
export const checkPlayListAction = createAction(SELECT_PLAYLIST);

function* receivePublishersSaga() {
  try {
    const result = yield call(curriculumSequencesApi.searchDistinctPublishers);
    yield put(receivePublishersSuccessAction(result));
  } catch (err) {
    const errorMessage = "Receive publishers is failing";
    notification({msg:errorMessage});
  }
}

function* receivePlaylistsSaga({ payload: { search = {}, page = 1, limit = 10 } }) {
  try {
    const _search = { ...search };
    // If user is CE then fetch playlists created by only this CE
    const { _id: userId, permissions: userPermissions = [] } = yield select(state => state.user.user) || {};
    if (userPermissions.includes("curator")) {
      if (_search.authoredByIds) {
        _search.authoredByIds.push(userId);
      } else {
        _search.authoredByIds = [userId];
      }
    }

    const result = yield call(curriculumSequencesApi.searchCurriculumSequences, {
      search: _search,
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
    const errorMessage = "Receive playlists is failing";
    notification({msg:errorMessage});
    yield put(receivePlaylistErrorAction({ error: errorMessage }));
    console.warn(err);
  }
}

function* receiveLastPlayListSaga() {
  try {
    const result = yield call(userContextApi.getLastPlayList);
    yield put(updateLastPlayListAction(result ? result : {}));
  } catch (err) {
    const errorMessage = "Receive last playslist is failing";
    notification({msg:errorMessage});
  }
}

function* receiveRecentPlayListsSaga() {
  try {
    const result = yield call(userContextApi.getRecentPlayLists);
    yield put(updateRecentPlayListsAction(result ? result.value : []));
  } catch (err) {
    const errorMessage = "Receive recent playlist is failing";
    notification({msg:errorMessage});
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

export const emptyFilters = {
  grades: [],
  subject: "",
  filter: filterMenuItems[0].filter,
  searchString: "",
  type: "",
  status: "",
  tags: [],
  collections: [],
  createdAt: ""
};

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
  lastPlayList: {},
  selectedPlayLists: [],
  filters: {
    ...emptyFilters
  }
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
    case UPDATE_PLAYLIST_FILTER: {
      const playListState = produce(state, draft => {
        draft.filters[payload.key] = payload.value;
      });
      return playListState;
    }
    case UPDATE_ALL_PLAYLIST_FILTERS:
      return {
        ...state,
        filters: payload
      };
    case CLEAR_PLAYLIST_FILTERS:
      return {
        ...state,
        filters: {
          ...emptyFilters
        }
      };
    case UPDATE_INITIAL_SEARCH_STATE_ON_LOGIN:
      return {
        ...state,
        filters: {
          ...emptyFilters,
          grades: payload.grades || [],
          subject: payload.subject[0] || ""
        }
      };
    case SELECT_PLAYLIST:
      return {
        ...state,
        selectedPlayLists: payload
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

export const getLastPlayListSelector = createSelector(
  stateSelector,
  state => state.lastPlayList
);

export const getRecentPlaylistSelector = createSelector(
  stateSelector,
  state => state.recentPlayLists
);

export const getPlalistFilterSelector = createSelector(
  stateSelector,
  state => state.filters
);

export const getSelectedPlaylistSelector = createSelector(
  stateSelector,
  state => state.selectedPlayLists
);
