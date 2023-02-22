import React, { useState } from 'react'
import {
  ContentWrapper,
  StyledDashedHr,
  DashedVR,
  Widget,
} from '../../common/styledComponents'
import WidgetCell from '../../common/WidgetCell'
import WidgetHeader from '../../common/WidgetHeader'
import AcademicSummaryWidgetFilters from './Filters'

const title = 'ACADEMIC SUMMARY AND PERFORMANCE DISTRIBUTION'

const AcademicSummary = ({ academicSummary }) => {
  const [filters, setFilters] = useState({})
  const {
    avgScore,
    percentageIncrease,
    prevMonth,
    aboveStandard,
  } = academicSummary
  return (
    <Widget>
      <WidgetHeader title={title} />
      <AcademicSummaryWidgetFilters filters={filters} setFilters={setFilters} />
      <ContentWrapper>
        <div>
          <WidgetCell
            header="AVG. SCORE"
            value={`${avgScore}%`}
            footer={percentageIncrease}
            subFooter={`since ${prevMonth}`}
            color="#cef5d8"
          />
          <StyledDashedHr />
          <WidgetCell
            header="ABOVE STANDARD"
            value={`${aboveStandard}%`}
            color="#cef5d8"
          />
        </div>
        <DashedVR />
      </ContentWrapper>
    </Widget>
  )
}

export default AcademicSummary
