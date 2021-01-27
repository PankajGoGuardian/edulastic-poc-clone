import React, { useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { CheckboxLabel, CustomModalStyled, EduButton } from '@edulastic/common'
import { ModalBody, AddonList, FlexRow, Total } from './styled'

const SubscriptionAddonModal = ({
  isVisible,
  handleCloseModal,
  isPaidPremium,
  setShowUpgradeModal,
  subEndDate,
  premiumProductId,
  products = [],
  setTotalPurchaseAmount,
  setAddOnProductIds,
  isPremiumUser,
}) => {
  const closeModal = () => handleCloseModal(false)
  const initialPrice = isPaidPremium ? 100 : 200
  const [totalPrice, setTotalPrice] = useState(initialPrice)
  const [selectedProductIds, setSelectedProductIds] = useState([])

  useEffect(() => {
    if (!products.length || !premiumProductId) return
    let _productIds = products.map((x) => x.id)
    if (isPremiumUser) {
      _productIds = _productIds.filter((x) => x === premiumProductId)
    }
    setSelectedProductIds(_productIds)
  }, [isPremiumUser, products, premiumProductId])

  const { teacherPremium = {}, itemBankPremium = [] } = useMemo(() => {
    const result = products.map((item) => {
      const itembankPrice = 100
      const period = 365
      if (!subEndDate || item.id === premiumProductId) {
        return {
          ...item,
          period,
          price: itembankPrice,
        }
      }
      let currentDate = new Date()
      const itemBankSubEndDate = new Date(
        currentDate.setDate(currentDate.getDate() + period)
      ).valueOf()
      const computedEndDate = Math.min(itemBankSubEndDate, subEndDate)
      currentDate = Date.now()
      const amountFactor =
        (computedEndDate - currentDate) / (itemBankSubEndDate - currentDate)
      const dynamicPrice = Math.round(amountFactor * itembankPrice)
      const dynamicDays = Math.round(amountFactor * period)

      return {
        ...item,
        price: dynamicPrice,
        period: dynamicDays,
      }
    })
    return {
      teacherPremium: result[0],
      itemBankPremium: result.slice(1),
    }
  }, [subEndDate, products])

  const handleClick = () => {
    setAddOnProductIds(selectedProductIds)
    setTotalPurchaseAmount(totalPrice)
    handleCloseModal(false)
    setShowUpgradeModal(true)
  }

  const handleOnChange = (e, id) => {
    const value = e.target.value
    if (e.target.checked) {
      setSelectedProductIds((x) => x.concat(id))
      setTotalPrice(totalPrice + value)
    } else {
      setSelectedProductIds((x) => x.filter((y) => y !== id))
      setTotalPrice(totalPrice - value)
    }
  }

  return (
    <CustomModalStyled
      centered
      title="Select Add-ons"
      footer={[
        <EduButton
          data-cy="proceedPayment"
          disabled={totalPrice === 0}
          isBlue
          onClick={handleClick}
        >
          PROCEED WITH PAYMENT
        </EduButton>,
      ]}
      visible={isVisible}
      onCancel={closeModal}
    >
      <ModalBody>
        <p>
          The Spark addons bundle premium content with some exciting software
          features to make it super easy for you to use.{' '}
          <a
            href="https://edulastic.com/spark-math/"
            target="_blank"
            rel="noreferrer"
          >
            Click here
          </a>{' '}
          to learn more.
        </p>
        <p> These addons need the premium or enterprise subscription.</p>
        <AddonList>
          {!isPaidPremium && (
            <FlexRow>
              <CheckboxLabel data-cy="teacherPremiumCheckbox" checked>
                {teacherPremium.name}
              </CheckboxLabel>
              <span>${teacherPremium.price}</span>
            </FlexRow>
          )}
          {itemBankPremium.map((item) => (
            <FlexRow key={item.id}>
              <CheckboxLabel
                data-cy="sparkPremiumCheckbox"
                value={item.price}
                onChange={(e) => handleOnChange(e, item.id)}
                defaultChecked
              >
                {item.name}
              </CheckboxLabel>
              <span>${item.price}</span>
            </FlexRow>
          ))}
        </AddonList>
        <Total>
          <FlexRow>
            <label>Total</label>
            <span>${totalPrice}</span>
          </FlexRow>
        </Total>
      </ModalBody>
    </CustomModalStyled>
  )
}

SubscriptionAddonModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
}

export default SubscriptionAddonModal
