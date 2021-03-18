import { CustomModalStyled, EduButton } from '@edulastic/common'
import { Spin } from 'antd'
import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const TrialConfirmationModal = ({
  visible,
  showTrialSubsConfirmationAction,
  showTrialConfirmationMessage,
  trialAddOnProductIds,
  collections,
  products,
  handleGoToCollectionClick,
  history,
}) => {
  const itemBankProducts = products.filter((product) =>
    trialAddOnProductIds.includes(product.id)
  )

  const productItemBankIds = itemBankProducts.map(
    (product) => product.linkedProductId
  )

  // Check if trial successfully started for all item banks.
  const isTrialPurchaseSuccess = useMemo(() => {
    const availableCollections = collections.filter((collection) => {
      return productItemBankIds.includes(collection._id)
    })
    return availableCollections.length === productItemBankIds.length
  }, [collections, products, trialAddOnProductIds])

  const sparkMathProduct = products.find(
    (product) => product.type === 'ITEM_BANK_SPARK_MATH'
  )

  // If more than one item bank present, show Spark math button else show actual item bank button
  const itemBankButtonParams = {
    title:
      itemBankProducts.length > 1
        ? sparkMathProduct.name
        : itemBankProducts?.[0]?.name,
    productId:
      itemBankProducts.length > 1
        ? sparkMathProduct.id
        : itemBankProducts?.[0]?.id,
  }

  const handleCloseModal = () => {
    showTrialSubsConfirmationAction(false)
  }

  const handleGoToDashboard = () => {
    handleCloseModal()
    history.push('/author/dashboard')
  }
  const { hasTrial, subEndDate } = showTrialConfirmationMessage

  const handleItemBankClick = () =>
    handleGoToCollectionClick(itemBankButtonParams.productId)

  return (
    <>
      <CustomModalStyled
        visible={visible}
        title="Free Trial Started"
        onCancel={handleCloseModal}
        width="675px"
        footer={[
          <>
            <EduButton
              data-cy="goToDashboard"
              onClick={handleGoToDashboard}
              width="180px"
              height="45px"
            >
              Go To Dashboard
            </EduButton>
            {itemBankProducts.length && (
              <EduButton
                data-cy="goToItemBank"
                onClick={handleItemBankClick}
                width="180px"
                height="45px"
              >
                Go To {itemBankButtonParams.title}
              </EduButton>
            )}
          </>,
        ]}
        centered
      >
        {!isTrialPurchaseSuccess && itemBankProducts.length && (
          <SpinContainer>
            <StyledSpin size="large" />
          </SpinContainer>
        )}
        <ModalBody>
          {hasTrial === 'haveBothSparkAndPremiumTrial' ? (
            <p>
              Thanks for trying the Teacher Premium and additional Spark
              content. Your subscription will expire on <b>{subEndDate}</b>.
            </p>
          ) : hasTrial === 'onlyPremiumTrial' ? (
            <p>
              Thanks for trying teacher premium. Your trial will expire on{' '}
              <b>{subEndDate}</b>.
            </p>
          ) : (
            <p>
              Thanks for trying premium Spark assessments and practice. Your
              trial will expire on <b>{subEndDate}</b>.
            </p>
          )}
        </ModalBody>
      </CustomModalStyled>
    </>
  )
}

TrialConfirmationModal.propTypes = {
  showTrialSubsConfirmationAction: PropTypes.func,
}

TrialConfirmationModal.defaultProps = {
  showTrialSubsConfirmationAction: () => {},
}

export default TrialConfirmationModal

const ModalBody = styled.div`
  p {
    font-weight: normal !important;
  }
`
const SpinContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 999;
  background: rgba(0, 0, 0, 0.2);
`

const StyledSpin = styled(Spin)`
  position: absolute;
  left: 50%;
  top: 35%;
  transform: translate(-50%, -50%);
`
