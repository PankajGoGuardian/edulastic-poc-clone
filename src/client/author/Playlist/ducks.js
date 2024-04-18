import { createSelector } from 'reselect'
import { createAction } from 'redux-starter-kit'
import { call, put, all, takeEvery, takeLatest } from 'redux-saga/effects'
import { notification } from '@edulastic/common'
import { libraryFilters } from '@edulastic/constants'
import {
  curriculumSequencesApi,
  userContextApi,
  TokenStorage as Storage,
} from '@edulastic/api'
import produce from 'immer'
import {
  CREATE_PLAYLISTS_SUCCESS,
  UPDATE_PLAYLISTS_SUCCESS,
} from '../src/constants/actions'
import { UPDATE_INITIAL_SEARCH_STATE_ON_LOGIN } from '../TestPage/components/AddItems/ducks'

const { SMART_FILTERS } = libraryFilters
export const filterMenuItems = [
  {
    icon: 'book',
    filter: SMART_FILTERS.ENTIRE_LIBRARY,
    path: 'all',
    text: 'Entire Library',
  },
  {
    icon: 'folder',
    filter: SMART_FILTERS.AUTHORED_BY_ME,
    path: 'by-me',
    text: 'Created by me',
  },
  {
    icon: 'share-alt',
    filter: SMART_FILTERS.SHARED_WITH_ME,
    path: 'shared',
    text: 'Shared with me',
  },
  {
    icon: 'copy',
    filter: SMART_FILTERS.CO_AUTHOR,
    path: 'co-author',
    text: 'I am an author',
  },
  {
    icon: 'reload',
    filter: SMART_FILTERS.PREVIOUSLY_USED,
    path: 'previous',
    text: 'Previously Used',
  },

  // This filter will be enabled once playlist favourites feature is implemented
  // { icon: "heart", filter: SMART_FILTERS.FAVORITES, path: "favourites", text: "My Favorites" }
]

// types
export const RECEIVE_PLAYLIST_REQUEST = '[playlists] receive list request'
export const RECEIVE_PUBLISHER_REQUEST = '[publishers] receive list request'
export const RECEIVE_PLAYLISTS_SUCCESS = '[playlists] receive list success'
export const RECEIVE_PUBLISHERS_SUCCESS = '[publishers] receive list success'
export const RECEIVE_PLAYLISTS_ERROR = '[playlists] receive list error'
export const UPDATE_RECENT_PLAYLISTS = '[playlists] update recent playlists'
export const UPDATE_LAST_PLAYLIST = '[playlists] update last playlist'
export const RECEIVE_RECENT_PLAYLISTS = '[playlists] receive recent playlists'
export const RECEIVE_LAST_PLAYLIST = '[playlists] receive last playlist'
export const UPDATE_PLAYLIST_FILTER =
  '[playlists] update playlist search filter'
export const UPDATE_ALL_PLAYLIST_FILTERS =
  '[playlists] update all playlist filters'
export const CLEAR_PLAYLIST_FILTERS = '[playlists] clear playlist filters'
export const SELECT_PLAYLIST = '[playlists] check playlist'

// actions
export const receivePlaylistsAction = createAction(RECEIVE_PLAYLIST_REQUEST)
export const receivePublishersAction = createAction(RECEIVE_PUBLISHER_REQUEST)

export const receivePlaylistSuccessAction = createAction(
  RECEIVE_PLAYLISTS_SUCCESS
)
export const receivePublishersSuccessAction = createAction(
  RECEIVE_PUBLISHERS_SUCCESS
)

export const receivePlaylistErrorAction = createAction(RECEIVE_PLAYLISTS_ERROR)
export const updateRecentPlayListsAction = createAction(UPDATE_RECENT_PLAYLISTS)
export const updateLastPlayListAction = createAction(UPDATE_LAST_PLAYLIST)
export const receiveRecentPlayListsAction = createAction(
  RECEIVE_RECENT_PLAYLISTS
)
export const receiveLastPlayListAction = createAction(RECEIVE_LAST_PLAYLIST)
export const updatePlaylistSearchFilterAction = createAction(
  UPDATE_PLAYLIST_FILTER
)
export const updateAllPlaylistSearchFilterAction = createAction(
  UPDATE_ALL_PLAYLIST_FILTERS
)
export const clearPlaylistFiltersAction = createAction(CLEAR_PLAYLIST_FILTERS)
export const checkPlayListAction = createAction(SELECT_PLAYLIST)

function* receivePublishersSaga() {
  try {
    const result = yield call(curriculumSequencesApi.searchDistinctPublishers)
    yield put(receivePublishersSuccessAction(result))
  } catch (err) {
    const errorMessage = 'Unable to retreive publishers info.'
    notification({ type: 'error', msg: errorMessage })
  }
}

