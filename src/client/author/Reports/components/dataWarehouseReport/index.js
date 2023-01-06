import React from 'react'
import styled from 'styled-components'

import {
  IconWholeStudentReport,
  IconMultipleAssessmentReportDW,
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
            IconThumbnail={IconMultipleAssessmentReportDW}
            title="Multiple Assessment Report"
            description="Compare the aggregate performance of students across various assessments "
            url="/author/reports/multiple-assessment-report-dw"
            loc={loc}
          />
          <ReportLinkCard
            IconThumbnail={IconWholeStudentReport}
            title="Whole Student Report"
            description="See the performance of a particular student accross Edulastic &amp; external tests"
            url="/author/reports/whole-student-report/student/"
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
