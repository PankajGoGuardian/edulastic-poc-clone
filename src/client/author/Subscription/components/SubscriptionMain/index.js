import { EduButton, FlexContainer, notification } from '@edulastic/common'
import { IconAlertCircle, IconPurchasedAlert } from '@edulastic/icons'
import { roleuser } from '@edulastic/constants'
import { Tooltip } from 'antd'
import produce from 'immer'
import {
  difference,
  groupBy,
  isBoolean,
  keyBy,
  map,
  uniq,
  isEmpty,
} from 'lodash'
import React, { useEffect, useMemo, useState } from 'react'
import FeatureNotAvailableModal from '../../../Dashboard/components/Showcase/components/Myclasses/components/FeatureNotAvailableModal'
import TrialModal from '../../../Dashboard/components/Showcase/components/Myclasses/components/TrialModal/index'
import FiltersSection from './FilterSection'
import {
  CardDetails,
  CardRightWrapper,
  CardsSection,
  ExpiryMsg,
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
  TopSection,
} from './styled'
import TabHeaderContent from './TabHeaderContent'
import { productsMetaData } from '../../../src/components/common/PurchaseModals/ProductsMetaData'

function getProductsWithMetaData(metaData, products) {
  return products
    .map(({ ...p }) => {
      const title = p.name
      const meta = metaData[p.name] || metaData[p.name.replace(' ', '')]
      return { ...p, title, ...meta }
    })
    .filter((x) => x.price)
}