function* receivePlaylistsSaga({
  payload: { search = {}, sort = {}, page = 1, limit = 10 },
}) {
  try {
    const result = yield call(
      curriculumSequencesApi.searchCurriculumSequences,
      {
        search: {
          ...search,
          tags: search.tags
            .flatMap((tag) => tag.associatedNames || [tag.title])
            .filter((tag) => !!tag),
        },
        sort,
        page,
        limit,
      }
    )
    const deletedPlaylistIds = new Set(
      yield call(Storage.getDeletedPlaylistIds)
    )
    /**
     * deleted playlists won't sometimes sync right away to elastic search.
     * they are tracked by sessionStorage of the user who deleted them
     * TODO: Take care of sessionStorage cleanup if ever the bloat becomes too big and causes issue to any user
     */
    const results = result.hits.hits.filter((x) => !deletedPlaylistIds.has(x))
    yield put(
      receivePlaylistSuccessAction({
        entities: results,
        count: result.hits.total - (result.hits.hits.length - results.length),
        page,
        limit,
      })
    )
  } catch (err) {
    const errorMessage = 'Unable to retrieve playlist info.'
    notification({ type: 'error', msg: errorMessage })
    yield put(receivePlaylistErrorAction({ error: errorMessage }))
    console.warn(err)
  }
}

export function* receiveLastPlayListSaga() {
  try {
    const result = yield call(userContextApi.getLastPlayList)
    yield put(updateLastPlayListAction(result || {}))
    return result
  } catch (err) {
    const errorMessage = 'Unable to retrieve the last playlist.'
    notification({ type: 'error', msg: errorMessage })
  }
}

function* receiveRecentPlayListsSaga() {
  try {
    const result = yield call(userContextApi.getRecentPlayLists)
    yield put(updateRecentPlayListsAction(result ? result.value : []))
  } catch (err) {
    const errorMessage = 'Unable to retrieve recent playlist.'
    notification({ type: 'error', msg: errorMessage })
  }
}

export function* watcherSaga() {
  yield all([
    yield takeLatest(RECEIVE_PLAYLIST_REQUEST, receivePlaylistsSaga),
    yield takeEvery(RECEIVE_PUBLISHER_REQUEST, receivePublishersSaga),
    yield takeLatest(RECEIVE_LAST_PLAYLIST, receiveLastPlayListSaga),
    yield takeLatest(RECEIVE_RECENT_PLAYLISTS, receiveRecentPlayListsSaga),
  ])
}

export const emptyFilters = {
  grades: [],
  subject: [],
  filter: filterMenuItems[0].filter,
  searchString: [],
  type: '',
  status: '',
  tags: [],
  collections: [],
  createdAt: '',
}

export const initialSortState = {
  sortBy: 'popularity',
  sortDir: 'desc',
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
  lastPlayList: {},
  selectedPlayLists: [],
  filters: {
    ...emptyFilters,
  },
  sort: { ...initialSortState },
}

export const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case RECEIVE_PLAYLIST_REQUEST:
      return { ...state, loading: true }
    case RECEIVE_PLAYLISTS_SUCCESS:
      return {
        ...state,
        loading: false,
        entities: payload.entities,
        page: payload.page,
        limit: payload.limit,
        count: payload.count,
      }
    case RECEIVE_PLAYLISTS_ERROR:
      return { ...state, loading: false, error: payload.error }
    case CREATE_PLAYLISTS_SUCCESS:
    case UPDATE_PLAYLISTS_SUCCESS:
      return {
        ...state,
        entities: [payload.entity, ...state.entities],
      }
    case RECEIVE_PUBLISHERS_SUCCESS:
      return {
        ...state,
        publishers: payload,
      }
    case UPDATE_RECENT_PLAYLISTS:
      return {
        ...state,
        recentPlayLists: payload,
      }
    case UPDATE_LAST_PLAYLIST:
      return {
        ...state,
        lastPlayList: payload,
      }
    case UPDATE_PLAYLIST_FILTER: {
      const playListState = produce(state, (draft) => {
        draft.filters[payload.key] = payload.value
      })
      return playListState
    }
    case UPDATE_ALL_PLAYLIST_FILTERS:
      return {
        ...state,
        filters: payload.search,
        sort: payload.sort,
      }
    case CLEAR_PLAYLIST_FILTERS:
      return {
        ...state,
        filters: {
          ...emptyFilters,
        },
        sort: { ...initialSortState },
      }
    case UPDATE_INITIAL_SEARCH_STATE_ON_LOGIN:
      return {
        ...state,
        filters: {
          ...emptyFilters,
          grades: payload.grades || [],
          subject: payload.subject?.[0] || '',
        },
      }
    case SELECT_PLAYLIST:
      return {
        ...state,
        selectedPlayLists: payload,
      }
    default:
      return state
  }
}

// selectors
export const stateSelector = (state) => state.playlists

export const getPlaylistsSelector = createSelector(
  stateSelector,
  (state) => state.entities
)
export const getPlaylistsLoadingSelector = createSelector(
  stateSelector,
  (state) => state.loading
)
export const getPlaylistsPageSelector = createSelector(
  stateSelector,
  (state) => state.page
)
export const getPlaylistsLimitSelector = createSelector(
  stateSelector,
  (state) => state.limit
)
export const getPlaylistsCountSelector = createSelector(
  stateSelector,
  (state) => state.count
)

export const getLastPlayListSelector = createSelector(
  stateSelector,
  (state) => state.lastPlayList
)

export const getRecentPlaylistSelector = createSelector(
  stateSelector,
  (state) => state.recentPlayLists
)

export const getPlalistFilterSelector = createSelector(
  stateSelector,
  (state) => state.filters
)

export const getSelectedPlaylistSelector = createSelector(
  stateSelector,
  (state) => state.selectedPlayLists
)

export const getSortFilterStateSelector = createSelector(
  stateSelector,
  (state) => state.sort
)
