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
} from '../../common/constants/dataWarehouseReports'

const DataWarehoureReportCardsWrapper = ({ loc }) => {
  return (
    <StyledCardsContainer>
      <ReportLinkCard
        IconThumbnail={IconMultipleAssessmentReportDW}
        title="Performance Trends"
        description="View whether the student's performance is improving over time &amp; take necessary interventions"
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
      <MoreReportsContainer />
    </StyledCardsContainer>
  )
}

const StyledCardsContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
`

export default DataWarehoureReportCardsWrapper
