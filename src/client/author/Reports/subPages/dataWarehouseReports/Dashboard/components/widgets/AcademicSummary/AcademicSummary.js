import { IconExternalLink } from '@edulastic/icons'
import React, { useState } from 'react'
import {
  ContentWrapper,
  StyledDashedHr,
  DashedVR,
  Widget,
} from '../../common/styledComponents'
import WidgetCell from '../../common/WidgetCell'
import AcademicSummaryWidgetFilters from './Filters'

const title = 'ACADEMIC SUMMARY AND PERFORMANCE DISTRIBUTION'

const AcademicSummary = () => {
  const [filters, setFilters] = useState({})
  return (
    <Widget>
      <div>
        <span className="title">{title}</span>
        <span className="external-link">
          <IconExternalLink />
        </span>
      </div>
      <AcademicSummaryWidgetFilters filters={filters} setFilters={setFilters} />
      <ContentWrapper>
        <div>
          <WidgetCell
            header="AVG. SCORE"
            value="75%"
            footer="26%"
            subFooter="since 1st Dec."
            color="#cef5d8"
          />
          <StyledDashedHr />
          <WidgetCell header="ABOVE STANDARD" value="68%" color="#cef5d8" />
        </div>
        <DashedVR />
      </ContentWrapper>
    </Widget>
  )
}

export default AcademicSummary
