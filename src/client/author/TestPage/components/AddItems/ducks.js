import { createSelector } from 'reselect'
import { captureSentryException, notification } from '@edulastic/common'
import { libraryFilters, test as testConst } from '@edulastic/constants'
import { createAction } from 'redux-starter-kit'
import {
  call,
  put,
  all,
  takeEvery,
  select,
  takeLatest,
  take,
  race,
} from 'redux-saga/effects'
import { push, LOCATION_CHANGE } from 'connected-react-router'
import { testItemsApi, contentErrorApi } from '@edulastic/api'
import { keyBy } from 'lodash'
import produce from 'immer'
import {
  getAllTagsSelector,
  TAGS_SAGA_FETCH_STATUS,
  SET_ALL_TAGS,
  SET_ALL_TAGS_FAILED,
  getTestEntitySelector,
  getSelectedTestItemsSelector,
  setTestDataAction,
} from '../../ducks'
import { DELETE_ITEM_SUCCESS } from '../../../ItemDetail/ducks'
import {
  APPROVE_OR_REJECT_SINGLE_ITEM_SUCCESS,
  APPROVE_OR_REJECT_MULTIPLE_ITEM_SUCCESS,
} from '../../../src/constants/actions'
import { UPDATE_TEST_ITEM_LIKE_COUNT } from '../../../ItemList/ducks'

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

  // These two filters are to be enabled later so, commented out
  // { icon: "reload", filter: "PREVIOUS", path: "previous", text: "Previously Used" },
  {
    icon: 'heart',
    filter: SMART_FILTERS.FAVORITES,
    path: 'favourites',
    text: 'My Favorites',
  },
  {
    icon: 'folders',
    filter: SMART_FILTERS.FOLDERS,
    path: 'folders',
    text: 'FOLDERS',
  },
]

// constants

export const RECEIVE_TEST_ITEMS_REQUEST = '[addItems] receive items request'
export const RECEIVE_TEST_ITEMS_SUCCESS = '[addItems] receive items success'
export const RECEIVE_TEST_ITEMS_ERROR = '[addItems] receive items error'
export const SET_TEST_ITEMS_REQUEST = '[addItems] set items request'
export const REMOVE_TEST_ITEMS_REQUEST = '[addItems] remove items request'
export const SET_TEST_ITEM_REQUEST = '[addItems] set passage item request'
export const CLEAR_SELECTED_ITEMS = '[addItems] clear selected items'
export const GET_ITEMS_SUBJECT_AND_GRADE = '[addItems] get subjects and grades'
export const REPORT_CONTENT_ERROR_REQUEST =
  '[addItems] report content error request'
export const SET_SEARCH_FILTER_STATE = '[addItems] update search filter state'
export const CLEAR_SEARCH_FILTER_STATE = '[addItems] clear search filter state'
export const UPDATE_INITIAL_SEARCH_STATE_ON_LOGIN =
  '[addItems] update init search state on login'
export const RESET_PAGE_STATE_ADD_ITEMS = '[addItems] reset page state'
export const SHOW_ADD_PASSAGE_ITEM_MODAL =
  '[addItems] toggle show add passage item modal'
export const SET_APPROVE_CONFIRMATION_OPEN =
  '[addItems] set approve confirmation modal open'
// actions

export const receiveTestItemsSuccess = (items, count, page, limit) => ({
  type: RECEIVE_TEST_ITEMS_SUCCESS,
  payload: {
    items,
    count,
    page,
    limit,
  },
})

export const receiveTestItemsError = (error) => ({
  type: RECEIVE_TEST_ITEMS_ERROR,
  payload: {
    error,
  },
})

export const receiveTestItemsAction = (search, sort, page, limit) => ({
  type: RECEIVE_TEST_ITEMS_REQUEST,
  payload: {
    search,
    sort,
    page,
    limit,
  },
})

export const setTestItemsAction = (data) => ({
  type: SET_TEST_ITEMS_REQUEST,
  payload: data,
})

export const removeTestItemsAction = (data) => ({
  type: REMOVE_TEST_ITEMS_REQUEST,
  payload: data,
})

