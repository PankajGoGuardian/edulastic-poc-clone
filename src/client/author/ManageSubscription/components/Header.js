import React from 'react'
import SubscriptionHeader from '../../Subscription/components/SubscriptionHeader'

const Header = ({ isSubscribed, subType, subEndDate, isPaidPremium }) => {
  return (
    <SubscriptionHeader
      isSubscribed={isSubscribed}
      subType={subType}
      subEndDate={subEndDate}
      isPaidPremium={isPaidPremium}
      isBannerVisible={false}
    />
  )
}

export default Header
