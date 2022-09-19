import React from 'react'
import styled from 'styled-components'
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
            title="Whole child report"
            description="See the performance of a particular student accross Edulastic &amp; external tests"
            url="/author/reports/whole-child-report/student/"
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
`

export default DataWarehouseReports
