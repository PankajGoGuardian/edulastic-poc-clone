import { title } from '@edulastic/colors'
import {
  CustomModalStyled,
  EduButton,
  NumberInputStyled,
} from '@edulastic/common'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

const BuyMoreLicensesModal = ({
  isVisible,
  onCancel,
  isPremiumBuyMoreModalOpened,
  setBuyCount,
  buyCount,
  setProductsCart,
  setShowUpgradeModal,
  products,
  setTotalAmount,
}) => {
  const [premiumCount, setPremiumCount] = useState()
  const [sparkMathCount, setSparkMathCount] = useState()

  useEffect(() => {
    if (isPremiumBuyMoreModalOpened) {
      setPremiumCount(buyCount)
    } else {
      setSparkMathCount(buyCount)
    }
  }, [buyCount])

  const handleOnChange = (value) => {
    setBuyCount(value)
  }
  const handleProceed = () => {
    if (isPremiumBuyMoreModalOpened) {
      const getPremiumPrice = products.find(
        (product) => product.type === 'PREMIUM'
      ).price
      setTotalAmount(buyCount * getPremiumPrice)
    } else {
      const getSparkPrice = products.find(
        (product) => product.type === 'ITEM_BANK'
      ).price
      setTotalAmount(buyCount * getSparkPrice)
    }

    const setProductQuantity = products.map((product) => ({
      ...product,
      quantity: product.type === 'PREMIUM' ? premiumCount : sparkMathCount,
    }))

    setProductsCart(setProductQuantity)
    setShowUpgradeModal(true)
  }
  const footer = (
    <>
      <EduButton isGhost height="38px" onClick={onCancel}>
        No, Cancel
      </EduButton>
      <EduButton height="38px" onClick={handleProceed} disabled={!buyCount}>
        Yes, Proceed
      </EduButton>
    </>
  )

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
        <p>
          Please enter the number of{' '}
          {isPremiumBuyMoreModalOpened ? 'premium' : 'SparkMath'} license count
          you need to buy.
        </p>
        <NumberInputStyled
          type="number"
          onChange={handleOnChange}
          data-cy="answer-rule-argument-input"
          min={1}
          value={buyCount}
          placeholder="Type the action"
          height="38px"
        />
      </ModalBody>
    </CustomModalStyled>
  )
}

export default BuyMoreLicensesModal

const ModalBody = styled.div`
  p {
    font-size: 14px;
    color: ${title};
    font-weight: normal !important;
  }
`
