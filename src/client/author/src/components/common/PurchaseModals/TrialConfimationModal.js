import { titleColor } from '@edulastic/colors'
import { CustomModalStyled, EduButton, FieldLabel } from '@edulastic/common'
import { curriculumGrades } from '@edulastic/constants'
import { Spin } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { ContentWrapper, CurriculumCard, StyledTag, ModalTitle } from './styled'

const TrialConfirmationModal = ({
  visible,
  showTrialSubsConfirmationAction,
  showTrialConfirmationMessage,
  trialAddOnProductIds = [],
  collections,
  products,
  history,
  subType,
  fetchPlaylists,
}) => {
  const [selectedProducts, setSelectedProducts] = useState([])
  const [selectedGrades, setSelectedGrades] = useState([])
  const itemBankProducts =
    products.filter(
      (product) =>
        trialAddOnProductIds.includes(product.id) && product.type !== 'PREMIUM'
    ) || []

  const { GRADES } = curriculumGrades

  const productItemBankIds =
    itemBankProducts.map((product) => product.linkedProductId) || []

  // Check if trial successfully started for all item banks.
  const isTrialPurchaseSuccess = useMemo(() => {
    const availableCollections = collections.filter((collection) => {
      return productItemBankIds.includes(collection._id)
    })

    return availableCollections.length === productItemBankIds.length
  }, [collections, products, trialAddOnProductIds])

  const handleCloseModal = () => {
    showTrialSubsConfirmationAction(false)
  }

  const handleGoToDashboard = () => {
    handleCloseModal()
    history.push('/author/dashboard')
  }

  const { subEndDate } = showTrialConfirmationMessage

  const productsToShow = products.filter(({ linkedProductId }) =>
    collections.find(({ _id }) => _id === linkedProductId)
  )

  const hasOnlyTeacherPremium =
    productsToShow.length === 0 &&
    (subType === 'premium' || subType === 'TRIAL_PREMIUM')

  useEffect(() => {
    if (!hasOnlyTeacherPremium) {
      const data = {
        page: 1,
        limit: 20,
        search: {
          grades: selectedGrades,
          filter: 'ENTIRE_LIBRARY',
          status: 'PUBLISHED',
          collections: selectedProducts,
        },
        sort: {},
      }
      fetchPlaylists(data)
    }
  }, [hasOnlyTeacherPremium, selectedGrades, selectedProducts])

  const showFooter = hasOnlyTeacherPremium ? (
    <EduButton
      data-cy="goToDashboard"
      onClick={handleGoToDashboard}
      width="180px"
      height="45px"
    >
      Go To Dashboard
    </EduButton>
  ) : (
    []
  )

  const onSelecteProduct = (id) => {
    if (!selectedProducts.includes(id)) {
      setSelectedProducts((product) => [...product, id])
    } else {
      setSelectedProducts((product) => product.filter((el) => el !== id))
    }
  }

  const onSelecteGrade = (value) => {
    const val = value.split(',').map((el) => el.trim()) // here the value is string and in case of high_school grades are '10, 11, 12' so using split.
    if (!selectedGrades.includes(val[0])) {
      setSelectedGrades((grades) => grades.concat(val))
    } else {
      setSelectedGrades((grades) => grades.filter((el) => !val.includes(el)))
    }
  }

  const modalTitle =
    subType === 'premium' ? (
      <ModalTitle>
        <div>Premium Subscription</div>
        {!hasOnlyTeacherPremium && (
          <div className="expire-on">
            Your subscription will expire on <b>{subEndDate}</b>.
          </div>
        )}
      </ModalTitle>
    ) : (
      <ModalTitle>
        <div>Free Trial Started</div>
        {!hasOnlyTeacherPremium && (
          <div className="expire-on">
            Your trial will expire on <b>{subEndDate}</b>.
          </div>
        )}
      </ModalTitle>
    )

  return (
    <>
      {!isTrialPurchaseSuccess && !!itemBankProducts?.length ? (
        <SpinContainer>
          <StyledSpin size="large" />
        </SpinContainer>
      ) : (
        <CustomModalStyled
          visible={visible}
          title={modalTitle}
          onCancel={handleCloseModal}
          width={hasOnlyTeacherPremium ? '700px' : '935px'}
          footer={showFooter}
          centered
        >
          <ModalBody>
            {hasOnlyTeacherPremium ? (
              <p>
                Thanks for trying teacher premium. Your{' '}
                {subType === 'premium' ? 'subscription' : 'trial'} will expire
                on <b>{subEndDate}</b>.
              </p>
            ) : (
              <>
                <p>
                  Thanks for trying the Teacher Premium and additional Spark
                  content. Select the grade and curriculum alignment to get
                  started.
                </p>
                <br />
                <div>
                  <FieldLabel color={titleColor}>PRODUCTS</FieldLabel>
                  <ContentWrapper>
                    {productsToShow.map(({ linkedProductId, name }) => (
                      <StyledTag
                        onClick={() => onSelecteProduct(linkedProductId)}
                        className={
                          selectedProducts.includes(linkedProductId) && 'active'
                        }
                      >
                        {name}
                      </StyledTag>
                    ))}
                  </ContentWrapper>
                </div>
                <div>
                  <FieldLabel color={titleColor}>SELECT YOUR GRADES</FieldLabel>
                  <ContentWrapper>
                    {GRADES.map(({ text, value }) => (
                      <StyledTag
                        onClick={() => onSelecteGrade(value)}
                        className={
                          (selectedGrades.includes(value) ||
                            (text === 'HIGH SCHOOL' &&
                              selectedGrades.includes('10'))) &&
                          'active'
                        }
                      >
                        {text}
                      </StyledTag>
                    ))}
                  </ContentWrapper>
                </div>
                <div>
                  <FieldLabel color={titleColor}>
                    SELECT YOUR CURRICULUM
                  </FieldLabel>
                  <ContentWrapper>
                    <CurriculumCard>1</CurriculumCard>
                    <CurriculumCard>2</CurriculumCard>
                    <CurriculumCard>3</CurriculumCard>
                    <CurriculumCard>4</CurriculumCard>
                    <CurriculumCard>5</CurriculumCard>
                    <CurriculumCard>6</CurriculumCard>
                    <CurriculumCard>7</CurriculumCard>
                  </ContentWrapper>
                </div>
              </>
            )}
          </ModalBody>
        </CustomModalStyled>
      )}
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
