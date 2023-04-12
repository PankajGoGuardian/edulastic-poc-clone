import React from 'react'

import {
  IconWholeLearnerReport,
  IconMultipleAssessmentReportDW,
  IconAttendanceReport,
  IconDashboardReport,
  IconEarlyWarningReport,
} from '@edulastic/icons'
import { Row } from 'antd'
import ReportLinkCard from './common/components/ReportLinkCard'
import {
  DW_ATTENDANCE_REPORT_URL,
  DW_EARLY_WARNING_REPORT_URL,
  DW_MAR_REPORT_URL,
  DW_WLR_REPORT_URL,
  DW_DASHBOARD_URL,
} from '../../common/constants/dataWarehouseReports'
import { StyledSectionHeader } from '../../common/styled'

const DataWarehoureReportCardsWrapper = ({ loc }) => {
  return (
    <>
      <div>
        <StyledSectionHeader>Academic Reports</StyledSectionHeader>
        <Row type="flex">
          <ReportLinkCard
            IconThumbnail={IconDashboardReport}
            title="Dashboard"
            description="View key health checks for students' performance. Drill down to analyze and intervene."
            url={DW_DASHBOARD_URL}
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
        </Row>
      </div>
      <div>
        <StyledSectionHeader>Non-Academic Reports</StyledSectionHeader>
        <Row type="flex">
          <ReportLinkCard
            IconThumbnail={IconAttendanceReport}
            title="Attendance Summary"
            description="Monitor attendance and tardies, identify students at risk of chronic absenteeism, and intervene."
            url={DW_ATTENDANCE_REPORT_URL}
            loc={loc}
          />
        </Row>
      </div>
      <div>
        <StyledSectionHeader>Goals And Interventions</StyledSectionHeader>
        <Row type="flex">
          <ReportLinkCard
            IconThumbnail={IconEarlyWarningReport}
            title="Early Warning"
            description="View students at risk based on their academic and attendance performance and plan interventions."
            url={DW_EARLY_WARNING_REPORT_URL}
            loc={loc}
          />
        </Row>
      </div>
    </>
  )
}

export default DataWarehoureReportCardsWrapper
