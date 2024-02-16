import { createSlice } from 'redux-starter-kit'
import { vqConst } from '../const'

const { defaultTab, reduxNamespaceKey } = vqConst

const initialState = {
  testList: [],
  videoList: [],
  ytNextPageToken: '',
  isLoading: false,
  currentTab: defaultTab,
  searchString: '',
  ytThumbnail: '',
}

const slice = createSlice({
  slice: reduxNamespaceKey,
  initialState: { ...initialState },
  reducers: {
    ytSearchRequest: (state) => {
      state.isLoading = true
    },
    ytSearchSuccess: (state, { payload: { videoList, ytNextPageToken } }) => {
      state.isLoading = false
      state.videoList = [...videoList]
      state.ytNextPageToken = ytNextPageToken
    },
    testSearchRequest: (state) => {
      state.isLoading = true
    },
    testSearchSuccess: (state, { payload: { testList = [] } }) => {
      state.isLoading = false
      state.videoList = []
      state.testList = [...testList]
    },
    resetVQState: (state) => {
      state.testList = []
      state.videoList = []
      state.ytNextPageToken = ''
      state.isLoading = false
      state.currentTab = defaultTab
      state.searchString = ''
      state.ytThumbnail = ''
    },
    updateCurrentTab: (state, { payload = defaultTab }) => {
      state.currentTab = payload
      state.testList = []
      state.videoList = []
    },
    updateSearchString: (state, { payload = '' }) => {
      state.searchString = payload?.trim()
    },
    createVQAssessmentRequest: (state) => {
      state.isLoading = true
      state.ytThumbnail = ''
    },
    getYoutubeThumbnailSuccess: (state) => {
      state.isLoading = true
    },
    getYoutubeThumbnailFailure: (state) => {
      state.isLoading = false
    },
    resetIsLoading: (state) => {
      state.isLoading = false
    },
  },
})

const {
  ytSearchRequest,
  ytSearchSuccess,
  testSearchRequest,
  testSearchSuccess,
  resetVQState,
  updateCurrentTab,
  updateSearchString,
  createVQAssessmentRequest,
  getYoutubeThumbnailSuccess,
  getYoutubeThumbnailFailure,
  resetIsLoading,
} = slice.actions

export const actions = {
  ytSearchRequest,
  ytSearchSuccess,
  testSearchRequest,
  testSearchSuccess,
  resetVQState,
  updateCurrentTab,
  updateSearchString,
  createVQAssessmentRequest,
  getYoutubeThumbnailSuccess,
  getYoutubeThumbnailFailure,
  resetIsLoading,
}

export const { reducer } = slice

export { reduxNamespaceKey }
