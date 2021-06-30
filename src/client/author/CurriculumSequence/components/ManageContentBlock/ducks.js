import { createSlice } from 'redux-starter-kit'
import { createSelector } from 'reselect'
import { delay } from 'redux-saga'
import {
  takeEvery,
  takeLatest,
  put,
  call,
  all,
  select,
} from 'redux-saga/effects'
import { testsApi, settingsApi, resourcesApi } from '@edulastic/api'
import { notification } from '@edulastic/common'

export const sliceName = 'playlistTestBox'
const LIMIT = 20

const stateSelector = (state) => state?.[sliceName]

export const getPlaylistContentFilters = createSelector(
  stateSelector,
  (state) => state
)

export const getRecommendedResources = createSelector(
  stateSelector,
  (state) => state.recommendedResources
)

export const FILTERS = [
  {
    icon: 'book',
    filter: 'ENTIRE_LIBRARY',
    path: 'all',
    text: 'Entire Library',
  },
  {
    icon: 'folder',
    filter: 'AUTHORED_BY_ME',
    path: 'by-me',
    text: 'Authored by me',
  },
  {
    icon: 'share-alt',
    filter: 'SHARED_WITH_ME',
    path: 'shared',
    text: 'Shared with me',
  },
  {
    icon: 'reload',
    filter: 'PREVIOUS',
    path: 'previous',
    text: 'Previously Used',
  },
  {
    icon: 'heart',
    filter: 'FAVORITES',
    path: 'favourites',
    text: 'My Favorites',
  },
]

const slice = createSlice({
  slice: sliceName,
  initialState: {
    tests: [],
    resources: [],
    recommendedResources: [],
    status: '',
    authoredBy: '',
    subject: '',
    grades: [],
    collection: '',
    sources: [],
    isLoading: false,
    alignment: {},
    selectedStandards: [],
    loadedPage: 0,
    filter: 'ENTIRE_LIBRARY',
    searchString: undefined,
    testPreviewModalVisible: false,
    selectedTestForPreview: '',
    externalToolsProviders: [],
    searchResourceBy: 'tests',
  },
  reducers: {
    setDefaults: (state, { payload }) => {
      const { subject = '', grades = [], collection = '' } = payload
      state.subject = subject
      state.grades = grades
      state.collection = collection
    },
    fetchTests: (state) => {
      state.isLoading = true
    },
    fetchResources: (state) => {
      state.isLoading = true
    },
    fetchRecommendedResourcesAction: (state) => {
      state.isLoading = true
    },
    recommendedResourcesSuccessAction: (state, { payload }) => {
      state.isLoading = false
      state.recommendedResources = payload
    },
    fetchTestsSuccess: (state, { payload }) => {
      state.isLoading = false
      if (state.loadedPage === 0) {
        state.tests = payload.items
      } else {
        state.tests.push(...payload.items)
      }
      state.loadedPage += 1
    },
    setFilterAction: (state, { payload }) => {
      state.filter = payload
    },
    setStatusAction: (state, { payload }) => {
      state.status = payload
    },
    setAuthoredAction: (state, { payload }) => {
      state.authoredBy = payload
    },
    setGradesAction: (state, { payload }) => {
      state.grades = payload
    },
    setSubjectAction: (state, { payload }) => {
      state.subject = payload
    },
    setCollectionAction: (state, { payload }) => {
      state.collection = payload
    },
    setSourcesAction: (state, { payload }) => {
      state.sources = payload
    },
    setAlignmentAction: (state, { payload }) => {
      state.alignment = payload
    },
    setSelectedStandardsAction: (state, { payload }) => {
      state.selectedStandards = payload
    },
    resetLoadedPage: (state) => {
      state.loadedPage = 0
    },
    resetAndFetchTests: (state) => {
      state.isLoading = true
      state.loadedPage = 0
      state.tests = []
    },
    resetSelectedStandards: (state) => {
      state.selectedStandards = []
    },
    setTestSearchAction: (state, { payload }) => {
      state.searchString = payload
    },
    setResourceSearchAction: (state, { payload }) => {
      state.searchString = payload
      state.loadedPage = 0
    },
    showTestPreviewModal: (state, { payload }) => {
      state.selectedTestForPreview = payload
      state.testPreviewModalVisible = true
    },
    closeTestPreviewModal: (state) => {
      state.selectedTestForPreview = ''
      state.testPreviewModalVisible = false
    },
    fetchExternalToolProvidersAction: (state) => {
      state.externalToolsProviders = []
    },
    fetchExternalToolProvidersSuccess: (state, { payload }) => {
      state.externalToolsProviders = payload
    },
    setSearchByTab: (state, { payload }) => {
      state.searchResourceBy = payload
    },
    addResource: (state) => {
      state.searchResourceBy = 'resources'
    },
    updateResource: (state) => {
      state.searchResourceBy = 'resources'
    },
    deleteResource: (state) => {
      state.searchResourceBy = 'resources'
    },
    searchResource: (state) => {
      state.isLoading = true
    },
    fetchResourceResult: (state, { payload }) => {
      state.isLoading = false
      if (state.loadedPage === 0) {
        state.resources = payload
      } else {
        state.resources.push(...payload)
      }
      state.loadedPage += 1
    },
    resetAndSearchResources: (state) => {
      state.isLoading = true
      state.loadedPage = 0
      state.resources = []
    },
    resetContentFilters: (state) => {
      state.status = ''
      state.authoredBy = ''
      state.subject = ''
      state.grades = []
      state.collection = ''
      state.sources = []
      state.alignment = {}
      state.selectedStandards = []
      state.loadedPage = 0
      state.filter = 'ENTIRE_LIBRARY'
      state.searchString = undefined
    },
  },
})

