import React, { useEffect, useMemo, useState } from 'react'
import { CustomModalStyled, EduButton, notification } from '@edulastic/common'
import { connect } from 'react-redux'
import Styled from 'styled-components'
import {
  emailRegex,
  isPearOrEdulasticText,
} from '../../../common/utils/helpers'
import ProductsList from '../../src/components/common/PurchaseModals/ProductsList'
import { ModalBody } from '../../src/components/common/PurchaseModals/SubscriptionAddonModal/styled'
import { getSubscriptionSelector, slice as subscriptionSlice } from '../ducks'
import AuthorCompleteSignupButton from '../../../common/components/AuthorCompleteSignupButton'
import BookkeeperInfoIconWrapper from '../../src/components/common/PurchaseModals/BookkeeperInfoIconWrapper'

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
  handleOpenRequestInvoiceModal,
  subsLicenses,
  itemBankSubscriptions,
  user,
  subType,
  hideCcButton,
  shouldbeMultipleLicenses,
  setIsTabShouldSwitch,
}) {
  const teacherPremiumId = teacherPremium?.id
  const [emailValues, setEmailValues] = useState('')

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
        shouldPayWithCC: true,
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
    setIsTabShouldSwitch(false)
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

  const productsToshow = useMemo(() => {
    return products.filter((x) => {
      return quantities[x.id]
    })
  }, [products, quantities])

  const footer = [
    <AuthorCompleteSignupButton
      renderButton={(callback) => (
        <EduButton
          isGhost
          onClick={callback}
          data-cy="requestInvoice"
          width="220px"
          height="45px"
        >
          REQUEST INVOICE
        </EduButton>
      )}
      onClick={handleOpenRequestInvoiceModal}
    />,
    hideCcButton ? null : (
      <AuthorCompleteSignupButton
        renderButton={(callback) => (
          <EduButton
            onClick={callback}
            data-cy="proceedPayment"
            width="220px"
            height="45px"
          >
            Pay with Credit Card
          </EduButton>
        )}
        onClick={handleProceed}
      />
    ),
  ]

  const selectedProductIds = Object.keys(quantities).filter(
    (x) => quantities[x]
  )

  const tooltipMessage = 'This user(s) will get manage subscriptions permission'

  return (
    <CustomModalStyled
      visible={visible}
      title={`Your ${isPearOrEdulasticText} Cart`}
      modalWidth="510px"
      width="510px"
      destroyOnClose
      footer={footer}
      onCancel={closeModal}
      centered
    >
      <ModalBody>
        <p>
          There are additional products that can make instructions easier.
          Subscribe to SparkMath, Spark Reading free trials to see how they can
          help.{' '}
        </p>

        <StyledProductsList
          isBuyMore
          isCart
          showRenewalOptions={false}
          showMultiplePurchaseModal={false}
          productsToshow={productsToshow}
          setTotalPurchaseAmount={setTotalAmount}
          setQuantities={setQuantities}
          quantities={quantities}
          setSelectedProductIds={() => {}}
          selectedProductIds={selectedProductIds}
          currentItemId={teacherPremiumId}
          subsLicenses={subsLicenses}
          teacherPremium={teacherPremium}
          itemBankSubscriptions={itemBankSubscriptions}
          user={user}
          subType={subType}
          allProducts={products}
        />
        {shouldbeMultipleLicenses && (
          <BookkeeperInfoIconWrapper
            tooltipMessage={tooltipMessage}
            emailValues={emailValues}
            handleInputEmailAddress={handleInputEmailAddress}
          />
        )}
      </ModalBody>
    </CustomModalStyled>
  )
}

export default connect(
  (state) => ({
    quantities: state?.subscription?.cartQuantities,
    subscription: getSubscriptionSelector(state),
  }),
  {
    setQuantities: subscriptionSlice.actions.setCartQuantities,
  }
)(CartModal)

const StyledProductsList = Styled(ProductsList)`

`
