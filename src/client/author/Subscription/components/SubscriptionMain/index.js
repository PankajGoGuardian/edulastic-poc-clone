import React, { useState, useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import {
  EduButton,
  FlexContainer,
  MainContentWrapper,
  notification,
} from '@edulastic/common'
import qs from 'qs'
import loadable from '@loadable/component'
import { Link } from 'react-router-dom'
import { isBoolean, groupBy, keyBy, difference, map } from 'lodash'
import TrialModal from '../../../Dashboard/components/Showcase/components/Myclasses/components/TrialModal/index'

// TODO: Update SVG imports here
import IMG2 from '../../static/2.png'

import IMG4 from '../../static/text-speech.svg'
import IMG5 from '../../static/test-security-settings.svg'
import IMG6 from '../../static/advanced-authoring.svg'
import IMG7 from '../../static/in-depth-reports.svg'
import IMG8 from '../../static/playlists.svg'
import IMG9 from '../../static/collaboration-engagement.svg'
import IMG10 from '../../static/student-groups.svg'
import IMG11 from '../../static/parent-portal.svg'

import IMG12 from '../../static/spark.svg'
import IMG13 from '../../static/book-buddies.svg'
import IMG14 from '../../static/stem-cross-curricular.svg'
import IMG15 from '../../static/phonics-practice.svg'
import IMG16 from '../../static/reading-comprehension-practice.svg'

import { ActionsWrapper, Description, Title } from '../styled/commonStyled'
import {
  AvailablePlansContainer,
  ContentWrapper,
  FeatureDescription,
  Img,
  PlanDetails,
  PlanImage,
  PlansContainer,
  ContentSection,
  ContentCards,
  ContentCard,
  AddonSection,
  SectionTitle,
  SectionDescription,
  SectionContainer,
  CardContainer,
  AddonCard,
  AddonImg,
  AddonDescription,
  EnterpriseSection,
  CustomButton,
  AddonFooter,
  PurchaseLink,
  LearnMoreLink,
  HaveLicenseKey,
} from './styled'
import AuthorCompleteSignupButton from '../../../../common/components/AuthorCompleteSignupButton'
import CalendlyScheduleModal from './CalendlyScheduleModal'
import FeatureNotAvailableModal from '../../../Dashboard/components/Showcase/components/Myclasses/components/FeatureNotAvailableModal'

const TrialConfirmationModal = loadable(() =>
  import(
    '../../../Dashboard/components/Showcase/components/Myclasses/components/FeaturedContentBundle/TrialConfimationModal'
  )
)

const getUpgradeToMultipleUsersPlanAction = ({ openPurchaseLicenseModal }) => (
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
]

const featuresData = [
  {
    imgSrc: IMG4,
    title: 'Text-to-speech',
    description: 'Enable read aloud for select students',
  },
  {
    imgSrc: IMG5,
    title: 'Test Security Settings',
    description: 'Shuffle questions, password protect, and more',
  },
  {
    imgSrc: IMG6,
    title: 'Advanced Authoring',
    description:
      'Activate dynamic parameters, rubrics, & authoring power tools',
  },
  {
    imgSrc: IMG7,
    title: 'In-depth reports',
    description:
      'Analyze data, growth, performance over time, & student mastery profiles.',
  },
  {
    imgSrc: IMG8,
    title: 'Playlists',
    description: 'Organize and deliver your assessments by units or modules.',
  },
  {
    imgSrc: IMG9,
    title: 'Collaboration & Engagement',
    description: 'Co-author, display present mode, and more.',
  },
  {
    imgSrc: IMG10,
    title: 'Student Groups',
    description:
      'Arrange students for differentiated assignments & instruction.',
  },
  {
    imgSrc: IMG11,
    title: 'Parent Portal',
    description: 'Give parents/guardians insight into student progress.',
  },
]

const addonsData = [
  {
    imgSrc: IMG12,
    title: 'SparkMath',
    description:
      'Pre-built assessments and differentiated Math practice for each student',
    learnMoreLinks: 'https://edulastic.com/spark-math',
  },
  {
    imgSrc: IMG13,
    title: 'Book Buddies',
    description: 'Assessments and prompts on your favorite books',
    learnMoreLinks: 'https://edulastic.com/spark-reading',
  },
  {
    imgSrc: IMG14,
    title: 'STEM Cross-curricular',
    description: 'Science passages with reading and science questions',
    learnMoreLinks: 'https://edulastic.com/spark-reading',
  },
  {
    imgSrc: IMG15,
    title: 'Phonics Practice',
    description:
      'Full year of practice assignments to help all students master each sound',
    learnMoreLinks: 'https://edulastic.com/spark-reading',
  },
  {
    imgSrc: IMG16,
    title: 'Reading Comprehension Practice',
    description: 'Fiction and nonfiction to practice close reading',
    learnMoreLinks: 'https://edulastic.com/spark-reading',
  },
  {
    imgSrc: IMG12,
    title: 'SparkScience',
    description:
      'NGSS-aligned pre-built assessments and item banks for grades K-12',
    learnMoreLinks: 'https://edulastic.com/spark-science',
  },
]

const PlansComponent = ({
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
)

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
  showFeatureNotAvailableModal,
  handleCloseFeatureNotAvailableModal,
  isFreeAdmin,
  setProductData,
  showTrialSubsConfirmationAction,
  showTrialConfirmationMessage,
  dashboardTiles,
  resetTestFilters,
  resetPlaylistFilters,
  isConfirmationModalVisible,
  collections,
  history,
  productData = {},
}) => {
  const [showSelectStates, setShowSelectStates] = useState(false)
  const [isTrialModalVisible, setIsTrialModalVisible] = useState(false)
  const [trialAddOnProductIds, setTrialAddOnProductIds] = useState([])
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
    featuredBundles &&
    featuredBundles.find(
      (bundle) => bundle?.config?.subscriptionData?.productId === productId
    )

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

  const handleGoToCollectionClick = (productId) => {
    const currentItemBank = getBundleByProductId(productId)
    const { config = {} } = currentItemBank
    const { filters, contentType } = config

    const content = contentType?.toLowerCase() || 'tests'

    const entries = filters.reduce((a, c) => ({ ...a, ...c }), {
      removeInterestedFilters: true,
    })
    const filter = qs.stringify(entries)

    if (content === 'tests') {
      resetTestFilters()
    } else {
      resetPlaylistFilters()
    }
    history.push(`/author/${content}?${filter}`)
    showTrialSubsConfirmationAction(false)
  }

  const getSparkProductLinks = (title) => {
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
  }

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
      <MainContentWrapper padding="30px" style={{ display: 'none' }}>
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
      </MainContentWrapper>

      <ContentSection>
        <ContentCards>
          {featuresData.map((_, index) => (
            <ContentCard key={index}>
              <Img src={featuresData[index].imgSrc} />
              <h3>{featuresData[index].title}</h3>
              <FeatureDescription>
                {featuresData[index].description}
              </FeatureDescription>
            </ContentCard>
          ))}
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
          {!isPremium && (
            <HaveLicenseKey
              data-cy="subscriptionHaveLicenseKey"
              onClick={openHasLicenseKeyModal}
            >
              {/* HAVE LICENSE KEY */}
            </HaveLicenseKey>
          )}
        </ContentCards>
      </ContentSection>
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
        />
      )}
      {isConfirmationModalVisible && (
        <TrialConfirmationModal
          visible={isConfirmationModalVisible}
          showTrialSubsConfirmationAction={showTrialSubsConfirmationAction}
          showTrialConfirmationMessage={showTrialConfirmationMessage}
          trialAddOnProductIds={trialAddOnProductIds}
          collections={collections}
          products={products}
          handleGoToCollectionClick={handleGoToCollectionClick}
          history={history}
        />
      )}
      {showFeatureNotAvailableModal && (
        <FeatureNotAvailableModal
          isVisible={showFeatureNotAvailableModal}
          handleCloseModal={handleCloseFeatureNotAvailableModal}
          handleSelectStateModal={handleSelectStateModal}
        />
      )}
      <AddonSection>
        <SectionContainer>
          <SectionTitle>
            {isPremium
              ? 'Add ons for your Premium Version'
              : 'Premium add-ons to make it even better'}
          </SectionTitle>
          <SectionDescription>
            You can bundle one or more of the following add-ons to the premium
            subscription that will <br /> make it easier to deliver
            differentiated instruction and keep your students engaged.
          </SectionDescription>
          <CardContainer>
            {addonsData.map((_, index) => (
              <AddonCard key={index}>
                <AddonImg src={addonsData[index].imgSrc} />
                <h3>{addonsData[index].title}</h3>
                <AddonDescription>
                  {addonsData[index].description}
                </AddonDescription>
                <AddonFooter>
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
                </AddonFooter>
              </AddonCard>
            ))}
          </CardContainer>
        </SectionContainer>
      </AddonSection>

      <EnterpriseSection>
        <SectionTitle>Enterprise</SectionTitle>
        <SectionDescription>
          Get in-depth insights into schoolwide and districtwide progress with
          Edulastic Enterprise. Deliver common assessments, analyze the instant
          student data, and manage everything in one place. Enterprise includes
          Premium and its collaboration, accommodation, and security tools.
        </SectionDescription>
        <FlexContainer justifyContent="center" style={{ marginTop: '25px' }}>
          <EduButton
            onClick={handleSelectStateModal}
            height="38px"
            width="215px"
            isGhost
            isBlue
          >
            schedule a demo
          </EduButton>
          <a
            target="_blank"
            href="//docs.google.com/forms/d/e/1FAIpQLSeJN61M1sxuBfqt0_e-YPYYx2E0sLuSxVLGb6wZvxOIuOy1Eg/viewform?c=0&amp;w=1"
            rel="noopener noreferrer"
          >
            <EduButton height="38px" width="215px" isBlue>
              request a quote
            </EduButton>
          </a>
        </FlexContainer>
      </EnterpriseSection>
      <CalendlyScheduleModal
        visible={showSelectStates}
        setShowSelectStates={setShowSelectStates}
      />
    </>
  )
}

export default connect((state) => ({
  products: state?.subscription?.products,
}))(SubscriptionMain)
