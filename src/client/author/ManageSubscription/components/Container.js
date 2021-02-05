import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { getSubscriptionSelector, getSuccessSelector } from '../ducks'
import Header from './Header'

const ManageSubscriptionContainer = ({
  subscription: { subEndDate, subType } = {},
  isSuccess,
}) => {
  const isSubscribed =
    subType === 'premium' ||
    subType === 'enterprise' ||
    isSuccess ||
    subType === 'TRIAL_PREMIUM'

  const isPaidPremium = !(!subType || subType === 'TRIAL_PREMIUM')

  return (
    <Header
      isSubscribed={isSubscribed}
      subType={subType}
      subEndDate={subEndDate}
      isPaidPremium={isPaidPremium}
    />
  )
}

const enhance = compose(
  connect(
    (state) => ({
      subscription: getSubscriptionSelector(state),
      isSuccess: getSuccessSelector(state),
    }),
    null
  )
)

export default enhance(ManageSubscriptionContainer)
