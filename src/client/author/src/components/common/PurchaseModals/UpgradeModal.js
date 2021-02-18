import { CustomModalStyled } from '@edulastic/common'
import { IconCredit, IconPo } from '@edulastic/icons'
import React from 'react'
import { ModalBody, Boxes, FlexRow } from './styled'

const UpgradeModal = ({
  visible,
  setShowModal,
  openPaymentServiceModal,
  openPoServiceModal,
  setShowBuyMoreModal,
}) => {
  const closeUpgradeModal = () => {
    setShowModal(false)
    setShowBuyMoreModal(false)
  }
  return (
    <CustomModalStyled
      visible={visible}
      title="Upgrade your account"
      onCancel={closeUpgradeModal}
      footer={null}
      centered
      modalWidth="530px"
      padding="25px 45px"
    >
      <ModalBody>
        <FlexRow>
          <Boxes
            onClick={() => {
              openPaymentServiceModal()
              closeUpgradeModal()
            }}
            data-cy="payWithCreditCard"
          >
            <IconCredit />
            <span>Pay with Credit Card</span>
          </Boxes>
          <Boxes
            onClick={() => {
              openPoServiceModal()
              setShowModal(false)
            }}
            data-cy="payWithPO"
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
