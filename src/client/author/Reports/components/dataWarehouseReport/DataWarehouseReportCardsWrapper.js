import React from 'react'
import {
  IconWholeLearnerReport,
  IconMultipleAssessmentReportDW,
  IconAttendanceReport,
  IconDashboardReport,
  IconEarlyWarningReport,
  IconSetGoals,
} from '@edulastic/icons'
import { Row } from 'antd'
import ReportLinkCard from './common/components/ReportLinkCard'
import {
  DW_ATTENDANCE_REPORT_URL,
  DW_EARLY_WARNING_REPORT_URL,
  DW_MAR_REPORT_URL,
  DW_WLR_REPORT_URL,
  DW_DASHBOARD_URL,
  DW_GOALS_AND_INTERVENTIONS_URL,
} from '../../common/constants/dataWarehouseReports'
import { StyledSectionHeader } from '../../common/styled'

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
        url: DW_GOALS_AND_INTERVENTIONS_URL,
      },
      {
        id: 2,
        IconThumbnail: IconEarlyWarningReport,
        title: 'Early Warning',
        description:
          'View students at risk based on their academic and attendance performance and plan interventions.',
        url: DW_EARLY_WARNING_REPORT_URL,
      },
    ],
  },
]

const DataWarehoureReportCardsWrapper = ({ loc }) => {
  return (
    <>
      {reports.map((item) => (
        <div>
          <StyledSectionHeader>{item.title}</StyledSectionHeader>
          <Row type="flex">
            {item.cards.map((card) => (
              <ReportLinkCard {...card} loc={loc} />
            ))}
          </Row>
        </div>
      ))}
    </>
  )
}

export default DataWarehoureReportCardsWrapper
