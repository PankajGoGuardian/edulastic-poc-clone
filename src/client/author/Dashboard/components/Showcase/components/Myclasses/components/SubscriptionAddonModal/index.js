import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { CheckboxLabel, CustomModalStyled, EduButton } from '@edulastic/common'
import { ModalBody, AddonList, FlexRow, Total } from './styled'

const getInitialSelectedProductIds = ({
  defaultSelectedProductIds,
  isPaidPremium,
  premiumProductId,
  itemBankPremium,
}) => {
  const itemBankPremiumIds = itemBankPremium.map((x) => x.id)
  const productIds = defaultSelectedProductIds || itemBankPremiumIds
  if (!isPaidPremium) {
    productIds.push(premiumProductId)
  }
  return productIds
}

const getInitialTotalPrice = ({
  selectedProductIds: x = [],
  isPaidPremium,
  teacherPremium = {},
  itemBankPremium = [],
}) => {
  const initialPrice = isPaidPremium ? 0 : teacherPremium.price || 100
  if (!x.length) return initialPrice
  return itemBankPremium.reduce(
    (a, { id, price }) => a + (x.includes(id) ? price : 0),
    initialPrice
  )
}

const SubscriptionAddonModal = ({
  isVisible,
  handleCloseModal,
  isPaidPremium,
  setShowUpgradeModal,
  premiumProductId,
  setTotalPurchaseAmount,
  setAddOnProductIds,
  defaultSelectedProductIds,
  teacherPremium,
  itemBankPremium,
}) => {
  const [selectedProductIds, setSelectedProductIds] = useState(
    getInitialSelectedProductIds({
      defaultSelectedProductIds,
      isPaidPremium,
      premiumProductId,
      itemBankPremium,
    })
  )

  const [totalPrice, setTotalPrice] = useState(
    getInitialTotalPrice({
      selectedProductIds,
      isPaidPremium,
      teacherPremium,
      itemBankPremium,
    })
  )

  const closeModal = () => handleCloseModal(false)

  const handleClick = () => {
    setAddOnProductIds(selectedProductIds)
    setTotalPurchaseAmount(totalPrice)
    handleCloseModal(false)
    setShowUpgradeModal(true)
  }

  const handleOnChange = (e, id) => {
    const productPrice = e.target.value
    if (e.target.checked) {
      setSelectedProductIds((x) => x.concat(id))
      setTotalPrice((currentPrice) => currentPrice + productPrice)
    } else {
      setSelectedProductIds((x) => x.filter((y) => y !== id))
      setTotalPrice((currentPrice) => currentPrice - productPrice)
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
            data-cy="sparkContentLink"
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
                checked={selectedProductIds.includes(item.id)}
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
