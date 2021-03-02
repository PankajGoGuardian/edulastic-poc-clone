import {
  CustomModalStyled,
  EduButton,
  NumberInputStyled,
} from '@edulastic/common'
import { isNumber } from 'lodash'
import React, { useMemo, useState } from 'react'
import {
  FlexRow,
  ModalBody,
  NumberInputWrapper,
  StyledCheckbox,
} from './SubscriptionAddonModal/styled'

const BuyMoreLicensesModal = ({
  isVisible,
  onCancel,
  setProductsCart,
  setShowUpgradeModal,
  products,
  setTotalAmount,
  isEdulasticAdminView,
  handlePayment,
  licenseIds,
  emailIds,
  currentItemId,
}) => {
  const [quantities, setQuantities] = useState({})

  const _totalPrice = useMemo(() => {
    return products.reduce((a, c) => {
      if (currentItemId === c.id) {
        return a + c.price * (isNumber(quantities[c.id]) ? quantities[c.id] : 1)
      }
      return a
    }, 0)
  }, [quantities, currentItemId])

  const handleQuantityChange = (itemId) => (value) => {
    const _quantities = {
      ...quantities,
      [itemId]: Math.floor(value),
    }
    setQuantities(_quantities)
  }

  const handleProceed = () => {
    setTotalAmount(_totalPrice)
    const setProductQuantity = products.map((product) => ({
      ...product,
      quantity:
        quantities[product.id] ||
        (currentItemId === product.id ? 1 : undefined),
    }))

    setProductsCart(setProductQuantity)

    if (isEdulasticAdminView) {
      handlePayment({
        productIds: setProductQuantity,
        emailIds,
        licenseIds,
      })
      onCancel()
      return
    }

    onCancel()
    setShowUpgradeModal(true)
  }
  const footer = (
    <>
      <EduButton isGhost height="38px" onClick={onCancel}>
        No, Cancel
      </EduButton>
      <EduButton height="38px" onClick={handleProceed}>
        Yes, Proceed
      </EduButton>
    </>
  )

  const currentOpenedProduct =
    products.filter((product) => product.id === currentItemId) || []

  return (
    <CustomModalStyled
      visible={isVisible}
      title="Buy More"
      onCancel={onCancel}
      centered
      footer={footer}
      modalWidth="460px"
      width="460px"
    >
      <ModalBody>
        {currentOpenedProduct.map((product) => (
          <>
            <p>
              Please enter the number of {product.name} license count you need
              to buy.
            </p>
            <FlexRow alignItems="center" padding="10px 0px">
              <StyledCheckbox data-cy="teacherPremiumCheckbox" checked>
                {product.name}
              </StyledCheckbox>
              <NumberInputWrapper>
                <NumberInputStyled
                  onChange={handleQuantityChange(product.id)}
                  data-cy="answer-rule-argument-input"
                  min={1}
                  value={quantities[product.id] || 1}
                  height="28px"
                  width="80px"
                />
              </NumberInputWrapper>
              <span className="priceCol">${_totalPrice}</span>
            </FlexRow>
          </>
        ))}
      </ModalBody>
    </CustomModalStyled>
  )
}

export default BuyMoreLicensesModal