export const setItemFromPassageAction = (data) => ({
  type: SET_TEST_ITEM_REQUEST,
  payload: data,
})

export const clearSelectedItemsAction = () => ({
  type: CLEAR_SELECTED_ITEMS,
})

export const getItemsSubjectAndGradeAction = (data) => ({
  type: GET_ITEMS_SUBJECT_AND_GRADE,
  payload: data,
})

export const reportContentErrorAction = (data) => ({
  type: REPORT_CONTENT_ERROR_REQUEST,
  payload: data,
})

export const updateSearchFilterStateAction = (payload) => ({
  type: SET_SEARCH_FILTER_STATE,
  payload,
})

export const clearFilterStateAction = (payload) => ({
  type: CLEAR_SEARCH_FILTER_STATE,
  payload,
})

export const updateInitSearchStateAction = (payload) => ({
  type: UPDATE_INITIAL_SEARCH_STATE_ON_LOGIN,
  payload,
})

export const resetPageStateAction = createAction(RESET_PAGE_STATE_ADD_ITEMS)
export const setApproveConfirmationOpenAction = createAction(
  SET_APPROVE_CONFIRMATION_OPEN
)

// reducer

export const initialSearchState = {
  subject: [],
  curriculumId: '',
  standardIds: [],
  questionType: '',
  depthOfKnowledge: '',
  authorDifficulty: '',
  collections: [],
  status: '',
  grades: [],
  tags: [],
  authoredByIds: [],
  filter: filterMenuItems[0].filter,
  createdAt: '',
}

export const initialSortState = {
  sortBy: 'popularity',
  sortDir: 'desc',
}

const initialState = {
  items: [],
  error: null,
  loading: false,
  page: 1,
  limit: 25,
  count: 0,
  selectedItems: [],
  itemsSubjectAndGrade: {
    subjects: [],
    grades: [],
  },
  search: { ...initialSearchState },
  archivedItems: [],
  needToSetFilter: true,
  showApproveConfirmation: false,
  sort: { ...initialSortState },
}

export const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case RECEIVE_TEST_ITEMS_REQUEST:
      return { ...state, loading: true }
    case RECEIVE_TEST_ITEMS_SUCCESS:
      return {
        ...state,
        loading: false,
        archivedItems: [],
        items: payload.items,
        count: payload.count,
        page: payload.page,
        limit: payload.limit,
      }
    case RECEIVE_TEST_ITEMS_ERROR:
      return { ...state, loading: false, error: payload.error }
    case SET_TEST_ITEMS_REQUEST:
      return {
        ...state,
        selectedItems: payload,
      }
    case SET_TEST_ITEM_REQUEST:
      return {
        ...state,
        selectedItems: [...state.selectedItems, payload],
      }
    case REMOVE_TEST_ITEMS_REQUEST:
      return {
        ...state,
        selectedItems: state.selectedItems.filter((i) => !payload.includes(i)),
      }
    case CLEAR_SELECTED_ITEMS:
      return {
        ...state,
        itemsSubjectAndGrade: {
          subjects: [],
          grades: [],
        },
      }
    case GET_ITEMS_SUBJECT_AND_GRADE:
      return {
        ...state,
        itemsSubjectAndGrade: payload,
      }
    case SET_SEARCH_FILTER_STATE:
      return {
        ...state,
        search: { ...payload.search },
        sort: { ...payload.sort },
        needToSetFilter: true,
      }
    case CLEAR_SEARCH_FILTER_STATE: {
      const search = payload?.search || {}
      if (payload?.search) {
        delete payload.search
      }
      return {
        ...state,
        search: {
          ...initialSearchState,
          ...search,
        },
        sort: { ...initialSortState },
        ...(payload || {}),
      }
    }
    case UPDATE_INITIAL_SEARCH_STATE_ON_LOGIN:
      return {
        ...state,
        search: {
          ...state.search,
          grades: payload.grades || [],
          subject: payload.subject[0] || '',
        },
      }
    case DELETE_ITEM_SUCCESS: {
      return {
        ...state,
        archivedItems: [...state.archivedItems, payload],
      }
    }
    case APPROVE_OR_REJECT_SINGLE_ITEM_SUCCESS:
      return {
        ...state,
        items: state.items.map((i) => {
          if (i._id === payload.itemId) {
            return {
              ...i,
              status: payload.status,
            }
          }
          return i
        }),
      }
    case APPROVE_OR_REJECT_MULTIPLE_ITEM_SUCCESS: {
      const itemIdsMap = keyBy(payload.itemIds)
      return {
        ...state,
        items: state.items.map((i) => {
          if (itemIdsMap[i._id]) {
            return {
              ...i,
              status: payload.status,
            }
          }
          return i
        }),
        selectedItems: [...state.selectedItems],
      }
    }
    case RESET_PAGE_STATE_ADD_ITEMS:
      return {
        ...state,
        page: 1,
        needToSetFilter: true,
      }
    case UPDATE_TEST_ITEM_LIKE_COUNT:
      return {
        ...state,
        items: state.items.map((item) => {
          if (item.versionId === payload.versionId) {
            return {
              ...item,
              analytics: [
                {
                  usage: item?.analytics?.[0]?.usage || 0,
                  likes: payload.toggleValue
                    ? (item?.analytics?.[0]?.likes || 0) + 1
                    : (item?.analytics?.[0]?.likes || 1) - 1,
                },
              ],
              alreadyLiked: payload.toggleValue,
            }
          }
          return item
        }),
      }
    case SET_APPROVE_CONFIRMATION_OPEN:
      return {
        ...state,
        showApproveConfirmation: payload,
      }
    default:
      return state
  }
}

