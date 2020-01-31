import React from "react";
import { WithResources } from "@edulastic/common";
import { StripeProvider } from "react-stripe-elements";
import { Elements } from "react-stripe-elements";
import PaymentForm from "./components/PaymentForm";
import { StyledPaymentServiceModal, StyledSpan, StyledTitle } from "./styled";

const PaymentServiceModal = props => {
  const { visible = false, closeModal, user, reason, verificationPending, stripePaymentAction } = props;

  const stripePubKey = process.env.POI_APP_STRIPE_PUBLIC_KEY;
  if (!stripePubKey) return null;

  return (
    <WithResources resources={["https://js.stripe.com/v3/"]} fallBack={<span />}>
      <StyledPaymentServiceModal
        visible={visible}
        title={
          <>
            <StyledTitle>Edulastic Payment Service</StyledTitle>
            <StyledSpan>TEACHER PREMIUM</StyledSpan>
          </>
        }
        onCancel={closeModal}
        footer={[]}
        centered
      >
        <StripeProvider apiKey={stripePubKey}>
          <Elements>
            <PaymentForm
              userId={`${user.role}_${user._id}`}
              reason={reason}
              handlePayment={stripePaymentAction}
              verificationPending={verificationPending}
            />
          </Elements>
        </StripeProvider>
      </StyledPaymentServiceModal>
    </WithResources>
  );
};

export default PaymentServiceModal;
