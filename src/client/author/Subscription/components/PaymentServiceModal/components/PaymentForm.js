import React from 'react'
import { injectStripe } from 'react-stripe-elements'

import CardSection from './CardSection'

const PaymentForm = ({
  stripe,
  userId,
  reason,
  handlePayment,
  verificationPending,
  premiumProductId,
}) => {
  const handleCardSubmit = (e) => {
    e.preventDefault()
    handlePayment({
      stripe,
      data: { type: 'card', userId, reason },
      productIds: [premiumProductId],
    })
  }

  return (
    <form>
      <CardSection
        handleCardSubmit={handleCardSubmit}
        verificationPending={verificationPending}
      />
    </form>
  )
}

export default injectStripe(PaymentForm)
