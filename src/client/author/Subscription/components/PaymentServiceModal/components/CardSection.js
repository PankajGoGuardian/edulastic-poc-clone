import React from 'react'
import { CardElement } from 'react-stripe-elements'
import styled from 'styled-components'
import {
  themeColor,
  greyishBorder,
  lightGreySecondary,
  linkColor1,
  redDark,
} from '@edulastic/colors'
import { EduButton } from '@edulastic/common'

const OuterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const InnerContainer = styled.div`
  display: flex;
  margin-bottom: 35px;
  width: 100%;
`

const InputContainer = styled.div`
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
`

const CardStyle = {
  base: {
    color: linkColor1,
    fontSize: '16px',
    '::placeholder': {
      color: linkColor1,
    },
  },
}

const CardSection = ({
  handleCardSubmit,
  verificationPending,
  totalPurchaseAmount,
}) => (
  <OuterContainer>
    <InnerContainer>
      <InputContainer>
        <CardElement style={CardStyle} hidePostalCode />
      </InputContainer>
    </InnerContainer>
    <EduButton
      width="220px"
      height="45px"
      onClick={handleCardSubmit}
      disabled={verificationPending}
    >
      PAY ${totalPurchaseAmount || 100}
    </EduButton>
  </OuterContainer>
)

export default CardSection
