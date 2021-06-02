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
} from '@edulastic/icons'
import { difference, groupBy, isBoolean, keyBy, map } from 'lodash'
import React, { useEffect, useMemo, useState } from 'react'
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
  TrialExpiryMsg,
} from './styled'
import TabHeaderContent from './TabHeaderContent'
import TeacherPremiumCard from './TeacherPremiumCard'
import AuthorCompleteSignupButton from '../../../../common/components/AuthorCompleteSignupButton'

/* const getUpgradeToMultipleUsersPlanAction = ({ openPurchaseLicenseModal }) => (
  <ActionsWrapper>
    <EduButton height="40px" onClick={openPurchaseLicenseModal} isGhost>
      PURCHASE LICENSE
    </EduButton>
    <Link to="/author/subscription/manage-licenses">
      <EduButton height="40px" isGhost>
        MANAGE LICENSE
      </EduButton>
    </Link>
  </ActionsWrapper>
)

const availablePlans = [
  {
    imgSrc: IMG2,
    title: 'Upgrade Multiple Users to Premium',
    description:
      'Administer common assesement, get immediate school or district-wide reports, and enable premium access for all teachers in your school or district.',
    getActionsComp: getUpgradeToMultipleUsersPlanAction,
  },
] */

/* const PlansComponent = ({
  imgSrc,
  title,
  description,
  getActionsComp,
  isblur,
  openPaymentServiceModal,
  openPurchaseLicenseModal,
}) => (
  <PlansContainer isblur={isblur}>
    <ContentWrapper>
      <PlanImage>
        <img src={imgSrc} alt="" />
      </PlanImage>
      <PlanDetails>
        <Title margin="0 0 8px 0">{title}</Title>
        <Description>{description}</Description>
      </PlanDetails>
    </ContentWrapper>
    {getActionsComp({
      openPaymentServiceModal,
      openPurchaseLicenseModal,
      isblur,
    })}
  </PlansContainer>
) */

