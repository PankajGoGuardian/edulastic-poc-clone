import { segmentApi } from '@edulastic/api'
import React, { useEffect } from 'react'
import { subscription } from '../../constants/subscription'
import SubscriptionContainer from './SubscriptionContainer'

const EnterpriseTab = ({
  isPremium,
  subType,
  subEndDate,
  isPremiumUser,
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
    <SubscriptionContainer
      showRequestOption={showRequestOption}
      data={data}
      type="enterprise"
    />
  )
}

export default EnterpriseTab
