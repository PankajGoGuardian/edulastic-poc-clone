import React from 'react'
import styled from 'styled-components'

import {
  IconWholeChildReport,
  IconMultipleAssessmentReportDW,
  IconSingleAssessmentReportDW,
  IconPreVsPostTestComparisonReport,
} from '@edulastic/icons'
import FeaturesSwitch from '../../../../features/components/FeaturesSwitch'
import { SubHeader } from '../../common/components/Header'
import MoreReportsContainer from './common/components/MoreReportsContainer'
import ReportLinkCard from './common/components/ReportLinkCard'

const DataWarehouseReports = ({ breadcrumbData, isCliUser, loc }) => {
  return (
    <>
      <SubHeader breadcrumbData={breadcrumbData} isCliUser={isCliUser} />
      <FeaturesSwitch
        inputFeatures="dataWarehouseReports"
        actionOnInaccessible="hidden"
      >
        <StyledCardsContainer>
          <ReportLinkCard
            IconThumbnail={IconWholeChildReport}
            title="Whole Child Report"
            description="See the performance of a particular student accross Edulastic &amp; external tests"
            url="/author/reports/whole-child-report/student/"
            loc={loc}
          />
          <ReportLinkCard
            IconThumbnail={IconMultipleAssessmentReportDW}
            title="Multiple Assessment Report"
            description="Compare the aggregate performance of students across various assessments "
            url="/author/reports/multiple-assessment-report-dw"
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
      </FeaturesSwitch>
    </>
  )
}

const StyledCardsContainer = styled.div`
  padding: 0px;
  display: flex;
  flex-wrap: nowrap;
`

export default DataWarehouseReports
