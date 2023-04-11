import React from 'react'
import styled from 'styled-components'
import { greyThemeDark3 } from '@edulastic/colors'
import {
  IconWholeLearnerReport,
  IconMultipleAssessmentReportDW,
  IconAttendanceReport,
  IconDashboardReport,
  IconSetGoals,
  IconSurveyInsights,
  IconEarlyWarning,
  IconEfficacy,
} from '@edulastic/icons'
import ReportLinkCard from './common/components/ReportLinkCard'
// import MoreReportsContainer from './common/components/MoreReportsContainer'
import {
  DW_ATTENDANCE_REPORT_URL,
  DW_MAR_REPORT_URL,
  DW_WLR_REPORT_URL,
  DW_DASHBOARD_URL,
} from '../../common/constants/dataWarehouseReports'

const reports = [
  {
    id: 1,
    title: 'Academic Reports',
    cards: [
      {
        id: 1,
        IconThumbnail: IconDashboardReport,
        title: 'Dashboard',
        description:
          "View key health checks for students' performance. Drill down to analyze and intervene.",
        url: DW_DASHBOARD_URL,
      },
      {
        id: 2,
        IconThumbnail: IconMultipleAssessmentReportDW,
        title: 'Performance Trends',
        description:
          "View whether the student's performance is improving over time &amp; take necessary interventions.",
        url: DW_MAR_REPORT_URL,
      },
      {
        id: 3,
        IconThumbnail: IconWholeLearnerReport,
        title: 'Whole Learner',
        description:
          "Get a complete understanding of a learner's academic &amp; associated indicators &amp; take necessary actions for the learner’s growth.",
        url: DW_WLR_REPORT_URL,
      },
    ],
  },
  {
    id: 2,
    title: 'Non-Academic Reports',
    cards: [
      {
        id: 1,
        IconThumbnail: IconAttendanceReport,
        title: 'Attendance Summary',
        description:
          'Monitor attendance and tardies, identify students at risk of chronic absenteeism, and intervene.',
        url: DW_ATTENDANCE_REPORT_URL,
      },
      {
        id: 2,
        IconThumbnail: IconSurveyInsights,
        title: 'Survey Insights',
        description:
          'Get insights into student’s responses to Skill Surveys and view competency trends.',
        url: DW_MAR_REPORT_URL,
      },
    ],
  },
  {
    id: 3,
    title: 'Goals and Interventions',
    cards: [
      {
        id: 1,
        IconThumbnail: IconSetGoals,
        title: 'Set Goals & Interventions',
        description: 'Set Goals and Interventions and track improvement.',
        url: DW_DASHBOARD_URL,
      },
      {
        id: 2,
        IconThumbnail: IconEarlyWarning,
        title: 'Early Warning',
        description:
          'View students at risk based on their academic and attendance performance and plan interventions.',
        url: DW_MAR_REPORT_URL,
      },
      {
        id: 3,
        IconThumbnail: IconEfficacy,
        title: 'Efficacy',
        description:
          'Compare student performance across tests pre and post-intervention.',
        url: DW_WLR_REPORT_URL,
      },
    ],
  },
]

const DataWarehoureReportCardsWrapper = ({ loc }) => {
  return (
    <Container>
      {reports.map((item) => (
        <div>
          <h2>{item.title}</h2>
          <StyledCardsContainer>
            {item.cards.map((card) => (
              <ReportLinkCard {...card} loc={loc} />
            ))}
          </StyledCardsContainer>
        </div>
      ))}
    </Container>
  )
}

const Container = styled.div`
  h2 {
    margin-bottom: 20px;
    margin-top: 20px;
    font-weight: bold;
    color: ${greyThemeDark3};
  }
`

const StyledCardsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 42px;
`

export default DataWarehoureReportCardsWrapper
