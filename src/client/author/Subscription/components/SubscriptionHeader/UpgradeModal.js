import { CustomModalStyled } from '@edulastic/common'
import { IconCredit, IconPo } from '@edulastic/icons'
import React from 'react'
import { ModalBody, Boxes, FlexRow } from './styled'

const UpgradeModal = ({
  visible,
  setShowModal,
  openPaymentServiceModal,
  openPoServiceModal,
}) => {
  return (
    <CustomModalStyled
      visible={visible}
      title="Upgrade your account"
      onCancel={() => setShowModal(false)}
      footer={[
        {
          /* <MultiSubscriptionLink>
          Buy Multiple Subscriptions CLICK HERE
        </MultiSubscriptionLink>, */
        },
      ]}
      centered
      modalWidth="530px"
      padding="25px 45px"
    >
      <ModalBody>
        <FlexRow>
          <Boxes
            onClick={() => {
              openPaymentServiceModal()
              setShowModal(false)
            }}
          >
            <IconCredit />
            <span>Pay with Credit Card</span>
          </Boxes>
          <Boxes
            onClick={() => {
              openPoServiceModal()
              setShowModal(false)
            }}
          >
            <IconPo />
            <span>Pay with PO</span>
          </Boxes>
        </FlexRow>
      </ModalBody>
    </CustomModalStyled>
  )
}

export default UpgradeModal
