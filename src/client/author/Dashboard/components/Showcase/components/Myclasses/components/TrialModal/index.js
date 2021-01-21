import React from 'react'
import PropTypes from 'prop-types'
import { Checkbox } from 'antd'
import styled from 'styled-components'
import moment from 'moment'
import { CustomModalStyled, EduButton, FlexContainer } from '@edulastic/common'
import { roleuser } from '@edulastic/constants'

const TrialModal = ({
  productId,
  productName,
  description,
  isVisible,
  toggleModal,
  userInfo,
  addItemBankPermission,
  premiumUser,
  isPremiumTrialUsed,
  startPremiumTrial,
  premiumProductId,
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

    const productIds = [productId]
    if (!premiumUser && !isPremiumTrialUsed) {
      productIds.push(premiumProductId)
      startPremiumTrial({ productIds })
    } else {
      addItemBankPermission({ productIds })
    }
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
      <FlexContainer
        flexDirection="column"
        justifyContent="center"
        marginLeft="40px"
        mr="40px"
        mt="20px"
      >
        {!premiumUser && !isPremiumTrialUsed && (
          <StyledCheckbox checked>Premium Trial</StyledCheckbox>
        )}
        <StyledCheckbox checked>{productName} Trial</StyledCheckbox>
      </FlexContainer>
    </CustomModalStyled>
  )
}

TrialModal.propTypes = {
  productName: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  productId: PropTypes.string.isRequired,
  isVisible: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
}

export default TrialModal

const StyledCheckbox = styled(Checkbox)`
  margin: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: unset;
`
