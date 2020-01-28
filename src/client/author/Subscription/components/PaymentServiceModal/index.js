import { useState } from "react";
import { Input, Icon, message } from "antd";
import { greyishBorder } from "@edulastic/colors";
import { FlexContainer } from "@edulastic/common";
import { StyledPaymentServiceModal, StyledSpan, StyledTitle, IconSpan } from "./styled";
import { ThemeButton } from "../styled/commonStyled";

const PaymentServiceModal = props => {
  const { visible = false, closeModal } = props;

  const [cardNumber, setCardNumber] = useState("");
  const [expDate, setExpDate] = useState("");
  const [cvc, setCvc] = useState("");

  const handleChange = (e, attr) => {
    if (attr === "cardNo") {
      if ((cardNumber.length < 16 || e.target.value.length < 16) && !isNaN(e.target.value)) {
        setCardNumber(e.target.value);
      }
    } else if (attr === "expDate") {
      // needs move validation
      if (expDate.length < 5 || e.target.value.length < 5) {
        const val = e.target.value.length === 2 && !isNaN(e.target.value[1]) ? e.target.value + "/" : e.target.value;
        setExpDate(val);
      }
    } else {
      if ((cvc.length < 3 || e.target.value.length < 3) && !isNaN(e.target.value)) {
        setCvc(e.target.value);
      }
    }
  };

  const handlePayment = () => {
    console.log("Handle Payment");
    if (cardNumber) {
      if (expDate) {
        if (cvc) {
          // dispatch card validation api call action
        } else message.warning("Please enter your cvc/cvv");
      } else message.warning("Please enter your card expiry");
    } else message.warning("Please enter your card number");
  };

  return (
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
      <p style={{ textAlign: "center" }}>teacher_qoKs-5r4d56tfyg78huj9k</p>
      <br />
      <FlexContainer flexDirection="column">
        <Input
          placeholder="Card Number"
          style={{
            width: "400px",
            height: "50px",
            background: "#F3F3F3",
            border: `1px solid ${greyishBorder}`
          }}
          prefix={
            <IconSpan>
              <Icon type="credit-card" />
            </IconSpan>
          }
          value={cardNumber}
          onChange={e => handleChange(e, "cardNo")}
        />
        <br />
        <FlexContainer>
          <Input
            placeholder="MM / YY"
            style={{
              width: "195px",
              height: "50px",
              background: "#F3F3F3",
              border: `1px solid ${greyishBorder}`,
              margin: "0 10px 0 0"
            }}
            prefix={
              <IconSpan>
                <Icon type="calendar" />
              </IconSpan>
            }
            value={expDate}
            onChange={e => handleChange(e, "expDate")}
          />
          <Input
            placeholder="CVC"
            style={{
              width: "195px",
              height: "50px",
              background: "#F3F3F3",
              border: `1px solid ${greyishBorder}`
            }}
            prefix={
              <IconSpan>
                <Icon type="lock" />
              </IconSpan>
            }
            value={cvc}
            onChange={e => handleChange(e, "cvc")}
          />
        </FlexContainer>
      </FlexContainer>
      <br />
      <ThemeButton width="400px" onClick={handlePayment} inverse>
        PAY $100.00
      </ThemeButton>
    </StyledPaymentServiceModal>
  );
};

export default PaymentServiceModal;