const productsData = [
  {
    id: '5e3d2eb34bdb8a0007e22223',
    icon: <IconCalc />,
    title: 'SparkMath',
    description:
      'Pre-built assessments and differentiated Math practice for each student.',
    learnMoreLinks: 'https://edulastic.com/spark-math',
    grades: 'Grades 6-8',
    filters: 'ELA & ELL, Social Studies, World Languages',
    price: '100',
  },
  {
    id: '',
    icon: <IconCloseBook />,
    title: 'Book Buddies',
    description: 'Assessments and prompts on your favorite books.',
    learnMoreLinks: 'https://edulastic.com/spark-reading',
    grades: 'Grades 6-8',
    filters: 'ELA & ELL, Social Studies, World Languages',
    price: '100',
  },
  {
    id: '',
    icon: <IconReading />,
    title: 'SparkReading',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean non ante fermentum, bibendum ex ut, tincidunt diam, bibendum ex ut, tincidunt diam.',
    learnMoreLinks: 'https://edulastic.com/spark-reading',
    grades: 'Grades 6-8',
    filters:
      'Book buddies, STEM cross-curricular, Phonics practice, Spark Words and reading comp practice',
    price: '100',
  },
  {
    id: '',
    icon: <IconScienceLab />,
    title: 'STEM Cross-curricular',
    description: 'Science passages with reading and science questions.',
    learnMoreLinks: 'https://edulastic.com/spark-reading',
    grades: 'Grades 6-8',
    filters: 'ELA & ELL, Social Studies, World Languages',
    price: '100',
  },
  {
    id: '',
    icon: <IconPhonics />,
    title: 'Phonics Practice',
    description:
      'Full year of practice assignments to help all students master each sound.',
    learnMoreLinks: 'https://edulastic.com/spark-reading',
    grades: 'Grades 6-8',
    filters: 'ELA & ELL, Social Studies, World Languages',
    price: '100',
  },
  {
    id: '',
    icon: <IconWord />,
    title: 'SparkWord',
    description:
      'NGSS-aligned pre-built assessments and item banks for grades K-12.',
    learnMoreLinks: 'https://edulastic.com/spark-science',
    grades: 'Grades 6-8',
    filters: 'ELA & ELL, Social Studies, World Languages',
    price: '100',
  },
  {
    id: '',
    icon: <IconLaptop />,
    title: 'Reading Comprehension Practice',
    description: 'Fiction and nonfiction to practice close Reading.',
    learnMoreLinks: 'https://edulastic.com/spark-reading',
    grades: 'Grades 6-8',
    filters: 'ELA & ELL, Social Studies, World Languages',
    price: '100',
  },
  {
    id: '',
    icon: <IconScience />,
    title: 'SparkScience',
    description:
      'NGSS-aligned pre-built assessments and item banks for grades K-12.',
    learnMoreLinks: 'https://edulastic.com/spark-science',
    grades: 'Grades 6-8',
    filters: 'ELA & ELL, Social Studies, World Languages',
    price: '100',
  },
  {
    id: '',
    icon: <IconRobot />,
    title: 'SparkCS',
    description:
      'Full year of practice assignments to help all students master each sound.',
    learnMoreLinks: 'https://edulastic.com/spark-science',
    grades: 'Grades 6-8',
    filters: 'ELA & ELL, Social Studies, World Languages',
    price: '100',
  },
]

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
}) => {
  const [showSelectStates, setShowSelectStates] = useState(false)
  const [isTrialModalVisible, setIsTrialModalVisible] = useState(false)
  const [hasAllTrialProducts, setHasAllTrialProducts] = useState(false)

  const productsKeyedByType = keyBy(products, 'type')

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
        (subscription) =>
          // only include the itembanks which are sold as products
          !subscription.isTrial &&
          productItemBankIds.includes(subscription.itemBankId)
      )
      .map((subscription) => subscription.itemBankId)
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

  return (
    <>
      <SectionContainer>
        {subType !== 'enterprise' && (
          <>
            <TabHeaderContent
              setShowMultiplePurchaseModal={setShowMultiplePurchaseModal}
              setShowEnterpriseTab={setShowEnterpriseTab}
              showMultipleSubscriptions={showMultipleSubscriptions}
              history={history}
            />

            <TeacherPremiumCard />
          </>
        )}

        <FiltersSection />

        {productsData.map((product) => (
          <CardsSection>
            <FlexContainer justifyContent="flex-start" alignItems="flex-start">
              <IconWrapper>{product.icon}</IconWrapper>
              <div>
                <SectionTitle>
                  {product.title}
                  {!isPremiumUser && (
                    <PremiumRequiredMsg>
                      <IconAlertCircle />
                      <span>Subscription requires access to Premium</span>
                    </PremiumRequiredMsg>
                  )}
                  {usedTrialItemBankIds.includes(product.id) && (
                    <TrialExpiryMsg>
                      <IconPurchasedAlert />
                      <span>FREE TRIAL EXPIRES April 30, 2021</span>
                    </TrialExpiryMsg>
                  )}
                </SectionTitle>
                <CardDetails>
                  <GradeWrapper>{product.grades}</GradeWrapper>
                  <OtherFilters>{product.filters}</OtherFilters>
                </CardDetails>
                <SectionDescription>{product.description}</SectionDescription>
              </div>
            </FlexContainer>
            <CardRightWrapper flexDirection="column" justifyContent="center">
              <Price>
                <span>$ {product.price}</span> per Teacher
              </Price>
              <EduButton
                onClick={handleSelectStateModal}
                height="32px"
                width="180px"
                data-cy="addToCart"
              >
                Add to Cart
              </EduButton>
              <EduButton
                onClick={handleSelectStateModal}
                height="32px"
                width="180px"
                isBlue
              >
                <LearnMoreLink
                  data-cy="LearnMore"
                  href={product.learnMoreLinks}
                  target="_blank"
                  rel="noreferrer"
                  className
                >
                  Learn more
                </LearnMoreLink>
              </EduButton>
              <EduButton
                onClick={handleSelectStateModal}
                height="32px"
                width="180px"
                isGhost
                isBlue
                data-cy="subscriptionStartTrialbtn"
              >
                Try Now
              </EduButton>
            </CardRightWrapper>
          </CardsSection>
        ))}
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
