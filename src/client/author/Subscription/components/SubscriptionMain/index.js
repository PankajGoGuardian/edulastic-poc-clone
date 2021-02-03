import React, { useState } from 'react'
import { connect } from 'react-redux'
import {
  EduButton,
  FlexContainer,
  MainContentWrapper,
  notification,
} from '@edulastic/common'
import { Link } from 'react-router-dom'
import { isBoolean } from 'lodash'
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
} from './styled'
import AuthorCompleteSignupButton from '../../../../common/components/AuthorCompleteSignupButton'
import CalendlyScheduleModal from './CalendlyScheduleModal'

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
  user,
  openPaymentServiceModal,
  openPurchaseLicenseModal,
  isPremiumTrialUsed,
  showRenewalOptions,
  startTrialAction,
  isPaidPremium,
  setShowSubscriptionAddonModalWithId,
  usedTrialItemBankId,
  products,
  hasAllPremiumProductAccess,
  itemBankSubscriptions,
  settingProductData,
  sparkMathProductId,
  sparkMathItemBankId,
  setShowItemBankTrialUsedModal,
}) => {
  const [showSelectStates, setShowSelectStates] = useState(false)
  const [isTrialModalVisible, setIsTrialModalVisible] = useState(false)

  const isPaidSparkMath =
    itemBankSubscriptions &&
    itemBankSubscriptions?.length > 0 &&
    itemBankSubscriptions?.filter((x) => {
      return x.itemBankId === sparkMathItemBankId && !x.isTrial
    })?.length

  const toggleTrialModal = (value) => setIsTrialModalVisible(value)
  const isPremiumUser = user.features.premium

  const handleSelectStateModal = () => setShowSelectStates(true)

  const handlePurchaseFlow = () => setShowSubscriptionAddonModalWithId()

  const handleStartTrial = () => {
    settingProductData()
    // NOTE: Don't set a boolean default value for 'isPremiumTrialUsed'!
    if (!isBoolean(isPremiumTrialUsed)) {
      return notification({
        type: 'warning',
        msg: 'Validating trial status, please wait...',
      })
    }

    if (usedTrialItemBankId) {
      setShowItemBankTrialUsedModal(true)
      return
    }
    setIsTrialModalVisible(true)
  }

  // Show item bank trial button when item bank trial is not used yet and user is either premium
  // or hasn't used premium trial yet.
  const hasTrialButton =
    usedTrialItemBankId !== sparkMathItemBankId &&
    !isPaidSparkMath &&
    (!isPremiumTrialUsed || isPremiumUser)

  const handleSparkMathClick = () => {
    settingProductData()
    handlePurchaseFlow()
  }

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
            {!hasAllPremiumProductAccess && (
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
                    Upgrade now $100/YR
                  </CustomButton>
                )}
                onClick={handlePurchaseFlow}
              />
            )}
            {isPaidPremium && showRenewalOptions && (
              <EduButton onClick={handlePurchaseFlow} isBlue height="38px">
                Renew Subscription
              </EduButton>
            )}
            {hasTrialButton && (
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
                onClick={handleStartTrial}
              />
            )}
          </FlexContainer>
        </ContentCards>
      </ContentSection>
      {isTrialModalVisible && (
        <TrialModal
          addOnProductIds={[sparkMathProductId]}
          isVisible={isTrialModalVisible}
          toggleModal={toggleTrialModal}
          isPremiumUser={isPremiumUser}
          isPremiumTrialUsed={isPremiumTrialUsed}
          startPremiumTrial={startTrialAction}
          products={products}
        />
      )}
      <AddonSection>
        <SectionContainer>
          <SectionTitle>
            {isPremiumUser
              ? 'Add ons for your Premium Version'
              : 'Premium addons to make it even better'}
          </SectionTitle>
          <SectionDescription>
            You can bundle one or more of the following addons to the teacher
            premium subscription that will <br /> make it easier to deliver
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
                  {addonsData[index].title === 'SparkMath' && (
                    <>
                      {!(isPaidPremium && isPaidSparkMath) && (
                        <AuthorCompleteSignupButton
                          renderButton={(handleClick) => (
                            <PurchaseLink
                              data-cy="Purchase"
                              onClick={handleClick}
                            >
                              Purchase
                            </PurchaseLink>
                          )}
                          onClick={handleSparkMathClick}
                        />
                      )}
                      {hasTrialButton && (
                        <AuthorCompleteSignupButton
                          renderButton={(handleClick) => (
                            <span data-cy="trialPurchase" onClick={handleClick}>
                              try
                            </span>
                          )}
                          onClick={handleStartTrial}
                        />
                      )}
                    </>
                  )}
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
          Teacher Premium and its collaboration, accommodation, and security
          tools.
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
