import React from "react";
import { CardElement } from "react-stripe-elements";
import styled from "styled-components";
import {
  themeColor,
  greyishBorder,
  lightGreySecondary,
  themeColorLight,
  linkColor1,
  redDark,
  white
} from "@edulastic/colors";
import { Button } from "antd";

const OuterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
`;

const InnerContainer = styled.div`
  display: flex;
  margin-bottom: 10px;
  width: 100%;
`;

const InputContainer = styled.div`
  margin: 10px;
  width: 100%;

  .StripeElement {
    box-sizing: border-box;
    color: ${linkColor1};
    height: 40px;

    padding: 10px 12px 12px 12px;

    border: 1px solid ${greyishBorder};
    border-radius: 4px;
    background-color: ${lightGreySecondary};
  }

  .StripeElement--focus {
    border-color: ${themeColor};
  }

  .StripeElement--invalid {
    border-color: ${redDark};
  }

  .StripeElement--webkit-autofill {
    background-color: #fefde5 !important;
  }
`;

const StyledButton = styled(Button)`
  width: 390px;
  height: 40px;
  background: ${themeColor};
  color: ${white};
  border-radius: 4px;

  &:hover,
  &:focus {
    background: ${themeColor};
    color: ${white};
  }
`;

const CardStyle = {
  base: {
    color: linkColor1,
    fontSize: "16px",
    "::placeholder": {
      color: linkColor1
    }
  }
};

const CardSection = ({ handleCardSubmit, verificationPending }) => (
  <OuterContainer>
    <InnerContainer>
      <InputContainer>
        <CardElement style={CardStyle} hidePostalCode={true} />
      </InputContainer>
    </InnerContainer>
    <StyledButton onClick={handleCardSubmit} disabled={verificationPending}>
      Pay $100
    </StyledButton>
  </OuterContainer>
);

export default CardSection;
