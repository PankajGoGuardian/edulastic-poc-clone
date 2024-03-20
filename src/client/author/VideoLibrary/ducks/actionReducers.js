import { createSlice } from 'redux-starter-kit'
import { vqConst } from '../const'

const { defaultTab, reduxNamespaceKey } = vqConst

const initialFilterValues = {
  subject: [],
  grades: [],
  status: '',
  filter: '',
  testCategories: '',
  collections: [],
  searchString: '',
}

const initialSortValues = {
  sortBy: 'recency',
  sortDir: 'desc',
}

const initialState = {
  searchString: '',
  testList: [],
  videoList: [],
  ytNextPageToken: '',
  isLoading: false,
  currentTab: defaultTab,
  ytTotalResult: 1,
  vqFilters: initialFilterValues,
  vqSort: initialSortValues,
  vqCount: 0,
  vqPage: 1,
  limit: vqConst.resultLimit,
  isInvalidUrl: false,
}

const slice = createSlice({
  slice: reduxNamespaceKey,
  initialState: { ...initialState },
  reducers: {
    ytSearchRequest: (state) => {
      state.isLoading = true
    },
    ytSearchSuccess: (
      state,
      { payload: { videoList, ytNextPageToken, ytTotalResult = 0 } }
    ) => {
      state.isLoading = false
      state.videoList = [...videoList]
      state.testList = []
      state.ytNextPageToken = ytNextPageToken
      state.ytTotalResult = ytTotalResult
    },
    ytSearchFailure: (state) => {
      state.isLoading = false
      state.videoList = []
      state.ytNextPageToken = ''
      state.ytTotalResult = 0
    },
    testSearchRequest: (state, { payload: { search = {}, sort = {} } }) => {
      state.isLoading = true
      state.vqFilters = { ...search }
      state.vqSort = { ...sort }
    },
    testSearchSuccess: (state, { payload: { testList = [], count, page } }) => {
      state.isLoading = false
      state.videoList = []
      state.testList = [...testList]
      state.vqCount = count
      state.vqPage = page
    },
    testSearchFailure: (state) => {
      state.testList = []
      state.isLoading = false
    },
    resetVQState: (state) => {
      state.searchString = ''
      state.testList = []
      state.videoList = []
      state.ytNextPageToken = ''
      state.isLoading = false
      state.currentTab = defaultTab
      state.ytTotalResult = 1
      state.vqFilters = initialFilterValues
      state.vqSort = initialSortValues
      state.vqCount = 0
      state.vqPage = 1
      state.limit = vqConst.resultLimit
      state.isInvalidUrl = false
    },
    updateCurrentTab: (state, { payload = defaultTab }) => {
      state.currentTab = payload
      state.testList = []
      state.videoList = []
    },
    updateSearchString: (state, { payload = '' }) => {
      state.searchString = payload
      state.ytTotalResult = 1
      state.isInvalidUrl = false
    },
    createVQAssessmentRequest: (state) => {
      state.isLoading = true
    },
    getYoutubeThumbnailRequest: (state) => {
      state.isLoading = true
    },
    getYoutubeThumbnailFailure: (state) => {
      state.isLoading = false
      state.isInvalidUrl = true
    },
    resetInvalidUrl: (state) => {
      state.isInvalidUrl = false
    },
    resetIsLoading: (state) => {
      state.isLoading = false
    },
    setVQFilters: (state, { payload: { search = {}, sort = {} } }) => {
      state.vqFilters = { ...search }
      state.vqSort = { ...sort }
    },
  },
})

const {
  ytSearchRequest,
  ytSearchSuccess,
  ytSearchFailure,
  testSearchRequest,
  testSearchSuccess,
  testSearchFailure,
  resetVQState,
  updateCurrentTab,
  updateSearchString,
  createVQAssessmentRequest,
  getYoutubeThumbnailRequest,
  getYoutubeThumbnailFailure,
  resetIsLoading,
  setVQFilters,
  resetInvalidUrl,
} = slice.actions

export const actions = {
  ytSearchRequest,
  ytSearchSuccess,
  ytSearchFailure,
  testSearchRequest,
  testSearchSuccess,
  testSearchFailure,
  resetVQState,
  updateCurrentTab,
  updateSearchString,
  createVQAssessmentRequest,
  getYoutubeThumbnailRequest,
  getYoutubeThumbnailFailure,
  resetIsLoading,
  setVQFilters,
  resetInvalidUrl,
}

export const { reducer } = slice

export { reduxNamespaceKey }
