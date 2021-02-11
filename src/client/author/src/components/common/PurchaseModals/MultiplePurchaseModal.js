import {
  CustomModalStyled,
  EduButton,
  FieldLabel,
  SelectInputStyled,
  TextInputStyled,
} from '@edulastic/common'
import { Row } from 'antd'
import React from 'react'
import { ModalBody, StyledCol } from './styled'

const MultiplePurchaseModal = ({ isVisible, onCancel }) => {
  const handlePayWithCard = () => {}
  const handleSelectCountPremiumSubs = () => {}
  const handleInputEmailAddress = () => {}
  return (
    <>
      <CustomModalStyled
        visible={isVisible}
        title="Upgrade multiple accounts"
        onCancel={onCancel}
        footer={[
          <EduButton height="45px" width="220px" onClick={handlePayWithCard}>
            PAY WITH CREDIT CARD
          </EduButton>,
        ]}
        centered
      >
        <ModalBody>
          <Row>
            <StyledCol>
              <FieldLabel>Number of Premium subscriptions</FieldLabel>
              <SelectInputStyled
                data-cy="selectNumberOfPremiumSubs"
                size="large"
                value=""
                onChange={handleSelectCountPremiumSubs}
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                placeholder="Select the number of premium subscriptions"
                height="40px"
              >
                <SelectInputStyled.Option data-cy="" key="" value="">
                  1
                </SelectInputStyled.Option>
              </SelectInputStyled>
            </StyledCol>
            <StyledCol>
              <FieldLabel>
                Enter the email addresses of the teachers to receive upgrades
              </FieldLabel>
              <TextInputStyled
                value=""
                onChange={handleInputEmailAddress}
                placeholder="Type the emails"
                height="40px"
              />
            </StyledCol>
          </Row>
        </ModalBody>
      </CustomModalStyled>
    </>
  )
}

export default MultiplePurchaseModal
