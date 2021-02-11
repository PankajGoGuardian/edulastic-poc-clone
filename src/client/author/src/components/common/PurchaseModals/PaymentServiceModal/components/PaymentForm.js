import React from 'react'
import { injectStripe } from 'react-stripe-elements'

import CardSection from './CardSection'

const PaymentForm = ({
  stripe,
  userId,
  reason,
  handlePayment,
  verificationPending,
  totalPurchaseAmount,
}) => {
  const handleCardSubmit = (e) => {
    e.preventDefault()
    handlePayment({
      stripe,
      data: { type: 'card', userId, reason },
    })
  }

  return (
    <form>
      <CardSection
        handleCardSubmit={handleCardSubmit}
        verificationPending={verificationPending}
        totalPurchaseAmount={totalPurchaseAmount}
      />
    </form>
  )
}

export default injectStripe(PaymentForm)
