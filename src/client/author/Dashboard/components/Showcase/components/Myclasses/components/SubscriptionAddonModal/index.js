import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { CheckboxLabel, CustomModalStyled, EduButton } from '@edulastic/common'
import { ModalBody, AddonList, FlexRow, Total } from './styled'

const SubscriptionAddonModal = ({
  isVisible,
  handleCloseModal,
  isPremiumUser,
  setShowUpgradeModal,
}) => {
  const closeModal = () => handleCloseModal(false)
  const initialPrice = isPremiumUser ? 100 : 200
  const [totalPrice, setTotalPrice] = useState(initialPrice)

  const handleClick = () => {
    handleCloseModal(false)
    setShowUpgradeModal(true)
  }

  const handleOnChange = (ele) => {
    const value = ele.value
    if (ele.checked) {
      setTotalPrice(totalPrice + value)
    } else {
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
          {!isPremiumUser && (
            <FlexRow>
              <CheckboxLabel data-cy="teacherPremiumCheckbox" checked>
                Teacher Premium
              </CheckboxLabel>
              <span>$100</span>
            </FlexRow>
          )}
          <FlexRow>
            <CheckboxLabel
              data-cy="sparkPremiumCheckbox"
              value={100}
              onChange={(e) => handleOnChange(e.target)}
              defaultChecked
            >
              Spark Math
            </CheckboxLabel>
            <span>$100</span>
          </FlexRow>
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
