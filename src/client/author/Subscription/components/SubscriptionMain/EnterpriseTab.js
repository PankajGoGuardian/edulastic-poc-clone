import { EduButton, FlexContainer } from '@edulastic/common'
import {
  IconOpenBook,
  IconPuzzel,
  IconSchool,
  IconServers,
  IconSparkCS,
  IconSparkMath,
  IconSparkScience,
  IconSpecs,
  IconStemCross,
} from '@edulastic/icons'
import React, { useState } from 'react'
import CalendlyScheduleModal from './CalendlyScheduleModal'
import {
  AddonCard,
  AddonDescription,
  AddonImg,
  AddonSection,
  CardContainer,
  EnterpriseSection,
  IconWrapper,
  SectionContainer,
  SectionDescription,
  SectionTitle,
  TopSection,
} from './styled'

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
    title: 'Lorem Ipsum',
    description:
      'Import state test scores, data from other assessments (MAP, iReady, SAT/ACT) and more for a holistic view of student performance and growth.',
  },
]

const EnterpriseTab = ({ isPremium, subType, requestQuote }) => {
  const [showSelectStates, setShowSelectStates] = useState(false)

  const handleSelectStateModal = () => setShowSelectStates(true)

  return (
    <SectionContainer>
      <TopSection>
        <h1>Edulastic Enterprise & Add-ons to supercharge instruction.</h1>
        <p>
          Upgrade your subscription to Teacher Premium or school or district
          Enterprise for additional features, and add on subject-specific <br />
          content bundles that you will love.
        </p>
      </TopSection>
      <EnterpriseSection>
        <FlexContainer justifyContent="flex-start" alignItems="flex-start">
          <IconWrapper>
            <IconSchool />
          </IconWrapper>
          <div>
            <SectionTitle>Enterprise for Districts or Schools</SectionTitle>
            <SectionDescription>
              Get in-depth insights into schoolwide and districtwide progress
              with Edulastic Enterprise. Deliver common assessments, analyze the
              instant student data, and manage everything in one place.
              Enterprise includes Premium and its collaboration, accommodation,
              and security tools.
            </SectionDescription>
          </div>
        </FlexContainer>
        <FlexContainer flexDirection="column" justifyContent="center">
          <EduButton
            data-cy="requestQuote"
            style={{ margin: '10px 0px' }}
            onClick={requestQuote}
            height="32px"
            width="180px"
            isBlue
          >
            request a quote
          </EduButton>
          <EduButton
            onClick={handleSelectStateModal}
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
          {addonsData.map((_, index) => (
            <AddonCard key={index}>
              <AddonImg>{addonsData[index].icon}</AddonImg>
              <h3>{addonsData[index].title}</h3>
              <AddonDescription>
                {addonsData[index].description}
              </AddonDescription>
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