const SubscriptionMain = ({
  isPremiumTrialUsed,
  startTrialAction,
  usedTrialItemBankIds,
  products,
  itemBankSubscriptions,
  setShowItemBankTrialUsedModal,
  isPremiumUser,
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
  setCartQuantities,
  cartQuantities,
  subscription,
  subsLicenses = [],
  user,
  isPlanEnterprise,
  proratedProducts,
  isPaidPremium,
  signUpFlowModalHandler = () => {},
  setIsTabShouldSwitch,
  isLoading = false,
  displayText,
}) => {
  const _isFreeAdmin = isFreeAdmin && !isPaidPremium
  const [isTrialModalVisible, setIsTrialModalVisible] = useState(false)
  const [hasAllTrialProducts, setHasAllTrialProducts] = useState(false)
  const [addonSubject, setAddonSubject] = useState('all')

  const subsLicensesKeyed = keyBy(subsLicenses, 'productId')
  const productsDataForDisplay = getProductsWithMetaData(
    productsMetaData,
    proratedProducts || products
  )
  const productsWithoutTeacherPremiumUnSorted = productsDataForDisplay?.filter(
    (p) => p.name != 'Teacher Premium'
  )
  const productsWithoutVideoQuizInOrder = productsWithoutTeacherPremiumUnSorted?.filter(
    (p) => p.name != 'Video Quiz and AI Suite'
  )
  const productsWithoutTeacherPremium = [
    ...productsWithoutTeacherPremiumUnSorted.filter(
      (p) => p.name === 'Video Quiz and AI Suite'
    ),
    ...productsWithoutVideoQuizInOrder,
  ]
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

  const toggleTrialModal = (value) => setIsTrialModalVisible(value)

  const handleSelectStateModal = () => {}

  const { FEATURED } = groupBy(dashboardTiles, 'type')
  const featuredBundles = FEATURED || []
  const getBundleByProductId = (productId) =>
    (featuredBundles &&
      featuredBundles?.find(
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
    let subscriptionData

    const currentItemBank = getBundleByProductId(productId)
    if (isEmpty(currentItemBank)) {
      const product = products.find((x) => x.id === productId)
      subscriptionData = {
        productId: product?.id,
        productName: product?.name,
        description: product?.description,
        hasTrial: !!product?.trialPeriod,
        itemBankId: product?.linkedProductId,
      }
    } else {
      const { config = {} } = currentItemBank
      subscriptionData = config.subscriptionData
    }
    setProductData({
      productId: subscriptionData.productId,
      productName: subscriptionData.productName,
      description: subscriptionData.description,
      hasTrial: subscriptionData.hasTrial,
      itemBankId: subscriptionData.itemBankId,
    })
  }

  const handleStartTrialButtonClick = (productIdOrSubType) => {
    settingProductData(productIdOrSubType)
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

    if (!['enterprise'].includes(productIdOrSubType?.toLowerCase())) {
      setIsTrialModalVisible(true)
    }
  }

  // Show item bank trial button when item bank trial is not used yet and user is either premium
  // or hasn't used premium trial yet.
  // const hasStartTrialButton = useMemo(() => {
  //   if (!isPremiumTrialUsed && !isPremiumUser) {
  //     return true
  //   }

  //   for (const productItemBankId of productItemBankIds) {
  //     if (
  //       !gethasUsedItemBankTrial(productItemBankId) &&
  //       !getIsPaidSparkProduct(productItemBankId)
  //     ) {
  //       return true
  //     }
  //   }

  //   return false
  // }, [itemBankSubscriptions, isPremiumTrialUsed, isPremiumUser])

  // const handleSparkPurchaseClick = (productId) => {
  //   settingProductData(productId)
  //   handlePurchaseFlow()
  // }

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

  const isUserPremium =
    ['premium', 'enterprise'].includes(subType?.toLowerCase?.()) ||
    (subType?.toLowerCase() === 'partial_premium' && isPremiumUser)

  const isTeacher = user?.role === roleuser.TEACHER
  const totalRemainingTeacherPremiumCount = useMemo(() => {
    if (subsLicenses && teacherPremium) {
      const {
        totalCount: totalTeacherPremium,
        usedCount: totalTeacherPremiumUsedCount,
      } = subsLicenses.find((x) => x.productId === teacherPremium?.id) || {}

      return totalTeacherPremium - totalTeacherPremiumUsedCount
    }
    return 0
  }, [subsLicenses, teacherPremium])
  const isEnterprise = ['partial_premium', 'enterprise'].includes(subType)

  const secondsInAday = 1000 * 60 * 60 * 24
  const subscriptionRemainingDays = (subEndDate - Date.now()) / secondsInAday

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
              for (const [_productId] of Object.entries(draft)) {
                const hasBankAccess = itemBankSubscriptions.find((x) => {
                  return (
                    x.itemBankId ===
                    products.find((y) => y.id === _productId)?.linkedProductId
                  )
                })
                if (hasBankAccess && !hasBankAccess.isTrial) {
                  const hasProductLicense = subsLicenses?.find(
                    (x) => x.productId === _productId
                  )
                  if (hasProductLicense) {
                    const { totalCount = 0, usedCount = 0 } = hasProductLicense
                    const diff =
                      totalCount - usedCount + (draft[_productId] || 0)

                    if (totalRemainingTeacherPremiumCount - diff < 0) {
                      delete draft[_productId]
                    }
                  }
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
          itemBankSubscriptions?.find((x) => {
            return (
              x.itemBankId ===
                products?.find((y) => y.id === productId)?.linkedProductId &&
              x?.endDate > Date.now() &&
              !x.isTrial
            )
          })

        const subscriptionEndsWithin90days = subscriptionRemainingDays < 90
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
          } else if (isUserPremium && hasAddonAccess) {
            // if user is premium and adding a bank which he has access to
            let teacherPremiumCount = isEnterprise ? 0 : 1
            if (subsLicensesKeyed[teacherPremium.id]) {
              teacherPremiumCount =
                subsLicensesKeyed[teacherPremium.id].totalCount
              if (
                subsLicensesKeyed[teacherPremium.id].usedCount === 0 &&
                isTeacher &&
                subType.toLowerCase() === 'premium'
              ) {
                teacherPremiumCount += 1
              }
            }
            if (cartQuantities[teacherPremium.id]) {
              teacherPremiumCount += cartQuantities[teacherPremium.id]
            }
            let existingAddonsCount = 1
            if (subsLicensesKeyed[productId]) {
              existingAddonsCount = subsLicensesKeyed[productId].totalCount
              if (
                subsLicensesKeyed[productId].usedCount === 0 &&
                isTeacher &&
                subType.toLowerCase() === 'premium'
              ) {
                existingAddonsCount += 1
              }
            }
            if (cartQuantities[productId]) {
              existingAddonsCount += cartQuantities[productId]
            }
            const diff = teacherPremiumCount - existingAddonsCount

            if (diff <= 0) {
              const existingCartCount = cartQuantities[teacherPremium.id] || 0
              Object.assign(changes, {
                [teacherPremium.id]: existingCartCount + 1,
              })
              notification({
                type: 'info',
                msg: `Note: Teacher Premium is added to cart by default since Itembank Licenses cannot be more than Teacher Premium`,
              })
            }
          } else if (
            !cartQuantities[teacherPremium.id] &&
            isTeacher &&
            subType?.toLowerCase() === 'premium' &&
            subscriptionEndsWithin90days
          ) {
            Object.assign(changes, {
              [teacherPremium.id]: 1,
            })
            notification({
              type: 'info',
              msg: `Note: Teacher Premium is added to cart by default since existing Teacher Premium is ending in less than 90 days`,
            })
          }
        }
        setCartQuantities({ ...quantities, ...changes })
      }
    }
  }

  if (isLoading) {
    return (
      <SpinContainer>
        <StyledSpin size="large" />
      </SpinContainer>
    )
  }

  return (
    <>
      <SectionContainer>
        {!isPlanEnterprise && (
          <>
            <TabHeaderContent
              setShowMultiplePurchaseModal={setShowMultiplePurchaseModal}
              setShowEnterpriseTab={setShowEnterpriseTab}
              showMultipleSubscriptions={showMultipleSubscriptions}
              history={history}
              signUpFlowModalHandler={signUpFlowModalHandler}
            />
            {(!isFreeAdmin ||
              (subType === 'partial_premium' && !isPremiumUser)) &&
              subType !== 'enterprise' && (
                <CardsSection data-cy={`${teacherPremium.type}Card`}>
                  <FlexContainer
                    justifyContent="flex-start"
                    alignItems="flex-start"
                  >
                    <IconWrapper>{teacherPremium.icon}</IconWrapper>
                    <div>
                      <SectionTitle>
                        {teacherPremium.title}
                        {isPremiumUser && (
                          <ExpiryMsg data-cy={`${teacherPremium.type}AlertMsg`}>
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
                        <GradeWrapper data-cy="gradesFilter">
                          {teacherPremium.grades}
                        </GradeWrapper>
                        <OtherFilters data-cy="subjectFilters">
                          {teacherPremium.filters}
                        </OtherFilters>
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
                    <Price data-cy={`${teacherPremium.type}Price`}>
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
                    {!['premium', 'TRIAL_PREMIUM'].includes(subType) &&
                      !_isFreeAdmin && (
                        <Tooltip
                          title={
                            isPremiumTrialUsed && !subscription.length
                              ? `Free trial for ${teacherPremium.title} is already utilized. Kindly purchase to access the content.`
                              : ''
                          }
                          placement="bottom"
                        >
                          <EduButton
                            title={
                              isPremiumTrialUsed && !subscription.length
                                ? `Free trial for ${teacherPremium.title} is already utilized. Kindly purchase to access the content.`
                                : undefined
                            }
                            onClick={() => {
                              !(isPremiumTrialUsed && !subscription.length)
                                ? signUpFlowModalHandler(
                                    handleStartTrialButtonClick
                                  )
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

        {['partial_premium', 'enterprise'].includes(subType) && isPremiumUser && (
          <TopSection>
            <h1>Add ons for your Enterprise Version.</h1>
            <p>
              Add on modules make it easier to deliver differentiated
              instruction and pull all of your data into one place for a
              holistic view of student understanding and growth.
            </p>
          </TopSection>
        )}

        {!!productsWithoutTeacherPremium?.length && (
          <FiltersSection
            selected={addonSubject}
            changeSubject={(v) => setAddonSubject(v)}
            subjects={uniq(productsWithoutTeacherPremium.map((x) => x.subject))}
          />
        )}

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
            const itemBankSubscription = itemBankSubscriptions?.find(
              (ib) => ib.itemBankId === _product?.linkedProductId
            )
            return (
              <CardsSection data-cy={`${_product.type}_Card`}>
                <FlexContainer
                  justifyContent="flex-start"
                  alignItems="flex-start"
                >
                  <IconWrapper>{_product.icon}</IconWrapper>
                  <div>
                    <SectionTitle>
                      {_product.title}
                      {!isPremiumUser && (
                        <PremiumRequiredMsg
                          data-cy={`${_product.type}_AlertMsg`}
                        >
                          <IconAlertCircle />
                          <span>Subscription requires access to Premium</span>
                        </PremiumRequiredMsg>
                      )}
                      {itemBankSubscription && (
                        <ExpiryMsg data-cy={`${_product.type}_AlertMsg`}>
                          {itemBankSubscription?.isTrial ? (
                            <>
                              <IconPurchasedAlert />
                              <span>
                                FREE TRIAL EXPIRES{' '}
                                {new Date(
                                  itemBankSubscription?.endDate
                                ).toDateString()}
                              </span>
                            </>
                          ) : itemBankSubscription?.endDate > Date.now() ? (
                            <>
                              <IconPurchasedAlert />
                              <span>
                                purchased - EXPIRES{' '}
                                {new Date(
                                  itemBankSubscription?.endDate
                                ).toDateString()}
                              </span>
                            </>
                          ) : null}
                        </ExpiryMsg>
                      )}
                    </SectionTitle>
                    <CardDetails>
                      <GradeWrapper data-cy="gradesFilter">
                        {_product.grades}
                      </GradeWrapper>
                      <OtherFilters data-cy="subjectFilters">
                        {_product.filters}
                      </OtherFilters>
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
                  <Price data-cy={`${_product.type}_Price`}>
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
                  {!itemBankSubscription && !_isFreeAdmin && (
                    <Tooltip
                      title={
                        usedTrialItemBankIds.includes(_product.linkedProductId)
                          ? `Free trial for ${_product.title} is already utilized. Kindly purchase to access the content.`
                          : ''
                      }
                      placement="bottom"
                    >
                      <EduButton
                        height="32px"
                        width="180px"
                        isGhost
                        isBlue
                        data-cy="subscriptionStartTrialbtn"
                        onClick={() => {
                          !usedTrialItemBankIds.includes(
                            _product.linkedProductId
                          )
                            ? signUpFlowModalHandler(() =>
                                handleStartTrialButtonClick(_product.id)
                              )
                            : {}
                        }}
                        title={
                          usedTrialItemBankIds.includes(
                            _product.linkedProductId
                          )
                            ? `Free trial for ${_product.title} is already utilized. Kindly purchase to access the content.`
                            : undefined
                        }
                        className={
                          usedTrialItemBankIds.includes(
                            _product.linkedProductId
                          ) && 'disabled'
                        }
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
          setIsTabShouldSwitch={setIsTabShouldSwitch}
          displayText={displayText}
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
