import { get } from 'lodash'
import { createSelector } from 'reselect'

export const stateSelector = (state) => state.subscription

const subTypes = {
  ENTERPRISE: 'enterprise',
}

const SUB_TYPE = 'subscriptionData.subscription.subType'

export const getSubscriptionTypeSelector = createSelector(
  stateSelector,
  (state) => get(state, SUB_TYPE, '')
)

export const getIsEnterpriseUserSelector = createSelector(
  getSubscriptionTypeSelector,
  (subType) => subType === subTypes.ENTERPRISE
)
