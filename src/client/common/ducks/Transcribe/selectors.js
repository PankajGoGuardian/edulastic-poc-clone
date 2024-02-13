import { createSelector } from 'reselect'

import { reduxNamespaceKey } from './actionReducers'

const stateSelector = (state) => state[reduxNamespaceKey]

// Temp credentials selector
const tempCredentialsSelector = createSelector(
  stateSelector,
  (state) => state?.tempCredentials
)

const tempCredentialsAPIStatusSelector = createSelector(
  tempCredentialsSelector,
  (state) => state?.status
)

const tempCredentialsDataSelector = createSelector(
  tempCredentialsSelector,
  (state) => state?.data
)

const activeTranscribeSessionIdSelector = createSelector(
  stateSelector,
  (state) => state?.activeTranscribeSessionId
)

const currentTranscribeToolBarIdSelector = createSelector(
  stateSelector,
  (state) => state?.currentToolBarId
)

export {
  tempCredentialsAPIStatusSelector,
  tempCredentialsDataSelector,
  activeTranscribeSessionIdSelector,
  currentTranscribeToolBarIdSelector,
}
