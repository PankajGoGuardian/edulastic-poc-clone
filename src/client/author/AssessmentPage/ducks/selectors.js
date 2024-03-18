import { createSelector } from 'reselect'
import { reduxNamespaceKey } from './actionReducers'
import { currentTestActivityIdSelector } from '../../../assessment/selectors/test'

const stateSelector = (state) => state[reduxNamespaceKey]

export const videoQuizSelector = createSelector(stateSelector, (state) => state)

export const isVideoEndedSelector = createSelector(
  videoQuizSelector,
  currentTestActivityIdSelector,
  (state, currentTestActivityId) =>
    state?.isVideoEnded?.[currentTestActivityId] || false
)
