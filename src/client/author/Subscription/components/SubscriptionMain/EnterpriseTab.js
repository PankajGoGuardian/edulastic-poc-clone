import { EduButton, FlexContainer } from '@edulastic/common'
import React, { useState } from 'react'
import IMG13 from '../../static/book-buddies.svg'
import IMG15 from '../../static/phonics-practice.svg'
import IMG16 from '../../static/reading-comprehension-practice.svg'
import IMG12 from '../../static/spark.svg'
import IMG14 from '../../static/stem-cross-curricular.svg'
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
} from './styled'

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
  {
    imgSrc: IMG12,
    title: 'SparkCS',
    description:
      'Full year of practice assignments to help all students master each sound',
  },
  {
    imgSrc: IMG12,
    title: 'Lorem Ipsum',
    description:
      'Import state test scores, data from other assessments (MAP, iReady, SAT/ACT) and more for a holistic view of student performance and growth.',
  },
]

const EnterpriseTab = ({ isPremium, subType }) => {
  const [showSelectStates, setShowSelectStates] = useState(false)

  const handleSelectStateModal = () => setShowSelectStates(true)

  return (
    <SectionContainer>
      {subType !== 'enterprise' && (
        <EnterpriseSection>
          <IconWrapper />
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
          <FlexContainer flexDirection="column" justifyContent="center">
            <a
              data-cy="requestQuote"
              target="_blank"
              href="//docs.google.com/forms/d/e/1FAIpQLSeJN61M1sxuBfqt0_e-YPYYx2E0sLuSxVLGb6wZvxOIuOy1Eg/viewform?c=0&amp;w=1"
              rel="noopener noreferrer"
              style={{ margin: '10px 0px' }}
            >
              <EduButton height="32px" width="180px" isBlue>
                request a quote
              </EduButton>
            </a>
            <EduButton
              onClick={handleSelectStateModal}
              height="32px"
              width="180px"
              isGhost
              isBlue
              data-cy="scheduleDemo"
            >
              schedule a demo
            </EduButton>
          </FlexContainer>
        </EnterpriseSection>
      )}
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
              <AddonImg src={addonsData[index].imgSrc} />
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
