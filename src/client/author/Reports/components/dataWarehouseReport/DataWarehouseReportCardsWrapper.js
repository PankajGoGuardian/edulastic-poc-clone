import React from 'react'
import styled from 'styled-components'

import {
  IconWholeStudentReport,
  IconMultipleAssessmentReportDW,
} from '@edulastic/icons'
import ReportLinkCard from './common/components/ReportLinkCard'
import MoreReportsContainer from './common/components/MoreReportsContainer'

const DW_MAR_REPORT_URL = '/author/reports/multiple-assessment-report-dw'
const DW_WSR_REPORT_URL = '/author/reports/whole-student-report/student/'

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
        IconThumbnail={IconWholeStudentReport}
        title="Whole Student Report"
        description="See the performance of a particular student accross Edulastic &amp; external tests"
        url={DW_WSR_REPORT_URL}
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
