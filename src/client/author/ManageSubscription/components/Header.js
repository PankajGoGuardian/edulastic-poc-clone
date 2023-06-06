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
  showRenewalOptions,
  isPremiumUser,
  orgData,
  userRole,
  features,
}) => {
  return (
    <SubscriptionHeader
      title="Manage Subscription"
      isSubscribed={isSubscribed}
      subType={subType}
      subEndDate={subEndDate}
      isPaidPremium={isPaidPremium}
      isBannerVisible={false}
      setShowSubscriptionAddonModal={setShowSubscriptionAddonModal}
      hasAllPremiumProductAccess={hasAllPremiumProductAccess}
      setShowMultiplePurchaseModal={setShowMultiplePurchaseModal}
      settingProductData={settingProductData}
      showRenewalOptions={showRenewalOptions}
      isPremiumUser={isPremiumUser}
      orgData={orgData}
      userRole={userRole}
      isManageSubscriptionView
      features={features}
    />
  )
}

export default Header
