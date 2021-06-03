import React from 'react'
import { IconCheck } from '@edulastic/icons'
import { CustomModalStyled, FlexContainer } from '@edulastic/common'
import styled from 'styled-components'
import { secondaryTextColor, themeColor } from '@edulastic/colors'

const InvoiceSuccessModal = ({
  visible = false,
  onCancel = () => console.log(this),
}) => (
  <CustomModalStyled
    visible={visible}
    onCancel={onCancel}
    title={null}
    footer={null}
    centered
  >
    <FlexContainer mt="40px" flexDirection="column" alignItems="center">
      <StyledIconCheck />
      <Title>Thank You</Title>
      <SubTitle>{visible}</SubTitle>
    </FlexContainer>
  </CustomModalStyled>
)

export default InvoiceSuccessModal

const StyledIconCheck = styled(IconCheck)`
  fill: white;
  background: ${themeColor};
  width: 40px;
  height: 40px;
  border-radius: 100px;
  margin-bottom: 16px;
  padding: 9px;
`

const Title = styled.h1`
  text-align: left;
  font: normal normal bold 22px/30px Open Sans;
  letter-spacing: -1.1px;
  color: ${secondaryTextColor};
  opacity: 1;
`

const SubTitle = styled.div`
  text-align: center;
  font-weight: normal;
  font-size: 16px;
  margin-bottom: 40px;
`
