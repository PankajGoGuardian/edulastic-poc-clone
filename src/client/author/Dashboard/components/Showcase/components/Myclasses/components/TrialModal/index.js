import React from 'react'
import PropTypes from 'prop-types'
import { CustomModalStyled, EduButton } from '@edulastic/common'
import { roleuser } from '@edulastic/constants'
import moment from 'moment'

const ItemPurchaseModal = ({
  productId,
  productName,
  description,
  isVisible,
  toggleModal,
  userInfo,
  addItemBankPermission,
}) => {
  const closeModal = () => toggleModal(false)
  const onProceed = () => {
    const {
      orgData: { districtIds, districts },
    } = userInfo
    const orgType = 'USER'
    const orgId = userInfo._id
    const districtId = districtIds?.[0]
    const districtName = districts?.[0]?.districtName
    const orgName = districts?.[0]?.districtName
    const isTrial = true
    const role = [roleuser.TEACHER]
    const itemBankName = productName
    const startDate = moment().valueOf()
    const endDate = moment().add(14, 'days').valueOf()

    const permissionDetails = [
      {
        orgType,
        orgId,
        districtId,
        districtName,
        orgName,
        isTrial,
        role,
        itemBankName,
        startDate,
        endDate,
      },
    ]

    const data = {
      bankId: productId,
      collectionName: productName,
      data: { permissionDetails },
    }
    addItemBankPermission({ data })
    closeModal()
  }

  const Footer = (
    <>
      <EduButton isGhost onClick={closeModal}>
        Cancel
      </EduButton>
      <EduButton onClick={onProceed}>Proceed</EduButton>
    </>
  )

  return (
    <CustomModalStyled
      centered
      title={productName}
      footer={Footer}
      visible={isVisible}
      onCancel={closeModal}
    >
      {description}
    </CustomModalStyled>
  )
}

ItemPurchaseModal.propTypes = {
  productName: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  productId: PropTypes.string.isRequired,
  isVisible: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
}

export default ItemPurchaseModal
