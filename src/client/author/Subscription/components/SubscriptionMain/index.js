import { EduButton, FlexContainer, notification } from '@edulastic/common'
import {
  IconAlertCircle,
  IconCalc,
  IconCloseBook,
  IconLaptop,
  IconPhonics,
  IconPurchasedAlert,
  IconReading,
  IconRobot,
  IconScience,
  IconScienceLab,
  IconWord,
  IconSchool,
} from '@edulastic/icons'
import produce from 'immer'
import { difference, groupBy, isBoolean, keyBy, map, uniq, omit } from 'lodash'
import React, { useEffect, useMemo, useState } from 'react'
import { Tooltip } from 'antd'
import FeatureNotAvailableModal from '../../../Dashboard/components/Showcase/components/Myclasses/components/FeatureNotAvailableModal'
import TrialModal from '../../../Dashboard/components/Showcase/components/Myclasses/components/TrialModal/index'
import FiltersSection from './FilterSection'
import {
  CardDetails,
  CardRightWrapper,
  CardsSection,
  GradeWrapper,
  IconWrapper,
  LearnMoreLink,
  OtherFilters,
  PremiumRequiredMsg,
  Price,
  SectionContainer,
  SectionDescription,
  SectionTitle,
  SpinContainer,
  StyledSpin,
  ExpiryMsg,
} from './styled'
import TabHeaderContent from './TabHeaderContent'
import AuthorCompleteSignupButton from '../../../../common/components/AuthorCompleteSignupButton'

const productsMetaData = {
  'Teacher Premium': {
    icon: <IconSchool />,
    grades: 'Grades K-12',
    learnMoreLinks: 'https://edulastic.com/teacher-premium',
    filters: 'ALL SUBJECTS',
  },
  SparkMath: {
    icon: <IconCalc />,
    subject: 'math & cs',
    grades: 'Grades K-12',
    learnMoreLinks: 'https://edulastic.com/spark-math',
    filters: 'MATHEMATICS',
  },
  SparkScience: {
    icon: <IconScience />,
    subject: 'science',
    grades: 'Grades K-12',
    learnMoreLinks: 'https://edulastic.com/spark-science',
    filters: 'SCIENCE',
  },
  SparkReading: {
    icon: <IconReading />,
    subject: 'ela',
    grades: 'Grades K-12',
    learnMoreLinks: 'https://edulastic.com/spark-reading',
    filters: 'ELA',
  },
}

function getProductsWithMetaData(metaData, products) {
  return products.map(({ ...p }) => {
    const title = p.name
    return { ...p, title, ...metaData[p.name] }
  })
}

