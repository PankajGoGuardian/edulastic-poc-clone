import { CheckboxLabel, CustomModalStyled, EduButton } from '@edulastic/common'
import React from 'react'
import { ModalBody, AddonList, FlexRow, Total } from './styled'

const AddonModal = ({ visible, setShowModal }) => {
  return (
    <CustomModalStyled
      visible={visible}
      title="Select Add-ons"
      onCancel={() => setShowModal(false)}
      footer={[
        <EduButton height="45px" width="220px">
          PROCEED WITH PAYMENT
        </EduButton>,
      ]}
      centered
    >
      <ModalBody>
        <p>
          The Spark addons bundle premium content with some exciting software
          features to make it super easy for you to use.{' '}
          <a href="#">Click here</a> to learn more.
        </p>
        <p>These addons need the premium or enterprise subscription.</p>
        <AddonList>
          <FlexRow>
            <CheckboxLabel>Spark Math</CheckboxLabel>
            <span>$100</span>
          </FlexRow>
          <FlexRow>
            <CheckboxLabel>Spark Science</CheckboxLabel>
            <span>$100</span>
          </FlexRow>
          <FlexRow>
            <CheckboxLabel>Spark Books</CheckboxLabel>
            <span>$100</span>
          </FlexRow>
        </AddonList>
        <Total>
          <FlexRow>
            <label>Total</label>
            <span>$300</span>
          </FlexRow>
        </Total>
      </ModalBody>
    </CustomModalStyled>
  )
}

export default AddonModal
