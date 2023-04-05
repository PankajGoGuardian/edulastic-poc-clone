import React from 'react'
import styled from 'styled-components'

import {
  IconWholeLearnerReport,
  IconMultipleAssessmentReportDW,
  IconDashboardReport,
  IconAttendanceSummaryReport,
  IconSurveyInsightsReport,
  IconGoalsAndInterventionsReport,
  IconEarlyWarningReport,
  IconEfficacyReport,
} from '@edulastic/icons'
import { greyThemeDark3 } from '@edulastic/colors'
import ReportLinkCard from './common/components/ReportLinkCard'
// import MoreReportsContainer from './common/components/MoreReportsContainer'
import {
  DW_MAR_REPORT_URL,
  DW_WLR_REPORT_URL,
  DW_DASHBOARD_REPORT_URL,
  DW_ATTENDANCE_REPORT_URL,
  DW_EARLY_WARNING_REPORT_URL,
  DW_EFFICACY_REPORT_URL,
  DW_SURVEY_INSIGHTS_URL,
  DW_GOALS_AND_INTERVENTIONS_URL,
} from '../../common/constants/dataWarehouseReports'

const DataWarehoureReportCardsWrapper = ({ loc }) => {
  return (
    <>
      <div>
        <StyledSectionHeader>Academic Reports</StyledSectionHeader>
        <SectionContent>
          <ReportLinkCard
            IconThumbnail={IconDashboardReport}
            title="Dashboard"
            description="View key health checks for students' performance. Drill down to analyze and intervene."
            url={DW_DASHBOARD_REPORT_URL}
            loc={loc}
          />
          <ReportLinkCard
            IconThumbnail={IconMultipleAssessmentReportDW}
            title="Performance Trends"
            description="View whether the student's performance is improving over time &amp; take necessary interventions."
            url={DW_MAR_REPORT_URL}
            loc={loc}
          />
          <ReportLinkCard
            IconThumbnail={IconWholeLearnerReport}
            title="Whole Learner"
            description="Get a complete understanding of a learner's academic &amp; associated indicators &amp; take necessary actions for the learner’s growth."
            url={DW_WLR_REPORT_URL}
            loc={loc}
          />
        </SectionContent>
      </div>
      <div>
        <StyledSectionHeader>Non-Academic Reports</StyledSectionHeader>
        <SectionContent>
          <ReportLinkCard
            IconThumbnail={IconAttendanceSummaryReport}
            title="Attendance"
            description="Monitor attendance and tardies, identify students at risk of chronic absenteeism, and intervene."
            url={DW_ATTENDANCE_REPORT_URL}
            loc={loc}
          />
          <ReportLinkCard
            IconThumbnail={IconSurveyInsightsReport}
            title="Survey Insights"
            description="Get Insights into student's responses to Skill Surveys and view competency trends."
            url={DW_SURVEY_INSIGHTS_URL}
            loc={loc}
          />
        </SectionContent>
      </div>
      <div>
        <StyledSectionHeader>Goals And Interventions</StyledSectionHeader>
        <SectionContent>
          <ReportLinkCard
            IconThumbnail={IconGoalsAndInterventionsReport}
            title="Set Goals & Interventions"
            description="Set Goals and Interventions and track improvement."
            url={DW_GOALS_AND_INTERVENTIONS_URL}
            loc={loc}
          />
          <ReportLinkCard
            IconThumbnail={IconEarlyWarningReport}
            title="Early Warning"
            description="View students at risk based on their academic and attendance performance and plan interventions."
            url={DW_EARLY_WARNING_REPORT_URL}
            loc={loc}
          />
          <ReportLinkCard
            IconThumbnail={IconEfficacyReport}
            title="Efficacy"
            description="Compare student performance across tests pre and post-intervention."
            url={DW_EFFICACY_REPORT_URL}
            loc={loc}
          />
        </SectionContent>
      </div>
      {/* <MoreReportsContainer /> */}
    </>
  )
}

const SectionContent = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const StyledSectionHeader = styled.div`
  display: block;
  font-weight: bold;
  font-size: 18px;
  margin: 20px;
  color: ${greyThemeDark3};
`

export default DataWarehoureReportCardsWrapper
