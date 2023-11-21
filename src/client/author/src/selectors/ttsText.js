import { createSelector } from 'reselect'

export const stateSelector = (state) => state.ttsTextReducer

export const getTTSTextAPIStatusSelector = createSelector(
  stateSelector,
  (state) => state.apiStatus
)

export const getTTSTextResultSelector = createSelector(
  stateSelector,
  (state) => state.result
)

export const updateTTSTextAPIStatusSelector = createSelector(
  stateSelector,
  (state) => state.TTSUpdateData?.apiStatus || false
)
