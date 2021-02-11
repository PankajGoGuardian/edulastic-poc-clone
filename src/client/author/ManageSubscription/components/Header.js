import React from 'react'
import SubscriptionHeader from '../../Subscription/components/SubscriptionHeader'

const Header = ({
  isSubscribed,
  subType,
  subEndDate,
  isPaidPremium,
  setShowSubscriptionAddonModal,
  setShowMultiplePurchaseModal,
  settingProductData,
  hasAllPremiumProductAccess,
}) => {
  return (
    <SubscriptionHeader
      isSubscribed={isSubscribed}
      subType={subType}
      subEndDate={subEndDate}
      isPaidPremium={isPaidPremium}
      isBannerVisible={false}
      setShowSubscriptionAddonModal={setShowSubscriptionAddonModal}
      hasAllPremiumProductAccess={hasAllPremiumProductAccess}
      setShowMultiplePurchaseModal={setShowMultiplePurchaseModal}
      settingProductData={settingProductData}
    />
  )
}

export default Header
