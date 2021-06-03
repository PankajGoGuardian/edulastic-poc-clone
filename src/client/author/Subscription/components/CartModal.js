import React, { useEffect, useState } from 'react'
import {
  CustomModalStyled,
  EduButton,
  FieldLabel,
  notification,
  TextInputStyled,
} from '@edulastic/common'
import { connect } from 'react-redux'
import ProductsList from '../../src/components/common/PurchaseModals/ProductsList'
import { EmailWrapper } from '../../src/components/common/PurchaseModals/styled'
import { emailRegex } from '../../../common/utils/helpers'
import Styled from 'styled-components'
import { slice as subscriptionSlice } from '../ducks'
import { ModalBody } from '../../src/components/common/PurchaseModals/SubscriptionAddonModal/styled'
const h3style = { fontWeight: 700 }
const pStyle = { fontWeight: 400 }

function CartModal({
  products,
  teacherPremium,
  quantities,
  setQuantities,
  setTotalAmount,
  bulkInviteBookKeepers,
  districtId,
  isBookKeepersInviteSuccess,
  setBookKeepersInviteSuccess,
  handleClick,
  visible,
  closeModal,
}) {
  const teacherPremiumId = teacherPremium?.id
  const [emailValues, setEmailValues] = useState('')
  useEffect(() => {
    if (teacherPremiumId && !quantities[teacherPremiumId]) {
      setQuantities({ ...quantities, [teacherPremiumId]: 1 })
    }
  }, [teacherPremiumId])
  const isMultipleQuantities = Object.keys(quantities).find(
    (x) => quantities[x] > 0
  )
  const setQuantitiesWithLocalStorage = (quantities) => {
    window.localStorage.cartQuantities = quantities
    return setQuantities(quantities)
  }
  useEffect(() => {
    if (isBookKeepersInviteSuccess) {
      const emails = emailValues
        .split(',')
        .map((x) => x.replace(/\s/g, ''))
        .filter((x) => x)

      handleClick({
        emails,
      })
    }
    return () => {
      if (isBookKeepersInviteSuccess) {
        setBookKeepersInviteSuccess(false)
      }
    }
  }, [emailValues, isBookKeepersInviteSuccess])

  const handleInputEmailAddress = (ele) => {
    const value = ele.target.value
    setEmailValues(value)
  }

  const handleProceed = () => {
    const emails = emailValues
      .split(',')
      .map((x) => x.replace(/\s/g, ''))
      .filter((x) => x)

    for (const email of emails) {
      if (!emailRegex.test(email)) {
        return notification({
          type: 'warn',
          msg: `${email} is invalid email!`,
        })
      }
    }

    bulkInviteBookKeepers({
      districtId,
      userDetails: emails,
    })
  }

  const footer = [
    <EduButton
      onClick={handleProceed}
      data-cy="proceedPayment"
      width="220px"
      height="45px"
      disabled={!quantities[teacherPremium.id]}
    >
      PROCEED WITH PAYMENT
    </EduButton>,
  ]

  const selectedProductIds = Object.keys(quantities).filter(
    (x) => quantities[x]
  )

  return (
    <CustomModalStyled
      visible={visible}
      title="Your Edulastic Cart"
      modalWidth="510px"
      width="510px"
      destroyOnClose
      footer={footer}
      onCancel={closeModal}
    >
      <ModalBody>
        <p style={pStyle}>
          50 student licenses are included in each teacher license for free.
          Additional student licenses cost <strong>$2/student</strong>
        </p>

        <p style={pStyle}>
          There are additional products that can make instructions easier.
          Subscribe to SparkMath, Spark Reading free trials to see how they can
          help.{' '}
        </p>

        <StyledProductsList
          isBuyMore
          isCart
          showRenewalOptions={false}
          showMultiplePurchaseModal={false}
          productsToshow={products}
          setTotalPurchaseAmount={setTotalAmount}
          setQuantities={setQuantities}
          quantities={quantities}
          setSelectedProductIds={(...args) => {
            console.log('setSelectedProductIds', args)
          }}
          selectedProductIds={selectedProductIds}
          currentItemId={null}
          subsLicenses={[]}
          teacherPremium={teacherPremium}
        />
        {isMultipleQuantities && (
          <EmailWrapper>
            <FieldLabel>Bookkeeper Email</FieldLabel>
            <TextInputStyled
              value={emailValues}
              onChange={handleInputEmailAddress}
              placeholder="Type the emails"
              height="40px"
            />
          </EmailWrapper>
        )}
      </ModalBody>
    </CustomModalStyled>
  )
}

export default connect(
  (state) => ({
    quantities: state?.subscription?.cartQuantities,
  }),
  {
    setQuantities: subscriptionSlice.actions.setCartQuantities,
  }
)(CartModal)

const StyledProductsList = Styled(ProductsList)`

`
