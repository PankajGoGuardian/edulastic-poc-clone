import { camelCase } from 'lodash'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { CheckboxLabel, CustomModalStyled, EduButton } from '@edulastic/common'
import { Tooltip } from 'antd'
import { title } from '@edulastic/colors'
import { ModalBody, AddonList, FlexRow, Total } from './styled'

const getInitialSelectedProductIds = ({
  defaultSelectedProductIds,
  isPaidPremium,
  premiumProductId,
}) => {
  const productIds = defaultSelectedProductIds || []
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
          onClick={handleClick}
          width="220px"
          height="45px"
        >
          PROCEED WITH PAYMENT
        </EduButton>,
      ]}
      visible={isVisible}
      onCancel={handleCloseModal}
      modalWidth="510px"
      width="510px"
    >
      <ModalBody>
        <p>
          The Spark addons bundle premium content with some exciting software
          features to make it super easy for you to use.
          <br />
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
              <Tooltip title="Premium subscription is mandatory for Spark content">
                <StyledCheckbox
                  data-cy="teacherPremiumCheckbox"
                  checked
                  disabled
                >
                  {teacherPremium.name}
                </StyledCheckbox>
              </Tooltip>

              <span className="priceCol">${teacherPremium.price}</span>
            </FlexRow>
          )}
          {itemBankPremium.map((item) => (
            <FlexRow key={item.id}>
              <CheckboxLabel
                data-cy={`${camelCase(item.name)}Checkbox`}
                value={item.price}
                onChange={(e) => handleOnChange(e, item.id)}
                checked={selectedProductIds.includes(item.id)}
              >
                {item.name}
              </CheckboxLabel>
              <span
                className="priceCol"
                data-cy={`${camelCase(item.name)}Price`}
              >
                ${item.price}
              </span>
            </FlexRow>
          ))}
        </AddonList>
        <Total>
          <FlexRow>
            <label>Total</label>
            <span data-cy="TotalPrice" className="priceCol">
              ${totalPrice}
            </span>
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

const StyledCheckbox = styled(CheckboxLabel)`
  &.ant-checkbox-wrapper .ant-checkbox + span {
    color: ${title};
  }
`
