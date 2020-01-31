import React from "react";
import { injectStripe } from "react-stripe-elements";

import CardSection from "./CardSection";

const PaymentForm = ({ stripe, userId, reason, handlePayment, verificationPending }) => {
  const handleCardSubmit = e => {
    e.preventDefault();
    handlePayment({ stripe, data: { type: "card", userId, reason } });
  };

  return (
    <form>
      <p style={{ textAlign: "center", marginBottom: "10px" }}>{userId}</p>
      <CardSection handleCardSubmit={handleCardSubmit} verificationPending={verificationPending} />
    </form>
  );
};

export default injectStripe(PaymentForm);