// saga

function* receiveTestItemsSaga({
  payload: { search = {}, sort = {}, page = 1, limit = 10 },
}) {
  try {
    const currentLocation = yield select(
      (state) => state.router.location.pathname
    )
    const existingSearchParams = new URLSearchParams(window.location.search)
    let newSearchParams = `?page=${page}`
    if (existingSearchParams.has('testType')) {
      newSearchParams = `${newSearchParams}&testType=${existingSearchParams.get(
        'testType'
      )}`
    }
    yield put(push(`${currentLocation}${newSearchParams}`))

    const { tags = [] } = search
    let searchTags = []
    if (tags.some((tag) => typeof tag?.title === 'string')) {
      searchTags = tags
        .flatMap((tag) => tag.associatedNames || [tag.title])
        .filter((tag) => !!tag)
    } else {
      // if the tags are still being fetched, wait for it to fetch and complete
      if (TAGS_SAGA_FETCH_STATUS.isLoading) {
        yield race({
          success: take(SET_ALL_TAGS),
          fail: take(SET_ALL_TAGS_FAILED),
        })
      }
      const allTagsData = yield select((state) =>
        getAllTagsSelector(state, 'testitem')
      )
      const allTagsKeyById = keyBy(allTagsData, '_id')
      searchTags = tags.map((tag) => allTagsKeyById[tag]?.tagName || '')
    }

    const { items, count } = yield call(testItemsApi.getAll, {
      search: { ...search, tags: searchTags },
      sort,
      page,
      limit,
    })
    yield put(receiveTestItemsSuccess(items, count, page, limit))
  } catch (err) {
    captureSentryException(err)
    const errorMessage = 'Unable to retrieve test items.'
    notification({ type: 'error', messageKey: 'receiveItemFailing' })
    yield put(receiveTestItemsError(errorMessage))
  }
}

function* reportContentErrorSaga({ payload }) {
  try {
    yield call(contentErrorApi.reportContentError, payload)
    notification({ type: 'success', messageKey: 'issueReportedSuccessfully' })
  } catch (err) {
    captureSentryException(err)
    notification({ messageKey: 'failedToReportIssue' })
  }
}

