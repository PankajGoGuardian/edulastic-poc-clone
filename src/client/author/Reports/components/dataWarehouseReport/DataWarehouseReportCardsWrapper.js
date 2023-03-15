import React from 'react'
import styled from 'styled-components'

import {
  IconWholeLearnerReport,
  IconMultipleAssessmentReportDW,
  IconSingleAssessmentReportDW,
  IconPreVsPostTestComparisonReport,
} from '@edulastic/icons'
import ReportLinkCard from './common/components/ReportLinkCard'
import MoreReportsContainer from './common/components/MoreReportsContainer'
import {
  DW_MAR_REPORT_URL,
  DW_WLR_REPORT_URL,
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
        IconThumbnail={IconSingleAssessmentReportDW}
        title="Single Assessment Report"
        description="Compare students' performance on a single assessment"
        url="/author/reports/single-assessment-report-dw"
        loc={loc}
      />
      <ReportLinkCard
        IconThumbnail={IconPreVsPostTestComparisonReport}
        title="Pre vs Post Test Comparison"
        description="This report shows the level of improvement of student cohorts between a pre-instructional assessment and a post-instructional assessment"
        url="/author/reports/pre-vs-post-test-comparison"
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