export const closePlayListTestPreviewModalAction = () =>
  slice.actions.closeTestPreviewModal()

export default slice

function* fetchTestsSaga() {
  try {
    const {
      status,
      subject,
      grades,
      loadedPage,
      filter,
      collection,
    } = yield select((state) => state[sliceName])
    // Add authoredBy and sources once BE is fixed

    const { items, count } =
      status === 'draft' && filter === 'ENTIRE_LIBRARY'
        ? { items: [], count: 0 }
        : yield call(testsApi.getAll, {
            search: {
              status,
              subject,
              grades,
              filter,
              collections: collection === '' ? [] : [collection],
            },
            page: loadedPage + 1,
            limit: LIMIT,
          })
    yield put(slice.actions.fetchTestsSuccess({ items, count }))
  } catch (e) {
    console.error('Error Occured: fetchTestsSaga ', e)
  }
}

function* fetchTestsBySearchString() {
  try {
    yield delay(600)
    yield put(slice.actions?.resetLoadedPage())
    const {
      status,
      subject,
      grades,
      loadedPage,
      filter,
      collection,
      searchString,
    } = yield select((state) => state[sliceName])
    const { items, count } = yield call(testsApi.getAll, {
      search: {
        status,
        subject,
        grades,
        filter,
        collections: collection === '' ? [] : [collection],
        searchString,
      },
      page: loadedPage + 1,
      limit: LIMIT,
    })
    yield put(slice.actions.fetchTestsSuccess({ items, count }))
  } catch (e) {
    console.error('Error Occured: fetchTestsBySearchParam ', e)
  }
}

function* fetchExternalToolsSaga({ payload }) {
  try {
    const result = yield call(settingsApi.getExternalTools, {
      orgId: payload.districtId,
    })
    yield put(slice.actions.fetchExternalToolProvidersSuccess(result))
  } catch (e) {
    console.error('Error Occured: fetchExternalTools ', e)
  }
}

function* fetchDataSaga({ payload }) {
  try {
    yield put(slice.actions.resetContentFilters())
    if (payload === 'tests') {
      yield put(slice.actions.resetAndFetchTests())
    } else {
      yield put(slice.actions.resetAndSearchResources())
    }
  } catch (e) {
    console.error('Error Occured: fetchDataSaga ', e)
  }
}

