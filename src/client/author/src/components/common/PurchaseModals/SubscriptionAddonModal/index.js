import { camelCase, isNumber } from 'lodash'
import React, { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {
  CheckboxLabel,
  CustomModalStyled,
  EduButton,
  FieldLabel,
  notification,
  NumberInputStyled,
  TextInputStyled,
} from '@edulastic/common'
import { Tooltip } from 'antd'
import { title } from '@edulastic/colors'
import {
  ModalBody,
  AddonList,
  FlexRow,
  Total,
  EmailWrapper,
  NumberInputWrapper,
} from './styled'

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
  showRenewalOptions,
  showMultiplePurchaseModal,
  setEmailIds,
  setProductsCart,
  products,
}) => {
  const [emailValues, setEmailValues] = useState('')
  const [quantities, setQuantities] = useState({})

  const emailsArray =
    (emailValues && emailValues.replace(/\s/g, '').split(/,|\n/)) || []

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

  const _totalPrice = useMemo(() => {
    return itemBankPremium.reduce((a, c) => {
      if (selectedProductIds.includes(c.id)) {
        return a + c.price * (isNumber(quantities[c.id]) ? quantities[c.id] : 1)
      }
      return a
    }, teacherPremium.price * (quantities[premiumProductId] || 1))
  }, [itemBankPremium, quantities, selectedProductIds, teacherPremium])

  const handleClick = () => {
    if (showMultiplePurchaseModal) {
      if (emailsArray.length > quantities[premiumProductId]) {
        notification({
          type: 'info',
          msg: 'Email count(s) can not be more than Premium count(s)',
        })
        return
      }
      const setProductQuantity = products.map((product) => ({
        ...product,
        quantity: quantities[product.id],
      }))

      setProductsCart(setProductQuantity)
      setEmailIds(emailsArray)
    } else {
      setAddOnProductIds(selectedProductIds)
    }

    setTotalPurchaseAmount(_totalPrice)
    handleCloseModal(false)
    setShowUpgradeModal(true)
  }

  const handleOnChange = (e, id) => {
    const productPrice = e.target.value
    if (e.target.checked) {
      const _quantities = {
        ...quantities,
        [id]: 1,
      }
      setQuantities(_quantities)
      setSelectedProductIds((x) => x.concat(id))
      setTotalPrice((currentPrice) => currentPrice + productPrice)
    } else {
      const _quantities = {
        ...quantities,
        [id]: undefined,
      }
      setQuantities(_quantities)
      setSelectedProductIds((x) => x.filter((y) => y !== id))
      setTotalPrice((currentPrice) => currentPrice - productPrice)
    }
  }

  const handleQuantityChange = (itemId) => (value) => {
    const _quantities = {
      ...quantities,
      [itemId]: value,
    }
    setQuantities(_quantities)
  }

  const handleInputEmailAddress = (ele) => {
    const value = ele.target.value
    setEmailValues(value)
  }

  const modalTitle = showMultiplePurchaseModal
    ? 'Upgrade multiple accounts'
    : showRenewalOptions
    ? 'Renew Subscription'
    : 'Select Add-ons'

  return (
    <CustomModalStyled
      centered
      title={modalTitle}
      footer={[
        <EduButton
          data-cy="proceedPayment"
          disabled={_totalPrice === 0}
          onClick={handleClick}
          width="220px"
          height="45px"
        >
          PROCEED WITH PAYMENT {showMultiplePurchaseModal && `$${_totalPrice}`}
        </EduButton>,
      ]}
      visible={isVisible}
      onCancel={handleCloseModal}
      modalWidth="510px"
      width="510px"
    >
      <ModalBody>
        <p>
          The Spark add-ons bundle premium content with some exciting software
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
        <p> These add-ons need the premium or enterprise subscription.</p>
        <AddonList>
          {(showRenewalOptions ||
            !isPaidPremium ||
            showMultiplePurchaseModal) && (
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
              {showMultiplePurchaseModal && (
                <NumberInputWrapper>
                  <NumberInputStyled
                    value={quantities[premiumProductId] || 1}
                    onChange={handleQuantityChange(premiumProductId)}
                    height="28px"
                    width="80px"
                    data-cy="selectNumberOfPremiumSubs"
                    min={1}
                  />
                </NumberInputWrapper>
              )}
              <span className="priceCol">
                ${teacherPremium.price * (quantities[premiumProductId] || 1)}
              </span>
            </FlexRow>
          )}
          {itemBankPremium.map((item) => (
            <FlexRow key={item.id}>
              <StyledCheckbox
                data-cy={`${camelCase(item.name)}Checkbox`}
                value={item.price}
                onChange={(e) => handleOnChange(e, item.id)}
                checked={selectedProductIds.includes(item.id)}
              >
                {item.name}
              </StyledCheckbox>
              {showMultiplePurchaseModal && (
                <NumberInputWrapper>
                  <NumberInputStyled
                    value={quantities[item.id]}
                    onChange={handleQuantityChange(item.id)}
                    height="28px"
                    width="80px"
                    data-cy={item.type}
                    min={1}
                    max={quantities[premiumProductId] || 1}
                    pattern="[0-9]"
                  />
                </NumberInputWrapper>
              )}
              <span
                className="priceCol"
                data-cy={`${camelCase(item.name)}Price`}
              >
                $
                {item.price *
                  (isNumber(quantities[item.id]) ? quantities[item.id] : 1)}
              </span>
            </FlexRow>
          ))}
        </AddonList>
        <Total>
          <FlexRow>
            <label>Total</label>
            <span data-cy="TotalPrice" className="priceCol">
              ${_totalPrice}
            </span>
          </FlexRow>
        </Total>
        {showMultiplePurchaseModal && (
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

SubscriptionAddonModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
}

export default SubscriptionAddonModal

const StyledCheckbox = styled(CheckboxLabel)`
  width: 150px;
  &.ant-checkbox-wrapper .ant-checkbox + span {
    color: ${title};
  }
`