const SubscriptionMain = ({
  openPaymentServiceModal,
  openPurchaseLicenseModal,
  isPremiumTrialUsed,
  showRenewalOptions,
  startTrialAction,
  setShowSubscriptionAddonModalWithId,
  usedTrialItemBankIds,
  products,
  hasAllPremiumProductAccess,
  itemBankSubscriptions,
  setShowItemBankTrialUsedModal,
  openHasLicenseKeyModal,
  isPremiumUser,
  isPremium,
  subType,
  showFeatureNotAvailableModal,
  handleCloseFeatureNotAvailableModal,
  isFreeAdmin,
  setProductData,
  dashboardTiles,
  productData = {},
  setTrialAddOnProductIds,
  setShowTrialSubsConfirmation,
  history,
  showMultipleSubscriptions,
  setShowEnterpriseTab,
  setShowMultiplePurchaseModal,
  subEndDate,
  isPaidPremium,
  setCartQuantities,
  cartQuantities,
  subscription,
  subsLicenses = [],
}) => {
  const [showSelectStates, setShowSelectStates] = useState(false)
  const [isTrialModalVisible, setIsTrialModalVisible] = useState(false)
  const [hasAllTrialProducts, setHasAllTrialProducts] = useState(false)
  const [addonSubject, setAddonSubject] = useState('all')

  const productsKeyedByType = keyBy(products, 'type')

  const productsDataForDisplay = getProductsWithMetaData(
    productsMetaData,
    products
  )
  const productsWithoutTeacherPremium = productsDataForDisplay?.filter(
    (p) => p.name != 'Teacher Premium'
  )
  const teacherPremium =
    productsDataForDisplay?.find((x) => x.name === 'Teacher Premium') || {}

  // Whenever trial modal is closed, clear the states it was using
  useEffect(() => {
    if (!isTrialModalVisible) {
      setProductData({})
      setHasAllTrialProducts(false)
    }
  }, [isTrialModalVisible])

  const {
    trialUnuseditemBankProductIds = [],
    productItemBankIds = [],
  } = useMemo(() => {
    if (products) {
      const itemBankProducts = products.filter(({ type }) => type !== 'PREMIUM')
      return {
        trialUnuseditemBankProductIds: itemBankProducts
          .filter(
            ({ linkedProductId }) =>
              !usedTrialItemBankIds.includes(linkedProductId)
          )
          .map(({ id }) => id),
        productItemBankIds: itemBankProducts.map(
          ({ linkedProductId }) => linkedProductId
        ),
      }
    }
    return {}
  }, [products, usedTrialItemBankIds])

  const paidItemBankIds = useMemo(() => {
    if (!itemBankSubscriptions) {
      return []
    }

    return itemBankSubscriptions
      .filter(
        (_subscription) =>
          // only include the itembanks which are sold as products
          !subscription.isTrial &&
          productItemBankIds.includes(_subscription.itemBankId)
      )
      .map((_subscription) => _subscription.itemBankId)
  }, [itemBankSubscriptions])

  const hasUsedAllItemBankTrials = trialUnuseditemBankProductIds.length === 0

  const getIsPaidSparkProduct = (itemBankId) =>
    paidItemBankIds.includes(itemBankId)

  const gethasUsedItemBankTrial = (itemBankId) =>
    usedTrialItemBankIds.includes(itemBankId)

  const toggleTrialModal = (value) => setIsTrialModalVisible(value)

  const handleSelectStateModal = () => setShowSelectStates(true)

  const handlePurchaseFlow = () => setShowSubscriptionAddonModalWithId()

  const { FEATURED } = groupBy(dashboardTiles, 'type')
  const featuredBundles = FEATURED || []
  const getBundleByProductId = (productId) =>
    (featuredBundles &&
      featuredBundles.find(
        (bundle) => bundle?.config?.subscriptionData?.productId === productId
      )) ||
    {}

  const settingProductData = (productId) => {
    // Flow when main start trial button is clicked
    if (!productId) {
      setProductData({})
      setHasAllTrialProducts(true)
      return
    }
    const currentItemBank = getBundleByProductId(productId)
    const { config = {} } = currentItemBank
    const { subscriptionData } = config

    setProductData({
      productId: subscriptionData.productId,
      productName: subscriptionData.productName,
      description: subscriptionData.description,
      hasTrial: subscriptionData.hasTrial,
      itemBankId: subscriptionData.itemBankId,
    })
  }

  const handleStartTrialButtonClick = (productId) => {
    settingProductData(productId)
    // NOTE: Don't set a boolean default value for 'isPremiumTrialUsed'!
    if (!isBoolean(isPremiumTrialUsed)) {
      return notification({
        type: 'warning',
        msg: 'Validating trial status, please wait...',
      })
    }

    if (hasUsedAllItemBankTrials) {
      setShowItemBankTrialUsedModal(true)
      return
    }
    setIsTrialModalVisible(true)
  }

  // Show item bank trial button when item bank trial is not used yet and user is either premium
  // or hasn't used premium trial yet.
  const hasStartTrialButton = useMemo(() => {
    if (!isPremiumTrialUsed && !isPremiumUser) {
      return true
    }

    for (const productItemBankId of productItemBankIds) {
      if (
        !gethasUsedItemBankTrial(productItemBankId) &&
        !getIsPaidSparkProduct(productItemBankId)
      ) {
        return true
      }
    }

    return false
  }, [itemBankSubscriptions, isPremiumTrialUsed, isPremiumUser])

  const handleSparkPurchaseClick = (productId) => {
    settingProductData(productId)
    handlePurchaseFlow()
  }

  /* const getSparkProductLinks = (title) => {
    const dataMap = {
      SparkMath: 'ITEM_BANK_SPARK_MATH',
      SparkScience: 'ITEM_BANK_SPARK_SCIENCE',
    }

    if (!dataMap[title]) {
      return null
    }

    const { id: productId, linkedProductId: itemBankId, name } =
      productsKeyedByType[dataMap[title]] || {}
    const isPaidSparkProduct = getIsPaidSparkProduct(itemBankId)
    const hasPurchaseLink = !isPaidSparkProduct
    const hasTrialLink =
      !isPaidSparkProduct &&
      !gethasUsedItemBankTrial(itemBankId) &&
      !isFreeAdmin
    const handleSparkStartTrial = () => handleStartTrialButtonClick(productId)

    return (
      <>
        {hasPurchaseLink && (
          <AuthorCompleteSignupButton
            renderButton={(handleClick) => (
              <PurchaseLink data-cy={`Purchase_${name}`} onClick={handleClick}>
                Purchase
              </PurchaseLink>
            )}
            onClick={() => handleSparkPurchaseClick(productId)}
          />
        )}
        {hasTrialLink && (
          <AuthorCompleteSignupButton
            renderButton={(handleClick) => (
              <span data-cy={`trialPurchase_${name}`} onClick={handleClick}>
                try
              </span>
            )}
            onClick={handleSparkStartTrial}
          />
        )}
      </>
    )
  } */

  // if the product has paid subscription or the trial is used then its not available for trial.
  const allAvailableTrialItemBankIds = difference(productItemBankIds, [
    ...paidItemBankIds,
    ...usedTrialItemBankIds,
  ])

  const allAvailableItemProductIds = map(
    products.filter((product) =>
      allAvailableTrialItemBankIds.includes(product.linkedProductId)
    ),
    'id'
  )
  const productsToShowInTrialModal = hasAllTrialProducts
    ? allAvailableItemProductIds
    : productData.productId
    ? [productData?.productId]
    : []

  const isUserPremium = ['premium', 'enterprise', 'partial_premium'].includes(
    subType?.toLowerCase?.()
  )

  const toggleCart = (productId, source) => {
    const quantities = cartQuantities
    if (productId) {
      if (cartQuantities[productId]) {
        // if removing tp and user is not premium
        if (source === 'tp' && !isUserPremium) {
          setCartQuantities({})
        } else if (source === 'tp' && isUserPremium) {
          setCartQuantities(
            produce(cartQuantities, (draft) => {
              delete draft[productId]
              for (const [_productId, _productCount] of Object.entries(draft)) {
                const hasBankAccess = itemBankSubscriptions.find((x) => {
                  return (
                    x.itemBankId ===
                    products.find((y) => y.id === _productId)?.linkedProductId
                  )
                })
                if (hasBankAccess && !hasBankAccess.isTrial) {
                  delete draft[_productId]
                } else if (hasBankAccess && hasBankAccess.isTrial) {
                  draft[_productId] = 1
                }
              }
              return draft
            })
          )
        } else {
          setCartQuantities(
            produce(cartQuantities, (draft) => {
              delete draft[productId]
              return draft
            })
          )
        }
      } else {
        const changes = { [productId]: 1 }

        const hasAddonAccess =
          productId === teacherPremium.id ||
          itemBankSubscriptions.find((x) => {
            return (
              x.itemBankId ===
                products.find((y) => y.id === productId)?.linkedProductId &&
              !x.isTrial
            )
          })

        if (quantities[teacherPremium.id] === undefined && source === 'addon') {
          // if additions of addons and user is not premium
          if (!isUserPremium) {
            Object.assign(changes, { [teacherPremium.id]: 1 })
            notification({
              type: 'info',
              msg: `Note: Teacher Premium is added to cart by default since you are on ${
                subType === 'TRIAL_PREMIUM' ? 'Trial Premium' : 'free'
              } plan`,
            })
          } else if (isUserPremium && subsLicenses.length && hasAddonAccess) {
            // if user is premium and adding a bank which he has access to
            const {
              totalCount: totalTeacherPremium,
              usedCount: totalTeacherPremiumUsedCount,
            } = subsLicenses.find((x) => x.productId === teacherPremium.id)

            const totalRemainingTeacherPremiumCount =
              totalTeacherPremium - totalTeacherPremiumUsedCount

            const totalRemainingItemBanksLicenseCount = subsLicenses.reduce(
              (a, c) => {
                if (c.productId === teacherPremium.id) return a
                const { totalCount, usedCount } = c
                const delta = totalCount - usedCount
                return delta > a ? delta : a
              },
              0
            )

            const diff =
              totalRemainingTeacherPremiumCount -
              totalRemainingItemBanksLicenseCount
            if (diff <= 0) {
              Object.assign(changes, { [teacherPremium.id]: 1 })
              notification({
                type: 'info',
                msg: `Note: Teacher Premium is added to cart by default since Itembank Licenses cannot be more than `,
              })
            }
          }
        }
        setCartQuantities({ ...quantities, ...changes })
      }
    }
  }

  return (
    <>
      {!productsWithoutTeacherPremium?.length ? (
        <SpinContainer>
          <StyledSpin size="large" />
        </SpinContainer>
      ) : (
        <SectionContainer>
          {subType !== 'enterprise' && (
            <>
              <TabHeaderContent
                setShowMultiplePurchaseModal={setShowMultiplePurchaseModal}
                setShowEnterpriseTab={setShowEnterpriseTab}
                showMultipleSubscriptions={showMultipleSubscriptions}
                history={history}
              />

              {!['partial_premium', 'enterprise'].includes(subType) && (
                <CardsSection data-cy={teacherPremium.id}>
                  <FlexContainer
                    justifyContent="flex-start"
                    alignItems="flex-start"
                  >
                    <IconWrapper>{teacherPremium.icon}</IconWrapper>
                    <div>
                      <SectionTitle>
                        {teacherPremium.title}
                        {isPremiumUser && (
                          <ExpiryMsg>
                            <IconPurchasedAlert />
                            {subType === 'TRIAL_PREMIUM' ? (
                              <span>
                                FREE TRIAL EXPIRES{' '}
                                {new Date(subEndDate).toDateString()}
                              </span>
                            ) : (
                              <span>
                                purchased - EXPIRES{' '}
                                {new Date(subEndDate).toDateString()}
                              </span>
                            )}
                          </ExpiryMsg>
                        )}
                      </SectionTitle>
                      <CardDetails>
                        <GradeWrapper>{teacherPremium.grades}</GradeWrapper>
                        <OtherFilters>{teacherPremium.filters}</OtherFilters>
                      </CardDetails>
                      <SectionDescription>
                        {teacherPremium.description}
                      </SectionDescription>
                    </div>
                  </FlexContainer>
                  <CardRightWrapper
                    flexDirection="column"
                    justifyContent="center"
                  >
                    <Price>
                      <span>$ {teacherPremium.price}</span> per Teacher
                    </Price>
                    <EduButton
                      onClick={() => toggleCart(teacherPremium.id, 'tp')}
                      height="32px"
                      width="180px"
                      className={
                        cartQuantities[teacherPremium.id] ? 'remove' : 'add'
                      }
                      data-cy={
                        cartQuantities[teacherPremium.id]
                          ? 'removeFromCart'
                          : 'addToCart'
                      }
                    >
                      {cartQuantities[teacherPremium.id]
                        ? 'Remove From Cart'
                        : 'Add to Cart'}
                    </EduButton>
                    <EduButton
                      onClick={handleSelectStateModal}
                      height="32px"
                      width="180px"
                      isBlue
                    >
                      <LearnMoreLink
                        data-cy="LearnMore"
                        href={teacherPremium.learnMoreLinks}
                        target="_blank"
                        rel="noreferrer"
                        className
                      >
                        Learn more
                      </LearnMoreLink>
                    </EduButton>
                    {console.log(
                      'teacherPremium',
                      isPremiumTrialUsed,
                      !subscription.length
                    )}
                    {!isPremiumUser && (
                      <Tooltip
                        title={
                          isPremiumTrialUsed && !subscription.length
                            ? `Free trial for ${teacherPremium.title} is already utilized. Kindly purchase to access the content.`
                            : ''
                        }
                        placement="bottom"
                      >
                        <EduButton
                          onClick={() => {
                            !(isPremiumTrialUsed && !subscription.length)
                              ? handleStartTrialButtonClick()
                              : {}
                          }}
                          height="32px"
                          width="180px"
                          isGhost
                          isBlue
                          data-cy="subscriptionStartTrialbtn"
                          className={
                            isPremiumTrialUsed &&
                            !subscription.length &&
                            'disabled'
                          }
                        >
                          Try Now
                        </EduButton>
                      </Tooltip>
                    )}
                  </CardRightWrapper>
                </CardsSection>
              )}
            </>
          )}

          <FiltersSection
            selected={addonSubject}
            changeSubject={(v) => setAddonSubject(v)}
            subjects={uniq(productsWithoutTeacherPremium.map((x) => x.subject))}
          />

          {productsWithoutTeacherPremium
            .filter((x) => {
              if (addonSubject === 'all') {
                return true
              }
              if (x.subject === addonSubject) {
                return true
              }
              return false
            })
            .map((_product) => {
              const itemBankSubscription = itemBankSubscriptions.find(
                (ib) => ib.itemBankId === _product?.linkedProductId
              )
              return (
                <CardsSection data-cy={_product.id}>
                  <FlexContainer
                    justifyContent="flex-start"
                    alignItems="flex-start"
                  >
                    <IconWrapper>{_product.icon}</IconWrapper>
                    <div>
                      <SectionTitle>
                        {_product.title}
                        {!isPremiumUser && (
                          <PremiumRequiredMsg>
                            <IconAlertCircle />
                            <span>Subscription requires access to Premium</span>
                          </PremiumRequiredMsg>
                        )}
                        {itemBankSubscription && (
                          <ExpiryMsg>
                            <IconPurchasedAlert />
                            {itemBankSubscription?.isTrial ? (
                              <span>
                                FREE TRIAL EXPIRES{' '}
                                {new Date(
                                  itemBankSubscription?.endDate
                                ).toDateString()}
                              </span>
                            ) : (
                              <span>
                                purchased - EXPIRES{' '}
                                {new Date(
                                  itemBankSubscription?.endDate
                                ).toDateString()}
                              </span>
                            )}
                          </ExpiryMsg>
                        )}
                      </SectionTitle>
                      <CardDetails>
                        <GradeWrapper>{_product.grades}</GradeWrapper>
                        <OtherFilters>{_product.filters}</OtherFilters>
                      </CardDetails>
                      <SectionDescription>
                        {_product.description}
                      </SectionDescription>
                    </div>
                  </FlexContainer>
                  <CardRightWrapper
                    flexDirection="column"
                    justifyContent="center"
                  >
                    <Price>
                      <span>$ {_product.price}</span> per Teacher
                    </Price>
                    <EduButton
                      onClick={() => toggleCart(_product.id, 'addon')}
                      height="32px"
                      width="180px"
                      data-cy={
                        cartQuantities[_product.id]
                          ? 'removeFromCart'
                          : 'addToCart'
                      }
                      className={cartQuantities[_product.id] ? 'remove' : 'add'}
                    >
                      {cartQuantities[_product.id]
                        ? 'Remove from Cart'
                        : 'Add to Cart'}
                    </EduButton>
                    <EduButton
                      onClick={handleSelectStateModal}
                      height="32px"
                      width="180px"
                      isBlue
                    >
                      <LearnMoreLink
                        data-cy="LearnMore"
                        href={_product.learnMoreLinks}
                        target="_blank"
                        rel="noreferrer"
                        className
                      >
                        Learn more
                      </LearnMoreLink>
                    </EduButton>
                    {!itemBankSubscription && (
                      <Tooltip
                        title={
                          usedTrialItemBankIds.includes(
                            _product.linkedProductId
                          )
                            ? `Free trial for ${_product.title} is already utilized. Kindly purchase to access the content.`
                            : ''
                        }
                        placement="bottom"
                      >
                        <EduButton
                          onClick={() => {
                            !usedTrialItemBankIds.includes(
                              _product.linkedProductId
                            )
                              ? handleStartTrialButtonClick(_product.id)
                              : {}
                          }}
                          className={
                            usedTrialItemBankIds.includes(
                              _product.linkedProductId
                            ) && 'disabled'
                          }
                          height="32px"
                          width="180px"
                          isGhost
                          isBlue
                          data-cy="subscriptionStartTrialbtn"
                        >
                          Try Now
                        </EduButton>
                      </Tooltip>
                    )}
                  </CardRightWrapper>
                </CardsSection>
              )
            })}
        </SectionContainer>
      )}

      {isTrialModalVisible && (
        <TrialModal
          addOnProductIds={productsToShowInTrialModal}
          isVisible={isTrialModalVisible}
          toggleModal={toggleTrialModal}
          isPremiumUser={isPremiumUser}
          isPremiumTrialUsed={isPremiumTrialUsed}
          startPremiumTrial={startTrialAction}
          products={products}
          setTrialAddOnProductIds={setTrialAddOnProductIds}
          hasAllTrialProducts={hasAllTrialProducts}
          setShowTrialSubsConfirmation={setShowTrialSubsConfirmation}
        />
      )}
      {showFeatureNotAvailableModal && (
        <FeatureNotAvailableModal
          isVisible={showFeatureNotAvailableModal}
          handleCloseModal={handleCloseFeatureNotAvailableModal}
          handleSelectStateModal={handleSelectStateModal}
        />
      )}
      {/* <AddonSection>
        <SectionContainer>
          <AvailablePlansContainer>
            {availablePlans.map((plan, index) => (
              <PlansComponent
                key={index}
                openPaymentServiceModal={openPaymentServiceModal}
                openPurchaseLicenseModal={openPurchaseLicenseModal}
                {...plan}
              />
            ))}
          </AvailablePlansContainer>
          <FlexContainer
            justifyContent="center"
            style={{ marginTop: '25px', width: '100%' }}
          >
            {!hasAllPremiumProductAccess &&
              !isFreeAdmin &&
              !showRenewalOptions && (
                <AuthorCompleteSignupButton
                  renderButton={(handleClick) => (
                    <CustomButton
                      height="38px"
                      width="215px"
                      data-cy="subscriptionUpgradebtn"
                      isBlue
                      onClick={handleClick}
                      noBg
                    >
                      Upgrade now
                    </CustomButton>
                  )}
                  onClick={handlePurchaseFlow}
                />
              )}
            {showRenewalOptions && (
              <EduButton onClick={handlePurchaseFlow} isBlue height="38px">
                Renew Subscription
              </EduButton>
            )}
            {hasStartTrialButton && !isFreeAdmin && (
              <AuthorCompleteSignupButton
                renderButton={(handleClick) => (
                  <CustomButton
                    height="38px"
                    width="215px"
                    data-cy="subscriptionStartTrialbtn"
                    isGhost
                    isBlue
                    onClick={handleClick}
                  >
                    Start a trial
                  </CustomButton>
                )}
                onClick={handleStartTrialButtonClick}
              />
            )}
          </FlexContainer>
          <CardContainer>
            {addonsData.map((_, index) => (
              <AddonCard key={index}>
                <LearnMoreLink
                  data-cy="LearnMore"
                  href={addonsData[index].learnMoreLinks}
                  target="_blank"
                  rel="noreferrer"
                  className
                >
                  Learn more
                </LearnMoreLink>
                {getSparkProductLinks(addonsData[index].title)}
              </AddonCard>
            ))}
          </CardContainer>
        </SectionContainer>
      </AddonSection> */}
    </>
  )
}

export default SubscriptionMain
