import { segmentApi } from '@edulastic/api'
import React, { useEffect } from 'react'
import { subscription } from '../../constants/subscription'
import SubscriptionContainer from './SubscriptionContainer'
import ManageSubscriptionButton from './ManageSubscriptionButton'

const EnterpriseTab = ({
  isPremium,
  subType,
  subEndDate,
  isPremiumUser,
  history,
  showMultipleSubscriptions,
  user,
}) => {
  const { utm_source, openIdProvider } = user

  const isExternalPublisher =
    utm_source === 'singapore' || openIdProvider === 'CLI'

  const showRequestOption = !(
    ['partial_premium', 'enterprise'].includes(subType) && isPremiumUser
  )

  const subscribed = subType === 'enterprise'

  const data = subscription.enterprise({
    subscribed,
    expiryDate: subEndDate,
  })

  if (isExternalPublisher) {
    data.addOn.data = data.addOn.data.filter((x) => x.title !== 'SparkMath')
  }

  if (isPremium) {
    data.addOn.title = 'Add ons for your Premium Version'
  }

  useEffect(() => {
    let eventName = 'Enterprise: Sell page visited'
    let eventData = {}
    if (subscribed) {
      eventName = 'Enterprise: subscription active'
      eventData = { ...user }
    }

    segmentApi.genericEventTrack(eventName, eventData)
  }, [])
  return (
    <>
      {/* This button will only be visible when showMultipleSubscription is true
      or the license type is multiple */}
      <ManageSubscriptionButton
        history={history}
        showMultipleSubscriptions={showMultipleSubscriptions}
      />
      <SubscriptionContainer
        showRequestOption={showRequestOption}
        data={data}
        type="enterprise"
      />
    </>
  )
}

export default EnterpriseTab
