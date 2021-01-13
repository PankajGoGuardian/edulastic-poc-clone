import React, { useState } from 'react'
import {
  EduButton,
  FlexContainer,
  MainContentWrapper,
  notification,
} from '@edulastic/common'
import { isBoolean } from 'lodash'
import { Link } from 'react-router-dom'
import StartTrialModal from './StartTrialModal'

// TODO: Update SVG imports here
import IMG1 from '../../static/1.png'
import IMG2 from '../../static/2.png'
import IMG3 from '../../static/3.png'

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
  CurrentPlanContainer,
  FeatureDescription,
  Img,
  PlanDetails,
  PlanImage,
  PlansContainer,
  PlanStatus,
  StyledLink,
  StyledParagraph,
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
  HaveLicenseKey,
} from './styled'
import AuthorCompleteSignupButton from '../../../../common/components/AuthorCompleteSignupButton'
import CalendlyScheduleModal from './CalendlyScheduleModal'

const getUpgradeToTeacherPlanActions = ({
  openPaymentServiceModal,
  openHasLicenseKeyModal,
  isblur,
}) => (
  <ActionsWrapper>
    <AuthorCompleteSignupButton
      renderButton={(handleClick) => (
        <EduButton height="40px" onClick={handleClick} disabled={isblur}>
          UPGRADE NOW FOR $100/YEAR
        </EduButton>
      )}
      onClick={openPaymentServiceModal}
    />
    <EduButton
      isGhost
      height="40px"
      onClick={openHasLicenseKeyModal}
      disabled={isblur}
    >
      ALREADY HAVE A LICENSE KEY
    </EduButton>
  </ActionsWrapper>
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

const getEnterprisePlanActions = () => (
  <ActionsWrapper>
    <EduButton height="40px" isGhost>
      REQUEST A QUOTE
    </EduButton>
  </ActionsWrapper>
)

const availablePlans = [
  {
    imgSrc: IMG1,
    title: 'Upgrade to Teacher Premium',
    description:
      'Get Additional reports, options to assist students collaborate with collegues, anti-cheating tools and more.',
    getActionsComp: getUpgradeToTeacherPlanActions,
  },
  {
    imgSrc: IMG2,
    title: 'Upgrade Multiple Users to Premium',
    description:
      'Administer common assesement, get immediate school or district-wide reports, and enable premium access for all teachers in your school or district.',
    getActionsComp: getUpgradeToMultipleUsersPlanAction,
  },
  {
    imgSrc: IMG3,
    title: 'Edulastic Enterprise',
    description:
      'Administer common assesement, get immediate school or district-wide reports, and enable premium access for all teachers in your school or district.',
    getActionsComp: getEnterprisePlanActions,
  },
]

const featuresData = [
  {
    imgSrc: IMG4,
    title: 'Text-to-speech',
    description: 'Text to Speech (Read Aloud) for students',
  },
  {
    imgSrc: IMG5,
    title: 'Test Security Settings',
    description: 'Shuffle questions, hide correct answers, etc.',
  },
  {
    imgSrc: IMG6,
    title: 'Advanced Authoring',
    description: 'Options, dynamic parameters, rubric support',
  },
  {
    imgSrc: IMG7,
    title: 'In-depth reports',
    description: 'Lorem ipsum dolor sit amet? lorem ipsum.',
  },
  {
    imgSrc: IMG8,
    title: 'Playlists',
    description: 'Lorem ipsum dolor sit amet? lorem ipsum.',
  },
  {
    imgSrc: IMG9,
    title: 'Collaboration & Engagement',
    description: 'Co-author, sharing, presentation mode',
  },
  {
    imgSrc: IMG10,
    title: 'Student Groups',
    description: 'Lorem ipsum dolor sit amet? lorem ipsum.',
  },
  {
    imgSrc: IMG11,
    title: 'Parent Portal',
    description: 'Lorem ipsum dolor sit amet? lorem ipsum.',
  },
]

const addonsData = [
  {
    imgSrc: IMG12,
    title: 'SparkMath',
    description:
      'Pre-built assessments and differentiated Math practice for each student',
  },
  {
    imgSrc: IMG13,
    title: 'Book Buddies',
    description: 'Assessments and prompts on your favorite books',
  },
  {
    imgSrc: IMG14,
    title: 'STEM Cross-curricular',
    description: 'Science passages with reading and science questions',
  },
  {
    imgSrc: IMG15,
    title: 'Phonics Practice',
    description:
      'Full year of practice assignments to help all students master each sound',
  },
  {
    imgSrc: IMG16,
    title: 'Reading Comprehension Practice',
    description: 'Fiction and nonfiction to practice close reading',
  },
  {
    imgSrc: IMG12,
    title: 'SparkScience',
    description:
      'NGSS-aligned pre-built assessments and item banks for grades K-12',
  },
]

const PlansComponent = ({
  imgSrc,
  title,
  description,
  getActionsComp,
  isblur,
  openPaymentServiceModal,
  openHasLicenseKeyModal,
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
      openHasLicenseKeyModal,
      openPurchaseLicenseModal,
      isblur,
    })}
  </PlansContainer>
)

