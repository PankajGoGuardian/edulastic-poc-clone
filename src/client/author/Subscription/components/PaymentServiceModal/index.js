import React from 'react'
import { WithResources } from '@edulastic/common'
import { StripeProvider, Elements } from 'react-stripe-elements'
import PaymentForm from './components/PaymentForm'
import { StyledPaymentServiceModal } from './styled'

const PaymentServiceModal = (props) => {
  const {
    visible = false,
    closeModal,
    user,
    reason,
    verificationPending,
    stripePaymentAction,
    premiumProductId,
    totalPurchaseAmount,
  } = props

  const stripePubKey = process.env.REACT_APP_STRIPE_PUBLIC_KEY
  if (!stripePubKey) return null

  return (
    <WithResources
      resources={['https://js.stripe.com/v3/']}
      fallBack={<span />}
    >
      <StyledPaymentServiceModal
        visible={visible}
        title={
          <>
            <h3>Edulastic Payment Service</h3>
            <p>
              Your payment information is completely secure. All payments are
              processed through Stripe and no credit card information is stored
              in Edulastic.
            </p>
          </>
        }
        onCancel={closeModal}
        footer={[]}
        centered
      >
        <StripeProvider apiKey={stripePubKey}>
          <Elements>
            <PaymentForm
              userId={user.userName || user.email}
              reason={reason}
              handlePayment={stripePaymentAction}
              verificationPending={verificationPending}
              premiumProductId={premiumProductId}
              totalPurchaseAmount={totalPurchaseAmount}
            />
          </Elements>
        </StripeProvider>
      </StyledPaymentServiceModal>
    </WithResources>
  )
}

export default PaymentServiceModal
