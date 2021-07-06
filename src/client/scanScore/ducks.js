import { all } from 'redux-saga/effects'
import { createAction, createReducer } from 'redux-starter-kit'
import { createSelector } from 'reselect'

export const SET_GROUPED_DOCS = '[scanStore] set group docs'

export const setGroupedDocsAction = createAction(SET_GROUPED_DOCS)

const stateSelector = (state) => state.scanStore

export const getGroupedDocs = createSelector(
  stateSelector,
  (state) => state.groupedDocs
)

const initialStore = {
  groupedDocs: {},
}

export const scanStoreReducer = createReducer(initialStore, {
  [SET_GROUPED_DOCS]: (state, { payload }) => {
    state.groupedDocs = payload
  },
})

// just a placeholder for now
export default function* watcher() {
  yield all([])
}
