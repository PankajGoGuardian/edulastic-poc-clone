import {
  CustomModalStyled,
  EduButton,
  FieldLabel,
  notification,
  SelectInputStyled,
  TextInputStyled,
} from '@edulastic/common'
import { Row } from 'antd'
import React, { useState } from 'react'
import { ModalBody, StyledCol } from './styled'

const MultiplePurchaseModal = ({
  isVisible,
  onCancel,
  setShowUpgradeModal,
  setTotalAmount,
  products,
  setProductsCart,
}) => {
  const [premiumSubsCount, setPremiumSubsCount] = useState()
  const [sparkMathSubsCount, setSparkMathSubsCount] = useState()
  const [emailValues, setEmailValues] = useState('')
  const [totalProductsAmount, setTotalProductsAmount] = useState(100)

  const emailsArray =
    emailValues && emailValues.replace(/\s/g, '').split(/,|\n/)

  const handlePayWithCard = () => {
    if (emailsArray.length > premiumSubsCount) {
      notification({
        type: 'info',
        msg: 'Email count(s) can not be more than Premium count(s)',
      })
      return
    }
    setTotalAmount(totalProductsAmount)

    const setProductQuantity = products.map((product) => ({
      ...product,
      price: product.type === 'PREMIUM' ? premiumSubsCount : sparkMathSubsCount,
      quantity:
        product.type === 'PREMIUM' ? premiumSubsCount : sparkMathSubsCount,
    }))

    setProductsCart(setProductQuantity)

    onCancel()
    setShowUpgradeModal(true)
  }

  const handleSelectCountPremiumSubs = (value) => {
    const getPremiumPrice = products.find(
      (product) => product.type === 'PREMIUM'
    ).price

    setPremiumSubsCount(value)

    if (sparkMathSubsCount > value) {
      setSparkMathSubsCount(value)
      setTotalProductsAmount((value + value) * getPremiumPrice)
      return
    }

    if (sparkMathSubsCount) {
      setTotalProductsAmount((value + sparkMathSubsCount) * getPremiumPrice)
    } else {
      setTotalProductsAmount(value * getPremiumPrice)
    }
  }

  const handleSelectCountSparkMathSubs = (value) => {
    const getSparkPrice = products.find((product) => product.type === 'PREMIUM')
      .price
    setSparkMathSubsCount(value)
    setTotalProductsAmount((value + premiumSubsCount) * getSparkPrice)
  }

  const handleInputEmailAddress = (ele) => {
    const value = ele.target.value
    setEmailValues(value)
  }

  const numberOfPremiumSubscription = 40
  const premiumCountArray = Array(numberOfPremiumSubscription)
    .fill()
    .map((_, i) => ++i)
  const sparkMathCountArray =
    (premiumSubsCount &&
      Array(premiumSubsCount)
        .fill()
        .map((_, i) => ++i)) ||
    []

  return (
    <CustomModalStyled
      visible={isVisible}
      title="Upgrade multiple accounts"
      onCancel={onCancel}
      footer={[
        <EduButton
          height="45px"
          width="220px"
          onClick={handlePayWithCard}
          disabled={!emailValues}
        >
          PAY WITH CREDIT CARD {premiumSubsCount && `$${totalProductsAmount}`}
        </EduButton>,
      ]}
      centered
    >
      <ModalBody>
        <Row>
          <StyledCol>
            <FieldLabel>Number of Premium subscriptions</FieldLabel>
            <SelectInputStyled
              placeholder="Select the number of premium subscriptions"
              size="large"
              value={premiumSubsCount}
              onSelect={handleSelectCountPremiumSubs}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
              height="40px"
              data-cy="selectNumberOfPremiumSubs"
            >
              {premiumCountArray.map((count) => (
                <SelectInputStyled.Option key={count} value={count}>
                  {count}
                </SelectInputStyled.Option>
              ))}
            </SelectInputStyled>
          </StyledCol>
          <StyledCol>
            <FieldLabel>Number of Spark Math subscriptions</FieldLabel>
            <SelectInputStyled
              placeholder="Select the number of Spark Math subscriptions"
              size="large"
              value={sparkMathSubsCount}
              onChange={handleSelectCountSparkMathSubs}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
              height="40px"
              data-cy="selectNumberOfSparkMathSubs"
              disabled={!premiumSubsCount}
            >
              {sparkMathCountArray.map((count) => (
                <SelectInputStyled.Option key={count} value={count}>
                  {count}
                </SelectInputStyled.Option>
              ))}
            </SelectInputStyled>
          </StyledCol>
          <StyledCol>
            <FieldLabel>
              Enter the email addresses of the teachers to receive upgrades
            </FieldLabel>
            <TextInputStyled
              value={emailValues}
              onChange={handleInputEmailAddress}
              placeholder="Type the emails"
              height="40px"
              disabled={!premiumSubsCount}
            />
          </StyledCol>
        </Row>
      </ModalBody>
    </CustomModalStyled>
  )
}

export default MultiplePurchaseModal
