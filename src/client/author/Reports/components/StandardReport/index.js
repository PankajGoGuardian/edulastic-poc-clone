import React from 'react'
import styled from 'styled-components'

import { MultipleAssessmentReport } from '../multipleAssessmentReport'
import { SingleAssessmentReport } from '../singleAssessmentReport'
import StandardsMasteryReport from '../standardsMasteryReport'
import { StudentProfileReport } from '../studentProfileReport'
import { SubscriptionReport } from '../subscriptionReport'
import { EngagementReport } from '../engagementReport'
import NonAcademicReport from '../nonAcademicReport'
// import SearchBox from "./SearchBox";
import {
  StandardReportWrapper,
  StyledCard,
  StyledContainer,
  ReportCardsWrapper,
} from './styled'

const StandardReport = ({ premium, isAdmin, loc }) => (
  <StandardReportWrapper>
    {!premium && (
      <NonPremiumBar>we give access to only one report now</NonPremiumBar>
    )}
    {/* <SearchBox /> */}
    <StyledContainer premium={premium}>
      <ReportCardsWrapper>
        <StyledCard className="single-assessment-reports report">
          <SingleAssessmentReport premium={premium} loc={loc} />
        </StyledCard>

        <StyledCard className="multiple-assessment-reports report">
          <MultipleAssessmentReport premium={premium} loc={loc} />
        </StyledCard>

        <StyledCard className="standards-mastery-reports report">
          <StandardsMasteryReport premium={premium} loc={loc} />
        </StyledCard>

        <StyledCard className="student-profile-reports report">
          <StudentProfileReport premium={premium} loc={loc} />
        </StyledCard>

        {isAdmin && (
          <StyledCard className="engagement-reports report">
            <EngagementReport premium={premium} loc={loc} />
          </StyledCard>
        )}

        <StyledCard className="non-academic-reports report">
          <NonAcademicReport premium={premium} loc={loc} />
        </StyledCard>
      </ReportCardsWrapper>
      {!premium && (
        <StyledCard
          style={{ width: 412, flexShrink: 0, border: 0 }}
          className="upgrade subscription report"
        >
          <SubscriptionReport premium={premium} />
        </StyledCard>
      )}
    </StyledContainer>
  </StandardReportWrapper>
)
export default StandardReport

const NonPremiumBar = styled.div`
  position: absolute;
  height: 30px;
  background: #30404f;
  color: white;
  border-radius: 4px;
  padding: 8px 28px;
  text-transform: uppercase;
  width: 100%;
  font-size: 10px;
  font-weight: 600;
  z-index: 1;
  top: -20px;
`
