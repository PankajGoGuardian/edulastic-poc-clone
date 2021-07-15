import { all } from 'redux-saga/effects'
import { createAction, createSlice } from 'redux-starter-kit'
import { createSelector } from 'reselect'

export const SET_GROUPED_DOCS = '[scanStore] set group docs'

export const setGroupedDocsAction = createAction(SET_GROUPED_DOCS)

const stateSelector = (state) => state.scanStore

const defaultUris = [
  'https://s3.amazonaws.com/edureact-dev/bubble_answer_sheets/608efe0cfae67b0009d16ce3/3a8129a7128e71dd6bc11ca0/combinepdf_87d1be23-a78c-4b35-8958-0ba638f16755-1.jpeg',
  'https://s3.amazonaws.com/edureact-dev/bubble_answer_sheets/608efe0cfae67b0009d16ce3/3a8129a7128e71dd6bc11ca0/combinepdf_87d1be23-a78c-4b35-8958-0ba638f16755-2.jpeg',
  'https://s3.amazonaws.com/edureact-dev/bubble_answer_sheets/608efe0cfae67b0009d16ce3/3a8129a7128e71dd6bc11ca0/combinepdf_87d1be23-a78c-4b35-8958-0ba638f16755-3.jpeg',
  'https://s3.amazonaws.com/edureact-dev/bubble_answer_sheets/608efe0cfae67b0009d16ce3/3a8129a7128e71dd6bc11ca0/combinepdf_87d1be23-a78c-4b35-8958-0ba638f16755-4.jpeg',
  'https://s3.amazonaws.com/edureact-dev/bubble_answer_sheets/608efe0cfae67b0009d16ce3/3a8129a7128e71dd6bc11ca0/combinepdf_87d1be23-a78c-4b35-8958-0ba638f16755-5.jpeg',
]

export const getGroupedDocs = createSelector(
  stateSelector,
  (state) => state.groupedDocs
)

const initialStore = {
  groupedDocs: {},
  splittedDocs: defaultUris.map((x) => ({
    uri: x,
    type: 'sheetUri',
    processStatus: 'done',
  })),
  scannedPageNumber: 1,
}

export const getSplittedDocsSelector = createSelector(
  stateSelector,
  (state) => state.splittedDocs
)

export const getScannedPageNumber = createSelector(
  stateSelector,
  (state) => state.scannedPageNumber
)

export const slice = createSlice({
  initialState: initialStore,
  reducers: {
    [SET_GROUPED_DOCS]: (state, { payload }) => {
      state.groupedDocs = payload
    },
    setSplittedDocs: (state, { payload }) => {
      state.splittedDocs = payload
    },
    setScannedPageNumber: (state, { payload }) => {
      state.scannedPageNumber = payload
    },
  },
})

// just a placeholder for now
export default function* watcher() {
  yield all([])
}
