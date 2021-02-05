import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import SubscriptionHeader from '../../Subscription/components/SubscriptionHeader'

const ManageSubscription = ({
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
    <SubscriptionHeader
      isSubscribed={isSubscribed}
      subType={subType}
      subEndDate={subEndDate}
      isPaidPremium={isPaidPremium}
      hideBanner
    />
  )
}

export default compose(
  connect(
    (state) => ({
      subscription: state?.subscription?.subscriptionData?.subscription,
      isSuccess: state?.subscription?.subscriptionData?.success,
      user: state.user.user,
      isPremiumTrialUsed:
        state?.subscription?.subscriptionData?.isPremiumTrialUsed,
    }),
    null
  )
)(ManageSubscription)
