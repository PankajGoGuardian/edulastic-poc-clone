import { EduButton, FlexContainer } from '@edulastic/common'
import { IconSchool } from '@edulastic/icons'
import React from 'react'
import {
  CardDetails,
  CardRightWrapper,
  CardsSection,
  GradeWrapper,
  IconWrapper,
  OtherFilters,
  Price,
  SectionDescription,
  SectionTitle,
} from './styled'

const TeacherPremiumCard = () => {
  return (
    <CardsSection>
      <FlexContainer justifyContent="flex-start" alignItems="flex-start">
        <IconWrapper>
          <IconSchool />
        </IconWrapper>
        <div>
          <SectionTitle>Teacher Premium</SectionTitle>
          <CardDetails>
            <GradeWrapper>Grades 6-8</GradeWrapper>
            <OtherFilters>
              ELA & ELL, Social Studies, World Languages
            </OtherFilters>
          </CardDetails>
          <SectionDescription>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean non
            ante fermentum, bibendum ex ut, tincidunt diam, bibendum ex ut,
            tincidunt diam.
          </SectionDescription>
        </div>
      </FlexContainer>
      <CardRightWrapper flexDirection="column" justifyContent="center">
        <Price>
          <span>$ 100</span> per Teacher
        </Price>
        <EduButton height="32px" width="180px" data-cy="addToCart">
          Add to Cart
        </EduButton>
        <EduButton height="32px" width="180px" isBlue data-cy="LearnMore">
          Learn More
        </EduButton>
        <EduButton
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
  )
}

export default TeacherPremiumCard