function* clearSelectedItemsSaga() {
  const test = yield select(getTestEntitySelector)
  const itemsToRemove = yield select(
    (state) => state?.testsAddItems?.selectedItems
  )
  let hasItemsToRemove = false
  let updatedTest
  if (itemsToRemove?.length) {
    updatedTest = produce(test, (draft) => {
      draft.itemGroups.forEach((group) => {
        if (group.type !== testConst.ITEM_GROUP_TYPES.AUTOSELECT) {
          const filteredItems = group?.items?.filter(
            (x) => !itemsToRemove.includes(x._id)
          )
          if (filteredItems.length < group?.items?.length) {
            hasItemsToRemove = true
            group.items = filteredItems
          }
        }
      })
    })
  }

  yield put(setTestItemsAction([]))

  /** This condition is added to check if there are any selected items to be remove
   * and also to check that there should be atleast 1 item in the test removed so that test data
   * doesn't reset unnecessarily */
  if (hasItemsToRemove) yield put(setTestDataAction(updatedTest))
}

function* removeItemFromTest({ payload }) {
  const test = yield select(getTestEntitySelector)
  const selectedItems = yield select(
    (state) => state?.testsAddItems?.selectedItems
  )

  const updatedTest = produce(test, (draft) => {
    draft.itemGroups.forEach((group) => {
      group.items = group?.items?.filter((x) => x._id !== payload)
    })
  })

  yield put(setTestDataAction(updatedTest))
  yield put(
    setTestItemsAction((selectedItems || []).filter((x) => x._id !== payload))
  )
}

function* locationChangedSaga({ payload }) {
  if (
    !(
      payload?.location?.pathname?.includes('/author/items') ||
      payload?.location?.pathname?.includes('/author/questions') ||
      payload?.location?.pathname?.includes('/author/tests')
    )
  ) {
    yield put(clearSelectedItemsAction())
  }
}

export function* watcherSaga() {
  yield all([
    takeEvery(RECEIVE_TEST_ITEMS_REQUEST, receiveTestItemsSaga),
    takeEvery(CLEAR_SELECTED_ITEMS, clearSelectedItemsSaga),
    takeEvery(DELETE_ITEM_SUCCESS, removeItemFromTest),
    takeLatest(REPORT_CONTENT_ERROR_REQUEST, reportContentErrorSaga),
    takeLatest(LOCATION_CHANGE, locationChangedSaga),
  ])
}

// selectors

export const stateTestItemsSelector = (state) => state.testsAddItems

export const getArchivedItemsSelector = createSelector(
  stateTestItemsSelector,
  (state) => state.archivedItems
)

export const getTestItemsSelector = createSelector(
  stateTestItemsSelector,
  (state) =>
    state.items.filter((item) => !state.archivedItems.includes(item._id))
)

export const getPopStateSelector = createSelector(
  stateTestItemsSelector,
  (state) => state.showPopUp
)

export const getTestItemsLoadingSelector = createSelector(
  stateTestItemsSelector,
  (state) => state.loading
)

export const getTestsItemsCountSelector = createSelector(
  stateTestItemsSelector,
  (state) => state.count - state.archivedItems.length
)

export const getTestsItemsLimitSelector = createSelector(
  stateTestItemsSelector,
  (state) => state.limit
)

export const getTestsItemsPageSelector = createSelector(
  stateTestItemsSelector,
  (state) => state.page
)

export const getSelectedItemSelector = createSelector(
  (s) => getSelectedTestItemsSelector(s),
  (testItems) => testItems.map((item) => item._id)
)

export const getItemsSubjectAndGradeSelector = createSelector(
  stateTestItemsSelector,
  (state) => state.itemsSubjectAndGrade
)

export const getPassageConfirmModalStateSelector = createSelector(
  stateTestItemsSelector,
  (state) => state.showPassageConfirmModal
)

export const getSearchFilterStateSelector = createSelector(
  stateTestItemsSelector,
  (state) => state.search
)

export const getShowApproveConfirmationSelector = createSelector(
  stateTestItemsSelector,
  (state) => state.showApproveConfirmation
)

export const getSortFilterStateSelector = createSelector(
  stateTestItemsSelector,
  (state) => state.sort
)
