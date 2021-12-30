import { EduButton, FlexContainer } from '@edulastic/common'
import {
  IconOpenBook,
  IconPurchasedAlert,
  IconPuzzel,
  IconSchool,
  IconServers,
  IconSparkCS,
  IconSparkMath,
  IconSparkScience,
  IconSpecs,
  IconStemCross,
  IconCPM,
  IconSparkWriting,
  IconSparkBooks,
  IconSparkPhonics,
} from '@edulastic/icons'
import React, { useState, useEffect } from 'react'
import { segmentApi } from '@edulastic/api'
import CalendlyScheduleModal from './CalendlyScheduleModal'
import {
  AddonCard,
  AddonDescription,
  AddonImg,
  AddonSection,
  CardContainer,
  EnterpriseSection,
  ExpiryMsg,
  IconWrapper,
  SectionContainer,
  SectionDescription,
  SectionTitle,
  TopSection,
} from './styled'
import RequestModal from './RequestModals'

const addonsData = [
  {
    icon: <IconSparkMath />,
    title: 'SparkMath',
    description:
      'Pre-built assessments and differentiated Math practice for each student',
  },
  {
    icon: <IconOpenBook />,
    title: 'Book Buddies',
    description: 'Assessments and prompts on your favorite books',
  },
  {
    icon: <IconStemCross />,
    title: 'STEM Cross-curricular',
    description: 'Science passages with reading and science questions',
  },
  {
    icon: <IconPuzzel />,
    title: 'Phonics Practice',
    description:
      'Full year of practice assignments to help all students master each sound',
  },
  {
    icon: <IconSpecs />,
    title: 'Reading Comprehension Practice',
    description: 'Fiction and nonfiction to practice close reading',
  },
  {
    icon: <IconSparkScience />,
    title: 'SparkScience',
    description:
      'NGSS-aligned pre-built assessments and item banks for grades K-12',
  },
  {
    icon: <IconSparkCS />,
    title: 'SparkCS',
    description:
      'Full year of practice assignments to help all students master each sound',
  },
  {
    icon: <IconServers />,
    title: 'Data Warehousing',
    description:
      'Import state test scores, data from other assessments (MAP, iReady, SAT/ACT) and more for a holistic view of student performance and growth.',
  },
  {
    icon: <IconCPM />,
    title: 'CPM',
    description:
      'Pre-built, customizable assessments for each chapter of your course, from core Connections, Course 1 through Algebra 2 and Integrated 1-3',
  },
  {
    icon: <IconSparkWriting />,
    title: 'SparkWriting',
    description:
      'Practice activities for grammar, conventions, usage, and mechanics for grade 2-12',
  },
  {
    icon: <IconSparkBooks />,
    title: 'SparkBooks',
    description: 'Quizzes and activities for the books you teach',
  },
  {
    icon: <IconSparkPhonics />,
    title: 'SparkPhonics',
    description:
      'Diagnostics and weekly practice exercises to strengthen phonemic awareness for early readers',
  },
]

const EnterpriseTab = ({
  isPremium,
  subType,
  subEndDate,
  isPremiumUser,
  user,
}) => {
  const [showSelectStates, setShowSelectStates] = useState(false)
  const [showSubscriptionsForms, setShowSubscriptionsForms] = useState(false)
  const [subscriptionFormType, setSubscriptionFormType] = useState('request')

  const { utm_source, openIdProvider } = user

  const showSubscriptionFormsModal = (type = 'request') => {
    setSubscriptionFormType(type)
    setShowSubscriptionsForms(true)
    segmentApi.genericEventTrack(`${type}FormButtonClick`, {})
  }

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://js.hsforms.net/forms/v2.js'
    document.body.appendChild(script)
  }, [])

  const isExternalPublisher =
    utm_source === 'singapore' || openIdProvider === 'CLI'

  const filteredAddonsData = isExternalPublisher
    ? addonsData.filter((x) => x.title !== 'SparkMath')
    : addonsData

  return (
    <SectionContainer>
      <RequestModal
        showSubscriptionsForms={showSubscriptionsForms}
        setShowSubscriptionsForms={setShowSubscriptionsForms}
        formType={subscriptionFormType}
      />
      <TopSection>
        <h1>Edulastic Enterprise & Add-ons to supercharge instruction.</h1>
        <p>
          Upgrade your subscription to Teacher Premium or school or district
          Enterprise for additional features, and add on subject-specific <br />
          content bundles that you will love.
        </p>
      </TopSection>
      <EnterpriseSection data-cy="enterpriseCard">
        <FlexContainer justifyContent="flex-start" alignItems="flex-start">
          <IconWrapper>
            <IconSchool />
          </IconWrapper>
          <div>
            <SectionTitle>
              Enterprise for Districts or Schools
              {subType === 'enterprise' && (
                <ExpiryMsg data-cy="enterpriseAlertMsg">
                  <IconPurchasedAlert />
                  <span>
                    purchased - EXPIRES {new Date(subEndDate).toDateString()}
                  </span>
                </ExpiryMsg>
              )}
            </SectionTitle>
            <SectionDescription>
              Get in-depth insights into schoolwide and districtwide progress
              with Edulastic Enterprise. Deliver common assessments, analyze the
              instant student data, and manage everything in one place.
              Enterprise includes Premium and its collaboration, accommodation,
              and security tools.
            </SectionDescription>
          </div>
        </FlexContainer>
        {!(
          ['partial_premium', 'enterprise'].includes(subType) && isPremiumUser
        ) && (
          <FlexContainer flexDirection="column" justifyContent="center">
            <EduButton
              data-cy="requestQuote"
              style={{ margin: '10px 0px' }}
              onClick={() => showSubscriptionFormsModal('request')}
              height="32px"
              width="180px"
              isBlue
            >
              request a quote
            </EduButton>
            <EduButton
              onClick={() => showSubscriptionFormsModal('demo')}
              height="32px"
              width="180px"
              isGhost
              isBlue
              data-cy="scheduleDemo"
              style={{ margin: '0px' }}
            >
              schedule a demo
            </EduButton>
          </FlexContainer>
        )}
      </EnterpriseSection>
      <AddonSection>
        <SectionTitle>
          {isPremium
            ? 'Add ons for your Premium Version'
            : 'Premium add-ons to make it even better'}
        </SectionTitle>
        <SectionDescription>
          Add on modules make it easier to deliver differentiated instruction
          and pull all of your data into <br /> one place for a holistic view of
          student understanding and growth.
        </SectionDescription>
        <CardContainer>
          {filteredAddonsData.map((x, index) => (
            <AddonCard key={index}>
              <AddonImg>{x.icon}</AddonImg>
              <h3>{x.title}</h3>
              <AddonDescription>{x.description}</AddonDescription>
            </AddonCard>
          ))}
        </CardContainer>
      </AddonSection>

      <CalendlyScheduleModal
        visible={showSelectStates}
        setShowSelectStates={setShowSelectStates}
      />
    </SectionContainer>
  )
}

export default EnterpriseTab
