import { createSelector } from 'reselect'
import { reduxNamespaceKey } from './actionReducers'

const stateSelector = (state) => state[reduxNamespaceKey]

export const videoQuizSelector = createSelector(stateSelector, (state) => state)

export const vqTestListSelector = createSelector(
  videoQuizSelector,
  (state) => state.testList
)

export const vqVideoListSelector = createSelector(
  videoQuizSelector,
  (state) => state.videoList
)

export const ytNextPageTokenSelector = createSelector(
  videoQuizSelector,
  (state) => state.nextPageToken
)

export const testNextPageSelector = createSelector(
  videoQuizSelector,
  (state) => state.nextPageToken
)

export const vqSearchStringSelector = createSelector(
  videoQuizSelector,
  (state) => state.searchString
)

export const vqCurrentTabSelector = createSelector(
  videoQuizSelector,
  (state) => state.currentTab
)

export const vqPageSelector = createSelector(
  videoQuizSelector,
  (state) => state.vqPage
)
export const vqIsLoadingSelector = createSelector(
  videoQuizSelector,
  (state) => state.isLoading
)
