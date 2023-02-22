import React from 'react'
import styled from 'styled-components'

import {
  IconWholeLearnerReport,
  IconMultipleAssessmentReportDW,
} from '@edulastic/icons'
import ReportLinkCard from './common/components/ReportLinkCard'
import MoreReportsContainer from './common/components/MoreReportsContainer'
import {
  DW_MAR_REPORT_URL,
  DW_WLR_REPORT_URL,
  ATTENDANCE_SUMMARY_REPORT_URL,
} from '../../common/constants/dataWarehouseReports'

const DataWarehoureReportCardsWrapper = ({ loc }) => {
  return (
    <StyledCardsContainer>
      <ReportLinkCard
        IconThumbnail={IconMultipleAssessmentReportDW}
        title="Multiple Assessment Report"
        description="Compare the aggregate performance of students across various assessments "
        url={DW_MAR_REPORT_URL}
        loc={loc}
      />
      <ReportLinkCard
        IconThumbnail={IconWholeLearnerReport}
        title="Whole Learner Report"
        description="See the performance of a particular student accross Edulastic &amp; external tests"
        url={DW_WLR_REPORT_URL}
        loc={loc}
      />
       <ReportLinkCard
        IconThumbnail={IconWholeLearnerReport}
        title="Attendance Summary"
        description="Monitor attendance and tardies, identify students at risk of chronic absenteeism and intervene."
        url={ATTENDANCE_SUMMARY_REPORT_URL}
        loc={loc}
      />
      <MoreReportsContainer />
    </StyledCardsContainer>
  )
}

const StyledCardsContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
`

export default DataWarehoureReportCardsWrapper