function formatDate(subEndDate) {
  if (!subEndDate) return null
  const date = new Date(subEndDate).toString().split(' ')
  return `${date[2]} ${date[1]}, ${date[3]}`
}

const SubscriptionMain = (props) => {
  const {
    isSubscribed = false,
    subEndDate,
    openPaymentServiceModal,
    openHasLicenseKeyModal,
    openPurchaseLicenseModal,
    subType,
    setShowUpgradeModal,
    isPremiumTrialUsed,
    startTrialAction,
  } = props

  const licenseExpiryDate = formatDate(subEndDate)

  const [showPlans, setShowPlans] = useState(false)
  const [showTrialModal, setShowTrialModal] = useState(false)
  const [showSelectStates, setShowSelectStates] = useState(false)

  const handleSelectStateModal = () => {
    setShowSelectStates(true)
  }

  const handleUpgradeModal = () => {
    setShowUpgradeModal(true)
  }

  const handleStartTrial = () => {
    // NOTE: Don't set a boolean default value for 'isPremiumTrialUsed'!
    if (!isBoolean(isPremiumTrialUsed)) {
      return notification({
        type: 'warning',
        msg: 'Validating trial status, please wait...',
      })
    }
    if (isPremiumTrialUsed) {
      return notification({
        type: 'warning',
        msg: 'You have already used up the trial !',
      })
    }
    startTrialAction()
    // setShowSelectStates(true)
  }

  return (
    <>
      <MainContentWrapper padding="30px" style={{ display: 'none' }}>
        <CurrentPlanContainer onClick={() => setShowPlans(false)}>
          <PlanStatus>
            {isSubscribed && licenseExpiryDate ? (
              <p>
                Expires on: <StyledLink>{licenseExpiryDate}</StyledLink>
              </p>
            ) : (
              <StyledLink>Free Forever</StyledLink>
            )}
          </PlanStatus>
        </CurrentPlanContainer>

        {!showPlans && (
          <>
            {subType !== 'enterprise' && (
              <StyledParagraph isSubscribed={isSubscribed}>
                interested in buying multiple teacher premium subscriptions or
                upgrading to enterprise?
                {/* <StyledLink onClick={() => setShowPlans(true)}> click here.</StyledLink> */}
                <a
                  href="https://edulastic.com/teacher-premium/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {' '}
                  click here.
                </a>
              </StyledParagraph>
            )}
          </>
        )}
        {showPlans && (
          <AvailablePlansContainer>
            {availablePlans.map((plan, index) => (
              <PlansComponent
                key={index}
                isblur={isSubscribed && index === 0}
                openPaymentServiceModal={openPaymentServiceModal}
                openHasLicenseKeyModal={openHasLicenseKeyModal}
                openPurchaseLicenseModal={openPurchaseLicenseModal}
                {...plan}
              />
            ))}
          </AvailablePlansContainer>
        )}
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
            {subType !== 'enterprise' && (
              <AuthorCompleteSignupButton
                renderButton={(handleClick) => (
                  <EduButton
                    height="38px"
                    width="215px"
                    isBlue
                    onClick={handleClick}
                    style={{
                      background: 'transparent',
                      borderColor: 'white',
                    }}
                  >
                    Upgrade now $100/YR
                  </EduButton>
                )}
                onClick={handleUpgradeModal}
              />
            )}
            <EduButton
              height="38px"
              width="215px"
              isGhost
              isBlue
              onClick={handleStartTrial}
              style={{
                borderColor: 'white',
              }}
            >
              Start a trial
            </EduButton>
          </FlexContainer>
          <HaveLicenseKey onClick={openHasLicenseKeyModal}>
            HAVE LICENSE KEY
          </HaveLicenseKey>
        </ContentCards>
      </ContentSection>
      <StartTrialModal
        visible={showTrialModal}
        setShowModal={setShowTrialModal}
      />

      <AddonSection>
        <SectionContainer>
          <SectionTitle>Premium addons to make it even better</SectionTitle>
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
              </AddonCard>
            ))}
          </CardContainer>
        </SectionContainer>
      </AddonSection>

      <EnterpriseSection>
        <SectionTitle>Enterprise</SectionTitle>
        <SectionDescription>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
          sollicitudin tincidunt tempus. <br /> Pellentesque auctor eros et
          metus condimentum aliquet.
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

export default SubscriptionMain