function* addResourceSaga({ payload }) {
  try {
    yield call(resourcesApi.addResource, payload)
    yield put(slice.actions.resetSelectedStandards())
    // delay reources fetch so that the added resource gets indexed in ES
    yield delay(500)
    yield put(slice.actions.resetAndSearchResources())
    notification({ type: 'success', msg: 'Resource Created Successfully' })
  } catch (e) {
    console.error('Error Occured: addResourceSaga ', e)
  }
}

function* updateResourceSaga({ payload }) {
  try {
    yield call(resourcesApi.updateResource, payload)
    yield put(slice.actions.resetSelectedStandards())
    // delay reources fetch so that the added resource gets indexed in ES
    yield delay(500)
    yield put(slice.actions.resetAndSearchResources())
    notification({ type: 'success', msg: 'Resource Updated Successfully' })
  } catch (e) {
    console.error('Error Occured: addResourceSaga ', e)
  }
}

function* deleteResourceSaga({ payload }) {
  try {
    yield call(resourcesApi.deleteResource, payload)
    yield put(slice.actions.resetSelectedStandards())
    // delay reources fetch so that the added resource gets indexed in ES
    yield delay(500)
    yield put(slice.actions.resetAndSearchResources())
    notification({ type: 'success', msg: 'Resource Deleted Successfully' })
  } catch (e) {
    console.error('Error Occured: addResourceSaga ', e)
  }
}

function* getResourcesSaga(payload) {
  try {
    const result = yield call(resourcesApi.addRecommendedResources, payload)
    if (result) {
      yield put(slice.actions.recommendedResourcesSuccessAction(result))
    }
  } catch (e) {
    console.error('Error Occured: searchResourceSaga ', e)
  }
}

function* searchResourceSaga() {
  try {
    const {
      loadedPage,
      selectedStandards,
      searchString,
      alignment,
    } = yield select((state) => state[sliceName]) || {}

    const selectedStandardIds = selectedStandards?.map((x) => x._id) || []
    const data = {
      page: loadedPage + 1,
      limit: LIMIT,
      search: {
        searchString,
        curriculumId: alignment?.curriculumId,
        standardIds: selectedStandardIds,
        subject: alignment?.subject,
      },
    }
    const result = yield call(resourcesApi.searchResource, data)
    if (!result) {
      notification({ msg: result.error })
      yield put(slice.actions.fetchResourceResult([]))
    } else {
      const _data = result.map((x) => ({ ...x._source, contentId: x._id }))
      yield put(slice.actions.fetchResourceResult(_data))
    }
  } catch (e) {
    console.error('Error Occured: searchResourceSaga ', e)
  }
}

export function* watcherSaga() {
  yield all([
    yield takeEvery(slice.actions.fetchTests, fetchTestsSaga),
    yield takeEvery(slice.actions.resetAndFetchTests, fetchTestsBySearchString),
    yield takeLatest(
      slice.actions.setTestSearchAction,
      fetchTestsBySearchString
    ),
    yield takeEvery(
      slice.actions.fetchExternalToolProvidersAction,
      fetchExternalToolsSaga
    ),
    yield takeEvery(slice.actions.setSearchByTab, fetchDataSaga),
    yield takeEvery(slice.actions.addResource, addResourceSaga),
    yield takeEvery(slice.actions.updateResource, updateResourceSaga),
    yield takeEvery(slice.actions.deleteResource, deleteResourceSaga),
    yield takeEvery(slice.actions.searchResource, searchResourceSaga),
    yield takeEvery(slice.actions.resetAndSearchResources, searchResourceSaga),
    yield takeEvery(slice.actions.setResourceSearchAction, searchResourceSaga),
    yield takeEvery(slice.actions.fetchResources, searchResourceSaga),
    yield takeEvery(
      slice.actions.fetchRecommendedResourcesAction,
      getResourcesSaga
    ),
  ])
}
